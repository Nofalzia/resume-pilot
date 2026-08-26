
'use client'

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from 'react'

/**
 * CSS-only 3D product visualization for the landing-page hero.
 *
 * Product story:
 *   Resume → AI Analysis → Priority Fixes
 *
 * The scene is decorative and aria-hidden. It uses CSS 3D depth rather
 * than Three.js/WebGL so the visual stays lightweight and accessible.
 *
 * Desktop:
 *   - layered 3D document composition
 *   - subtle pointer-reactive tilt
 *   - score counter
 *   - staggered keyword/recommendation badges
 *
 * Mobile / reduced motion:
 *   - static composition
 *   - no pointer tilt
 *   - no continuous animation
 *   - score renders immediately
 */
export function HeroCSSScene() {
  const sceneRef = useRef<HTMLDivElement>(null)
  const scoreRef = useRef<HTMLSpanElement>(null)

  const rafTiltRef = useRef<number>(0)
  const rafCountRef = useRef<number>(0)

  const target = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })

  const [isDesktop, setIsDesktop] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  // ── Responsive / motion preferences ──────────────────────────────

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 900px)')
    const reducedMotionQuery = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    )

    const updatePreferences = () => {
      setIsDesktop(desktopQuery.matches)
      setPrefersReducedMotion(reducedMotionQuery.matches)
    }

    updatePreferences()

    desktopQuery.addEventListener('change', updatePreferences)
    reducedMotionQuery.addEventListener('change', updatePreferences)

    return () => {
      desktopQuery.removeEventListener('change', updatePreferences)
      reducedMotionQuery.removeEventListener('change', updatePreferences)
    }
  }, [])

  // ── Pointer-reactive tilt ─────────────────────────────────────────

  const onPointerMove = useCallback((event: PointerEvent) => {
    const element = sceneRef.current

    if (!element) return

    const rect = element.getBoundingClientRect()

    target.current = {
      x: ((event.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((event.clientY - rect.top) / rect.height - 0.5) * 2,
    }
  }, [])

  const onPointerLeave = useCallback(() => {
    target.current = { x: 0, y: 0 }
  }, [])

  useEffect(() => {
    const element = sceneRef.current

    if (!element) return

    if (!isDesktop || prefersReducedMotion) {
      element.style.transform = ''
      return
    }

    const supportsHoveringPointer = window.matchMedia(
      '(hover: hover) and (pointer: fine)',
    ).matches

    if (!supportsHoveringPointer) return

    const MAX_TILT = 4.5

    const tickTilt = () => {
      current.current.x +=
        (target.current.x - current.current.x) * 0.055

      current.current.y +=
        (target.current.y - current.current.y) * 0.055

      const rotateX = -current.current.y * MAX_TILT
      const rotateY = current.current.x * MAX_TILT

      element.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`

      rafTiltRef.current = requestAnimationFrame(tickTilt)
    }

    element.addEventListener('pointermove', onPointerMove)
    element.addEventListener('pointerleave', onPointerLeave)

    rafTiltRef.current = requestAnimationFrame(tickTilt)

    return () => {
      element.removeEventListener('pointermove', onPointerMove)
      element.removeEventListener('pointerleave', onPointerLeave)

      cancelAnimationFrame(rafTiltRef.current)

      element.style.transform = ''
    }
  }, [
    isDesktop,
    prefersReducedMotion,
    onPointerMove,
    onPointerLeave,
  ])

  // ── Score counter ─────────────────────────────────────────────────

  useEffect(() => {
    const element = scoreRef.current

    if (!element) return

    if (!isDesktop || prefersReducedMotion) {
      element.textContent = '78'
      return
    }

    element.textContent = '0'

    const TARGET = 78
    const DURATION = 1100
    const DELAY = 550

    const timeout = window.setTimeout(() => {
      const startTime = performance.now()

      const tickCount = (now: number) => {
        const elapsed = now - startTime
        const progress = Math.min(elapsed / DURATION, 1)

        const eased =
          progress === 1
            ? 1
            : 1 - Math.pow(2, -10 * progress)

        if (element) {
          element.textContent = String(
            Math.round(eased * TARGET),
          )
        }

        if (progress < 1) {
          rafCountRef.current = requestAnimationFrame(tickCount)
        }
      }

      rafCountRef.current = requestAnimationFrame(tickCount)
    }, DELAY)

    return () => {
      window.clearTimeout(timeout)
      cancelAnimationFrame(rafCountRef.current)
    }
  }, [isDesktop, prefersReducedMotion])

  const shouldAnimate = isDesktop && !prefersReducedMotion

  return (
    <div
      aria-hidden="true"
      style={{
        perspective: '1000px',
        perspectiveOrigin: '50% 48%',
        width: '100%',
        maxWidth: '500px',
        margin: '0 auto',
        userSelect: 'none',
      }}
    >
      <div
        className="hero-scene"
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '5 / 4',
        }}
      >
        <div
          ref={sceneRef}
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            transformStyle: 'preserve-3d',
            willChange: shouldAnimate ? 'transform' : undefined,
          }}
        >
          {/* Source resume */}
          <Layer
            kind="resume"
            z={-62}
            ry={-5}
            rx={2}
            opacity={0.92}
            scale={0.88}
            delay={0}
            shouldAnimate={shouldAnimate}
          >
            <ResumeLayerContent />
          </Layer>

          {/* AI analysis */}
          <Layer
            kind="analysis"
            z={0}
            ry={0}
            rx={0}
            opacity={1}
            scale={1}
            delay={120}
            isAccent
            shouldAnimate={shouldAnimate}
          >
            <AnalysisLayerContent
              scoreRef={scoreRef}
              shouldAnimate={shouldAnimate}
            />
          </Layer>

          {/* Priority fixes */}
          <Layer
            kind="fixes"
            z={58}
            ry={4}
            rx={-1.5}
            opacity={0.98}
            scale={0.91}
            delay={240}
            shouldAnimate={shouldAnimate}
          >
            <FixesLayerContent shouldAnimate={shouldAnimate} />
          </Layer>

          {/* Flow connectors */}
          <FlowConnector
            position="left"
            shouldAnimate={shouldAnimate}
          />

          <FlowConnector
            position="right"
            shouldAnimate={shouldAnimate}
          />
        </div>
      </div>
    </div>
  )
}

// ── Layer wrapper ──────────────────────────────────────────────────

interface LayerProps {
  kind: 'resume' | 'analysis' | 'fixes'
  z: number
  ry: number
  rx: number
  opacity: number
  scale: number
  delay: number
  isAccent?: boolean
  shouldAnimate: boolean
  children: ReactNode
}

function Layer({
  kind,
  z,
  ry,
  rx,
  opacity,
  scale,
  delay,
  isAccent = false,
  shouldAnimate,
  children,
}: LayerProps) {
  const layerTitle =
    kind === 'resume'
      ? 'Your resume'
      : kind === 'analysis'
        ? 'AI analysis'
        : 'Priority fixes'

  const layerBackground =
    kind === 'analysis'
      ? 'linear-gradient(145deg, rgba(30, 42, 40, 0.98), var(--surface-2) 58%, rgba(16, 30, 27, 0.99))'
      : kind === 'fixes'
        ? 'linear-gradient(145deg, rgba(31, 29, 43, 0.99), var(--surface-1) 68%, rgba(24, 22, 35, 0.99))'
        : 'linear-gradient(145deg, rgba(28, 29, 35, 0.98), var(--surface-1) 72%)'

  const borderColor =
    kind === 'analysis'
      ? 'rgba(45, 232, 176, 0.36)'
      : kind === 'fixes'
        ? 'rgba(196, 181, 253, 0.24)'
        : 'rgba(255, 255, 255, 0.13)'

  const boxShadow =
    kind === 'analysis'
      ? '0 30px 75px rgba(0,0,0,0.46), 0 0 0 1px rgba(45,232,176,0.06) inset'
      : kind === 'fixes'
        ? '0 34px 64px rgba(0,0,0,0.50), 0 1px 0 rgba(255,255,255,0.07) inset'
        : '0 20px 48px rgba(0,0,0,0.44), 0 1px 0 rgba(255,255,255,0.05) inset'

  return (
    <div
      className={`hero-layer hero-layer--${kind}`}
      style={{
        position: 'absolute',
        inset: 0,
        transform: `translateZ(${z}px) rotateY(${ry}deg) rotateX(${rx}deg) scale(${scale})`,
        opacity,
        background: layerBackground,
        border: `1px solid ${borderColor}`,
        borderRadius: 'var(--radius-xl)',
        padding: '20px 22px',
        overflow: 'hidden',
        boxShadow,
        display: 'flex',
        flexDirection: 'column',
        gap: '9px',
        backfaceVisibility: 'hidden',
        animation: shouldAnimate
          ? `fade-up var(--dur-slow) var(--ease-out) ${delay}ms both`
          : undefined,
      }}
    >
      {/* Surface highlight */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.075), transparent 27%, transparent 70%, rgba(255,255,255,0.025))',
          pointerEvents: 'none',
        }}
      />

      {/* Subtle inner edge */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 1,
          borderRadius: 'calc(var(--radius-xl) - 1px)',
          border: '1px solid rgba(255,255,255,0.025)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2px',
        }}
      >
        <span
          style={{
            fontSize: '9px',
            fontWeight: 750,
            letterSpacing: '0.11em',
            textTransform: 'uppercase',
            color: isAccent
              ? 'var(--accent)'
              : 'var(--text-muted)',
          }}
        >
          {layerTitle}
        </span>

        {kind === 'analysis' && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '9px',
              fontWeight: 650,
              color: 'var(--text-muted)',
            }}
          >
            <span
              style={{
                width: '5px',
                height: '5px',
                borderRadius: '999px',
                background: 'var(--accent)',
                boxShadow: '0 0 10px rgba(45,232,176,0.65)',
              }}
            />
            Scanned
          </span>
        )}
      </div>

      {isAccent && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: '-2px',
            borderRadius: 'var(--radius-xl)',
            boxShadow:
              '0 0 55px rgba(45,232,176,0.22), 0 0 95px rgba(45,232,176,0.08)',
            opacity: 0,
            animation: shouldAnimate
              ? `accent-glow-opacity 3.5s ease-in-out ${delay + 900}ms infinite`
              : undefined,
            pointerEvents: 'none',
            zIndex: -1,
          }}
        />
      )}

      {children}
    </div>
  )
}

// ── Resume layer ───────────────────────────────────────────────────

function ResumeLayerContent() {
  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '7px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
          }}
        >
          <div
            style={{
              width: '23px',
              height: '23px',
              borderRadius: '6px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'grid',
              placeItems: 'center',
              fontSize: '9px',
              fontWeight: 750,
              color: 'var(--text-secondary)',
            }}
          >
            NZ
          </div>

          <div>
            <Block
              w="58px"
              h={6}
              color="var(--text-secondary)"
              style={{ opacity: 0.8 }}
            />
            <div style={{ height: '4px' }} />
            <Block
              w="76px"
              h={4}
              color="var(--text-muted)"
              style={{ opacity: 0.55 }}
            />
          </div>
        </div>

        <span
          style={{
            fontSize: '8px',
            color: 'var(--text-muted)',
            letterSpacing: '0.04em',
          }}
        >
          RESUME.PDF
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 0.72fr',
          gap: '14px',
          paddingTop: '3px',
        }}
      >
        <ResumeSection title="Experience">
          {[82, 68, 74, 57].map((width, index) => (
            <Block
              key={index}
              w={`${width}%`}
              h={5}
              color="var(--surface-3)"
            />
          ))}
        </ResumeSection>

        <ResumeSection title="Skills">
          <ResumeSkill text="React" matched />
          <ResumeSkill text="TypeScript" matched />
          <ResumeSkill text="AWS" />
          <ResumeSkill text="GraphQL" />
        </ResumeSection>
      </div>

      <div
        style={{
          marginTop: '2px',
          padding: '8px 9px',
          borderRadius: '7px',
          background: 'rgba(245,158,11,0.055)',
          border: '1px solid rgba(245,158,11,0.12)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            marginBottom: '5px',
          }}
        >
          <span
            style={{
              width: '5px',
              height: '5px',
              borderRadius: '50%',
              background: 'var(--warning)',
            }}
          />

          <span
            style={{
              fontSize: '8px',
              fontWeight: 700,
              color: 'var(--warning)',
              letterSpacing: '0.04em',
            }}
          >
            POTENTIAL GAP
          </span>
        </div>

        <Block
          w="72%"
          h={5}
          color="var(--surface-3)"
          style={{ opacity: 0.85 }}
        />
      </div>
    </>
  )
}

function ResumeSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
      }}
    >
      <span
        style={{
          fontSize: '8px',
          fontWeight: 700,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}
      >
        {title}
      </span>

      {children}
    </div>
  )
}

function ResumeSkill({
  text,
  matched = false,
}: {
  text: string
  matched?: boolean
}) {
  return (
    <span
      style={{
        display: 'inline-flex',
        width: 'fit-content',
        padding: '2px 6px',
        borderRadius: '4px',
        background: matched
          ? 'var(--success-muted)'
          : 'var(--warning-muted)',
        color: matched
          ? 'var(--success)'
          : 'var(--warning)',
        border: `1px solid ${
          matched
            ? 'rgba(34,197,94,0.14)'
            : 'rgba(245,158,11,0.14)'
        }`,
        fontSize: '8px',
        fontWeight: 650,
      }}
    >
      {text}
    </span>
  )
}

// ── AI analysis layer ──────────────────────────────────────────────

function AnalysisLayerContent({
  scoreRef,
  shouldAnimate,
}: {
  scoreRef: RefObject<HTMLSpanElement | null>
  shouldAnimate: boolean
}) {
  const matchedBadges = ['React', 'TypeScript', 'Next.js']
  const missingBadges = ['AWS', 'GraphQL']

  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginTop: '2px',
          marginBottom: '4px',
        }}
      >
        <div>
          <div
            style={{
              fontSize: '9px',
              color: 'var(--text-muted)',
              marginBottom: '4px',
            }}
          >
            Overall match
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '4px',
            }}
          >
            <span
              ref={scoreRef}
              style={{
                fontSize: '38px',
                fontWeight: 750,
                color: 'var(--accent)',
                lineHeight: 0.95,
                letterSpacing: '-0.055em',
                fontVariantNumeric: 'tabular-nums',
                textShadow:
                  '0 0 24px rgba(45,232,176,0.18)',
              }}
            >
              {shouldAnimate ? '0' : '78'}
            </span>

            <span
              style={{
                fontSize: '11px',
                color: 'var(--text-muted)',
                marginBottom: '3px',
              }}
            >
              /100
            </span>
          </div>
        </div>

        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '9px',
            fontWeight: 650,
            padding: '5px 8px',
            background: 'var(--success-muted)',
            color: 'var(--success)',
            borderRadius: '6px',
            border: '1px solid rgba(34,197,94,0.16)',
          }}
        >
          <span
            style={{
              width: '5px',
              height: '5px',
              borderRadius: '50%',
              background: 'currentColor',
            }}
          />
          ATS ready
        </span>
      </div>

      {/* Analysis dimensions */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '6px',
        }}
      >
        <Metric
          label="Skills"
          value="Strong"
          positive
        />
        <Metric
          label="Keywords"
          value="3 gaps"
          positive={false}
        />
        <Metric
          label="Impact"
          value="Good"
          positive
        />
        <Metric
          label="ATS"
          value="82%"
          positive
        />
      </div>

      {/* Matched / missing keywords */}
      <div
        style={{
          marginTop: '2px',
          paddingTop: '9px',
          borderTop: '1px solid rgba(255,255,255,0.065)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '7px',
          }}
        >
          <span
            style={{
              fontSize: '8px',
              fontWeight: 700,
              color: 'var(--text-muted)',
              letterSpacing: '0.07em',
              textTransform: 'uppercase',
            }}
          >
            Job match
          </span>

          <span
            style={{
              fontSize: '8px',
              color: 'var(--text-muted)',
            }}
          >
            Senior Frontend Engineer
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '4px',
          }}
        >
          {matchedBadges.map((keyword, index) => (
            <KeywordBadge
              key={keyword}
              text={keyword}
              type="matched"
              shouldAnimate={shouldAnimate}
              delay={650 + index * 90}
            />
          ))}

          {missingBadges.map((keyword, index) => (
            <KeywordBadge
              key={keyword}
              text={keyword}
              type="missing"
              shouldAnimate={shouldAnimate}
              delay={
                650 +
                (matchedBadges.length + index) * 90
              }
            />
          ))}
        </div>
      </div>

      {/* Analysis progress bars */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '5px',
          marginTop: '2px',
        }}
      >
        <AnalysisBar label="Experience" value={84} />
        <AnalysisBar label="Keywords" value={68} />
        <AnalysisBar label="Structure" value={91} />
      </div>
    </>
  )
}

function Metric({
  label,
  value,
  positive,
}: {
  label: string
  value: string
  positive: boolean
}) {
  return (
    <div
      style={{
        padding: '7px 8px',
        borderRadius: '7px',
        background: 'rgba(255,255,255,0.026)',
        border: '1px solid rgba(255,255,255,0.055)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '5px',
        }}
      >
        <span
          style={{
            fontSize: '8px',
            color: 'var(--text-muted)',
          }}
        >
          {label}
        </span>

        <span
          style={{
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            background: positive
              ? 'var(--success)'
              : 'var(--warning)',
          }}
        />
      </div>

      <div
        style={{
          marginTop: '3px',
          fontSize: '10px',
          fontWeight: 650,
          color: positive
            ? 'var(--text-secondary)'
            : 'var(--warning)',
        }}
      >
        {value}
      </div>
    </div>
  )
}

function KeywordBadge({
  text,
  type,
  shouldAnimate,
  delay,
}: {
  text: string
  type: 'matched' | 'missing'
  shouldAnimate: boolean
  delay: number
}) {
  const matched = type === 'matched'

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '3px 7px',
        borderRadius: '5px',
        background: matched
          ? 'var(--success-muted)'
          : 'var(--warning-muted)',
        color: matched
          ? 'var(--success)'
          : 'var(--warning)',
        border: `1px solid ${
          matched
            ? 'rgba(34,197,94,0.15)'
            : 'rgba(245,158,11,0.15)'
        }`,
        fontSize: '8px',
        fontWeight: 650,
        animation: shouldAnimate
          ? `badge-pop 350ms var(--ease-out) ${delay}ms both`
          : undefined,
      }}
    >
      <span style={{ fontSize: '8px' }}>
        {matched ? '✓' : '△'}
      </span>
      {text}
    </span>
  )
}

function AnalysisBar({
  label,
  value,
}: {
  label: string
  value: number
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '54px 1fr 24px',
        alignItems: 'center',
        gap: '6px',
      }}
    >
      <span
        style={{
          fontSize: '8px',
          color: 'var(--text-muted)',
        }}
      >
        {label}
      </span>

      <div
        style={{
          height: '4px',
          borderRadius: '999px',
          background: 'rgba(255,255,255,0.06)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${value}%`,
            height: '100%',
            borderRadius: 'inherit',
            background:
              'linear-gradient(90deg, rgba(45,232,176,0.45), var(--accent))',
          }}
        />
      </div>

      <span
        style={{
          fontSize: '8px',
          color: 'var(--text-muted)',
          textAlign: 'right',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}%
      </span>
    </div>
  )
}

// ── Priority fixes layer ───────────────────────────────────────────

function FixesLayerContent({
  shouldAnimate,
}: {
  shouldAnimate: boolean
}) {
  const fixes = [
    {
      number: '01',
      title: 'Add missing keywords',
      detail: 'AWS · GraphQL',
      tone: 'warning' as const,
    },
    {
      number: '02',
      title: 'Strengthen experience bullets',
      detail: 'Use measurable impact',
      tone: 'accent' as const,
    },
    {
      number: '03',
      title: 'Improve ATS alignment',
      detail: 'Match target terminology',
      tone: 'neutral' as const,
    },
  ]

  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '3px',
        }}
      >
        <div
          style={{
            fontSize: '16px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.025em',
          }}
        >
          3 priority fixes
        </div>

        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '8px',
            fontWeight: 650,
            color: 'var(--accent)',
          }}
        >
          <span
            style={{
              width: '5px',
              height: '5px',
              borderRadius: '50%',
              background: 'var(--accent)',
            }}
          />
          AI recommended
        </span>
      </div>

      <p
        style={{
          margin: '0 0 4px',
          fontSize: '9px',
          lineHeight: 1.45,
          color: 'var(--text-muted)',
        }}
      >
        Focus on these changes first to improve your match.
      </p>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}
      >
        {fixes.map((fix, index) => (
          <FixItem
            key={fix.number}
            {...fix}
            shouldAnimate={shouldAnimate}
            delay={900 + index * 100}
          />
        ))}
      </div>

      <div
        style={{
          marginTop: 'auto',
          paddingTop: '7px',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          borderTop: '1px solid rgba(255,255,255,0.055)',
        }}
      >
        <span
          style={{
            fontSize: '8px',
            color: 'var(--text-muted)',
          }}
        >
          Estimated improvement
        </span>

        <span
          style={{
            fontSize: '9px',
            fontWeight: 700,
            color: 'var(--success)',
          }}
        >
          +12–18 pts
        </span>
      </div>
    </>
  )
}

function FixItem({
  number,
  title,
  detail,
  tone,
  shouldAnimate,
  delay,
}: {
  number: string
  title: string
  detail: string
  tone: 'warning' | 'accent' | 'neutral'
  shouldAnimate: boolean
  delay: number
}) {
  const toneColor =
    tone === 'warning'
      ? 'var(--warning)'
      : tone === 'accent'
        ? 'var(--accent)'
        : 'var(--text-muted)'

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '23px 1fr auto',
        alignItems: 'center',
        gap: '7px',
        padding: '7px 8px',
        borderRadius: '7px',
        background: 'rgba(255,255,255,0.027)',
        border: '1px solid rgba(255,255,255,0.055)',
        animation: shouldAnimate
          ? `badge-pop 350ms var(--ease-out) ${delay}ms both`
          : undefined,
      }}
    >
      <span
        style={{
          width: '23px',
          height: '23px',
          display: 'grid',
          placeItems: 'center',
          borderRadius: '6px',
          background: `${toneColor}12`,
          border: `1px solid ${toneColor}24`,
          color: toneColor,
          fontSize: '8px',
          fontWeight: 750,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {number}
      </span>

      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: '9px',
            fontWeight: 650,
            color: 'var(--text-secondary)',
            lineHeight: 1.25,
          }}
        >
          {title}
        </div>

        <div
          style={{
            marginTop: '2px',
            fontSize: '8px',
            color: 'var(--text-muted)',
            lineHeight: 1.25,
          }}
        >
          {detail}
        </div>
      </div>

      <span
        style={{
          color: toneColor,
          fontSize: '12px',
          lineHeight: 1,
        }}
      >
        →
      </span>
    </div>
  )
}

// ── Decorative flow connector ──────────────────────────────────────

function FlowConnector({
  position,
  shouldAnimate,
}: {
  position: 'left' | 'right'
  shouldAnimate: boolean
}) {
  const isLeft = position === 'left'

  const style: CSSProperties = {
    position: 'absolute',
    top: '47%',
    [isLeft ? 'left' : 'right']: '-20px',
    width: '30px',
    height: '1px',
    background:
      'linear-gradient(90deg, transparent, rgba(45,232,176,0.35), transparent)',
    opacity: shouldAnimate ? 0.8 : 0.55,
    transform: `translateZ(${isLeft ? -12 : 12}px)`,
    pointerEvents: 'none',
  }

  return (
    <div
      aria-hidden="true"
      style={style}
    >
      <span
        style={{
          position: 'absolute',
          top: '-2px',
          [isLeft ? 'right' : 'left']: '1px',
          width: '5px',
          height: '5px',
          borderTop: '1px solid rgba(45,232,176,0.5)',
          borderRight: '1px solid rgba(45,232,176,0.5)',
          transform: isLeft ? 'rotate(45deg)' : 'rotate(225deg)',
        }}
      />
    </div>
  )
}

// ── Primitive ──────────────────────────────────────────────────────

function Block({
  w,
  h,
  color,
  style,
}: {
  w: string | number
  h: number
  color: string
  style?: CSSProperties
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

