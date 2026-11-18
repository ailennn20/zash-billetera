'use client'

import { useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import { useWallet } from '@/lib/zash/store'
import { ZashButton, Notice } from '../ui'

export function NuevoScreen() {
  const { navigate, dispatch, speak } = useWallet()
  const [name, setName] = useState('')
  const [alias, setAlias] = useState('')
  const [err, setErr] = useState('')

  function submit() {
    if (name.trim().length < 3 || alias.trim().length < 3) {
      setErr('Completá el nombre y el alias, CVU o celular.')
      return
    }
    const contact = {
      id: String(Date.now()),
      name: name.trim(),
      relation: 'Alias, CVU o celular: ' + alias.trim(),
      isNew: true,
    }
    dispatch({ type: 'addContact', contact })
    speak(`Enviar a ${contact.name}`)
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
        <h1 className="text-xl font-extrabold">Persona nueva</h1>
      </header>

      <div className="flex flex-1 flex-col px-5 py-5">
        <Notice tone="warn">
          Revisá bien el nombre y el alias. Si alguien te pidió plata por teléfono o mensaje, consultá con un familiar.
        </Notice>

        <label className="mt-5 text-sm font-bold" htmlFor="nn">
          Nombre
        </label>
        <input
          id="nn"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 h-14 rounded-2xl border-2 border-zash-line px-4 text-lg"
          placeholder="Ej: Ana López"
        />

        <label className="mt-4 text-sm font-bold" htmlFor="na">
          Alias, CVU o celular
        </label>
        <input
          id="na"
          value={alias}
          onChange={(e) => setAlias(e.target.value)}
          className="mt-1 h-14 rounded-2xl border-2 border-zash-line px-4 text-lg"
          placeholder="Ej: analopez.mp"
        />

        {err && (
          <p className="mt-3 text-base font-semibold text-zash-error" role="alert">
            {err}
          </p>
        )}

        <ZashButton className="mt-auto" onClick={submit}>
          Continuar
        </ZashButton>
      </div>
    </div>
  )
}
