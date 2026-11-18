'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react'
import {
  INITIAL_AUTO,
  INITIAL_BILLS,
  INITIAL_CONTACTS,
  INITIAL_MOVEMENTS,
  formatMoney,
  operationId,
  type AutoPay,
  type Bill,
  type Contact,
  type Movement,
  type ScreenId,
} from './data'

export type PinMode = 'set' | 'confirm' | 'enter'

export interface WalletState {
  screen: ScreenId
  balance: number
  bigText: boolean
  voice: boolean
  bioEnabled: boolean
  authed: boolean
  pinMode: PinMode
  pinDigits: string
  pinFirst: string
  pinError: string
  pinFails: number
  lockUntil: number
  movements: Movement[]
  bills: Bill[]
  contacts: Contact[]
  autoPays: AutoPay[]
  toContact: Contact | null
  amount: string
  pendingBill: Bill | null
  pendingSend: { contact: Contact; amount: number } | null
  confirmTitle: string
  confirmBig: string
  confirmSub: string
  confirmWarn: string
  confirmYes: string
  confirmBack: ScreenId
  doneTitle: string
  doneSub: string
  resetKey: number
  voiceOpen: boolean
}

const INITIAL: WalletState = {
  screen: 'welcome',
  balance: 412350,
  bigText: false,
  voice: true,
  bioEnabled: false,
  authed: false,
  pinMode: 'set',
  pinDigits: '',
  pinFirst: '',
  pinError: '',
  pinFails: 0,
  lockUntil: 0,
  movements: INITIAL_MOVEMENTS,
  bills: INITIAL_BILLS,
  contacts: INITIAL_CONTACTS,
  autoPays: INITIAL_AUTO,
  toContact: null,
  amount: '',
  pendingBill: null,
  pendingSend: null,
  confirmTitle: '',
  confirmBig: '',
  confirmSub: '',
  confirmWarn: '',
  confirmYes: '',
  confirmBack: 'home',
  doneTitle: '',
  doneSub: '',
  resetKey: 0,
  voiceOpen: false,
}

type Action =
  | { type: 'navigate'; screen: ScreenId }
  | { type: 'reset' }
  | { type: 'toggleBig' }
  | { type: 'toggleVoice' }
  | { type: 'setPinDigit'; digit: string }
  | { type: 'clearPin' }
  | { type: 'setPinMode'; mode: PinMode }
  | { type: 'pinSuccess' }
  | { type: 'pinFail' }
  | { type: 'setBio'; enabled: boolean }
  | { type: 'lock' }
  | { type: 'setAmount'; amount: string }
  | { type: 'setTo'; contact: Contact | null }
  | { type: 'addContact'; contact: Contact }
  | { type: 'askPayBill'; bill: Bill }
  | { type: 'askSend'; contact: Contact; amount: number }
  | { type: 'confirmYes' }
  | { type: 'toggleAuto'; id: string }
  | { type: 'setDone'; title: string; sub: string }
  | { type: 'setVoiceOpen'; open: boolean }

function reducer(state: WalletState, action: Action): WalletState {
  switch (action.type) {
    case 'navigate':
      return { ...state, screen: action.screen, voiceOpen: false }
    case 'reset':
      return { ...INITIAL, resetKey: state.resetKey + 1 }
    case 'toggleBig':
      return { ...state, bigText: !state.bigText }
    case 'toggleVoice':
      return { ...state, voice: !state.voice }
    case 'setPinDigit': {
      if (state.lockUntil > Date.now()) return state
      const d = action.digit
      let digits = state.pinDigits
      if (d === 'C') digits = ''
      else if (d === '⌫') digits = digits.slice(0, -1)
      else if (digits.length < 4) digits = digits + d
      return { ...state, pinDigits: digits, pinError: '' }
    }
    case 'clearPin':
      return { ...state, pinDigits: '', pinError: '' }
    case 'setPinMode':
      return { ...state, pinMode: action.mode, pinDigits: '', pinFirst: '', pinError: '' }
    case 'pinSuccess':
      return {
        ...state,
        authed: true,
        pinDigits: '',
        pinError: '',
        pinFails: 0,
        screen: state.pinMode === 'set' || state.pinMode === 'confirm' ? 'bioask' : 'home',
        pinMode: 'enter',
      }
    case 'pinFail': {
      const fails = state.pinFails + 1
      if (fails >= 5) {
        return {
          ...state,
          pinDigits: '',
          pinFails: 0,
          lockUntil: Date.now() + 30000,
          pinError: 'Demasiados intentos. Esperá 30 segundos.',
        }
      }
      return {
        ...state,
        pinDigits: '',
        pinFails: fails,
        pinError: `Clave incorrecta. Te quedan ${5 - fails} intentos.`,
      }
    }
    case 'setBio':
      return { ...state, bioEnabled: action.enabled }
    case 'lock':
      return {
        ...state,
        authed: false,
        pinDigits: '',
        pinError: '',
        pinMode: 'enter',
        screen: state.bioEnabled ? 'lock' : 'pin',
        voiceOpen: false,
      }
    case 'setAmount':
      return { ...state, amount: action.amount }
    case 'setTo':
      return { ...state, toContact: action.contact, amount: '' }
    case 'addContact':
      return {
        ...state,
        contacts: [...state.contacts, action.contact],
        toContact: action.contact,
        amount: '',
        screen: 'monto',
      }
    case 'askPayBill': {
      const bill = action.bill
      return {
        ...state,
        pendingBill: bill,
        pendingSend: null,
        confirmTitle: '¿Está seguro de que quiere pagar esta boleta?',
        confirmBig: formatMoney(bill.amount),
        confirmSub: `Boleta de ${bill.name} · ${bill.company}`,
        confirmWarn: '',
        confirmYes: 'pagar',
        confirmBack: 'boletas',
        screen: 'confirm',
      }
    }
    case 'askSend': {
      const { contact, amount } = action
      return {
        ...state,
        pendingBill: null,
        pendingSend: { contact, amount },
        confirmTitle: `¿Está seguro de que le quiere enviar dinero a ${contact.name}?`,
        confirmBig: formatMoney(amount),
        confirmSub: `${contact.relation}. Revisá bien el nombre antes de seguir.`,
        confirmWarn: contact.isNew
          ? 'Es una persona nueva. Si alguien te pidió esta plata por teléfono o mensaje, consultá primero con un familiar.'
          : '',
        confirmYes: 'enviar',
        confirmBack: 'monto',
        screen: 'confirm',
      }
    }
    case 'confirmYes': {
      if (state.pendingBill) {
        const bill = state.pendingBill
        const newBal = state.balance - bill.amount
        return {
          ...state,
          balance: newBal,
          bills: state.bills.filter((b) => b.id !== bill.id),
          movements: [
            {
              id: operationId(),
              title: `Pago de ${bill.name}`,
              date: 'Ahora',
              amount: -bill.amount,
            },
            ...state.movements,
          ],
          pendingBill: null,
          doneTitle: '¡Listo!',
          doneSub: `Pagaste la boleta de ${bill.name}. Te quedan ${formatMoney(newBal)}.`,
          screen: 'listo',
        }
      }
      if (state.pendingSend) {
        const { contact, amount } = state.pendingSend
        const newBal = state.balance - amount
        return {
          ...state,
          balance: newBal,
          movements: [
            {
              id: operationId(),
              title: `Envío a ${contact.name}`,
              date: 'Ahora',
              amount: -amount,
            },
            ...state.movements,
          ],
          pendingSend: null,
          toContact: null,
          amount: '',
          doneTitle: '¡Listo!',
          doneSub: `Le enviaste ${formatMoney(amount)} a ${contact.name}. Te quedan ${formatMoney(newBal)}.`,
          screen: 'listo',
        }
      }
      return state
    }
    case 'toggleAuto':
      return {
        ...state,
        autoPays: state.autoPays.map((a) =>
          a.id === action.id ? { ...a, on: !a.on } : a,
        ),
      }
    case 'setDone':
      return {
        ...state,
        doneTitle: action.title,
        doneSub: action.sub,
        screen: 'listo',
      }
    case 'setVoiceOpen':
      return { ...state, voiceOpen: action.open }
    default:
      return state
  }
}

const Ctx = createContext<{
  state: WalletState
  dispatch: React.Dispatch<Action>
  navigate: (s: ScreenId) => void
  speak: (t: string) => void
  runVoiceCommand: (raw: string) => boolean
} | null>(null)

function norm(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL)

  const navigate = useCallback((screen: ScreenId) => {
    dispatch({ type: 'navigate', screen })
  }, [])

  const speak = useCallback(
    (t: string) => {
      if (!state.voice || typeof window === 'undefined') return
      try {
        window.speechSynthesis.cancel()
        const u = new SpeechSynthesisUtterance(
          t.replace(/\$\s?([0-9.]+)/g, '$1 pesos'),
        )
        u.lang = 'es-AR'
        u.rate = 0.92
        window.speechSynthesis.speak(u)
      } catch {
        /* ignore */
      }
    },
    [state.voice],
  )

  const runVoiceCommand = useCallback(
    (raw: string): boolean => {
      let t = norm(String(raw).replace(/(\d)[.,](?=\d{3}\b)/g, '$1'))
      t = t.replace(/^(hola |ok |oye )?zash /, '').trim()
      if (!t) return false

      if (/\bsaldo\b|(cuanto|cuanta)\b.*\b(tengo|hay|queda)|mi plata|mi dinero/.test(t)) {
        navigate('home')
        speak(`Tenés ${formatMoney(state.balance)}.`)
        return true
      }
      const bol = state.bills.find(
        (b) => new RegExp('\\b' + norm(b.name) + '\\b').test(t) || t.includes(norm(b.company)),
      )
      if (bol && /(pagar|paga|abonar|boleta|factura)/.test(t)) {
        dispatch({ type: 'askPayBill', bill: bol })
        return true
      }
      if (/(envi|mand|transfer|pasa|deposit)/.test(t)) {
        const contact = state.contacts.find((f) => {
          const toks = (norm(f.name) + ' ' + norm(f.relation))
            .split(' ')
            .filter((w) => w.length > 2)
          return toks.some((w) => new RegExp('\\b' + w + '\\b').test(t))
        })
        if (contact) {
          dispatch({ type: 'setTo', contact })
          navigate('monto')
          return true
        }
        navigate('enviar')
        return true
      }
      if (/movimiento|historial|ultimos|gastos/.test(t)) {
        navigate('movs')
        return true
      }
      if (/automatic|debito/.test(t)) {
        navigate('auto')
        return true
      }
      if (/(letra|texto)/.test(t) && /(grande|agrand)/.test(t)) {
        if (!state.bigText) dispatch({ type: 'toggleBig' })
        speak('Listo, la letra es más grande.')
        return true
      }
      if (/(letra|texto)/.test(t) && /(chica|achic|normal)/.test(t)) {
        if (state.bigText) dispatch({ type: 'toggleBig' })
        speak('Listo, la letra es normal.')
        return true
      }
      if (/boleta|factura|servicio|pagar/.test(t)) {
        navigate('boletas')
        return true
      }
      if (/ayuda|auxilio|llam|persona|operador|no entiendo/.test(t)) {
        navigate('ayuda')
        return true
      }
      if (/bloquear|salir|cerrar sesion/.test(t)) {
        dispatch({ type: 'lock' })
        return true
      }
      if (/inicio|principal|volver|atras|menu/.test(t)) {
        navigate('home')
        return true
      }
      return false
    },
    [state.balance, state.bills, state.contacts, state.bigText, navigate, speak],
  )

  // Auto-lock after 60s hidden
  useEffect(() => {
    let hiddenAt = 0
    const onVis = () => {
      if (document.hidden) hiddenAt = Date.now()
      else if (state.authed && hiddenAt && Date.now() - hiddenAt > 60000) {
        dispatch({ type: 'lock' })
      }
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [state.authed])

  const value = useMemo(
    () => ({ state, dispatch, navigate, speak, runVoiceCommand }),
    [state, navigate, speak, runVoiceCommand],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useWallet() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useWallet must be used inside WalletProvider')
  return ctx
}

/* ---------- Biometría (WebAuthn platform) ---------- */
const b64 = (u: ArrayBuffer) =>
  btoa(String.fromCharCode(...new Uint8Array(u)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')

const unb64 = (s: string) =>
  Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0))

const rnd = (n: number) => crypto.getRandomValues(new Uint8Array(n))

export async function bioAvailable(): Promise<boolean> {
  try {
    return !!(
      window.PublicKeyCredential &&
      PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable &&
      (await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable())
    )
  } catch {
    return false
  }
}

export async function bioEnroll(): Promise<void> {
  const c = await navigator.credentials.create({
    publicKey: {
      challenge: rnd(32),
      rp: { name: 'Zash' },
      user: {
        id: rnd(16),
        name: 'zash-usuario',
        displayName: 'Mi cuenta Zash',
      },
      pubKeyCredParams: [
        { type: 'public-key', alg: -7 },
        { type: 'public-key', alg: -257 },
      ],
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        userVerification: 'required',
        residentKey: 'discouraged',
      },
      timeout: 60000,
      attestation: 'none',
    },
  })
  if (!c) throw new Error('sin credencial')
  const rawId = (c as PublicKeyCredential).rawId
  localStorage.setItem('zash.bio', b64(rawId))
}

export async function bioLogin(): Promise<void> {
  const id = localStorage.getItem('zash.bio')
  if (!id) throw new Error('sin credencial')
  const r = await navigator.credentials.get({
    publicKey: {
      challenge: rnd(32),
      allowCredentials: [
        { type: 'public-key', id: unb64(id), transports: ['internal'] },
      ],
      userVerification: 'required',
      timeout: 60000,
    },
  })
  if (!r) throw new Error('cancelado')
}
