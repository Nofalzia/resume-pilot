const FEATURES = [
  {
    icon: '◎',
    title: 'Resume score',
    description:
      'A 0–100 score with a plain-language rationale. Understand exactly why you scored what you did, not just a number.',
    accent: false,
  },
  {
    icon: '⬡',
    title: 'ATS compatibility',
    description:
      'Identifies formatting issues that cause ATS systems to reject or misparse resumes — tables, headers, non-standard sections.',
    accent: false,
  },
  {
    icon: '◈',
    title: 'Keyword gap analysis',
    description:
      'Compares your resume against the job description. Shows matched keywords in green and missing ones in amber.',
    accent: true,
  },
  {
    icon: '◇',
    title: 'Bullet feedback',
    description:
      'Finds your weakest experience bullets and explains exactly what\'s wrong — then suggests how to fix each one.',
    accent: false,
  },
  {
    icon: '◉',
    title: 'Ranked recommendations',
    description:
      'Up to 5 prioritised action items ordered by hiring impact. High, medium, and low priority — no guessing what to do next.',
    accent: false,
  },
  {
    icon: '✦',
    title: 'AI Copilot',
    description:
      'Ask follow-up questions, request bullet rewrites, or explore any recommendation. Context-aware — it knows your resume and your score.',
    accent: false,
  },
]

export function FeatureGrid() {
  return (
    <section
      aria-labelledby="features-heading"
      className="features-section"
      style={{
        padding: '96px 1.5rem',
        borderTop: '1px solid var(--border)',
      }}
    >
      <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
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
            What you get
          </p>
          <h2
            id="features-heading"
            style={{
              fontSize: 'clamp(26px, 4vw, 36px)',
              fontWeight: '700',
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
              margin: '0 0 12px',
              lineHeight: 1.15,
            }}
          >
            Five dimensions. One pass.
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.7 }}>
            Structured output across every dimension that actually affects whether recruiters call you back.
          </p>
        </div>

        <ul
          className="features-grid"
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}
          aria-label="Features"
        >
          {FEATURES.map((feature) => (
            <li
              key={feature.title}
              className="feature-card"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 'var(--radius-xl)',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <span
                aria-hidden="true"
                className="feature-card-icon"
                style={{
                  fontSize: '20px',
                  color: 'rgba(52,211,153,0.7)',
                  lineHeight: 1,
                }}
              >
                {feature.icon}
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <h3
                  style={{
                    fontSize: '15px',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    margin: 0,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  style={{
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    margin: 0,
                    lineHeight: 1.65,
                  }}
                >
                  {feature.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
