'use client'

import { forwardRef, type ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  fullWidth?: boolean
}

const variantStyles: Record<Variant, React.CSSProperties> = {
  primary: {
    background: 'var(--accent)',
    color: '#080809',
    border: 'none',
  },
  secondary: {
    background: 'var(--surface-2)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-strong)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text-secondary)',
    border: '1px solid var(--border)',
  },
  danger: {
    background: 'var(--danger-muted)',
    color: '#FCA5A5',
    border: '1px solid rgba(239,68,68,0.25)',
  },
}

const sizeStyles: Record<Size, React.CSSProperties> = {
  sm: { fontSize: '13px', padding: '6px 12px', borderRadius: 'var(--radius-md)' },
  md: { fontSize: '14px', padding: '9px 18px', borderRadius: 'var(--radius-md)' },
  lg: { fontSize: '15px', padding: '12px 24px', borderRadius: 'var(--radius-lg)' },
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      disabled,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          fontWeight: '600',
          fontFamily: 'inherit',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          width: fullWidth ? '100%' : undefined,
          opacity: isDisabled && !loading ? 0.45 : 1,
          transition: `opacity var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out)`,
          userSelect: 'none',
          whiteSpace: 'nowrap',
          letterSpacing: '-0.01em',
          ...variantStyles[variant],
          ...sizeStyles[size],
          ...style,
        }}
        onMouseDown={(e) => {
          if (!isDisabled) {
            const el = e.currentTarget
            el.style.transform = 'scale(0.97)'
          }
          props.onMouseDown?.(e)
        }}
        onMouseUp={(e) => {
          const el = e.currentTarget
          el.style.transform = 'scale(1)'
          props.onMouseUp?.(e)
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget
          el.style.transform = 'scale(1)'
          props.onMouseLeave?.(e)
        }}
        {...props}
      >
        {loading && (
          <span
            aria-hidden="true"
            style={{
              display: 'inline-block',
              width: '14px',
              height: '14px',
              border: '2px solid currentColor',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 0.7s linear infinite',
              flexShrink: 0,
            }}
          />
        )}
        {children}
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </button>
    )
  }
)

Button.displayName = 'Button'
