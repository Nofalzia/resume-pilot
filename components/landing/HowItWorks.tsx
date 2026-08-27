const STEPS = [
  {
    number: '01',
    title: 'Paste your resume',
    description:
      'Copy and paste your resume as plain text. Optionally add a target job description to unlock keyword matching and role alignment scoring.',
    detail: 'Plain text works best. No PDF parsing, no formatting surprises — what you paste is what the AI sees.',
  },
  {
    number: '02',
    title: 'AI analysis runs',
    description:
      'The AI reads your resume like both a recruiter and an ATS system, scoring it across five dimensions in a single structured pass.',
    detail: 'Structured output — not a wall of text. Every result is typed and validated before it reaches your screen.',
  },
  {
    number: '03',
    title: 'Get structured insights',
    description:
      'See your score, ATS issues, missing keywords, per-bullet feedback, and a prioritised list of what to fix first.',
    detail: 'Then open the AI Copilot to ask follow-up questions, request bullet rewrites, or go deeper on any recommendation.',
  },
]

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="how-it-works-section"
      style={{
        padding: '96px 1.5rem',
        borderTop: '1px solid var(--border)',
      }}
    >
      <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
        {/* Section header */}
        <div style={{ maxWidth: '480px', marginBottom: '56px' }}>
          <p
            style={{
              fontSize: '12px',
              fontWeight: '600',
              color: 'var(--accent)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              margin: '0 0 12px',
            }}
          >
            How it works
          </p>
          <h2
            id="how-it-works-heading"
            style={{
              fontSize: 'clamp(26px, 4vw, 36px)',
              fontWeight: '700',
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
              margin: '0 0 12px',
              lineHeight: 1.15,
            }}
          >
            From resume to insights in under a minute.
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.7 }}>
            No signup. No upload. Paste and go.
          </p>
        </div>

        {/* Steps */}
        <ol
          className="steps-grid"
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}
          aria-label="Steps to use Resume Pilot"
        >
          {STEPS.map((step, i) => (
            <li
              key={step.number}
              style={{
                background: 'var(--surface-1)',
                border: '1px solid var(--border)',
                borderTop: `2px solid ${['rgba(52,211,153,0.25)', 'rgba(52,211,153,0.55)', 'rgba(52,211,153,0.9)'][i]}`,
                borderRadius: 'var(--radius-xl)',
                padding: '32px 28px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Step indicator dot */}
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: i === 1 ? 'var(--accent-muted)' : 'var(--surface-2)',
                  border: `1px solid ${i === 1 ? 'rgba(45,232,176,0.25)' : 'var(--border-strong)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: '700',
                    color: i === 1 ? 'var(--accent)' : 'var(--text-muted)',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {i + 1}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <h3
                  style={{
                    fontSize: '17px',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    margin: 0,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {step.title}
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.65 }}>
                  {step.description}
                </p>
              </div>

              <p
                style={{
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                  margin: 0,
                  lineHeight: 1.6,
                  paddingTop: '8px',
                  borderTop: '1px solid var(--border)',
                }}
              >
                {step.detail}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
