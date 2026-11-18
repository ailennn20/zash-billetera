'use client'

import { Volume2 } from 'lucide-react'
import { useWallet } from '@/lib/zash/store'
import { ZashButton, Notice } from '../ui'

export function ConfirmScreen() {
  const { state, navigate, dispatch, speak } = useWallet()

  function readAloud() {
    const m = state.confirmBig.startsWith('$')
      ? state.confirmBig.replace('$', '').trim() + ' pesos'
      : state.confirmBig
    speak(
      `${state.confirmTitle} ${m}. ${state.confirmSub}${state.confirmWarn ? ' ' + state.confirmWarn : ''}`,
    )
  }

  function yes() {
    dispatch({ type: 'confirmYes' })
    // speak after state update via a short timeout in listo is better, but simple:
    speak(state.doneTitle || 'Listo')
  }

  return (
    <div className="flex h-full flex-col bg-zash-bg px-5 pt-8 pb-6">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <p className="text-lg font-semibold text-zash-muted">Antes de seguir</p>
        <h1 className="mt-3 text-2xl font-extrabold leading-snug text-zash-ink">
          {state.confirmTitle}
        </h1>
        <p className="mt-4 text-4xl font-extrabold tabular-nums text-zash-navy">
          {state.confirmBig}
        </p>
        <p className="mt-3 max-w-[300px] text-base text-zash-muted">
          {state.confirmSub}
        </p>
        {state.confirmWarn && (
          <div className="mt-4 w-full">
            <Notice tone="warn">{state.confirmWarn}</Notice>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <ZashButton variant="amber" onClick={yes}>
          Sí, {state.confirmYes}
        </ZashButton>
        <ZashButton variant="secondary" onClick={() => navigate(state.confirmBack)}>
          No, volver
        </ZashButton>
        <button
          type="button"
          onClick={readAloud}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-zash-navy py-3 text-base font-bold text-zash-navy"
        >
          <Volume2 className="size-5" />
          Leerme esto en voz alta
        </button>
      </div>
    </div>
  )
}
