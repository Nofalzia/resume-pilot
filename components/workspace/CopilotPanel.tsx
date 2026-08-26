'use client'

import {
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useState,
  type KeyboardEvent,
} from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import type { Analysis } from '@/lib/types'
import { CopilotMessages } from './CopilotMessages'
import { CopilotInput } from './CopilotInput'

const SUGGESTED_PROMPTS = [
  'Why did I get this score?',
  'Rewrite my weakest bullet point',
  'What should I fix first?',
  'What keywords am I missing?',
  'How can I improve my impact statements?',
]

interface CopilotPanelProps {
  isOpen: boolean
  onClose: () => void
  resumeText: string
  analysis: Analysis | null
}

export function CopilotPanel({
  isOpen,
  onClose,
  resumeText,
  analysis,
}: CopilotPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const openerRef = useRef<HTMLElement | null>(null)

  const [input, setInput] = useState('')
  const transport = useMemo(
    () => new DefaultChatTransport({
      api: '/api/chat',
      body: () => ({ resumeText, analysis }),
    }),
    [resumeText, analysis]
  )
  const { messages, status, stop, error, clearError, regenerate, sendMessage } = useChat({ transport })
  const isLoading = status === 'submitted' || status === 'streaming'

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }, [])

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || isLoading) return
    setInput('')
    void sendMessage({ text })
  }, [input, isLoading, sendMessage])

  // Ã¢â€â‚¬Ã¢â€â‚¬ Auto-scroll to newest message Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
  useEffect(() => {
    if (messages.length) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  // Ã¢â€â‚¬Ã¢â€â‚¬ Focus management Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
  useEffect(() => {
    if (isOpen) {
      openerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
      // Small delay so the CSS transition has started before focus moves
      const t = setTimeout(() => closeButtonRef.current?.focus(), 50)
      return () => clearTimeout(t)
    } else if (openerRef.current?.isConnected) {
      openerRef.current.focus()
      openerRef.current = null
    }
  }, [isOpen])

  // Keep an off-screen panel out of both the accessibility tree and tab order.
  useEffect(() => {
    const el = panelRef.current
    if (!el) return
    if (isOpen) {
      el.removeAttribute('aria-hidden')
      el.removeAttribute('inert')
    } else {
      el.setAttribute('aria-hidden', 'true')
      el.setAttribute('inert', '')
    }
  }, [isOpen])

  // Ã¢â€â‚¬Ã¢â€â‚¬ Escape key closes panel Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    },
    [onClose]
  )

  // Ã¢â€â‚¬Ã¢â€â‚¬ Focus trap Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
  const handleTrapFocus = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab') return
    const panel = panelRef.current
    if (!panel) return

    const focusable = panel.querySelectorAll<HTMLElement>(
      'button:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
    )
    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault()
        last?.focus()
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault()
        first?.focus()
      }
    }
  }, [])

  const handleSuggestedPrompt = useCallback(
    (prompt: string) => {
      if (isLoading) return
      setInput(prompt)
      // Submit on the next frame so input state has settled
      requestAnimationFrame(() => {
        const form = panelRef.current?.querySelector('form')
        form?.requestSubmit()
      })
    },
    [isLoading]
  )

  const isEmpty = messages.length === 0

  return (
    <>
      {/* Ã¢â€â‚¬Ã¢â€â‚¬ Backdrop Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ */}
      <div
        aria-hidden="true"
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.55)',
          zIndex: 49,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 250ms var(--ease-out)',
          backdropFilter: isOpen ? 'blur(2px)' : 'none',
        }}
      />

      {/* Ã¢â€â‚¬Ã¢â€â‚¬ Panel Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="AI Copilot"
        onKeyDown={(e) => {
          handleKeyDown(e)
          handleTrapFocus(e)
        }}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 'min(420px, 100vw)',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--surface-1)',
          borderLeft: '1px solid var(--border-strong)',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 300ms var(--ease-out)',
          // Mobile: full-width bottom sheet
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid var(--border)',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              aria-hidden="true"
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: isLoading ? 'var(--accent)' : 'var(--text-muted)',
                transition: 'background 300ms',
                animation: isLoading ? 'pulse-dot 1.4s ease-in-out infinite' : 'none',
              }}
            />
            <span
              style={{
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                letterSpacing: '-0.01em',
              }}
            >
              AI Copilot
            </span>
            {analysis && (
              <span
                style={{
                  fontSize: '11px',
                  color: 'var(--text-muted)',
                  background: 'var(--surface-2)',
                  padding: '2px 7px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)',
                }}
              >
                Score {analysis.score}/100
              </span>
            )}
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close AI Copilot"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '44px',
              height: '44px',
              background: 'none',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--surface-2)'
              e.currentTarget.style.color = 'var(--text-primary)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'none'
              e.currentTarget.style.color = 'var(--text-secondary)'
            }}
          >
            <CloseIcon />
          </button>
        </div>

        {/* Messages area */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          {isEmpty ? (
            <EmptyChat
              hasAnalysis={!!analysis}
              isLoading={isLoading}
              onPrompt={handleSuggestedPrompt}
            />
          ) : (
            <CopilotMessages messages={messages} isLoading={isLoading} />
          )}

          {/* Error state */}
          {error && !isLoading && (
            <div
              role="alert"
              style={{
                margin: '8px 0',
                padding: '12px 14px',
                background: 'var(--danger-muted)',
                border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
              }}
            >
              <span style={{ fontSize: '13px', color: '#FCA5A5' }}>
                {error.message || 'Something went wrong.'}
              </span>
              <button
                type="button"
                onClick={() => { clearError(); void regenerate() }}
                style={{
                  fontSize: '12px',
                  color: 'var(--accent)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  flexShrink: 0,
                minHeight: '44px',
                padding: '2px 8px',
                }}
              >
                Retry
              </button>
            </div>
          )}

          <div ref={messagesEndRef} aria-hidden="true" />
        </div>

        {/* Input area */}
        <CopilotInput
          input={input}
          isOpen={isOpen}
          isLoading={isLoading}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          onStop={stop}
        />
      </div>
    </>
  )
}

// Ã¢â€â‚¬Ã¢â€â‚¬ Sub-components Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

function EmptyChat({
  hasAnalysis,
  isLoading,
  onPrompt,
}: {
  hasAnalysis: boolean
  isLoading: boolean
  onPrompt: (p: string) => void
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        paddingTop: '8px',
      }}
    >
      <div>
        <p
          style={{
            fontSize: '14px',
            fontWeight: '500',
            color: 'var(--text-primary)',
            margin: '0 0 6px',
          }}
        >
          {hasAnalysis
            ? 'Your resume and analysis are loaded.'
            : 'Ask me anything about your resume.'}
        </p>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.6' }}>
          {hasAnalysis
            ? 'Ask follow-up questions, request bullet rewrites, or explore how to improve your score.'
            : 'Run an analysis first to unlock context-aware advice.'}
        </p>
      </div>

      {hasAnalysis && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <p
            style={{
              fontSize: '11px',
              fontWeight: '600',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.07em',
              margin: '0 0 4px',
            }}
          >
            Suggested questions
          </p>
          {SUGGESTED_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              disabled={isLoading}
              onClick={() => onPrompt(prompt)}
              style={{
                textAlign: 'left',
                padding: '10px 13px',
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                fontSize: '13px',
                color: 'var(--text-secondary)',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.55 : 1,
                fontFamily: 'inherit',
                lineHeight: '1.5',
                transition: 'border-color var(--dur-fast), color var(--dur-fast)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-focus)'
                e.currentTarget.style.color = 'var(--text-primary)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.color = 'var(--text-secondary)'
              }}
            >
              {prompt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
    >
      <path d="M1 1l12 12M13 1L1 13" />
    </svg>
  )
}
