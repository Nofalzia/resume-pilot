'use client'

import Link from 'next/link'
import { HeroCSSScene } from './HeroCSSScene'

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        padding: '96px 1.5rem 64px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle radial glow — accent, very restrained */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(ellipse at center, rgba(45,232,176,0.045) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          maxWidth: '1080px',
          margin: '0 auto',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '48px',
          alignItems: 'center',
        }}
        className="hero-grid"
      >
        {/* Text column */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            maxWidth: '560px',
          }}
          className="animate-fade-up"
        >
          {/* Eyebrow */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '5px 12px',
              background: 'var(--accent-muted)',
              border: '1px solid rgba(45,232,176,0.18)',
              borderRadius: '100px',
              width: 'fit-content',
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'var(--accent)',
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: '12px',
                fontWeight: '600',
                color: 'var(--accent)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              AI-powered resume analysis
            </span>
          </div>

          {/* Headline */}
          <h1
            id="hero-heading"
            style={{
              fontSize: 'clamp(36px, 6vw, 58px)',
              fontWeight: '700',
              lineHeight: 1.08,
              letterSpacing: '-0.04em',
              color: 'var(--text-primary)',
              margin: 0,
            }}
          >
            Know exactly{' '}
            <span style={{ color: 'var(--accent)' }}>what's weak.</span>
            <br />
            Fix it fast.
          </h1>

          {/* Sub */}
          <p
            style={{
              fontSize: 'clamp(15px, 2vw, 17px)',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              margin: 0,
              maxWidth: '480px',
            }}
          >
            Paste your resume and a target job description. Get structured AI
            feedback on ATS compatibility, keyword gaps, experience bullet
            impact, and a prioritised list of exactly what to improve.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <Link
              href="/workspace"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '13px 24px',
                background: 'var(--accent)',
                color: '#080809',
                borderRadius: 'var(--radius-lg)',
                fontSize: '15px',
                fontWeight: '700',
                textDecoration: 'none',
                letterSpacing: '-0.02em',
                transition: 'background var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out)',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'var(--accent-hover)'
                el.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'var(--accent)'
                el.style.transform = 'translateY(0)'
              }}
            >
              Analyze my resume
              <ArrowIcon />
            </Link>

            <a
              href="#how-it-works"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '13px 20px',
                background: 'transparent',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-strong)',
                borderRadius: 'var(--radius-lg)',
                fontSize: '14px',
                fontWeight: '500',
                textDecoration: 'none',
                transition: 'color var(--dur-fast), border-color var(--dur-fast)',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.color = 'var(--text-primary)'
                el.style.borderColor = 'var(--border-focus)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.color = 'var(--text-secondary)'
                el.style.borderColor = 'var(--border-strong)'
              }}
            >
              See how it works
            </a>
          </div>

          {/* Trust signals */}
          <div
            style={{
              display: 'flex',
              gap: '20px',
              flexWrap: 'wrap',
              paddingTop: '8px',
            }}
          >
            {[
              '5 analysis dimensions',
              'ATS compatibility check',
              'Context-aware AI Copilot',
            ].map((signal) => (
              <div
                key={signal}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  color: 'var(--text-muted)',
                }}
              >
                <CheckIcon />
                {signal}
              </div>
            ))}
          </div>
        </div>

        {/* Visual column */}
        <div
          style={{ width: '100%' }}
          className="hero-visual animate-fade-up"
        >
          {/* Accessible description of the visual for screen readers */}
          <p className="sr-only">
            A visual representation of the Resume Pilot analysis workflow: three
            layered panels showing a raw resume, AI analysis results with a score
            of 78 out of 100, and a job alignment card showing 64% match.
          </p>
          <HeroCSSScene />
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .hero-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .hero-visual {
            animation-delay: 150ms;
          }
        }
      `}</style>
    </section>
  )
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14"
      fill="none" stroke="var(--accent)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 7l3.5 3.5L12 3" />
    </svg>
  )
}
