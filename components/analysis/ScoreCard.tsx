'use client'

import { useEffect, useRef } from 'react'
import { Badge } from '@/components/ui/Badge'
import type { Analysis } from '@/lib/types'

const ATS_LABELS: Record<Analysis['atsCompatibility'], string> = {
  good: 'ATS: Good',
  'needs-work': 'ATS: Needs work',
  poor: 'ATS: Poor',
}

const ATS_VARIANTS: Record<
  Analysis['atsCompatibility'],
  'success' | 'warning' | 'danger'
> = {
  good: 'success',
  'needs-work': 'warning',
  poor: 'danger',
}

function scoreColor(score: number): string {
  if (score >= 75) return 'var(--accent)'
  if (score >= 50) return 'var(--warning)'
  return 'var(--danger)'
}

interface ScoreCardProps {
  analysis: Analysis
  animationDelay?: number
}

export function ScoreCard({ analysis, animationDelay = 0 }: ScoreCardProps) {
  const countRef = useRef<HTMLSpanElement>(null)
  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

  // Animate score counter 0 → score
  useEffect(() => {
    const el = countRef.current
    if (!el) return
    if (prefersReducedMotion) {
      el.textContent = String(analysis.score)
      return
    }

    const start = performance.now()
    const duration = 900
    const target = analysis.score

    function tick(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // Ease out expo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      el!.textContent = String(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(tick)
    }

    // Delay counter start to match card entry animation
    const timeout = setTimeout(() => requestAnimationFrame(tick), animationDelay + 200)
    return () => clearTimeout(timeout)
  }, [analysis.score, animationDelay, prefersReducedMotion])

  const hasJobAlignment = typeof analysis.jobAlignment === 'number'

  return (
    <div
      style={{
        background: 'var(--surface-1)',
        border: '1px solid var(--border-strong)',
        borderRadius: 'var(--radius-xl)',
        padding: '28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        animation: `fade-up var(--dur-slow) var(--ease-out) ${animationDelay}ms both`,
      }}
    >
      {/* Top row: score + secondary metrics */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap',
        }}
      >
        {/* Score */}
        <div>
          <div
            aria-label={`Resume score: ${analysis.score} out of 100`}
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '4px',
              lineHeight: 1,
            }}
          >
            <span
              ref={countRef}
              aria-hidden="true"
              style={{
                fontSize: '72px',
                fontWeight: '700',
                letterSpacing: '-0.04em',
                color: scoreColor(analysis.score),
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              0
            </span>
            <span
              aria-hidden="true"
              style={{
                fontSize: '24px',
                fontWeight: '500',
                color: 'var(--text-muted)',
                letterSpacing: '-0.02em',
              }}
            >
              /100
            </span>
          </div>
          <p
            style={{
              fontSize: '12px',
              color: 'var(--text-muted)',
              margin: '4px 0 0',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              fontWeight: '500',
            }}
          >
            Resume score
          </p>
        </div>

        {/* Right column: ATS badge + optional job alignment */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end' }}>
          <Badge variant={ATS_VARIANTS[analysis.atsCompatibility]}>
            {ATS_LABELS[analysis.atsCompatibility]}
          </Badge>

          {hasJobAlignment && (
            <div style={{ textAlign: 'right' }}>
              <p
                aria-label={`Job alignment: ${analysis.jobAlignment} percent`}
                style={{ fontSize: '22px', fontWeight: '700', color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.03em' }}
              >
                {analysis.jobAlignment}
                <span style={{ fontSize: '13px', fontWeight: '400', color: 'var(--text-muted)' }}>%</span>
              </p>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '2px 0 0', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Job alignment
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Score rationale */}
      <p
        style={{
          fontSize: '14px',
          color: 'var(--text-secondary)',
          lineHeight: '1.65',
          margin: 0,
          paddingTop: '4px',
          borderTop: '1px solid var(--border)',
        }}
      >
        {analysis.scoreRationale}
      </p>

      {/* Strengths / weaknesses */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
        }}
      >
        <StrengthsList items={analysis.strengths} />
        <WeaknessesList items={analysis.weaknesses} />
      </div>
    </div>
  )
}

function StrengthsList({ items }: { items: string[] }) {
  if (!items.length) return null
  return (
    <section aria-labelledby="strengths-heading">
      <h3
        id="strengths-heading"
        style={{
          fontSize: '11px',
          fontWeight: '600',
          color: 'var(--success)',
          textTransform: 'uppercase',
          letterSpacing: '0.07em',
          margin: '0 0 8px',
        }}
      >
        Strengths
      </h3>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {items.map((s, i) => (
          <li key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            <span aria-hidden="true" style={{ color: 'var(--success)', fontSize: '13px', lineHeight: '1.6', flexShrink: 0 }}>↑</span>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{s}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function WeaknessesList({ items }: { items: string[] }) {
  if (!items.length) return null
  return (
    <section aria-labelledby="weaknesses-heading">
      <h3
        id="weaknesses-heading"
        style={{
          fontSize: '11px',
          fontWeight: '600',
          color: 'var(--danger)',
          textTransform: 'uppercase',
          letterSpacing: '0.07em',
          margin: '0 0 8px',
        }}
      >
        Needs work
      </h3>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {items.map((w, i) => (
          <li key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            <span aria-hidden="true" style={{ color: 'var(--danger)', fontSize: '13px', lineHeight: '1.6', flexShrink: 0 }}>↓</span>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{w}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
