import Link from 'next/link'
import Image from 'next/image'

export function CTABand() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="cta-section"
      style={{
        padding: '96px 1.5rem',
        borderTop: '1px solid var(--border)',
        background: 'radial-gradient(ellipse 50% 60% at 50% 0%, rgba(52,211,153,0.06) 0%, transparent 70%)',
      }}
    >
      <div
        style={{
          maxWidth: '640px',
          margin: '0 auto',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h2
            id="cta-heading"
            className="cta-heading"
            style={{
              fontSize: 'clamp(26px, 4vw, 38px)',
              fontWeight: '700',
              letterSpacing: '-0.035em',
              color: 'var(--text-primary)',
              margin: 0,
              lineHeight: 1.15,
            }}
          >
            Ready to improve your resume?
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
            No account needed. Paste your resume and get structured feedback in under a minute.
          </p>
        </div>

        <Link
          href="/workspace"
          className="cta-primary-cta"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '14px 28px',
            background: '#10B981',
            color: '#080809',
            borderRadius: 'var(--radius-xl)',
            fontSize: '15px',
            fontWeight: '700',
            textDecoration: 'none',
            letterSpacing: '-0.02em',
            transition: 'background var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out)',
          }}
        >
          Analyze my resume — free
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16"
            fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </Link>

        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.35)', margin: 0 }}>
          Session-only — nothing is stored permanently.
        </p>
      </div>
    </section>
  )
}

export function LandingFooter() {
  return (
    <footer
      className="landing-footer"
      style={{
        borderTop: '1px solid var(--border)',
        padding: '28px 1.5rem',
      }}
    >
      <div
        style={{
          maxWidth: '1080px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap',
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          aria-label="Resume Pilot home"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
        >
          <Image
            aria-hidden="true"
            src="/resume-pilot-logo.png"
            alt=""
            width={24}
            height={24}
            style={{
              width: '24px', height: '24px',
              borderRadius: '6px',
              display: 'block', objectFit: 'cover',
            }}
          />
          <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)' }}>
            Resume Pilot
          </span>
        </Link>

        {/* Links */}
        <nav aria-label="Footer navigation" style={{ display: 'flex', gap: '20px' }}>
          {[
            { label: 'Workspace', href: '/workspace' },
            { label: 'How it works', href: '#how-it-works' },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              style={{
                fontSize: '13px',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                transition: 'color var(--dur-fast)',
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
          Built with Next.js, Vercel AI SDK, and OpenRouter.
        </p>
      </div>
    </footer>
  )
}
