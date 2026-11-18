'use client'

import { useState } from 'react'
import { BatteryFull, RotateCcw, Signal, Wifi } from 'lucide-react'
import { cn } from '@/lib/utils'
import { WalletProvider, useWallet } from '@/lib/zash/store'
import { type ScreenId } from '@/lib/zash/data'
import { formatMoney } from '@/lib/zash/data'
import { ZashLogo } from './ui'
import { WelcomeScreen } from './screens/welcome-screen'
import { PinScreen } from './screens/pin-screen'
import { LockScreen } from './screens/lock-screen'
import { BioaskScreen } from './screens/bioask-screen'
import { HomeScreen } from './screens/home-screen'
import { BoletasScreen } from './screens/boletas-screen'
import { EnviarScreen } from './screens/enviar-screen'
import { NuevoScreen } from './screens/nuevo-screen'
import { MontoScreen } from './screens/monto-screen'
import { ConfirmScreen } from './screens/confirm-screen'
import { ListoScreen } from './screens/listo-screen'
import { MovsScreen } from './screens/movs-screen'
import { AutoScreen } from './screens/auto-screen'
import { AyudaScreen } from './screens/ayuda-screen'
import { ArquitecturaScreen } from './screens/arquitectura-screen'

const SCREENS: {
  id: ScreenId
  label: string
  group: string
  component: () => React.JSX.Element
}[] = [
  { id: 'welcome', label: 'Bienvenida', group: 'Acceso', component: WelcomeScreen },
  { id: 'pin', label: 'Clave de 4 números', group: 'Acceso', component: PinScreen },
  { id: 'lock', label: 'Ingreso con huella/cara', group: 'Acceso', component: LockScreen },
  { id: 'bioask', label: 'Activar biometría', group: 'Acceso', component: BioaskScreen },
  { id: 'home', label: 'Inicio de la billetera', group: 'Billetera', component: HomeScreen },
  { id: 'boletas', label: 'Pagar boletas', group: 'Billetera', component: BoletasScreen },
  { id: 'enviar', label: 'Enviar plata', group: 'Billetera', component: EnviarScreen },
  { id: 'nuevo', label: 'Persona nueva', group: 'Billetera', component: NuevoScreen },
  { id: 'monto', label: 'Escribir el monto', group: 'Billetera', component: MontoScreen },
  { id: 'confirm', label: 'Confirmar operación', group: 'Billetera', component: ConfirmScreen },
  { id: 'listo', label: 'Comprobante', group: 'Billetera', component: ListoScreen },
  { id: 'movs', label: 'Mis movimientos', group: 'Billetera', component: MovsScreen },
  { id: 'auto', label: 'Pagos automáticos', group: 'Billetera', component: AutoScreen },
  { id: 'ayuda', label: 'Pedir ayuda', group: 'Ayuda', component: AyudaScreen },
  { id: 'arquitectura', label: 'Arquitectura de la app', group: 'Documentación', component: ArquitecturaScreen },
]

const GROUPS = ['Acceso', 'Billetera', 'Ayuda', 'Documentación']

export function DemoShell() {
  return (
    <WalletProvider>
      <DemoLayout />
    </WalletProvider>
  )
}

function DemoLayout() {
  const { state, navigate, dispatch } = useWallet()
  const [resetOpen, setResetOpen] = useState(false)
  const current = SCREENS.find((s) => s.id === state.screen) ?? SCREENS[0]
  const ScreenComponent = current.component
  const index = SCREENS.indexOf(current)

  return (
    <div className="min-h-dvh bg-zash-bg lg:flex">
      <aside
        aria-label="Índice de pantallas de la demo"
        className="zash-scroll sticky top-0 hidden h-dvh w-80 shrink-0 flex-col gap-6 overflow-y-auto border-r border-zash-line bg-white p-6 lg:flex"
      >
        <div className="flex items-center gap-3">
          <ZashLogo size={48} />
          <div>
            <p className="font-extrabold">Zash · Billetera</p>
            <p className="text-xs text-zash-muted">Para personas mayores · Demo</p>
          </div>
        </div>

        <nav className="flex flex-col gap-5">
          {GROUPS.map((group) => (
            <div key={group}>
              <p className="mb-2 text-xs font-semibold tracking-wide text-zash-muted uppercase">
                {group}
              </p>
              <ul className="flex flex-col gap-1">
                {SCREENS.filter((s) => s.group === group).map((s) => {
                  const n = SCREENS.indexOf(s) + 1
                  const active = s.id === state.screen
                  return (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => navigate(s.id)}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors',
                          active
                            ? 'bg-zash-navy font-bold text-white'
                            : 'text-zash-ink hover:bg-zash-chip',
                        )}
                      >
                        <span
                          className={cn(
                            'flex size-6 items-center justify-center rounded-full text-[11px] font-bold',
                            active ? 'bg-zash-amber text-zash-ink' : 'bg-zash-chip text-zash-ink',
                          )}
                        >
                          {n}
                        </span>
                        {s.label}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-3">
          <div className="rounded-2xl bg-zash-chip p-4 text-sm">
            <dl className="flex flex-col gap-1.5">
              <div className="flex justify-between">
                <dt className="text-zash-muted">Saldo</dt>
                <dd className="font-bold tabular-nums">{formatMoney(state.balance)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zash-muted">Voz</dt>
                <dd className="font-bold">{state.voice ? 'Sí' : 'No'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zash-muted">Biometría</dt>
                <dd className="font-bold">{state.bioEnabled ? 'Sí' : 'No'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zash-muted">Letra grande</dt>
                <dd className="font-bold">{state.bigText ? 'Sí' : 'No'}</dd>
              </div>
            </dl>
          </div>
          <button
            type="button"
            onClick={() => setResetOpen(true)}
            className="flex h-11 items-center justify-center gap-2 rounded-xl border-2 border-zash-navy text-sm font-bold hover:bg-zash-chip"
          >
            <RotateCcw className="size-4" aria-hidden /> Reiniciar demo
          </button>
          <p className="text-[11px] leading-relaxed text-zash-muted">
            Prototipo académico. No procesa dinero real. Biometría y voz usan APIs del navegador.
          </p>
        </div>
      </aside>

      <div className="flex min-h-dvh flex-1 flex-col">
        <div className="flex items-center gap-2 border-b border-zash-line bg-white px-3 py-2 lg:hidden">
          <ZashLogo size={32} />
          <select
            value={state.screen}
            onChange={(e) => navigate(e.target.value as ScreenId)}
            className="h-10 min-w-0 flex-1 rounded-lg border border-zash-line bg-white px-2 text-sm font-medium"
            aria-label="Ir a la pantalla"
          >
            {GROUPS.map((g) => (
              <optgroup key={g} label={g}>
                {SCREENS.filter((s) => s.group === g).map((s) => (
                  <option key={s.id} value={s.id}>
                    {SCREENS.indexOf(s) + 1}. {s.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setResetOpen(true)}
            aria-label="Reiniciar demo"
            className="flex h-10 items-center gap-1.5 rounded-lg border border-zash-navy px-2.5 text-xs font-bold"
          >
            <RotateCcw className="size-3.5" /> Reiniciar
          </button>
        </div>

        <main className="flex flex-1 flex-col items-center justify-center sm:p-4">
          <p className="mb-3 hidden text-sm text-zash-muted sm:block">
            Pantalla {index + 1} de {SCREENS.length} ·{' '}
            <span className="font-semibold text-zash-ink">{current.label}</span>
          </p>
          <div className="relative flex h-[calc(100dvh-53px)] w-full flex-col overflow-hidden bg-white sm:h-[844px] sm:max-h-[calc(100dvh-8.5rem)] sm:w-[390px] sm:rounded-[48px] sm:border-[10px] sm:border-zash-navy sm:shadow-[0_20px_50px_-20px_rgba(11,42,102,0.35)]">
            <div
              className="hidden h-9 shrink-0 items-center justify-between bg-transparent px-7 text-xs font-semibold sm:flex"
              aria-hidden
            >
              <span>9:41</span>
              <span className="h-5 w-24 rounded-full bg-zash-navy" />
              <span className="flex items-center gap-1">
                <Signal className="size-3.5" />
                <Wifi className="size-3.5" />
                <BatteryFull className="size-4" />
              </span>
            </div>
            <div
              key={`${state.screen}-${state.resetKey}`}
              className="relative min-h-0 flex-1 animate-in fade-in-0 duration-200"
            >
              <ScreenComponent />
            </div>
          </div>
          <p className="mt-3 hidden text-xs text-zash-muted sm:block">
            Demo interactiva · Voz + biometría · Orientada a personas mayores
          </p>
        </main>
      </div>

      {resetOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-extrabold">¿Reiniciar la demo?</h2>
            <p className="mt-2 text-zash-muted">
              Se restauran el saldo, las boletas, los movimientos y la configuración inicial.
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  dispatch({ type: 'reset' })
                  setResetOpen(false)
                }}
                className="h-12 rounded-2xl bg-zash-navy font-bold text-white"
              >
                Reiniciar demo
              </button>
              <button
                type="button"
                onClick={() => setResetOpen(false)}
                className="h-12 rounded-2xl border-2 border-zash-line font-bold"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
