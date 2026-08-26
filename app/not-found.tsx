import Link from 'next/link'

export default function NotFound() {
  return (
    <main style={{ minHeight: '100dvh', display: 'grid', placeItems: 'center', padding: '1.5rem' }}>
      <section aria-labelledby="not-found-heading" style={{ width: 'min(100%, 520px)', padding: 'clamp(24px, 7vw, 40px)', background: 'var(--surface-1)', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-xl)' }}>
        <p style={{ margin: '0 0 8px', color: 'var(--accent)', fontWeight: 700 }}>404</p>
        <h1 id="not-found-heading" style={{ margin: '0 0 8px', fontSize: 'clamp(24px, 6vw, 32px)' }}>Page not found</h1>
        <p style={{ margin: '0 0 24px', color: 'var(--text-secondary)' }}>The page you requested does not exist or has moved.</p>
        <Link href="/" style={{ padding: '10px 16px', borderRadius: 'var(--radius-md)', background: 'var(--accent)', color: '#080809', fontWeight: 700, textDecoration: 'none' }}>Back to home</Link>
      </section>
    </main>
  )
}
