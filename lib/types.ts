import type { z } from 'zod'
import type { AnalysisSchema } from '@/lib/ai/schema'

export type Analysis = z.infer<typeof AnalysisSchema>

export type ATSCompatibility = Analysis['atsCompatibility']
export type BulletFeedbackItem = Analysis['bulletFeedback'][number]
export type RecommendationItem = Analysis['recommendations'][number]
export type Priority = RecommendationItem['priority']
export type Severity = BulletFeedbackItem['severity']

export type WorkspacePhase = 'input' | 'analyzing' | 'results' | 'error'
