'use client'

import {
  FileText,
  HelpCircle,
  List,
  Lock,
  Mic,
  Send,
  Settings2,
  Type,
  Volume2,
  VolumeX,
  Layers,
} from 'lucide-react'
import { formatMoney } from '@/lib/zash/data'
import { useWallet } from '@/lib/zash/store'
import { ZashLogo, Notice } from '../ui'
import { VoiceSheet } from '../voice-sheet'
import { cn } from '@/lib/utils'

const ACTIONS = [
  { id: 'boletas' as const, label: 'Pagar boletas', icon: FileText, desc: 'Luz, gas, agua...' },
  { id: 'enviar' as const, label: 'Enviar plata', icon: Send, desc: 'A la familia o amigos' },
  { id: 'movs' as const, label: 'Mis movimientos', icon: List, desc: 'Lo que entró y salió' },
  { id: 'auto' as const, label: 'Pagos automáticos', icon: Settings2, desc: 'Gastos fijos solos' },
  { id: 'ayuda' as const, label: 'Pedir ayuda', icon: HelpCircle, desc: 'Una persona de verdad' },
]

export function HomeScreen() {
  const { state, navigate, dispatch, speak } = useWallet()

  return (
    <div className={cn('relative flex h-full flex-col bg-zash-bg', state.bigText && 'text-[1.1em]')}>
      <div className="zash-scroll flex-1 overflow-y-auto px-5 pt-4 pb-6">
        <header className="mb-5 flex items-center gap-2">
          <ZashLogo size={44} />
          <div className="min-w-0 flex-1">
            <p className="text-sm text-zash-muted">Hola</p>
            <h1 className="truncate text-xl font-extrabold leading-tight text-zash-ink">Rosa</h1>
          </div>
          <button
            type="button"
            onClick={() => {
              dispatch({ type: 'setVoiceOpen', open: true })
              speak('Hablá con Zash')
            }}
            aria-label="Hablar con Zash"
            className="flex size-11 items-center justify-center rounded-full bg-zash-amber"
          >
            <Mic className="size-5 text-zash-ink" />
          </button>
          <button
            type="button"
            onClick={() => {
              dispatch({ type: 'toggleVoice' })
              speak(state.voice ? 'Voz apagada' : 'Voz activada')
            }}
            aria-label={state.voice ? 'Apagar voz' : 'Activar voz'}
            className="flex size-11 items-center justify-center rounded-full bg-white"
          >
            {state.voice ? (
              <Volume2 className="size-5 text-zash-navy" />
            ) : (
              <VolumeX className="size-5 text-zash-muted" />
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              dispatch({ type: 'toggleBig' })
              speak(state.bigText ? 'Letra normal' : 'Letra más grande')
            }}
            aria-label="Cambiar tamaño de letra"
            className="flex size-11 items-center justify-center rounded-full bg-white"
          >
            <Type className="size-5 text-zash-navy" />
          </button>
        </header>

        <section
          aria-label="Saldo"
          className="relative mb-5 overflow-hidden rounded-3xl bg-zash-navy p-5 text-white"
        >
          <div className="absolute -top-8 -right-8 size-32 rounded-full bg-white/10" aria-hidden />
          <p className="text-sm font-semibold text-white/80">Tu plata disponible</p>
          <p className="mt-1 text-4xl font-extrabold tracking-tight tabular-nums">
            {formatMoney(state.balance)}
          </p>
          <p className="mt-2 text-sm text-white/70">Cobro de jubilación · Hoy</p>
        </section>

        <Notice tone="info">
          Tocá un botón grande. Si preferís, tocá el micrófono y hablale a Zash.
        </Notice>

        <div className="mt-5 grid gap-3">
          {ACTIONS.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => {
                speak(a.label)
                navigate(a.id)
              }}
              className="flex items-center gap-4 rounded-2xl border-2 border-zash-line bg-white p-4 text-left transition-colors active:border-zash-navy"
            >
              <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-zash-navy text-white">
                <a.icon className="size-6" aria-hidden />
              </span>
              <span>
                <span className="block text-lg font-bold text-zash-ink">{a.label}</span>
                <span className="block text-sm text-zash-muted">{a.desc}</span>
              </span>
            </button>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => dispatch({ type: 'lock' })}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-zash-line bg-white py-3 text-sm font-bold"
          >
            <Lock className="size-4" /> Bloquear
          </button>
          <button
            type="button"
            onClick={() => navigate('arquitectura')}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-zash-line bg-white py-3 text-sm font-bold"
          >
            <Layers className="size-4" /> Arquitectura
          </button>
        </div>
      </div>

      <VoiceSheet />
    </div>
  )
}
