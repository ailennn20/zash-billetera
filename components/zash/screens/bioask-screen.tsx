'use client'

import { useState } from 'react'
import { Fingerprint } from 'lucide-react'
import { bioAvailable, bioEnroll, useWallet } from '@/lib/zash/store'
import { ZashButton, ZashLogo, Notice } from '../ui'

export function BioaskScreen() {
  const { dispatch, navigate, speak } = useWallet()
  const [busy, setBusy] = useState(false)

  async function enable() {
    if (busy) return
    setBusy(true)
    try {
      const ok = await bioAvailable()
      if (!ok) throw new Error('no disponible')
      await bioEnroll()
      dispatch({ type: 'setBio', enabled: true })
      speak('Listo. La próxima vez podés entrar con tu huella o tu cara.')
      navigate('home')
    } catch {
      speak('No se pudo activar. Seguí entrando con tu clave.')
      navigate('home')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex h-full flex-col bg-zash-bg px-6 pt-10 pb-8">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <ZashLogo size={64} className="mb-6" />
        <div className="mb-4 flex size-20 items-center justify-center rounded-full bg-zash-navy-soft">
          <Fingerprint className="size-10 text-zash-navy" />
        </div>
        <h1 className="text-2xl font-extrabold text-zash-ink">
          ¿Querés entrar más fácil?
        </h1>
        <p className="mt-3 max-w-[280px] text-base text-zash-muted">
          Podés usar la huella o la cara de este teléfono. Así no tenés que escribir la clave cada vez.
        </p>
        <div className="mt-6 w-full">
          <Notice tone="info">
            Solo funciona en este teléfono. Zash nunca guarda tu huella: usa la del sistema.
          </Notice>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <ZashButton variant="amber" loading={busy} onClick={enable}>
          Sí, activar huella o cara
        </ZashButton>
        <ZashButton
          variant="secondary"
          onClick={() => {
            navigate('home')
            speak('Seguí entrando con tu clave.')
          }}
        >
          Ahora no, usar solo la clave
        </ZashButton>
      </div>
    </div>
  )
}
