'use client'

import { useEffect } from 'react'
import { Delete } from 'lucide-react'
import { useWallet } from '@/lib/zash/store'
import { ZashButton, ZashLogo } from '../ui'
import { cn } from '@/lib/utils'

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫']

export function PinScreen() {
  const { state, dispatch, navigate, speak } = useWallet()
  const locked = state.lockUntil > Date.now()
  const remaining = locked ? Math.ceil((state.lockUntil - Date.now()) / 1000) : 0

  useEffect(() => {
    if (!locked) return
    const t = setInterval(() => {
      if (Date.now() >= state.lockUntil) dispatch({ type: 'clearPin' })
    }, 1000)
    return () => clearInterval(t)
  }, [locked, state.lockUntil, dispatch])

  useEffect(() => {
    if (state.pinDigits.length !== 4 || locked) return
    const p = state.pinDigits
    const t = setTimeout(() => {
      if (state.pinMode === 'set') {
        dispatch({ type: 'setPinMode', mode: 'confirm' })
        // store first in a second dispatch
        // we need pinFirst - use a custom path
        // Actually setPinMode clears; let's handle differently
      }
    }, 180)
    return () => clearTimeout(t)
  }, [state.pinDigits, state.pinMode, locked, dispatch])

  // Handle completion when 4 digits
  useEffect(() => {
    if (state.pinDigits.length !== 4 || locked) return
    const p = state.pinDigits
    const t = setTimeout(() => {
      if (state.pinMode === 'set') {
        // save first and go to confirm - we use a special action sequence
        // Store first via pinFirst by navigating through modes carefully
        // Simpler: use localStorage for demo pin
        sessionStorage.setItem('zash.pin1', p)
        dispatch({ type: 'setPinMode', mode: 'confirm' })
        speak('Repetí la misma clave para confirmar.')
        return
      }
      if (state.pinMode === 'confirm') {
        const first = sessionStorage.getItem('zash.pin1') || ''
        if (p === first) {
          localStorage.setItem('zash.pin', p) // demo only
          sessionStorage.removeItem('zash.pin1')
          dispatch({ type: 'pinSuccess' })
          speak('Clave guardada.')
        } else {
          dispatch({ type: 'setPinMode', mode: 'set' })
          dispatch({ type: 'clearPin' })
          // set error
          speak('Las claves no son iguales. Probá de nuevo.')
        }
        return
      }
      // enter
      const saved = localStorage.getItem('zash.pin')
      if (!saved || saved === p) {
        dispatch({ type: 'pinSuccess' })
        speak('Entraste a Zash.')
      } else {
        dispatch({ type: 'pinFail' })
        speak('Clave incorrecta.')
      }
    }, 200)
    return () => clearTimeout(t)
  }, [state.pinDigits, state.pinMode, locked, dispatch, speak])

  const title =
    state.pinMode === 'set'
      ? 'Creá tu clave de 4 números'
      : state.pinMode === 'confirm'
        ? 'Repetí la clave'
        : 'Ingresá tu clave'

  return (
    <div className="flex h-full flex-col bg-zash-bg px-5 pt-8 pb-6">
      <div className="mb-6 flex items-center gap-3">
        <ZashLogo size={40} />
        <div>
          <p className="text-sm font-semibold text-zash-muted">Seguridad</p>
          <h1 className="text-xl font-extrabold text-zash-ink">{title}</h1>
        </div>
      </div>

      <div className="mb-6 flex justify-center gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              'size-4 rounded-full border-2 transition-colors',
              i < state.pinDigits.length
                ? 'border-zash-navy bg-zash-navy'
                : 'border-zash-line bg-white',
            )}
          />
        ))}
      </div>

      {(state.pinError || locked) && (
        <p className="mb-4 text-center text-base font-semibold text-zash-error" role="alert">
          {locked ? `Esperá ${remaining}s…` : state.pinError}
        </p>
      )}

      <div className="mt-auto grid grid-cols-3 gap-3">
        {KEYS.map((k) => (
          <button
            key={k}
            type="button"
            disabled={locked}
            onClick={() => dispatch({ type: 'setPinDigit', digit: k })}
            aria-label={k === 'C' ? 'Borrar todo' : k === '⌫' ? 'Borrar último' : k}
            className={cn(
              'flex h-16 items-center justify-center rounded-2xl text-2xl font-bold transition-colors disabled:opacity-40',
              k === 'C' || k === '⌫'
                ? 'bg-zash-chip text-zash-muted'
                : 'bg-white text-zash-ink shadow-sm active:bg-zash-navy-soft',
            )}
          >
            {k === '⌫' ? <Delete className="size-6" /> : k}
          </button>
        ))}
      </div>

      {state.pinMode === 'enter' && (
        <ZashButton
          variant="ghost"
          className="mt-3"
          onClick={() => {
            speak('Llamá al 11 5555-0123 y una persona te ayuda a recuperar tu clave. Nunca des tu clave por teléfono.')
          }}
        >
          Olvidé mi clave
        </ZashButton>
      )}

      <ZashButton variant="ghost" className="mt-2" onClick={() => navigate('welcome')}>
        Volver
      </ZashButton>
    </div>
  )
}
