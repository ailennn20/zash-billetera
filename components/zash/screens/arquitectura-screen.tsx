'use client'

import { ChevronLeft } from 'lucide-react'
import { useWallet } from '@/lib/zash/store'

const LAYERS = [
  {
    title: 'Presentación',
    color: '#0B2A66',
    items: [
      'Pantallas grandes, alto contraste',
      'Botones táctiles ≥ 48px',
      'Tipografía Inter, base 18px+',
      'Modo letra grande opcional',
    ],
  },
  {
    title: 'Interacción',
    color: '#FFC933',
    items: [
      'Confirmación explícita antes de pagar/enviar',
      'Síntesis de voz (es-AR) para leer carteles',
      'Reconocimiento de voz (comandos simples)',
      'Teclado numérico grande para montos y PIN',
    ],
  },
  {
    title: 'Seguridad',
    color: '#1B7A4E',
    items: [
      'PIN de 4 dígitos (hash local en demo)',
      'Biometría del dispositivo (WebAuthn platform)',
      'Bloqueo automático tras inactividad',
      'Límite de intentos de clave',
      'Nunca pide clave por teléfono/mensaje',
    ],
  },
  {
    title: 'Dominio',
    color: '#55617D',
    items: [
      'Saldo y movimientos simulados',
      'Boletas de servicios',
      'Contactos familiares y comercios',
      'Pagos automáticos on/off',
      'Ayuda con persona real (simulada)',
    ],
  },
]

const FLOWS = [
  {
    name: 'Onboarding',
    steps: ['Bienvenida', 'Crear PIN', 'Confirmar PIN', 'Activar biometría (opc.)', 'Inicio'],
  },
  {
    name: 'Pagar boleta',
    steps: ['Inicio', 'Pagar boletas', 'Elegir boleta', 'Confirmar + voz', 'Listo'],
  },
  {
    name: 'Enviar plata',
    steps: ['Inicio', 'Enviar', 'Elegir contacto', 'Monto', 'Confirmar + voz', 'Listo'],
  },
  {
    name: 'Voz',
    steps: ['Micrófono', 'Escuchar / escribir', 'Interpretar comando', 'Navegar o confirmar'],
  },
]

export function ArquitecturaScreen() {
  const { navigate } = useWallet()

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
        <h1 className="text-xl font-extrabold">Arquitectura</h1>
      </header>

      <div className="zash-scroll flex-1 overflow-y-auto px-5 py-5">
        <p className="text-base leading-relaxed text-zash-muted">
          Zash está pensada para personas mayores: pocas pantallas, lenguaje claro, confirmaciones
          habladas y seguridad del teléfono (PIN + biometría).
        </p>

        <h2 className="mt-6 text-lg font-extrabold">Capas</h2>
        <div className="mt-3 grid gap-3">
          {LAYERS.map((l) => (
            <div
              key={l.title}
              className="rounded-2xl border-2 border-zash-line bg-white p-4"
            >
              <div className="mb-2 flex items-center gap-2">
                <span
                  className="size-3 rounded-sm"
                  style={{ background: l.color }}
                  aria-hidden
                />
                <h3 className="font-extrabold">{l.title}</h3>
              </div>
              <ul className="list-disc space-y-1 pl-5 text-sm text-zash-muted">
                {l.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <h2 className="mt-8 text-lg font-extrabold">Flujos principales</h2>
        <div className="mt-3 grid gap-3">
          {FLOWS.map((f) => (
            <div key={f.name} className="rounded-2xl border-2 border-zash-line bg-white p-4">
              <h3 className="font-extrabold">{f.name}</h3>
              <ol className="mt-2 flex flex-wrap gap-1.5">
                {f.steps.map((s, i) => (
                  <li key={s} className="flex items-center gap-1.5 text-sm">
                    {i > 0 && <span className="text-zash-muted">→</span>}
                    <span className="rounded-full bg-zash-chip px-2.5 py-1 font-semibold">
                      {s}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>

        <h2 className="mt-8 text-lg font-extrabold">Principios de diseño</h2>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-base text-zash-muted">
          <li>Una acción principal por pantalla</li>
          <li>Texto en voz alta opcional en cada confirmación</li>
          <li>Errores claros y recuperables (sin jerga técnica)</li>
          <li>Ayuda humana accesible en un toque</li>
          <li>Sin publicidad ni upselling</li>
        </ul>

        <div className="mt-6 rounded-2xl border-l-4 border-zash-navy bg-zash-navy-soft p-4 text-sm leading-relaxed">
          <strong>Nota de prototipo:</strong> esta demo no se conecta a bancos ni procesa dinero
          real. La biometría usa WebAuthn del navegador; el reconocimiento de voz usa la API de
          SpeechRecognition (mejor en Chrome).
        </div>
      </div>
    </div>
  )
}
