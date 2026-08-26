'use client'

import Link from 'next/link'

export function LandingNav() {
  return (
    <>
      {/* Skip to main content — keyboard / screen reader users */}
      <a
        href="#main-content"
        style={{
          position: 'absolute',
          top: '-100%',
          left: '1rem',
          padding: '8px 16px',
          background: 'var(--accent)',
          color: '#080809',
          borderRadius: 'var(--radius-md)',
          fontSize: '13px',
          fontWeight: '600',
          zIndex: 100,
          textDecoration: 'none',
          transition: 'top 0.1s',
        }}
        onFocus={(e) => { e.currentTarget.style.top = '1rem' }}
        onBlur={(e) => { e.currentTarget.style.top = '-100%' }}
      >
        Skip to main content
      </a>

      <nav
        aria-label="Main navigation"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 40,
          borderBottom: '1px solid var(--border)',
          background: 'rgba(8,8,9,0.82)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          padding: '0 1.5rem',
        }}
      >
        <div
          style={{
          maxWidth: '1080px',
            margin: '0 auto',
            height: '58px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          gap: '16px',
        }}
        className="landing-shell"
        >
          {/* Logo */}
          <Link
            href="/"
            aria-label="Resume Pilot home"
            style={{ display: 'flex', alignItems: 'center', gap: '9px', textDecoration: 'none' }}
          >
            <span
              aria-hidden="true"
              style={{
                width: '30px',
                height: '30px',
                background: 'var(--accent)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: '800',
                color: '#080809',
                letterSpacing: '-0.03em',
                flexShrink: 0,
              }}
            >
              RP
            </span>
            <span
              style={{
                fontSize: '15px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
              }}
            >
              Resume Pilot
            </span>
          </Link>

          {/* Right nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link
              href="#how-it-works"
              style={{
                fontSize: '13px',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                padding: '6px 10px',
                borderRadius: 'var(--radius-md)',
                display: 'none', // hidden on mobile, shown md+
              }}
              className="nav-link-desktop"
            >
              How it works
            </Link>

            <Link
              href="/workspace"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                background: 'var(--accent)',
                color: '#080809',
                borderRadius: 'var(--radius-md)',
                fontSize: '13px',
                fontWeight: '700',
                textDecoration: 'none',
                letterSpacing: '-0.01em',
                transition: 'background var(--dur-fast) var(--ease-out)',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--accent-hover)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--accent)' }}
            >
              Analyze resume
            </Link>
          </div>
        </div>
      </nav>

      <style>{`
        @media (min-width: 640px) {
          .nav-link-desktop { display: block !important; }
        }
      `}</style>
    </>
  )
}
