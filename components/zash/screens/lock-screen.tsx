'use client'

import { useState } from 'react'
import { Fingerprint, ScanFace } from 'lucide-react'
import { bioLogin, useWallet } from '@/lib/zash/store'
import { ZashButton, ZashLogo } from '../ui'

export function LockScreen() {
  const { dispatch, navigate, speak } = useWallet()
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  async function tryBio() {
    if (busy) return
    setBusy(true)
    setErr('')
    try {
      await bioLogin()
      dispatch({ type: 'pinSuccess' })
      speak('Entraste a Zash.')
    } catch {
      setErr('No se pudo con la huella o la cara. Usá tu clave.')
      speak('No se pudo. Usá tu clave.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex h-full flex-col items-center justify-center bg-zash-bg px-6 text-center">
      <ZashLogo size={72} className="mb-6" />
      <h1 className="text-2xl font-extrabold text-zash-ink">Hola de nuevo</h1>
      <p className="mt-2 text-base text-zash-muted">
        Usá tu huella o tu cara para entrar
      </p>

      <button
        type="button"
        onClick={tryBio}
        disabled={busy}
        className="mt-10 flex size-24 items-center justify-center rounded-full bg-zash-navy text-white shadow-lg active:scale-95 disabled:opacity-60"
        aria-label="Entrar con huella o cara"
      >
        <Fingerprint className="size-12" />
      </button>

      {err && (
        <p className="mt-4 text-base font-semibold text-zash-error" role="alert">
          {err}
        </p>
      )}

      <div className="mt-10 w-full max-w-xs flex flex-col gap-3">
        <ZashButton
          variant="secondary"
          onClick={() => {
            dispatch({ type: 'setPinMode', mode: 'enter' })
            navigate('pin')
          }}
        >
          Usar clave de 4 números
        </ZashButton>
      </div>

      <p className="mt-8 flex items-center gap-2 text-sm text-zash-muted">
        <ScanFace className="size-4" /> Huella o Face ID del teléfono
      </p>
    </div>
  )
}
