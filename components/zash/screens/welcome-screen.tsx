'use client'

import { ZashButton, ZashLogo } from '../ui'
import { useWallet } from '@/lib/zash/store'

export function WelcomeScreen() {
  const { navigate, speak, dispatch } = useWallet()

  return (
    <div className="flex h-full flex-col bg-zash-bg px-6 pt-10 pb-8">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <ZashLogo size={80} className="mb-6" />
        <h1 className="text-3xl font-extrabold tracking-tight text-zash-ink">Zash</h1>
        <p className="mt-2 text-lg text-zash-muted">Tu billetera simple</p>
        <p className="mt-6 max-w-[280px] text-base leading-relaxed text-zash-muted">
          Pensada para personas mayores. Letras grandes, voz que confirma, huella o cara, y ayuda de verdad.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <ZashButton
          onClick={() => {
            dispatch({ type: 'setPinMode', mode: 'set' })
            speak('Bienvenida a Zash. Vamos a crear tu clave de cuatro números.')
            navigate('pin')
          }}
        >
          Empezar (crear clave)
        </ZashButton>
        <ZashButton
          variant="secondary"
          onClick={() => {
            speak('Entrando a la billetera de Rosa.')
            dispatch({ type: 'pinSuccess' })
            navigate('home')
          }}
        >
          Ya tengo cuenta (demo)
        </ZashButton>
      </div>
    </div>
  )
}
