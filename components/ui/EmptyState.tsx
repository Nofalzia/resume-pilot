import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '48px 24px',
        gap: '12px',
      }}
    >
      {icon && (
        <div
          aria-hidden="true"
          style={{
            fontSize: '28px',
            color: 'var(--text-muted)',
            marginBottom: '4px',
          }}
        >
          {icon}
        </div>
      )}
      <p
        style={{
          fontSize: '15px',
          fontWeight: '500',
          color: 'var(--text-secondary)',
          margin: 0,
        }}
      >
        {title}
      </p>
      {description && (
        <p
          style={{
            fontSize: '14px',
            color: 'var(--text-muted)',
            margin: 0,
            maxWidth: '320px',
            lineHeight: '1.6',
          }}
        >
          {description}
        </p>
      )}
      {action && <div style={{ marginTop: '8px' }}>{action}</div>}
    </div>
  )
}
