'use client'

import { type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Loader2, Volume2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'amber' | 'secondary' | 'ghost' | 'danger'

const buttonVariants: Record<ButtonVariant, string> = {
  primary: 'bg-zash-navy text-white hover:bg-[#0a2459] active:bg-[#091f4d]',
  amber: 'bg-zash-amber text-zash-ink hover:bg-[#f5c020] active:bg-[#ebb800]',
  secondary: 'bg-white text-zash-ink border-2 border-zash-line hover:bg-zash-bg',
  ghost: 'bg-transparent text-zash-ink hover:bg-zash-chip',
  danger: 'bg-white text-zash-error border-2 border-zash-error/40 hover:bg-zash-error-soft',
}

interface ZashButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: 'md' | 'lg' | 'sm'
  loading?: boolean
  fullWidth?: boolean
}

export function ZashButton({
  variant = 'primary',
  size = 'lg',
  loading,
  fullWidth = true,
  className,
  children,
  disabled,
  type = 'button',
  ...props
}: ZashButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-2xl font-bold transition-colors',
        'focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zash-amber',
        'disabled:cursor-not-allowed disabled:opacity-50',
        size === 'lg' && 'h-14 px-6 text-lg',
        size === 'md' && 'h-12 px-5 text-base',
        size === 'sm' && 'h-10 px-4 text-sm rounded-xl',
        fullWidth && 'w-full',
        buttonVariants[variant],
        className,
      )}
      {...props}
    >
      {loading && <Loader2 className="size-5 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  )
}

export function ZashLogo({ size = 48, className }: { size?: number; className?: string }) {
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-2xl bg-zash-navy font-extrabold text-white',
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      aria-label="Zash"
    >
      Z
    </div>
  )
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-xl font-extrabold text-zash-ink">{children}</h2>
}

export function SpeakButton({ onClick, label = 'Leerme esto' }: { onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full border-2 border-zash-navy bg-white px-4 py-2 text-sm font-bold text-zash-navy"
    >
      <Volume2 className="size-4" aria-hidden="true" />
      {label}
    </button>
  )
}

export function Notice({ children, tone = 'info' }: { children: ReactNode; tone?: 'info' | 'warn' | 'ok' }) {
  const styles = {
    info: 'bg-zash-navy-soft border-zash-navy/20 text-zash-ink',
    warn: 'bg-zash-amber-soft border-zash-amber/40 text-zash-ink',
    ok: 'bg-emerald-50 border-emerald-200 text-emerald-900',
  }
  return (
    <div className={cn('rounded-2xl border-2 px-4 py-3 text-base font-medium leading-snug', styles[tone])}>
      {children}
    </div>
  )
}
