'use client'

import { ChevronLeft } from 'lucide-react'
import { formatMoney } from '@/lib/zash/data'
import { useWallet } from '@/lib/zash/store'
import { Notice } from '../ui'

export function BoletasScreen() {
  const { state, navigate, dispatch, speak } = useWallet()

  function pay(bill: (typeof state.bills)[0]) {
    speak(`Boleta de ${bill.name}, ${formatMoney(bill.amount)}`)
    dispatch({ type: 'askPayBill', bill })
  }

  return (
    <div className="flex h-full flex-col bg-zash-bg">
      <header className="flex items-center gap-3 border-b border-zash-line bg-white px-4 py-3">
        <button
          type="button"
          onClick={() => navigate('home')}
          aria-label="Volver al inicio"
          className="flex size-11 items-center justify-center rounded-full bg-zash-chip"
        >
          <ChevronLeft className="size-6" />
        </button>
        <h1 className="text-xl font-extrabold">Pagar boletas</h1>
      </header>

      <div className="zash-scroll flex-1 overflow-y-auto px-5 py-5">
        {state.bills.length === 0 ? (
          <Notice tone="ok">No tenés boletas pendientes. ¡Bien!</Notice>
        ) : (
          <div className="flex flex-col gap-3">
            {state.bills.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => pay(b)}
                className="flex items-center gap-4 rounded-2xl border-2 border-zash-line bg-white p-4 text-left active:border-zash-navy"
              >
                <span className="flex size-14 items-center justify-center rounded-2xl bg-zash-amber-soft text-2xl">
                  {b.icon}
                </span>
                <span className="flex-1">
                  <span className="block text-lg font-bold">{b.name}</span>
                  <span className="block text-sm text-zash-muted">{b.company}</span>
                </span>
                <span className="text-lg font-extrabold tabular-nums">
                  {formatMoney(b.amount)}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
