import { describe, expect, it } from 'vitest'
import { buildAnalysisPrompt } from '@/lib/ai/prompt'

describe('buildAnalysisPrompt', () => {
  it('includes job-specific comparison instructions when a target job is provided', () => {
    const prompt = buildAnalysisPrompt('Frontend Engineer with React experience', 'Requires TypeScript and React', 'resume')

    expect(prompt).toContain('TARGET JOB DESCRIPTION:')
    expect(prompt).toContain('Populate the jobAlignment score')
    expect(prompt).toContain('Requires TypeScript and React')
  })

  it('explicitly prevents fabricated metrics and omits job comparison without a job', () => {
    const prompt = buildAnalysisPrompt('Built a dashboard', undefined, 'cv')

    expect(prompt).toContain('NEVER fabricate metrics')
    expect(prompt).toContain('This is a CV, not a resume')
    expect(prompt).toContain('Leave keywords.matched, keywords.missing, skills.missing, and jobAlignment empty/omitted')
    expect(prompt).not.toContain('TARGET JOB DESCRIPTION:')
  })
})