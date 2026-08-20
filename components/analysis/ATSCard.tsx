import { Badge } from '@/components/ui/Badge'
import type { Analysis } from '@/lib/types'

const ATS_DESCRIPTION: Record<Analysis['atsCompatibility'], string> = {
  good: 'Your resume should parse reliably through most ATS systems.',
  'needs-work': 'Some formatting issues may cause ATS parsing problems.',
  poor: 'Significant formatting issues that will likely cause ATS rejection.',
}

interface ATSCardProps {
  atsCompatibility: Analysis['atsCompatibility']
  atsIssues: Analysis['atsIssues']
  animationDelay?: number
}

export function ATSCard({ atsCompatibility, atsIssues, animationDelay = 0 }: ATSCardProps) {
  const variant =
    atsCompatibility === 'good'
      ? 'success'
      : atsCompatibility === 'needs-work'
      ? 'warning'
      : 'danger'

  return (
    <section
      aria-labelledby="ats-heading"
      style={{
        background: 'var(--surface-1)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        animation: `fade-up var(--dur-slow) var(--ease-out) ${animationDelay}ms both`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
        <h2
          id="ats-heading"
          style={{
            fontSize: '13px',
            fontWeight: '600',
            color: 'var(--text-primary)',
            margin: 0,
          }}
        >
          ATS Compatibility
        </h2>
        <Badge variant={variant}>
          {atsCompatibility === 'good'
            ? 'Good'
            : atsCompatibility === 'needs-work'
            ? 'Needs work'
            : 'Poor'}
        </Badge>
      </div>

      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.6' }}>
        {ATS_DESCRIPTION[atsCompatibility]}
      </p>

      {atsIssues.length > 0 && (
        <div>
          <p style={{
            fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)',
            textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 8px',
          }}>
            Issues found
          </p>
          <ul style={{
            listStyle: 'none', margin: 0, padding: 0,
            display: 'flex', flexDirection: 'column', gap: '6px',
          }}>
            {atsIssues.map((issue, i) => (
              <li key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <span aria-hidden="true" style={{ color: 'var(--warning)', fontSize: '13px', lineHeight: '1.6', flexShrink: 0 }}>
                  ⚠
                </span>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  {issue}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {atsIssues.length === 0 && atsCompatibility === 'good' && (
        <p style={{ fontSize: '13px', color: 'var(--success)', margin: 0 }}>
          No ATS issues detected.
        </p>
      )}
    </section>
  )
}
