'use client'

import { useState } from 'react'
import { Textarea } from '@/components/ui/Textarea'

const MAX_CHARS = 6_000

interface JobInputProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function JobInput({ value, onChange, disabled }: JobInputProps) {
  // Start expanded if we already have a value (e.g. restored from session)
  const [expanded, setExpanded] = useState(!!value)

  const hasValue = value.trim().length > 0

  return (
    <div
      style={{
        background: 'var(--surface-1)',
        border: '1px solid var(--border-strong)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        transition: 'border-color var(--dur-fast) var(--ease-out)',
      }}
    >
      {/* Toggle header */}
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls="job-description-panel"
        onClick={() => setExpanded((prev) => !prev)}
        disabled={disabled}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          padding: '14px 16px',
          background: 'none',
          border: 'none',
          cursor: disabled ? 'default' : 'pointer',
          color: 'var(--text-primary)',
          fontFamily: 'inherit',
          textAlign: 'left',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ fontSize: '13px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Target job description
            <span
              style={{
                fontSize: '10px',
                fontWeight: '500',
                padding: '1px 6px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--accent-muted)',
                color: 'var(--accent)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              Optional
            </span>
            {hasValue && !expanded && (
              <span
                style={{
                  width: '6px', height: '6px',
                  borderRadius: '50%',
                  background: 'var(--accent)',
                  flexShrink: 0,
                }}
                aria-label="Job description added"
              />
            )}
          </span>
          {!expanded && (
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {hasValue
                ? `${value.trim().length.toLocaleString()} characters · unlocks keyword matching and role alignment`
                : 'Add to unlock keyword matching and role alignment score'}
            </span>
          )}
        </div>

        <ChevronIcon
          style={{
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform var(--dur-fast) var(--ease-out)',
            flexShrink: 0,
            color: 'var(--text-muted)',
          }}
        />
      </button>

      {/* Collapsible panel */}
      <div
        id="job-description-panel"
        hidden={!expanded}
        style={{ padding: '0 16px 16px' }}
      >
        <Textarea
          label="Job description"
          description="Paste the full job posting. The AI will compare it against your resume to identify keyword gaps, missing skills, and alignment score."
          placeholder="Paste the job description here…"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          maxChars={MAX_CHARS}
          rows={10}
          style={{ minHeight: '200px' }}
        />
      </div>
    </div>
  )
}

function ChevronIcon({ style }: { style?: React.CSSProperties }) {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
    >
      <path d="M4 6l4 4 4-4" />
    </svg>
  )
}
