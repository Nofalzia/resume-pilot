import { Badge } from '@/components/ui/Badge'
import type { RecommendationItem } from '@/lib/types'

const PRIORITY_VARIANT: Record<
  RecommendationItem['priority'],
  'danger' | 'warning' | 'neutral'
> = {
  high: 'danger',
  medium: 'warning',
  low: 'neutral',
}

const PRIORITY_LABEL: Record<RecommendationItem['priority'], string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
}

interface RecommendationsCardProps {
  recommendations: RecommendationItem[]
  animationDelay?: number
}

export function RecommendationsCard({
  recommendations,
  animationDelay = 0,
}: RecommendationsCardProps) {
  if (!recommendations.length) return null

  return (
    <section
      aria-labelledby="recommendations-heading"
      style={{
        background: 'var(--surface-1)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        animation: `fade-up var(--dur-slow) var(--ease-out) ${animationDelay}ms both`,
      }}
    >
      <h2
        id="recommendations-heading"
        style={{
          fontSize: '13px',
          fontWeight: '600',
          color: 'var(--text-primary)',
          margin: 0,
          letterSpacing: '-0.01em',
        }}
      >
        Recommendations
      </h2>

      <ol
        style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
        }}
      >
        {recommendations.map((rec, i) => (
          <li
            key={i}
            style={{
              display: 'flex',
              gap: '14px',
              alignItems: 'flex-start',
              padding: '14px 0',
              borderBottom:
                i < recommendations.length - 1
                  ? '1px solid var(--border)'
                  : 'none',
            }}
          >
            {/* Number */}
            <span
              aria-hidden="true"
              style={{
                flexShrink: 0,
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'var(--surface-3)',
                border: '1px solid var(--border-strong)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: '600',
                color: 'var(--text-muted)',
                marginTop: '1px',
              }}
            >
              {i + 1}
            </span>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flexWrap: 'wrap',
                  marginBottom: '4px',
                }}
              >
                <p
                  style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: 'var(--text-primary)',
                    margin: 0,
                  }}
                >
                  {rec.title}
                </p>
                <Badge variant={PRIORITY_VARIANT[rec.priority]}>
                  {PRIORITY_LABEL[rec.priority]}
                </Badge>
              </div>
              <p
                style={{
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                  margin: 0,
                  lineHeight: '1.65',
                }}
              >
                {rec.detail}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
