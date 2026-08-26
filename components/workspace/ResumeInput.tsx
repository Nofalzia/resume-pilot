'use client'

import { Textarea } from '@/components/ui/Textarea'
import type { DocumentType } from '@/lib/types'

const MAX_CHARS = 12_000
const WARN_THRESHOLD = 0.8

interface ResumeInputProps {
  value: string
  onChange: (value: string) => void
  documentType: DocumentType
  onDocumentTypeChange: (documentType: DocumentType) => void
  validationMessage?: string
  disabled?: boolean
}

export function ResumeInput({
  value,
  onChange,
  documentType,
  onDocumentTypeChange,
  validationMessage,
  disabled,
}: ResumeInputProps) {
  const isOverLimit = value.length > MAX_CHARS
  const documentLabel = documentType === 'cv' ? 'CV' : 'resume'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <fieldset disabled={disabled} style={{ border: 0, padding: 0, margin: 0 }}>
        <legend style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)', marginBottom: '8px' }}>
          Document type
        </legend>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '8px' }}>
          <DocumentTypeOption
            value="resume"
            label="Resume"
            description="A short, targeted summary of your experience, usually tailored to a specific job."
            checked={documentType === 'resume'}
            onChange={onDocumentTypeChange}
          />
          <DocumentTypeOption
            value="cv"
            label="CV"
            description="A detailed, multi-page record of your academic and professional history."
            checked={documentType === 'cv'}
            onChange={onDocumentTypeChange}
          />
        </div>
      </fieldset>

      <Textarea
        label={`Your ${documentLabel}`}
        description={`Paste the full text of your ${documentLabel}. Plain text works best.`}
        placeholder={`Paste your ${documentLabel} here...\n\nExample:\nJane Smith\njane@email.com | github.com/janesmith\n\nEXPERIENCE\nFrontend Engineer, Acme Corp (2023-present)\n- Built and shipped React dashboard serving 50k monthly users\n- Reduced bundle size by 40% through code splitting\n\nSKILLS\nReact, TypeScript, Next.js, Node.js, Tailwind CSS`}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        maxChars={MAX_CHARS}
        charCountThreshold={WARN_THRESHOLD}
        error={validationMessage ?? (isOverLimit ? `${documentLabel[0].toUpperCase()}${documentLabel.slice(1)} is too long. Please trim to under ${MAX_CHARS.toLocaleString()} characters.` : undefined)}
        aria-required="true"
        rows={16}
        style={{
          minHeight: '280px',
          fontFamily: 'var(--font-geist-mono, monospace)',
          fontSize: '13px',
          lineHeight: '1.8',
        }}
      />
    </div>
  )
}

function DocumentTypeOption({
  value,
  label,
  description,
  checked,
  onChange,
}: {
  value: DocumentType
  label: string
  description: string
  checked: boolean
  onChange: (documentType: DocumentType) => void
}) {
  return (
    <label
      style={{
        minHeight: '72px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        padding: '12px',
        border: `1px solid ${checked ? 'var(--accent)' : 'var(--border-strong)'}`,
        borderRadius: 'var(--radius-md)',
        background: checked ? 'var(--accent-muted)' : 'var(--surface-1)',
        cursor: 'pointer',
      }}
    >
      <input
        type="radio"
        name="document-type"
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        style={{ width: '20px', height: '20px', margin: '2px 0 0', accentColor: 'var(--accent)', flexShrink: 0 }}
      />
      <span style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{label}</span>
        <span style={{ fontSize: '12px', lineHeight: 1.5, color: 'var(--text-secondary)' }}>{description}</span>
      </span>
    </label>
  )
}
