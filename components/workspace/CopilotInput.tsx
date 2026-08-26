'use client'

import { type ChangeEvent, type FormEvent, useRef, useEffect } from 'react'

interface CopilotInputProps {
  input: string
  isLoading: boolean
  onInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
  onStop: () => void
}

export function CopilotInput({
  input,
  isLoading,
  onInputChange,
  onSubmit,
  onStop,
}: CopilotInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea as content grows
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }, [input])

  // Refocus textarea after generation stops
  useEffect(() => {
    if (!isLoading) {
      textareaRef.current?.focus()
    }
  }, [isLoading])

  const canSubmit = input.trim().length > 0 && !isLoading

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Enter submits; Shift+Enter inserts a newline
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (canSubmit) {
        const form = e.currentTarget.closest('form')
        form?.requestSubmit()
      }
    }
  }

  return (
    <div
      style={{
        flexShrink: 0,
        borderTop: '1px solid var(--border)',
        padding: '14px 16px',
        background: 'var(--surface-1)',
      }}
    >
      <form
        onSubmit={onSubmit}
        aria-label="Send a message to AI Copilot"
      >
        <div
          style={{
            display: 'flex',
            gap: '10px',
            alignItems: 'flex-end',
            background: 'var(--surface-2)',
            border: '1px solid var(--border-strong)',
            borderRadius: 'var(--radius-lg)',
            padding: '10px 12px',
            transition: 'border-color var(--dur-fast) var(--ease-out)',
          }}
          onFocusCapture={(e) => {
            const container = e.currentTarget
            container.style.borderColor = 'var(--border-focus)'
            container.style.boxShadow = '0 0 0 3px var(--accent-muted)'
          }}
          onBlurCapture={(e) => {
            // Only remove highlight when focus leaves the container entirely
            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
              const container = e.currentTarget
              container.style.borderColor = 'var(--border-strong)'
              container.style.boxShadow = 'none'
            }
          }}
        >
          <label htmlFor="copilot-input" className="sr-only">
            Message AI Copilot
          </label>
          <textarea
            ref={textareaRef}
            id="copilot-input"
            value={input}
            onChange={onInputChange}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="Ask about your resume…"
            rows={1}
            aria-multiline="true"
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              outline: 'none',
              resize: 'none',
              fontFamily: 'inherit',
              fontSize: '13px',
              lineHeight: '1.6',
              color: 'var(--text-primary)',
              minHeight: '22px',
              maxHeight: '160px',
              overflowY: 'auto',
              padding: 0,
            }}
          />

          {/* Stop / Send button */}
          {isLoading ? (
            <button
              type="button"
              onClick={onStop}
              aria-label="Stop generating"
              style={{
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '44px',
                height: '44px',
                background: 'var(--surface-3)',
                border: '1px solid var(--border-strong)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                color: 'var(--text-secondary)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)' }}
            >
              <StopIcon />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!canSubmit}
              aria-label="Send message"
              style={{
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '44px',
                height: '44px',
                background: canSubmit ? 'var(--accent)' : 'var(--surface-3)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: canSubmit ? 'pointer' : 'not-allowed',
                color: canSubmit ? '#080809' : 'var(--text-muted)',
                transition: 'background var(--dur-fast) var(--ease-out)',
              }}
              onMouseEnter={(e) => {
                if (canSubmit) e.currentTarget.style.background = 'var(--accent-hover)'
              }}
              onMouseLeave={(e) => {
                if (canSubmit) e.currentTarget.style.background = 'var(--accent)'
              }}
            >
              <SendIcon />
            </button>
          )}
        </div>

        <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '8px 0 0', textAlign: 'center' }}>
          {isLoading ? 'Generating…' : 'Enter to send · Shift+Enter for new line'}
        </p>
      </form>
    </div>
  )
}

function SendIcon() {
  return (
    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.2"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
    </svg>
  )
}

function StopIcon() {
  return (
    <svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
      <rect x="1.5" y="1.5" width="9" height="9" rx="1.5" />
    </svg>
  )
}
