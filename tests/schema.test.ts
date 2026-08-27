import { describe, expect, it } from 'vitest'
import { AnalysisSchema } from '@/lib/ai/schema'

const validAnalysis = {
  score: 78,
  scoreRationale: 'Clear experience with room to quantify impact.',
  atsCompatibility: 'needs-work' as const,
  atsIssues: ['Add a clearer skills heading.'],
  strengths: ['Relevant frontend experience.'],
  weaknesses: ['Some bullets lack outcomes.'],
  skills: { strong: ['React'], missing: [] },
  keywords: { matched: [], missing: [] },
  bulletFeedback: [],
  recommendations: [],
}

describe('AnalysisSchema', () => {
  it('accepts structured analysis output within score bounds', () => {
    expect(AnalysisSchema.safeParse(validAnalysis).success).toBe(true)
  })

  it('rejects invalid scores and unsupported ATS statuses', () => {
    expect(AnalysisSchema.safeParse({ ...validAnalysis, score: 101 }).success).toBe(false)
    expect(AnalysisSchema.safeParse({ ...validAnalysis, atsCompatibility: 'excellent' }).success).toBe(false)
  })
})