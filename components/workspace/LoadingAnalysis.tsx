import { AnalysisCardSkeleton } from '@/components/ui/Skeleton'

interface LoadingAnalysisProps {
  hasJobDescription: boolean
}

const BASE_STEPS = [
  'Reading resume structure',
  'Evaluating experience bullets',
  'Checking ATS compatibility',
  'Scoring overall strength',
]

const JOB_STEPS = [
  'Reading resume structure',
  'Comparing against job description',
  'Identifying keyword gaps',
  'Evaluating role alignment',
  'Scoring overall strength',
]

export function LoadingAnalysis({ hasJobDescription }: LoadingAnalysisProps) {
  const steps = hasJobDescription ? JOB_STEPS : BASE_STEPS

  return (
    <div
      aria-label="Analyzing resume, please wait"
      style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
    >
      {/* Status header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <PulsingDot />
          <p
            style={{
              fontSize: '15px',
              fontWeight: '600',
              color: 'var(--text-primary)',
              margin: 0,
            }}
          >
            Analyzing your resume
          </p>
        </div>

        {/* Step list — communicates what the AI is doing, not fake progress */}
        <ol
          aria-label="Analysis steps"
          style={{
            listStyle: 'none',
            margin: 0,
            padding: '0 0 0 4px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {steps.map((step, i) => (
            <li
              key={step}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '13px',
                color: 'var(--text-secondary)',
                animation: `fade-up var(--dur-slow) var(--ease-out) ${i * 180}ms both`,
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  background: 'var(--accent)',
                  flexShrink: 0,
                  opacity: 0.6,
                }}
              />
              {step}
            </li>
          ))}
        </ol>
      </div>

      {/* Skeleton cards — show the shape of what's coming */}
      <div
        aria-hidden="true"
        style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
      >
        {/* Score card skeleton */}
        <div
          style={{
            background: 'var(--surface-1)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {/* Score number skeleton */}
          <div
            style={{
              width: '72px',
              height: '64px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(90deg, var(--surface-2) 25%, var(--surface-3) 50%, var(--surface-2) 75%)',
              backgroundSize: '200% 100%',
              animation: 'skeleton-shimmer 1.6s ease-in-out infinite',
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div
              style={{
                height: '13px', width: '85%', borderRadius: 'var(--radius-sm)',
                background: 'linear-gradient(90deg, var(--surface-2) 25%, var(--surface-3) 50%, var(--surface-2) 75%)',
                backgroundSize: '200% 100%',
                animation: 'skeleton-shimmer 1.6s ease-in-out 0.1s infinite',
              }}
            />
            <div
              style={{
                height: '13px', width: '60%', borderRadius: 'var(--radius-sm)',
                background: 'linear-gradient(90deg, var(--surface-2) 25%, var(--surface-3) 50%, var(--surface-2) 75%)',
                backgroundSize: '200% 100%',
                animation: 'skeleton-shimmer 1.6s ease-in-out 0.2s infinite',
              }}
            />
          </div>
        </div>

        {/* Two-column skeleton cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <AnalysisCardSkeleton />
          <AnalysisCardSkeleton />
        </div>
        <AnalysisCardSkeleton />
        <AnalysisCardSkeleton />
      </div>

      <style>{`
        @keyframes skeleton-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="skeleton-shimmer"] {
            animation: none;
            background: var(--surface-2) !important;
          }
        }
      `}</style>
    </div>
  )
}

function PulsingDot() {
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        background: 'var(--accent-muted)',
        flexShrink: 0,
        position: 'relative',
      }}
    >
      <span
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: 'var(--accent)',
          animation: 'pulse-dot 1.4s ease-in-out infinite',
        }}
      />
      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 0.4; transform: scale(0.85); }
          50%       { opacity: 1;   transform: scale(1); }
        }
      `}</style>
    </span>
  )
}
