interface SkeletonProps {
  height?: number | string
  width?: number | string
  borderRadius?: number | string
  style?: React.CSSProperties
}

export function Skeleton({
  height = 20,
  width = '100%',
  borderRadius = 'var(--radius-md)',
  style,
}: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      style={{
        height,
        width,
        borderRadius,
        background: 'linear-gradient(90deg, var(--surface-2) 25%, var(--surface-3) 50%, var(--surface-2) 75%)',
        backgroundSize: '200% 100%',
        animation: 'skeleton-shimmer 1.6s ease-in-out infinite',
        ...style,
      }}
    >
      <style>{`
        @keyframes skeleton-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="skeleton-shimmer"] {
            animation: none;
            background: var(--surface-2);
          }
        }
      `}</style>
    </div>
  )
}

/** Pre-composed skeleton card for analysis result placeholders */
export function AnalysisCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      style={{
        background: 'var(--surface-1)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <Skeleton height={14} width="40%" />
      <Skeleton height={12} width="90%" />
      <Skeleton height={12} width="75%" />
      <Skeleton height={12} width="60%" />
    </div>
  )
}
