'use client'

import { useEffect, useRef, useCallback } from 'react'

/**
 * CSS-only 3D layered document composition.
 * Three planes representing: raw resume → AI insight → job alignment.
 * Reacts to pointer movement with subtle tilt.
 * No Three.js — zero extra bundle weight.
 * Phase 6 will optionally replace this with a Three.js scene on desktop.
 */
export function HeroCSSScene() {
  const containerRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)
  const targetRef = useRef({ x: 0, y: 0 })
  const currentRef = useRef({ x: 0, y: 0 })

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    // Normalise pointer position to -1 … 1
    targetRef.current = {
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
    }
  }, [])

  const handleMouseLeave = useCallback(() => {
    targetRef.current = { x: 0, y: 0 }
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    // Skip pointer tilt on touch devices
    const isTouch = window.matchMedia('(hover: none)').matches
    if (isTouch) return

    el.addEventListener('mousemove', handleMouseMove)
    el.addEventListener('mouseleave', handleMouseLeave)

    const MAX_TILT = 10 // degrees

    function tick() {
      // Lerp toward target for smooth follow
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * 0.06
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * 0.06

      const rx = -currentRef.current.y * MAX_TILT
      const ry = currentRef.current.x * MAX_TILT

      if (el) {
        el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      el.removeEventListener('mousemove', handleMouseMove)
      el.removeEventListener('mouseleave', handleMouseLeave)
      cancelAnimationFrame(rafRef.current)
    }
  }, [handleMouseMove, handleMouseLeave])

  return (
    <div
      aria-hidden="true"
      style={{
        perspective: '900px',
        perspectiveOrigin: '50% 45%',
        width: '100%',
        maxWidth: '420px',
        margin: '0 auto',
        userSelect: 'none',
      }}
    >
      {/* p.s. screen readers see nothing — the section has its own description */}
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '4/3',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.05s linear',
        }}
      >
        {/* Layer 1 — raw resume (back) */}
        <DocumentPlane
          z={-40}
          rotateY={-4}
          rotateX={2}
          opacity={0.45}
          scale={0.92}
          delay={0}
          content="resume"
        />

        {/* Layer 2 — AI insight overlay (middle) */}
        <DocumentPlane
          z={0}
          rotateY={0}
          rotateX={0}
          opacity={0.85}
          scale={1}
          delay={120}
          content="analysis"
        />

        {/* Layer 3 — job alignment (front) */}
        <DocumentPlane
          z={44}
          rotateY={3}
          rotateX={-1}
          opacity={1}
          scale={0.94}
          delay={240}
          content="job"
        />
      </div>
    </div>
  )
}

type PlaneContent = 'resume' | 'analysis' | 'job'

interface DocumentPlaneProps {
  z: number
  rotateY: number
  rotateX: number
  opacity: number
  scale: number
  delay: number
  content: PlaneContent
}

function DocumentPlane({ z, rotateY, rotateX, opacity, scale, delay, content }: DocumentPlaneProps) {
  const isAnalysis = content === 'analysis'
  const isJob = content === 'job'

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        transform: `translateZ(${z}px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale(${scale})`,
        opacity,
        background: isAnalysis
          ? 'var(--surface-2)'
          : isJob
          ? 'var(--surface-1)'
          : 'var(--surface-1)',
        border: `1px solid ${isAnalysis ? 'rgba(45,232,176,0.25)' : 'var(--border-strong)'}`,
        borderRadius: 'var(--radius-xl)',
        boxShadow: isAnalysis
          ? '0 0 40px rgba(45,232,176,0.06), 0 24px 48px rgba(0,0,0,0.5)'
          : '0 16px 40px rgba(0,0,0,0.4)',
        padding: '20px',
        overflow: 'hidden',
        animation: `fade-up var(--dur-slow) var(--ease-out) ${delay}ms both`,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      {content === 'resume' && <ResumeContent />}
      {content === 'analysis' && <AnalysisContent />}
      {content === 'job' && <JobContent />}
    </div>
  )
}

function ResumeContent() {
  return (
    <>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--text-muted)' }} />
        <LineBlock width="55%" color="var(--text-muted)" height={9} />
      </div>
      {[80, 60, 70, 50, 65, 55, 72].map((w, i) => (
        <LineBlock key={i} width={`${w}%`} color="var(--surface-3)" height={7} />
      ))}
    </>
  )
}

function AnalysisContent() {
  return (
    <>
      {/* Score badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
          <span style={{ fontSize: '28px', fontWeight: '700', color: 'var(--accent)', lineHeight: 1, letterSpacing: '-0.04em' }}>
            78
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>/100</span>
        </div>
        <span style={{
          fontSize: '10px', fontWeight: '600', padding: '2px 8px',
          background: 'var(--success-muted)', color: 'var(--success)',
          borderRadius: 'var(--radius-sm)',
        }}>
          ATS: Good
        </span>
      </div>
      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
        {['React', 'TypeScript', 'Next.js'].map(k => (
          <span key={k} style={{
            fontSize: '10px', padding: '2px 7px',
            background: 'var(--success-muted)', color: 'var(--success)',
            borderRadius: 'var(--radius-sm)',
          }}>{k}</span>
        ))}
        {['GraphQL', 'AWS'].map(k => (
          <span key={k} style={{
            fontSize: '10px', padding: '2px 7px',
            background: 'var(--warning-muted)', color: 'var(--warning)',
            borderRadius: 'var(--radius-sm)',
          }}>{k}</span>
        ))}
      </div>
      {[70, 50, 80].map((w, i) => (
        <LineBlock key={i} width={`${w}%`} color="var(--surface-3)" height={7} />
      ))}
    </>
  )
}

function JobContent() {
  return (
    <>
      <div style={{ marginBottom: '4px' }}>
        <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
          Senior Frontend Engineer
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '5px',
          fontSize: '10px', fontWeight: '600',
          padding: '3px 9px',
          background: 'rgba(139,92,246,0.12)',
          color: '#C4B5FD',
          borderRadius: 'var(--radius-sm)',
        }}>
          64% aligned
        </div>
      </div>
      {[65, 80, 55, 72].map((w, i) => (
        <LineBlock key={i} width={`${w}%`} color="var(--surface-3)" height={7} />
      ))}
    </>
  )
}

function LineBlock({ width, color, height = 8 }: { width: string; color: string; height?: number }) {
  return (
    <div style={{ width, height, borderRadius: '3px', background: color }} />
  )
}
