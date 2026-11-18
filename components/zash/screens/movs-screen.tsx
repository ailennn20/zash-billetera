'use client'

import { ChevronLeft } from 'lucide-react'
import { formatMoney } from '@/lib/zash/data'
import { useWallet } from '@/lib/zash/store'
import { cn } from '@/lib/utils'

export function MovsScreen() {
  const { state, navigate } = useWallet()

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
        <h1 className="text-xl font-extrabold">Mis movimientos</h1>
      </header>

      <div className="zash-scroll flex-1 overflow-y-auto px-5 py-4">
        <ul className="flex flex-col gap-2">
          {state.movements.map((m) => (
            <li
              key={m.id}
              className="flex items-center justify-between rounded-2xl border border-zash-line bg-white px-4 py-3"
            >
              <div>
                <p className="font-bold text-zash-ink">{m.title}</p>
                <p className="text-sm text-zash-muted">{m.date}</p>
              </div>
              <p
                className={cn(
                  'text-lg font-extrabold tabular-nums',
                  m.amount >= 0 ? 'text-emerald-700' : 'text-zash-ink',
                )}
              >
                {m.amount >= 0 ? '+' : ''}
                {formatMoney(m.amount)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
