'use client'

import { ChevronLeft, Delete } from 'lucide-react'
import { formatMoney } from '@/lib/zash/data'
import { useWallet } from '@/lib/zash/store'
import { ZashButton } from '../ui'
import { cn } from '@/lib/utils'

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫']

export function MontoScreen() {
  const { state, navigate, dispatch, speak } = useWallet()
  const n = Number(state.amount) || 0
  const bad = n > state.balance
  const to = state.toContact

  function key(k: string) {
    let next = state.amount
    if (k === 'C') next = ''
    else if (k === '⌫') next = next.slice(0, -1)
    else if (next.length < 7) next = (next + k).replace(/^0+/, '') || ''
    dispatch({ type: 'setAmount', amount: next })
  }

  function continue_() {
    if (!to || n <= 0 || bad) return
    speak(`Confirmar envío de ${formatMoney(n)} a ${to.name}`)
    dispatch({ type: 'askSend', contact: to, amount: n })
  }

  return (
    <div className="flex h-full flex-col bg-zash-bg">
      <header className="flex items-center gap-3 border-b border-zash-line bg-white px-4 py-3">
        <button
          type="button"
          onClick={() => navigate('enviar')}
          aria-label="Volver"
          className="flex size-11 items-center justify-center rounded-full bg-zash-chip"
        >
          <ChevronLeft className="size-6" />
        </button>
        <div>
          <h1 className="text-lg font-extrabold">Enviar a {to?.name}</h1>
          <p className="text-sm text-zash-muted">{to?.relation}</p>
        </div>
      </header>

      <div className="flex flex-1 flex-col px-5 py-5">
        <p className="text-center text-base text-zash-muted">¿Cuánta plata?</p>
        <p
          className={cn(
            'mt-2 text-center text-4xl font-extrabold tabular-nums',
            bad ? 'text-zash-error' : 'text-zash-ink',
          )}
          aria-live="polite"
        >
          {formatMoney(n)}
        </p>
        {bad && (
          <p className="mt-2 text-center text-base font-semibold text-zash-error">
            No alcanza. Tenés {formatMoney(state.balance)}.
          </p>
        )}

        <div className="mt-auto grid grid-cols-3 gap-3">
          {KEYS.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => key(k)}
              className={cn(
                'flex h-14 items-center justify-center rounded-2xl text-xl font-bold',
                k === 'C' || k === '⌫'
                  ? 'bg-zash-chip text-zash-muted'
                  : 'bg-white shadow-sm active:bg-zash-navy-soft',
              )}
            >
              {k === '⌫' ? <Delete className="size-5" /> : k}
            </button>
          ))}
        </div>

        <ZashButton
          className="mt-4"
          disabled={n <= 0 || bad}
          onClick={continue_}
        >
          Continuar
        </ZashButton>
      </div>
    </div>
  )
}
