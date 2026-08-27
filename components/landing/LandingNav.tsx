import Link from 'next/link'
import Image from 'next/image'

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
      >
        Skip to main content
      </a>

      <nav
        aria-label="Main navigation"
        className="landing-nav"
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
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
            <Image
              aria-hidden="true"
              src="/resume-pilot-logo.png"
              alt=""
              width={30}
              height={30}
              priority
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '8px',
                display: 'block',
                objectFit: 'cover',
                flexShrink: 0,
              }}
            />
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
            >
              Analyze resume
            </Link>
          </div>
        </div>
      </nav>

      <style>{`@media (min-width: 640px) { .nav-link-desktop { display: inline-flex !important; align-items: center; min-height: 36px; } }`}</style>
    </>
  )
}
