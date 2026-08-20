'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import type { BulletFeedbackItem } from '@/lib/types'

const SEVERITY_LABEL: Record<BulletFeedbackItem['severity'], string> = {
  high: 'High priority',
  medium: 'Medium priority',
  low: 'Low priority',
}

const SEVERITY_VARIANT: Record<
  BulletFeedbackItem['severity'],
  'danger' | 'warning' | 'neutral'
> = {
  high: 'danger',
  medium: 'warning',
  low: 'neutral',
}

interface BulletFeedbackProps {
  bullets: BulletFeedbackItem[]
  animationDelay?: number
}

export function BulletFeedback({ bullets, animationDelay = 0 }: BulletFeedbackProps) {
  return (
    <section
      aria-labelledby="bullet-feedback-heading"
      style={{
        background: 'var(--surface-1)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        animation: `fade-up var(--dur-slow) var(--ease-out) ${animationDelay}ms both`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <h2
          id="bullet-feedback-heading"
          style={{
            fontSize: '13px',
            fontWeight: '600',
            color: 'var(--text-primary)',
            margin: 0,
            letterSpacing: '-0.01em',
          }}
        >
          Experience bullet feedback
        </h2>
        {bullets.length > 0 && (
          <span
            style={{
              fontSize: '11px',
              color: 'var(--text-muted)',
              flexShrink: 0,
            }}
          >
            {bullets.length} bullet{bullets.length !== 1 ? 's' : ''} reviewed
          </span>
        )}
      </div>

      {bullets.length === 0 ? (
        <EmptyState
          title="No bullet feedback available"
          description="The AI didn't identify specific bullets to improve. That's a good sign."
        />
      ) : (
        <ol
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {bullets.map((bullet, i) => (
            <BulletItem key={i} bullet={bullet} index={i} />
          ))}
        </ol>
      )}
    </section>
  )
}

function BulletItem({ bullet, index }: { bullet: BulletFeedbackItem; index: number }) {
  const [expanded, setExpanded] = useState(bullet.severity === 'high')
  const id = `bullet-${index}`

  return (
    <li
      style={{
        background: 'var(--surface-2)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
      }}
    >
      {/* Header — always visible */}
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={id}
        onClick={() => setExpanded((v) => !v)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
          padding: '12px 14px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          fontFamily: 'inherit',
          color: 'inherit',
        }}
      >
        {/* Severity indicator */}
        <span
          aria-hidden="true"
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            marginTop: '5px',
            flexShrink: 0,
            background:
              bullet.severity === 'high'
                ? 'var(--danger)'
                : bullet.severity === 'medium'
                ? 'var(--warning)'
                : 'var(--text-muted)',
          }}
        />

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Original bullet — truncated when collapsed */}
          <p
            style={{
              fontSize: '13px',
              color: 'var(--text-secondary)',
              margin: '0 0 6px',
              fontStyle: 'italic',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: expanded ? 'none' : 2,
              WebkitBoxOrient: 'vertical',
            } as React.CSSProperties}
          >
            &ldquo;{bullet.original}&rdquo;
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Badge variant={SEVERITY_VARIANT[bullet.severity]}>
              {SEVERITY_LABEL[bullet.severity]}
            </Badge>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              {expanded ? 'Hide' : 'Show'} feedback
            </span>
          </div>
        </div>

        <ChevronIcon
          style={{
            flexShrink: 0,
            color: 'var(--text-muted)',
            marginTop: '2px',
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform var(--dur-fast) var(--ease-out)',
          }}
        />
      </button>

      {/* Expandable body */}
      <div id={id} hidden={!expanded}>
        <div
          style={{
            padding: '0 14px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            borderTop: '1px solid var(--border)',
            paddingTop: '12px',
          }}
        >
          <FeedbackRow label="Issue" text={bullet.issue} color="var(--danger)" />
          <FeedbackRow label="Suggestion" text={bullet.suggestion} color="var(--accent)" />
        </div>
      </div>
    </li>
  )
}

function FeedbackRow({ label, text, color }: { label: string; text: string; color: string }) {
  return (
    <div>
      <p style={{
        fontSize: '11px', fontWeight: '600', color, textTransform: 'uppercase',
        letterSpacing: '0.07em', margin: '0 0 4px',
      }}>
        {label}
      </p>
      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.65' }}>
        {text}
      </p>
    </div>
  )
}

function ChevronIcon({ style }: { style?: React.CSSProperties }) {
  return (
    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 16 16"
      fill="none" stroke="currentColor" strokeWidth="1.75"
      strokeLinecap="round" strokeLinejoin="round" style={style}
    >
      <path d="M4 6l4 4 4-4" />
    </svg>
  )
}
