'use client'

import { ChevronLeft, Phone, User } from 'lucide-react'
import { useWallet } from '@/lib/zash/store'
import { ZashButton, Notice } from '../ui'

export function AyudaScreen() {
  const { navigate, dispatch, speak } = useWallet()

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
        <h1 className="text-xl font-extrabold">Pedir ayuda</h1>
      </header>

      <div className="zash-scroll flex-1 overflow-y-auto px-5 py-5">
        <Notice tone="info">
          Acá no hay robots: te atiende una persona de verdad.
        </Notice>

        <div className="mt-5 flex flex-col gap-3">
          <ZashButton
            variant="amber"
            onClick={() => {
              dispatch({
                type: 'setDone',
                title: 'Te vamos a llamar',
                sub: 'Una persona del servicio técnico te llama en unos minutos. Tené el celular a mano. Número: 11 5555-0123',
              })
              speak('Te vamos a llamar en unos minutos.')
            }}
          >
            <Phone className="size-5" /> Quiero que me llamen
          </ZashButton>
          <ZashButton
            variant="secondary"
            onClick={() => {
              dispatch({
                type: 'setDone',
                title: 'Turno pedido',
                sub: 'Te llamamos para confirmar el día y la hora de atención en persona.',
              })
            }}
          >
            <User className="size-5" /> Atención en persona
          </ZashButton>
        </div>

        <h2 className="mt-8 text-lg font-extrabold">Cómo pagar una boleta</h2>
        <ol className="mt-2 list-decimal space-y-2 pl-5 text-base text-zash-muted">
          <li>Tocá “Pagar boletas”.</li>
          <li>Elegí la boleta con el dibujo.</li>
          <li>Leé el cartel y tocá “Sí, pagar”.</li>
        </ol>
        <ZashButton
          variant="ghost"
          className="mt-3"
          onClick={() =>
            speak(
              'Para pagar una boleta: uno, tocá Pagar boletas. Dos, elegí la boleta con el dibujo. Tres, leé el cartel y tocá Sí, pagar.',
            )
          }
        >
          Escuchar la guía
        </ZashButton>

        <p className="mt-8 rounded-2xl bg-zash-amber-soft p-4 text-sm font-medium leading-relaxed text-zash-ink">
          Zash nunca te pide la clave por teléfono ni por mensaje. Si alguien te la pide, cortá y llamanos.
        </p>
      </div>
    </div>
  )
}
