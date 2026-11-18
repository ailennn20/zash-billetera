'use client'

import { useEffect, useRef, useState } from 'react'
import { Mic, X } from 'lucide-react'
import { VOICE_CHIPS } from '@/lib/zash/data'
import { useWallet } from '@/lib/zash/store'
import { ZashButton } from './ui'
import { cn } from '@/lib/utils'

type St = 'idle' | 'listening' | 'error'

const VERR: Record<string, string> = {
  'not-allowed':
    'El micrófono no está permitido. Tocá el candado al lado de la dirección y permitilo.',
  'service-not-allowed':
    'El micrófono no está permitido. Tocá el candado al lado de la dirección y permitilo.',
  'no-speech': 'No escuché nada. Acercate al teléfono y tocá “Hablar”.',
  'audio-capture': 'No encuentro el micrófono de este teléfono.',
  network: 'Para escucharte hace falta internet. Probá de nuevo o escribí abajo.',
  'language-not-supported': 'Este teléfono no entiende español hablado. Escribí abajo.',
}

export function VoiceSheet() {
  const { state, dispatch, runVoiceCommand, speak } = useWallet()
  const [st, setSt] = useState<St>('idle')
  const [msg, setMsg] = useState('')
  const [txt, setTxt] = useState('')
  const [typed, setTyped] = useState('')
  const recRef = useRef<SpeechRecognition | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const SR =
    typeof window !== 'undefined'
      ? window.SpeechRecognition || (window as unknown as { webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition
      : undefined

  function stopListen() {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (recRef.current) {
      const r = recRef.current
      recRef.current = null
      r.onresult = null
      r.onerror = null
      r.onend = null
      r.onstart = null
      try {
        r.abort()
      } catch {
        /* */
      }
    }
  }

  function close() {
    stopListen()
    dispatch({ type: 'setVoiceOpen', open: false })
    setSt('idle')
    setMsg('')
    setTxt('')
    setTyped('')
  }

  function startListen() {
    stopListen()
    if (!SR) {
      setSt('error')
      setMsg('Este navegador no puede escucharte. Tocá una opción o escribí abajo.')
      return
    }
    let r: SpeechRecognition
    try {
      r = new SR()
    } catch {
      setSt('error')
      setMsg('No pude prender el micrófono. Tocá una opción o escribí abajo.')
      return
    }
    recRef.current = r
    r.lang = 'es-AR'
    r.interimResults = true
    r.maxAlternatives = 3
    r.continuous = false
    let got = false
    let errored = false

    r.onstart = () => {
      setSt('listening')
      setMsg('Te escucho. Decime qué necesitás.')
      setTxt('')
    }
    r.onresult = (e: SpeechRecognitionEvent) => {
      const x = e.results[e.results.length - 1]
      setTxt(x[0].transcript)
      if (x.isFinal) {
        got = true
        stopListen()
        const alts = Array.from(x, (a) => a.transcript)
        for (const a of alts) {
          if (runVoiceCommand(a)) {
            close()
            return
          }
        }
        setSt('error')
        setMsg(
          'No te entendí. Podés decir, por ejemplo: “Zash, mostrame cuánto dinero tengo”.',
        )
        setTxt(alts[0] || '')
      }
    }
    r.onerror = (e: SpeechRecognitionErrorEvent) => {
      errored = true
      if (e.error === 'aborted') return
      stopListen()
      setSt('error')
      setMsg(VERR[e.error] || 'No pude escucharte. Probá de nuevo o escribí abajo.')
    }
    r.onend = () => {
      if (recRef.current !== r) return
      stopListen()
      if (!got && !errored && state.voiceOpen) {
        setSt('error')
        setMsg('No te escuché. Acercate al teléfono y tocá “Hablar”.')
      }
    }
    timerRef.current = setTimeout(() => {
      try {
        r.stop()
      } catch {
        /* */
      }
    }, 10000)
    try {
      r.start()
    } catch {
      stopListen()
      setSt('error')
      setMsg('No pude prender el micrófono. Tocá una opción o escribí abajo.')
    }
  }

  useEffect(() => {
    if (state.voiceOpen) {
      setSt('idle')
      setMsg('')
      setTxt('')
      // auto-start
      const t = setTimeout(startListen, 300)
      return () => {
        clearTimeout(t)
        stopListen()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.voiceOpen])

  if (!state.voiceOpen) return null

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/40 p-3">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="vt"
        className="w-full max-w-md rounded-3xl bg-white p-5 shadow-2xl"
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 id="vt" className="text-xl font-extrabold">
            Hablá con Zash
          </h2>
          <button
            type="button"
            onClick={close}
            aria-label="Cerrar"
            className="flex size-10 items-center justify-center rounded-full bg-zash-chip"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="mb-4 flex flex-col items-center">
          <div
            className={cn(
              'flex size-16 items-center justify-center rounded-full transition-colors',
              st === 'listening' ? 'bg-zash-navy text-white animate-pulse' : 'bg-zash-chip text-zash-navy',
            )}
          >
            <Mic className="size-7" />
          </div>
          <p className="mt-3 text-center text-base font-medium text-zash-muted" aria-live="polite">
            {msg || (st === 'idle' ? 'Tocá Hablar para empezar' : '')}
          </p>
          {txt && (
            <p className="mt-1 text-center text-lg font-bold text-zash-ink">“{txt}”</p>
          )}
        </div>

        {st === 'listening' ? (
          <ZashButton variant="secondary" onClick={() => { try { recRef.current?.stop() } catch { /* */ } }}>
            Ya terminé de hablar
          </ZashButton>
        ) : (
          <ZashButton variant="amber" onClick={startListen}>
            <Mic className="size-5" /> Hablar
          </ZashButton>
        )}

        <p className="mt-4 mb-2 text-sm font-semibold text-zash-muted">O tocá lo que necesitás:</p>
        <div className="flex flex-wrap gap-2">
          {VOICE_CHIPS.map((c) => (
            <button
              key={c.cmd}
              type="button"
              onClick={() => {
                if (runVoiceCommand(c.cmd)) close()
                else {
                  setSt('error')
                  setMsg('No pude ejecutar eso. Probá de nuevo.')
                }
              }}
              className="rounded-full border-2 border-zash-line bg-zash-chip px-3 py-1.5 text-sm font-bold"
            >
              {c.label}
            </button>
          ))}
        </div>

        <form
          className="mt-4"
          onSubmit={(e) => {
            e.preventDefault()
            const v = typed.trim()
            if (!v) return
            if (runVoiceCommand(v)) close()
            else {
              setSt('error')
              setMsg('No te entendí. Probá con: “pagar la luz” o “enviar plata a Marta”.')
              setTxt(v)
              setTyped('')
            }
          }}
        >
          <label htmlFor="vin" className="text-sm font-semibold text-zash-muted">
            O escribilo acá
          </label>
          <div className="mt-1 flex gap-2">
            <input
              id="vin"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder="Por ejemplo: pagar la luz"
              className="h-12 flex-1 rounded-xl border-2 border-zash-line px-3 text-base"
              autoComplete="off"
              enterKeyHint="send"
            />
            <ZashButton type="submit" fullWidth={false} className="w-auto px-5">
              Enviar
            </ZashButton>
          </div>
        </form>
      </div>
    </div>
  )
}
