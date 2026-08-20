import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import type { Analysis } from '@/lib/types'

interface KeywordsCardProps {
  keywords: Analysis['keywords']
  skills: Analysis['skills']
  animationDelay?: number
}

export function KeywordsCard({ keywords, skills, animationDelay = 0 }: KeywordsCardProps) {
  const hasKeywordData = keywords.matched.length > 0 || keywords.missing.length > 0
  const hasSkillData = skills.strong.length > 0 || skills.missing.length > 0

  return (
    <section
      aria-labelledby="keywords-heading"
      style={{
        background: 'var(--surface-1)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        animation: `fade-up var(--dur-slow) var(--ease-out) ${animationDelay}ms both`,
      }}
    >
      <h2
        id="keywords-heading"
        style={{
          fontSize: '13px',
          fontWeight: '600',
          color: 'var(--text-primary)',
          margin: 0,
          letterSpacing: '-0.01em',
        }}
      >
        Keywords &amp; Skills
      </h2>

      {!hasKeywordData && !hasSkillData ? (
        <EmptyState
          title="No job description provided"
          description="Add a target job description to see keyword matching and missing skills."
        />
      ) : (
        <>
          {hasKeywordData && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {keywords.matched.length > 0 && (
                <ChipGroup
                  label="Matched keywords"
                  items={keywords.matched}
                  variant="success"
                />
              )}
              {keywords.missing.length > 0 && (
                <ChipGroup
                  label="Missing keywords"
                  items={keywords.missing}
                  variant="warning"
                />
              )}
            </div>
          )}

          {hasSkillData && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {skills.strong.length > 0 && (
                <ChipGroup
                  label="Strong skills"
                  items={skills.strong}
                  variant="accent"
                />
              )}
              {skills.missing.length > 0 && (
                <ChipGroup
                  label="Skills to add"
                  items={skills.missing}
                  variant="danger"
                />
              )}
            </div>
          )}
        </>
      )}
    </section>
  )
}

function ChipGroup({
  label,
  items,
  variant,
}: {
  label: string
  items: string[]
  variant: 'success' | 'warning' | 'accent' | 'danger'
}) {
  return (
    <div>
      <p
        style={{
          fontSize: '11px',
          fontWeight: '600',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.07em',
          margin: '0 0 8px',
        }}
      >
        {label}
      </p>
      <div
        style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}
        aria-label={`${label}: ${items.join(', ')}`}
      >
        {items.map((item) => (
          <Badge key={item} variant={variant}>
            {item}
          </Badge>
        ))}
      </div>
    </div>
  )
}
