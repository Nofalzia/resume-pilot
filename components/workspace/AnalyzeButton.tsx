'use client'

interface AnalyzeButtonProps {
  disabled: boolean
  loading: boolean
  hasJobDescription?: boolean
  onClick?: () => void
}

export function AnalyzeButton({
  disabled,
  loading,
  hasJobDescription = false,
  onClick,
}: AnalyzeButtonProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <button
        type="submit"
        onClick={onClick}
        disabled={disabled || loading}
        aria-disabled={disabled || loading}
        aria-busy={loading}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          width: '100%',
          padding: '14px 24px',
          background: disabled ? 'var(--surface-2)' : 'var(--accent)',
          color: disabled ? 'var(--text-muted)' : '#080809',
          border: disabled ? '1px solid var(--border)' : 'none',
          borderRadius: 'var(--radius-lg)',
          fontSize: '15px',
          fontWeight: '700',
          fontFamily: 'inherit',
          letterSpacing: '-0.02em',
          cursor: disabled || loading ? 'not-allowed' : 'pointer',
          transition:
            'background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out)',
        }}
        onMouseEnter={(e) => {
          if (!disabled && !loading) {
            e.currentTarget.style.background = 'var(--accent-hover)'
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled && !loading) {
            e.currentTarget.style.background = 'var(--accent)'
          }
        }}
        onMouseDown={(e) => {
          if (!disabled && !loading) {
            e.currentTarget.style.transform = 'scale(0.98)'
          }
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
        }}
      >
        {loading ? (
          <>
            <Spinner />
            Analyzing your resume…
          </>
        ) : (
          <>
            <SparkleIcon />
            Analyze my resume
          </>
        )}
      </button>

      {/* Contextual nudge */}
      <p
        aria-live="polite"
        style={{
          fontSize: '12px',
          color: 'var(--text-muted)',
          textAlign: 'center',
          margin: 0,
        }}
      >
        {disabled
          ? 'Paste your resume above to get started'
          : hasJobDescription
          ? 'Will include keyword matching and role alignment score'
          : 'Analysis runs in ~10–15 seconds'}
      </p>
    </div>
  )
}

function Spinner() {
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'inline-block',
        width: '16px',
        height: '16px',
        border: '2px solid #080809',
        borderTopColor: 'transparent',
        borderRadius: '50%',
        animation: 'analyze-spin 0.7s linear infinite',
        flexShrink: 0,
      }}
    >
      <style>{`@keyframes analyze-spin { to { transform: rotate(360deg); } }`}</style>
    </span>
  )
}

function SparkleIcon() {
  return (
    <svg
      aria-hidden="true"
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="currentColor"
      style={{ flexShrink: 0 }}
    >
      <path d="M12 2l2.4 7.2H22l-6.4 4.8 2.4 7.2L12 17l-6 4.2 2.4-7.2L2 9.2h7.6L12 2z" />
    </svg>
  )
}
