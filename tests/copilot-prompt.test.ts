import { describe, expect, it } from 'vitest'
import { buildCopilotSystemPrompt } from '@/lib/ai/copilot-prompt'

describe('buildCopilotSystemPrompt', () => {
  it('asks for resume context before offering specific feedback', () => {
    const prompt = buildCopilotSystemPrompt(null, null)

    expect(prompt).toContain('No resume has been loaded yet')
    expect(prompt).toContain('NEVER fabricate metrics')
  })

  it('uses the resume and structured analysis as bounded context', () => {
    const prompt = buildCopilotSystemPrompt('Built a React dashboard', {
      score: 82,
      scoreRationale: 'Strong evidence with some missing outcomes.',
      atsCompatibility: 'good',
      atsIssues: [],
      strengths: ['Relevant experience'],
      weaknesses: ['Needs more metrics'],
      skills: { strong: ['React'], missing: [] },
      keywords: { matched: [], missing: [] },
      bulletFeedback: [],
      recommendations: [],
    })

    expect(prompt).toContain("CANDIDATE'S RESUME")
    expect(prompt).toContain('Built a React dashboard')
    expect(prompt).toContain('Resume score: 82/100')
  })
})