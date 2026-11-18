'use client'

import { ChevronLeft, UserPlus } from 'lucide-react'
import { useWallet } from '@/lib/zash/store'
import { Notice } from '../ui'

export function EnviarScreen() {
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
        <h1 className="text-xl font-extrabold">Enviar plata</h1>
      </header>

      <div className="zash-scroll flex-1 overflow-y-auto px-5 py-5">
        <Notice tone="info">Elegí a quién le querés enviar. Revisá bien el nombre.</Notice>

        <button
          type="button"
          onClick={() => navigate('nuevo')}
          className="mt-4 flex w-full items-center gap-3 rounded-2xl border-2 border-dashed border-zash-navy bg-zash-navy-soft p-4 text-left"
        >
          <span className="flex size-12 items-center justify-center rounded-full bg-zash-navy text-white">
            <UserPlus className="size-6" />
          </span>
          <span>
            <span className="block text-lg font-bold">Persona nueva</span>
            <span className="block text-sm text-zash-muted">Alias, CVU o celular</span>
          </span>
        </button>

        <div className="mt-4 flex flex-col gap-2">
          {state.contacts.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                dispatch({ type: 'setTo', contact: c })
                speak(`Enviar a ${c.name}, ${c.relation}`)
                navigate('monto')
              }}
              className="flex items-center gap-4 rounded-2xl border-2 border-zash-line bg-white p-4 text-left active:border-zash-navy"
            >
              <span className="flex size-12 items-center justify-center rounded-full bg-zash-navy text-lg font-bold text-white">
                {c.name.charAt(0)}
              </span>
              <span>
                <span className="block text-lg font-bold">{c.name}</span>
                <span className="block text-sm text-zash-muted">{c.relation}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
