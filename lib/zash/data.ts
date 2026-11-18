export type ScreenId =
  | 'welcome'
  | 'pin'
  | 'lock'
  | 'bioask'
  | 'home'
  | 'boletas'
  | 'enviar'
  | 'nuevo'
  | 'monto'
  | 'confirm'
  | 'listo'
  | 'movs'
  | 'auto'
  | 'ayuda'
  | 'arquitectura'

export interface Movement {
  id: string
  title: string
  date: string
  amount: number
}

export interface Bill {
  id: string
  name: string
  company: string
  amount: number
  icon: string
}

export interface Contact {
  id: string
  name: string
  relation: string
  isNew?: boolean
}

export interface AutoPay {
  id: string
  name: string
  subtitle: string
  amount: number
  on: boolean
}

export function formatMoney(n: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(n)
}

export function operationId(): string {
  return `op-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export const INITIAL_MOVEMENTS: Movement[] = [
  { id: '1', title: 'Cobro de jubilación', date: 'Hoy', amount: 412350 },
  { id: '2', title: 'Farmacia del Barrio', date: 'Ayer', amount: -18200 },
  { id: '3', title: 'Transferencia a Marta', date: 'Hace 3 días', amount: -15000 },
  { id: '4', title: 'Pago de Agua', date: 'Hace 5 días', amount: -9800 },
]

export const INITIAL_BILLS: Bill[] = [
  { id: 'luz', name: 'Luz', company: 'Edenor', amount: 18450, icon: '⚡' },
  { id: 'gas', name: 'Gas', company: 'Metrogas', amount: 12300, icon: '🔥' },
  { id: 'agua', name: 'Agua', company: 'AySA', amount: 9800, icon: '💧' },
  { id: 'internet', name: 'Internet', company: 'Telecentro', amount: 21900, icon: '📶' },
]

export const INITIAL_CONTACTS: Contact[] = [
  { id: '1', name: 'Juan Pérez', relation: 'Mi hijo' },
  { id: '2', name: 'Marta Pérez', relation: 'Mi hija' },
  { id: '3', name: 'Lucía Gómez', relation: 'Mi nieta' },
  { id: '4', name: 'Rosa Díaz', relation: 'Amiga' },
  { id: '5', name: 'Carlos Rodríguez', relation: 'Plomero' },
  { id: '6', name: 'Farmacia del Barrio', relation: 'Comercio' },
]

export const INITIAL_AUTO: AutoPay[] = [
  { id: '1', name: 'Remedios', subtitle: 'Farmacia del Barrio', amount: 18200, on: true },
  { id: '2', name: 'Médico', subtitle: 'Cuota de la prepaga', amount: 34500, on: false },
]

export const SCREEN_LABELS: Record<ScreenId, string> = {
  welcome: 'Bienvenida',
  pin: 'Clave de 4 números',
  lock: 'Ingreso con huella o cara',
  bioask: 'Activar huella o cara',
  home: 'Inicio',
  boletas: 'Pagar boletas',
  enviar: 'Enviar plata',
  nuevo: 'Persona nueva',
  monto: 'Escribir el monto',
  confirm: 'Confirmar',
  listo: 'Listo',
  movs: 'Mis movimientos',
  auto: 'Pagos automáticos',
  ayuda: 'Pedir ayuda',
  arquitectura: 'Arquitectura de la app',
}

/** Comandos de voz de ejemplo */
export const VOICE_CHIPS = [
  { label: '¿Cuánto dinero tengo?', cmd: 'cuanto dinero tengo' },
  { label: 'Pagar boletas', cmd: 'pagar boletas' },
  { label: 'Enviar plata', cmd: 'enviar plata' },
  { label: 'Necesito ayuda', cmd: 'necesito ayuda' },
]
