'use client'

import { Textarea } from '@/components/ui/Textarea'

const MAX_CHARS = 12_000
const WARN_THRESHOLD = 0.8

interface ResumeInputProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function ResumeInput({ value, onChange, disabled }: ResumeInputProps) {
  const isOverLimit = value.length > MAX_CHARS

  return (
    <Textarea
      label="Your resume"
      description="Paste the full text of your resume. Plain text works best."
      placeholder={`Paste your resume here…

Example:
Jane Smith
jane@email.com | github.com/janesmith

EXPERIENCE
Frontend Engineer, Acme Corp (2023–present)
• Built and shipped React dashboard serving 50k monthly users
• Reduced bundle size by 40% through code splitting

SKILLS
React, TypeScript, Next.js, Node.js, Tailwind CSS`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      maxChars={MAX_CHARS}
      charCountThreshold={WARN_THRESHOLD}
      error={isOverLimit ? `Resume is too long. Please trim to under ${MAX_CHARS.toLocaleString()} characters.` : undefined}
      rows={16}
      style={{
        minHeight: '280px',
        fontFamily: 'var(--font-geist-mono, monospace)',
        fontSize: '13px',
        lineHeight: '1.8',
      }}
    />
  )
}
