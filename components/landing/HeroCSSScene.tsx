'use client'

import { useEffect, useRef, useCallback } from 'react'

/**
 * CSS-only 3D layered document composition.
 *
 * Three planes: raw resume → AI insight → job alignment.
 * Pointer-reactive tilt via a lerped RAF loop.
 *
 * Phase 5 additions (Option C):
 *   A — Slow accent-glow pulse on the analysis card (CSS keyframe)
 *   B — Score counter 0→78 on mount; keyword badges fade in with stagger
 *
 * All animations are skipped when prefers-reduced-motion: reduce is set.
 */
export function HeroCSSScene() {
  const sceneRef    = useRef<HTMLDivElement>(null)
  const scoreRef    = useRef<HTMLSpanElement>(null)
  const rafTiltRef  = useRef<number>(0)
  const rafCountRef = useRef<number>(0)
  const target      = useRef({ x: 0, y: 0 })
  const current     = useRef({ x: 0, y: 0 })

  // ── Pointer-reactive tilt ─────────────────────────────────────────
  const onPointerMove = useCallback((e: PointerEvent) => {
    const el = sceneRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    target.current = {
      x: ((e.clientX - rect.left) / rect.width  - 0.5) * 2,
      y: ((e.clientY - rect.top)  / rect.height - 0.5) * 2,
    }
  }, [])

  const onPointerLeave = useCallback(() => {
    target.current = { x: 0, y: 0 }
  }, [])

  useEffect(() => {
    const el = sceneRef.current
    if (!el) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return // static composition on reduced-motion

    const supportsHoveringPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!supportsHoveringPointer) return

    el.addEventListener('pointermove', onPointerMove)
    el.addEventListener('pointerleave', onPointerLeave)

    const MAX_TILT = 5 // degrees

    function tickTilt() {
      current.current.x += (target.current.x - current.current.x) * 0.055
      current.current.y += (target.current.y - current.current.y) * 0.055

      const rx = -current.current.y * MAX_TILT
      const ry =  current.current.x * MAX_TILT

      if (el) el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`

      rafTiltRef.current = requestAnimationFrame(tickTilt)
    }

    rafTiltRef.current = requestAnimationFrame(tickTilt)

    return () => {
      el.removeEventListener('pointermove', onPointerMove)
      el.removeEventListener('pointerleave', onPointerLeave)
      cancelAnimationFrame(rafTiltRef.current)
      el.style.transform = ''
    }
  }, [onPointerMove, onPointerLeave])

  // ── Score counter 0 → 78 ─────────────────────────────────────────
  useEffect(() => {
    const el = scoreRef.current
    if (!el) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      el.textContent = '78'
      return
    }

    const TARGET   = 78
    const DURATION = 1200 // ms
    const DELAY    = 700  // start after card entry animation

    const timeout = setTimeout(() => {
      const startTime = performance.now()

      function tickCount(now: number) {
        const elapsed  = now - startTime
        const progress = Math.min(elapsed / DURATION, 1)
        // Ease-out expo for the satisfying "snap to target" feel
        const eased    = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)

        if (el) el.textContent = String(Math.round(eased * TARGET))

        if (progress < 1) {
          rafCountRef.current = requestAnimationFrame(tickCount)
        }
      }

      rafCountRef.current = requestAnimationFrame(tickCount)
    }, DELAY)

    return () => {
      clearTimeout(timeout)
      cancelAnimationFrame(rafCountRef.current)
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      style={{ perspective: '900px', perspectiveOrigin: '50% 45%', width: '100%', maxWidth: '420px', margin: '0 auto', userSelect: 'none' }}
    >
      <div
        className="hero-scene"
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '4 / 3',
        }}
      >
        <div
          ref={sceneRef}
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
          transformStyle: 'preserve-3d',
          }}
        >
          <Layer z={-44} ry={-4} rx={2} opacity={0.42} scale={0.91} delay={0}>
            <ResumeLayerContent />
          </Layer>

          <Layer z={0} ry={0} rx={0} opacity={1} scale={1} delay={100} isAccent>
            <AnalysisLayerContent scoreRef={scoreRef} />
          </Layer>

          <Layer z={46} ry={3} rx={-1} opacity={0.95} scale={0.93} delay={200}>
            <JobLayerContent />
          </Layer>
        </div>
      </div>
    </div>
  )
}

// ── Layer wrapper ──────────────────────────────────────────────────

interface LayerProps {
  z: number
  ry: number
  rx: number
  opacity: number
  scale: number
  delay: number
  isAccent?: boolean
  children: React.ReactNode
}

function Layer({ z, ry, rx, opacity, scale, delay, isAccent, children }: LayerProps) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        transform: `translateZ(${z}px) rotateY(${ry}deg) rotateX(${rx}deg) scale(${scale})`,
        opacity,
        background: isAccent ? 'var(--surface-2)' : 'var(--surface-1)',
        border: `1px solid ${isAccent ? 'rgba(45,232,176,0.22)' : 'var(--border-strong)'}`,
        borderRadius: 'var(--radius-xl)',
        padding: '18px 20px',
        overflow: 'hidden',
        // Glow is rendered by a composited overlay below.
        animation: `fade-up var(--dur-slow) var(--ease-out) ${delay}ms both`,
        boxShadow: isAccent
          ? undefined
          : '0 16px 40px rgba(0,0,0,0.4)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      {isAccent && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: '-1px',
            borderRadius: 'var(--radius-xl)',
            boxShadow: '0 0 50px rgba(45,232,176,0.28), 0 0 90px rgba(45,232,176,0.10)',
            opacity: 0,
            animation: `accent-glow-opacity 3.5s ease-in-out ${delay + 800}ms infinite`,
            pointerEvents: 'none',
            zIndex: -1,
          }}
        />
      )}
      {children}
    </div>
  )
}

// ── Layer content components ───────────────────────────────────────

function ResumeLayerContent() {
  return (
    <>
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '2px' }}>
        <Block w="6px" h={6} color="var(--text-muted)" style={{ borderRadius: '50%' }} />
        <Block w="48%" h={8} color="var(--text-muted)" style={{ opacity: 0.5 }} />
      </div>
      {[78, 58, 68, 48, 62, 54, 70].map((w, i) => (
        <Block key={i} w={`${w}%`} h={6} color="var(--surface-3)" />
      ))}
    </>
  )
}

function AnalysisLayerContent({ scoreRef }: { scoreRef: React.RefObject<HTMLSpanElement | null> }) {
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const MATCHED_BADGES = ['React', 'TypeScript', 'Next.js']
  const MISSING_BADGES = ['GraphQL', 'AWS']

  return (
    <>
      {/* Score row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
          <span
            ref={scoreRef}
            style={{
              fontSize: '30px',
              fontWeight: '700',
              color: 'var(--accent)',
              lineHeight: 1,
              letterSpacing: '-0.04em',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {prefersReduced ? '78' : '0'}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '2px' }}>/100</span>
        </div>
        <span
          style={{
            fontSize: '10px',
            fontWeight: '600',
            padding: '2px 8px',
            background: 'var(--success-muted)',
            color: 'var(--success)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid rgba(34,197,94,0.2)',
          }}
        >
          ATS: Good
        </span>
      </div>

      {/* Matched keyword badges */}
      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
        {MATCHED_BADGES.map((k, i) => (
          <span
            key={k}
            style={{
              fontSize: '10px',
              padding: '2px 7px',
              background: 'var(--success-muted)',
              color: 'var(--success)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(34,197,94,0.15)',
              animation: prefersReduced ? undefined : `badge-pop 350ms var(--ease-out) ${900 + i * 110}ms both`,
            }}
          >
            {k}
          </span>
        ))}
        {MISSING_BADGES.map((k, i) => (
          <span
            key={k}
            style={{
              fontSize: '10px',
              padding: '2px 7px',
              background: 'var(--warning-muted)',
              color: 'var(--warning)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(245,158,11,0.15)',
              animation: prefersReduced ? undefined : `badge-pop 350ms var(--ease-out) ${900 + (MATCHED_BADGES.length + i) * 110}ms both`,
            }}
          >
            {k}
          </span>
        ))}
      </div>

      {/* Decorative lines */}
      {[68, 50, 78].map((w, i) => (
        <Block key={i} w={`${w}%`} h={6} color="var(--surface-3)" />
      ))}
    </>
  )
}

function JobLayerContent() {
  return (
    <>
      <div style={{ marginBottom: '4px' }}>
        <p style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', margin: '0 0 6px' }}>
          Senior Frontend Engineer
        </p>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '10px',
            fontWeight: '600',
            padding: '3px 9px',
            background: 'rgba(139,92,246,0.10)',
            color: '#C4B5FD',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid rgba(139,92,246,0.18)',
          }}
        >
          64% aligned
        </span>
      </div>
      {[62, 78, 52, 70].map((w, i) => (
        <Block key={i} w={`${w}%`} h={6} color="var(--surface-3)" />
      ))}
    </>
  )
}

// ── Primitive ──────────────────────────────────────────────────────

function Block({
  w, h, color, style,
}: {
  w: string | number
  h: number
  color: string
  style?: React.CSSProperties
}) {
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: '3px',
        background: color,
        flexShrink: 0,
        ...style,
      }}
    />
  )
}
