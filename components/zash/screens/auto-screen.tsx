'use client'

import { ChevronLeft } from 'lucide-react'
import { formatMoney } from '@/lib/zash/data'
import { useWallet } from '@/lib/zash/store'
import { Notice } from '../ui'
import { cn } from '@/lib/utils'

export function AutoScreen() {
  const { state, navigate, dispatch, speak } = useWallet()

  return (
    <div className="flex h-full flex-col bg-zash-bg">
      <header className="flex items-center gap-3 border-b border-zash-line bg-white px-4 py-3">
        <button
          type="button"
          onClick={() => navigate('home')}
          aria-label="Volver"
          className="flex size-11 items-center justify-center rounded-full bg-zash-chip"
        >
          <ChevronLeft className="size-6" />
        </button>
        <h1 className="text-xl font-extrabold">Pagos automáticos</h1>
      </header>

      <div className="zash-scroll flex-1 overflow-y-auto px-5 py-5">
        <Notice tone="info">
          Los gastos fijos se pagan solos. Te avisamos cada vez con un cartel grande.
        </Notice>

        <div className="mt-4 flex flex-col gap-3">
          {state.autoPays.map((a) => (
            <div
              key={a.id}
              className="flex items-center gap-3 rounded-2xl border-2 border-zash-line bg-white p-4"
            >
              <div className="flex-1">
                <p className="font-bold">{a.name}</p>
                <p className="text-sm text-zash-muted">
                  {a.subtitle} · {formatMoney(a.amount)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  dispatch({ type: 'toggleAuto', id: a.id })
                  speak(
                    a.on
                      ? `Apagaste el pago automático de ${a.name}`
                      : `Activaste el pago automático de ${a.name}`,
                  )
                }}
                aria-pressed={a.on}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-bold transition-colors',
                  a.on
                    ? 'bg-zash-navy text-white'
                    : 'bg-zash-chip text-zash-muted',
                )}
              >
                {a.on ? 'Activado' : 'Apagado'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
