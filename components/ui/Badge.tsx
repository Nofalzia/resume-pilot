import type { ReactNode } from 'react'

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'accent'

interface BadgeProps {
  variant?: BadgeVariant
  children: ReactNode
  size?: 'sm' | 'md'
}

const variantMap: Record<BadgeVariant, { bg: string; color: string; border: string }> = {
  success: {
    bg: 'var(--success-muted)',
    color: 'var(--success)',
    border: 'rgba(34,197,94,0.2)',
  },
  warning: {
    bg: 'var(--warning-muted)',
    color: 'var(--warning)',
    border: 'rgba(245,158,11,0.2)',
  },
  danger: {
    bg: 'var(--danger-muted)',
    color: '#FCA5A5',
    border: 'rgba(239,68,68,0.2)',
  },
  info: {
    bg: 'rgba(99,179,237,0.10)',
    color: '#90CDF4',
    border: 'rgba(99,179,237,0.2)',
  },
  neutral: {
    bg: 'var(--surface-2)',
    color: 'var(--text-secondary)',
    border: 'var(--border)',
  },
  accent: {
    bg: 'var(--accent-muted)',
    color: 'var(--accent)',
    border: 'rgba(45,232,176,0.2)',
  },
}

export function Badge({ variant = 'neutral', size = 'sm', children }: BadgeProps) {
  const v = variantMap[variant]

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: size === 'sm' ? '11px' : '13px',
        fontWeight: '500',
        padding: size === 'sm' ? '2px 8px' : '4px 10px',
        borderRadius: 'var(--radius-sm)',
        background: v.bg,
        color: v.color,
        border: `1px solid ${v.border}`,
        letterSpacing: '0.01em',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  )
}
