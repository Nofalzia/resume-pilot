'use client'

import type { UIMessage } from 'ai'

interface CopilotMessagesProps {
  messages: UIMessage[]
  isLoading: boolean
}

export function CopilotMessages({ messages, isLoading }: CopilotMessagesProps) {
  return (
    <div
      role="log"
      aria-label="Conversation"
      aria-live="polite"
      style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
    >
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {/* Thinking indicator — only while waiting for first token */}
      {isLoading && messages[messages.length - 1]?.role === 'user' && (
        <ThinkingIndicator />
      )}
    </div>
  )
}

function MessageBubble({ message }: { message: UIMessage }) {
  const isUser = message.role === 'user'
  const content = message.parts
    .filter((part) => part.type === 'text')
    .map((part) => part.text)
    .join('')

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isUser ? 'flex-end' : 'flex-start',
        gap: '4px',
        animation: 'fade-up var(--dur-base) var(--ease-out) both',
      }}
    >
      {/* Role label */}
      <span
        aria-hidden="true"
        style={{
          fontSize: '10px',
          fontWeight: '600',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          paddingLeft: isUser ? 0 : '2px',
          paddingRight: isUser ? '2px' : 0,
        }}
      >
        {isUser ? 'You' : 'Copilot'}
      </span>

      {/* Bubble */}
      <div
        style={{
          maxWidth: '88%',
          padding: '10px 13px',
          borderRadius: isUser
            ? 'var(--radius-lg) var(--radius-lg) var(--radius-sm) var(--radius-lg)'
            : 'var(--radius-lg) var(--radius-lg) var(--radius-lg) var(--radius-sm)',
          background: isUser ? 'var(--accent-muted)' : 'var(--surface-2)',
          border: `1px solid ${isUser ? 'rgba(45,232,176,0.18)' : 'var(--border)'}`,
          fontSize: '13px',
          lineHeight: '1.7',
          color: isUser ? 'var(--accent)' : 'var(--text-secondary)',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {/* Render assistant markdown-lite: bold, inline code, line breaks */}
        {isUser
          ? content
          : renderAssistantContent(content)}
      </div>
    </div>
  )
}

/** Minimal markdown rendering — bold, inline code, paragraph breaks only.
 *  No external dependency — keeps bundle small. */
function renderAssistantContent(text: string): React.ReactNode {
  // Split into paragraphs
  const paragraphs = text.split(/\n{2,}/)

  return paragraphs.map((para, pi) => {
    // Split paragraph into lines
    const lines = para.split('\n')

    return (
      <p key={pi} style={{ margin: pi > 0 ? '10px 0 0' : '0' }}>
        {lines.map((line, li) => (
          <span key={li}>
            {li > 0 && <br />}
            {renderInline(line)}
          </span>
        ))}
      </p>
    )
  })
}

function renderInline(text: string): React.ReactNode {
  // Pattern: **bold**, `code`
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
          {part.slice(2, -2)}
        </strong>
      )
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={i}
          style={{
            fontFamily: 'var(--font-geist-mono, monospace)',
            fontSize: '12px',
            background: 'var(--surface-3)',
            padding: '1px 5px',
            borderRadius: '3px',
            color: 'var(--accent)',
          }}
        >
          {part.slice(1, -1)}
        </code>
      )
    }
    return part
  })
}

function ThinkingIndicator() {
  return (
    <div
      aria-label="Copilot is thinking"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        padding: '10px 13px',
        background: 'var(--surface-2)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg) var(--radius-lg) var(--radius-lg) var(--radius-sm)',
        width: 'fit-content',
        animation: 'fade-in var(--dur-base) var(--ease-out)',
      }}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          aria-hidden="true"
          style={{
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            background: 'var(--text-muted)',
            animation: `pulse-dot 1.2s ease-in-out ${i * 160}ms infinite`,
          }}
        />
      ))}
    </div>
  )
}
