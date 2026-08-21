'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useSessionStorage } from '@/lib/hooks/useSessionStorage'
import type { Analysis, WorkspacePhase } from '@/lib/types'

import { WorkspaceHeader } from '@/components/workspace/WorkspaceHeader'
import { ResumeInput } from '@/components/workspace/ResumeInput'
import { JobInput } from '@/components/workspace/JobInput'
import { AnalyzeButton } from '@/components/workspace/AnalyzeButton'
import { LoadingAnalysis } from '@/components/workspace/LoadingAnalysis'
import { CopilotPanel } from '@/components/workspace/CopilotPanel'
import { ErrorState } from '@/components/ui/ErrorState'

import { ScoreCard } from '@/components/analysis/ScoreCard'
import { ATSCard } from '@/components/analysis/ATSCard'
import { KeywordsCard } from '@/components/analysis/KeywordsCard'
import { BulletFeedback } from '@/components/analysis/BulletFeedback'
import { RecommendationsCard } from '@/components/analysis/RecommendationsCard'

const SK_RESUME   = 'rp:resume'
const SK_JOB      = 'rp:job'
const SK_ANALYSIS = 'rp:analysis'
const STAGGER_MS  = 80

export default function WorkspacePage() {
  const [resumeText, setResumeText, clearResume]     = useSessionStorage<string>(SK_RESUME, '')
  const [jobText, setJobText, clearJob]               = useSessionStorage<string>(SK_JOB, '')
  const [analysis, setAnalysis, clearAnalysis]        = useSessionStorage<Analysis | null>(SK_ANALYSIS, null)

  const [phase, setPhase] = useState<WorkspacePhase>(() =>
    typeof window !== 'undefined' &&
    window.sessionStorage.getItem(SK_ANALYSIS) !== null
      ? 'results'
      : 'input'
  )
  const [errorMessage, setErrorMessage] = useState('')
  const [errorCode, setErrorCode]       = useState<string | undefined>()
  const [copilotOpen, setCopilotOpen]   = useState(false)

  const resultsRef = useRef<HTMLDivElement>(null)
  const formRef    = useRef<HTMLFormElement>(null)

  // Screen reader status
  const srMessage =
    phase === 'analyzing' ? 'Analyzing your resume, please wait.' :
    phase === 'results'   ? 'Analysis complete. Scroll down to see your results.' :
    phase === 'error'     ? `Analysis failed: ${errorMessage}` :
    ''

  useEffect(() => {
    if (phase === 'results' && resultsRef.current) {
      resultsRef.current.focus()
    }
  }, [phase])

  // Prevent scroll when copilot panel is open
  useEffect(() => {
    document.body.style.overflow = copilotOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [copilotOpen])

  const handleAnalyze = useCallback(async () => {
    if (!resumeText.trim() || phase === 'analyzing') return

    setPhase('analyzing')
    setErrorMessage('')
    setErrorCode(undefined)

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume: resumeText.trim(),
          ...(jobText.trim() ? { jobDescription: jobText.trim() } : {}),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw { message: data.message ?? `Request failed (${res.status})`, code: data.code }
      }

      setAnalysis(data as Analysis)
      setPhase('results')
    } catch (err: unknown) {
      const e = err as { message?: string; code?: string }
      setErrorMessage(e.message ?? 'Something went wrong. Please try again.')
      setErrorCode(e.code)
      setPhase('error')
    }
  }, [resumeText, jobText, phase, setAnalysis])

  const handleReanalyze = useCallback(() => {
    clearAnalysis()
    setCopilotOpen(false)
    setPhase('input')
    setErrorMessage('')
    setErrorCode(undefined)
    requestAnimationFrame(() => {
      formRef.current?.querySelector('textarea')?.focus()
    })
  }, [clearAnalysis])

  const handleRetry = useCallback(() => {
    setPhase('input')
    setErrorMessage('')
    setErrorCode(undefined)
  }, [])

  const hasResume         = resumeText.trim().length > 0
  const hasJobDescription = jobText.trim().length > 0
  const resumeTooLong     = resumeText.length > 12_000

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--surface-base)', color: 'var(--text-primary)' }}>
      {/* SR announcer */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {srMessage}
      </div>

      <WorkspaceHeader
        showReanalyze={phase === 'results' || phase === 'error'}
        onReanalyze={handleReanalyze}
        onOpenCopilot={() => setCopilotOpen(true)}
        showCopilotTrigger={phase === 'results'}
      />

      <main
        id="main-content"
        style={{ maxWidth: '768px', margin: '0 auto', padding: '2rem 1rem 4rem' }}
      >
        {/* ── INPUT ──────────────────────────────────────────────── */}
        {phase === 'input' && (
          <form
            ref={formRef}
            aria-label="Resume analysis"
            onSubmit={(e) => { e.preventDefault(); handleAnalyze() }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
          >
            <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <h1 style={{ fontSize: 'clamp(20px, 4vw, 26px)', fontWeight: '700', letterSpacing: '-0.03em', margin: 0 }}>
                Analyze your resume
              </h1>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
                Paste your resume and optionally a target job description for keyword matching and role alignment.
              </p>
            </div>

            <ResumeInput value={resumeText} onChange={setResumeText} disabled={false} />
            <JobInput value={jobText} onChange={setJobText} disabled={false} />
            <AnalyzeButton
              disabled={!hasResume || resumeTooLong}
              loading={false}
              hasJobDescription={hasJobDescription}
            />
          </form>
        )}

        {/* ── ANALYZING ──────────────────────────────────────────── */}
        {phase === 'analyzing' && (
          <LoadingAnalysis hasJobDescription={hasJobDescription} />
        )}

        {/* ── ERROR ──────────────────────────────────────────────── */}
        {phase === 'error' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ opacity: 0.45, pointerEvents: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <ResumeInput value={resumeText} onChange={() => {}} disabled />
              {hasJobDescription && <JobInput value={jobText} onChange={() => {}} disabled />}
            </div>
            <ErrorState message={errorMessage} code={errorCode} onRetry={handleRetry} />
          </div>
        )}

        {/* ── RESULTS ────────────────────────────────────────────── */}
        {phase === 'results' && analysis && (
          <div
            ref={resultsRef}
            tabIndex={-1}
            aria-label="Analysis results"
            style={{ outline: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            <AnalyzedContext hasJobDescription={hasJobDescription} charCount={resumeText.trim().length} />

            <ScoreCard analysis={analysis} animationDelay={0} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              <ATSCard
                atsCompatibility={analysis.atsCompatibility}
                atsIssues={analysis.atsIssues}
                animationDelay={STAGGER_MS}
              />
              <KeywordsCard
                keywords={analysis.keywords}
                skills={analysis.skills}
                animationDelay={STAGGER_MS * 2}
              />
            </div>

            <BulletFeedback bullets={analysis.bulletFeedback} animationDelay={STAGGER_MS * 3} />
            <RecommendationsCard recommendations={analysis.recommendations} animationDelay={STAGGER_MS * 4} />

            {/* Copilot CTA — opens the panel */}
            <CopilotCTA onOpen={() => setCopilotOpen(true)} animationDelay={STAGGER_MS * 5} />
          </div>
        )}
      </main>

      {/* Copilot panel — rendered outside main, always in DOM so chat history survives navigation */}
      <CopilotPanel
        isOpen={copilotOpen}
        onClose={() => setCopilotOpen(false)}
        resumeText={resumeText}
        analysis={analysis}
      />
    </div>
  )
}

// ── Sub-components ───────────────────────────────────────────────────

function AnalyzedContext({ hasJobDescription, charCount }: { hasJobDescription: boolean; charCount: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} aria-hidden="true" />
      Analyzed {charCount.toLocaleString()} characters
      {hasJobDescription ? ' · includes job alignment' : ' · no job description'}
    </div>
  )
}

function CopilotCTA({ onOpen, animationDelay }: { onOpen: () => void; animationDelay: number }) {
  return (
    <div
      style={{
        background: 'var(--accent-muted)',
        border: '1px solid rgba(45,232,176,0.15)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        flexWrap: 'wrap',
        animation: `fade-up var(--dur-slow) var(--ease-out) ${animationDelay}ms both`,
      }}
    >
      <div>
        <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--accent)', margin: '0 0 4px' }}>
          Ask the AI Copilot
        </p>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
          Get bullet rewrites, ask why you scored what you did, or explore specific improvements.
        </p>
      </div>
      <button
        type="button"
        onClick={onOpen}
        aria-label="Open AI Copilot panel"
        style={{
          padding: '9px 18px',
          background: 'var(--accent)',
          color: '#080809',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          fontSize: '13px',
          fontWeight: '700',
          cursor: 'pointer',
          flexShrink: 0,
          letterSpacing: '-0.01em',
          transition: 'background var(--dur-fast) var(--ease-out)',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent-hover)' }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--accent)' }}
      >
        Open Copilot →
      </button>
    </div>
  )
}
