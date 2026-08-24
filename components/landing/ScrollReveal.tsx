'use client'

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'

interface ScrollRevealProps {
  children: ReactNode
  /**
   * Delay in ms before the transition starts once the element enters viewport.
   * Use sparingly — stagger between sibling reveals, not within a single section.
   */
  delay?: number
  style?: CSSProperties
  className?: string
}

/**
 * Wraps children and fades them up into view as they enter the viewport.
 *
 * Implementation notes:
 * - Hidden state is set in useEffect (client-only) to avoid SSR hydration mismatch.
 *   The server renders children as fully visible; the reveal only activates in the browser.
 * - Fires once — the observer disconnects after the element becomes visible.
 * - Completely skipped if prefers-reduced-motion is set.
 * - Adds no dependencies.
 */
export function ScrollReveal({ children, delay = 0, style, className }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return // render immediately, no animation

    // Apply the hidden state after mount so SSR output is always visible.
    // This prevents a flash of invisible content on hydration.
    el.style.opacity = '0'
    el.style.transform = 'translateY(18px)'

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return

        // Transition in — delay is applied here, not on the initial hidden state
        el.style.transition = [
          `opacity 560ms var(--ease-out) ${delay}ms`,
          `transform 560ms var(--ease-out) ${delay}ms`,
        ].join(', ')
        el.style.opacity = '1'
        el.style.transform = 'translateY(0)'

        // Fire once only
        observer.unobserve(el)
      },
      {
        // 8% of the element must be visible before triggering.
        // rootMargin pulls the trigger point 48px above the bottom of the viewport
        // so fast scrollers see the animation rather than snapping in.
        threshold: 0.08,
        rootMargin: '0px 0px -48px 0px',
      }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])

  return (
    <div ref={ref} style={style} className={className}>
      {children}
    </div>
  )
}
