'use client'

import { forwardRef, useId, type TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  description?: string
  error?: string
  maxChars?: number
  /** Show char count only when approaching the limit */
  charCountThreshold?: number
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      description,
      error,
      maxChars,
      charCountThreshold = 0.75,
      value = '',
      style,
      ...props
    },
    ref
  ) => {
    const id = useId()
    const descId = description ? `${id}-desc` : undefined
    const errId = error ? `${id}-err` : undefined

    const charCount = typeof value === 'string' ? value.length : 0
    const nearLimit = maxChars
      ? charCount >= maxChars * charCountThreshold
      : false
    const overLimit = maxChars ? charCount > maxChars : false

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {/* Label row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: '8px',
          }}
        >
          <label
            htmlFor={id}
            style={{
              fontSize: '13px',
              fontWeight: '500',
              color: 'var(--text-primary)',
              letterSpacing: '-0.01em',
            }}
          >
            {label}
          </label>

          {maxChars && nearLimit && (
            <span
              aria-live="polite"
              style={{
                fontSize: '12px',
                color: overLimit ? 'var(--danger)' : 'var(--warning)',

                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {charCount.toLocaleString()} / {maxChars.toLocaleString()}
            </span>
          )}
        </div>

        {description && (
          <p
            id={descId}
            style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}
          >
            {description}
          </p>
        )}

        {/* Textarea */}
        <textarea
          ref={ref}
          id={id}
          value={value}
          aria-describedby={
            [descId, errId].filter(Boolean).join(' ') || undefined
          }
          aria-invalid={error ? 'true' : undefined}
          style={{
            width: '100%',
            background: 'var(--surface-1)',
            border: `1px solid ${error ? 'var(--danger)' : overLimit ? 'var(--warning)' : 'var(--border-strong)'}`,
            borderRadius: 'var(--radius-lg)',
            color: 'var(--text-primary)',
            fontFamily: 'inherit',
            fontSize: '14px',
            lineHeight: '1.7',
            padding: '14px 16px',
            resize: 'vertical',
            transition: `border-color var(--dur-fast) var(--ease-out)`,
            ...style,
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-focus)'
            e.currentTarget.style.boxShadow = '0 0 0 3px var(--accent-muted)'
            props.onFocus?.(e)
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = error
              ? 'var(--danger)'
              : overLimit
              ? 'var(--warning)'
              : 'var(--border-strong)'
            e.currentTarget.style.boxShadow = 'none'
            props.onBlur?.(e)
          }}
          {...props}
        />

        {/* Error message */}
        {error && (
          <p
            id={errId}
            role="alert"
            style={{
              fontSize: '13px',
              color: 'var(--danger)',
              margin: 0,
            }}
          >
            {error}
          </p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
