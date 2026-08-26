'use client'

import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/Button'

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  return (
    <main style={{ minHeight: '100dvh', display: 'grid', placeItems: 'center', padding: '1.5rem' }}>
      <section aria-labelledby="error-heading" style={{ width: 'min(100%, 520px)', padding: 'clamp(24px, 7vw, 40px)', background: 'var(--surface-1)', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-xl)' }}>
        <h1 ref={headingRef} id="error-heading" tabIndex={-1} style={{ outline: 'none', margin: '0 0 8px', fontSize: 'clamp(24px, 6vw, 32px)' }}>We couldn&apos;t load this page</h1>
        <p style={{ margin: '0 0 24px', color: 'var(--text-secondary)' }}>Please retry. Your session data will remain in this browser.</p>
        <Button onClick={reset}>Try again</Button>
      </section>
    </main>
  )
}
