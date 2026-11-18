'use client'

import { Check } from 'lucide-react'
import { useWallet } from '@/lib/zash/store'
import { ZashButton } from '../ui'

export function ListoScreen() {
  const { state, navigate } = useWallet()

  return (
    <div className="flex h-full flex-col items-center justify-center bg-zash-bg px-6 text-center">
      <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-emerald-100">
        <Check className="size-10 text-emerald-600" strokeWidth={3} />
      </div>
      <h1 className="text-3xl font-extrabold text-zash-ink">{state.doneTitle}</h1>
      <p className="mt-3 max-w-[300px] text-lg text-zash-muted">{state.doneSub}</p>
      <ZashButton className="mt-10 max-w-xs" onClick={() => navigate('home')}>
        Ir al inicio
      </ZashButton>
    </div>
  )
}
