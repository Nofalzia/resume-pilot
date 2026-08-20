import { Button } from '@/components/ui/Button'

interface ErrorStateProps {
  title?: string
  message: string
  code?: string
  onRetry?: () => void
  retryLabel?: string
}

export function ErrorState({
  title,
  message,
  code,
  onRetry,
  retryLabel = 'Try again',
}: ErrorStateProps) {
  const isRateLimited = code === 'RATE_LIMITED'

  const heading = title ?? (isRateLimited ? 'Service temporarily busy' : 'Something went wrong')

  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{
        background: isRateLimited ? 'var(--warning-muted)' : 'var(--danger-muted)',
        border: `1px solid ${isRateLimited ? 'rgba(245,158,11,0.25)' : 'rgba(239,68,68,0.2)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: '20px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <div>
        <p
          style={{
            fontSize: '15px',
            fontWeight: '600',
            color: isRateLimited ? 'var(--warning)' : '#FCA5A5',
            margin: '0 0 4px',
          }}
        >
          {heading}
        </p>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
          {message}
        </p>
      </div>

      {onRetry && (
        <div>
          <Button variant="secondary" size="sm" onClick={onRetry}>
            {retryLabel}
          </Button>
        </div>
      )}
    </div>
  )
}
