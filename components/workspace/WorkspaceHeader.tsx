import Link from 'next/link'
import { Button } from '@/components/ui/Button'

interface WorkspaceHeaderProps {
  showReanalyze: boolean
  onReanalyze: () => void
  showCopilotTrigger?: boolean
  onOpenCopilot?: () => void
}

export function WorkspaceHeader({
  showReanalyze,
  onReanalyze,
  showCopilotTrigger = false,
  onOpenCopilot,
}: WorkspaceHeaderProps) {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        borderBottom: '1px solid var(--border)',
        background: 'rgba(8,8,9,0.88)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        padding: '0 1rem',
      }}
    >
      <div
        style={{
          maxWidth: '768px',
          margin: '0 auto',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          aria-label="Resume Pilot — home"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'var(--text-primary)', flexShrink: 0 }}
        >
          <span
            aria-hidden="true"
            style={{
              width: '28px', height: '28px',
              background: 'var(--accent)',
              borderRadius: '7px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '12px', fontWeight: '800', color: '#080809', letterSpacing: '-0.03em',
            }}
          >
            RP
          </span>
          <span style={{ fontSize: '15px', fontWeight: '600', letterSpacing: '-0.02em' }}>
            Resume Pilot
          </span>
        </Link>

        {/* Actions */}
        <div className="workspace-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {showCopilotTrigger && onOpenCopilot && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onOpenCopilot}
              aria-label="Open AI Copilot"
            >
              <CopilotIcon />
              Copilot
            </Button>
          )}
          {showReanalyze && (
            <Button variant="ghost" size="sm" onClick={onReanalyze} aria-label="Start a new analysis">
              New analysis
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

function CopilotIcon() {
  return (
    <svg
      aria-hidden="true"
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}
