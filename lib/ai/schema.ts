import { z } from 'zod'

export const AnalysisSchema = z.object({
  score: z
    .number()
    .min(0)
    .max(100)
    .describe('Overall resume strength score from 0 to 100'),

  scoreRationale: z
    .string()
    .describe('1–2 sentence plain-language explanation of the score. Specific, not generic.'),

  atsCompatibility: z
    .enum(['good', 'needs-work', 'poor'])
    .describe('How well the resume will parse through ATS systems'),

  atsIssues: z
    .array(z.string())
    .describe('Specific ATS formatting problems found. Empty array if none.'),

  strengths: z
    .array(z.string())
    .max(4)
    .describe('What the resume does well. Maximum 4 items. Be specific, not vague.'),

  weaknesses: z
    .array(z.string())
    .max(4)
    .describe('Specific problems that weaken the resume. Maximum 4 items.'),

  skills: z.object({
    strong: z
      .array(z.string())
      .describe('Skills clearly demonstrated in the resume'),
    missing: z
      .array(z.string())
      .describe(
        'Skills expected for the role but absent or unclear in the resume. ' +
        'Only populate when a job description was provided.'
      ),
  }),

  keywords: z.object({
    matched: z
      .array(z.string())
      .describe(
        'Keywords or phrases from the job description that appear in the resume. ' +
        'Empty array if no job description was provided.'
      ),
    missing: z
      .array(z.string())
      .describe(
        'Important keywords from the job description not found in the resume. ' +
        'Empty array if no job description was provided.'
      ),
  }),

  bulletFeedback: z
    .array(
      z.object({
        original: z.string().describe('The exact bullet point text from the resume'),
        issue: z.string().describe('What is weak or missing in this bullet point'),
        suggestion: z
          .string()
          .describe(
            'How to improve the bullet. NEVER fabricate metrics or achievements. ' +
            'If a number would help, show WHERE to add it: "Add the X metric here" — do not invent it.'
          ),
        severity: z
          .enum(['high', 'medium', 'low'])
          .describe('How important this fix is to overall impact'),
      })
    )
    .max(5)
    .describe(
      'Feedback on the weakest experience bullets. Maximum 5. ' +
      'Focus on the bullets that most need improvement.'
    ),

  recommendations: z
    .array(
      z.object({
        priority: z.enum(['high', 'medium', 'low']),
        title: z
          .string()
          .describe('Short action title, e.g. "Quantify your internship impact"'),
        detail: z
          .string()
          .describe('Specific, actionable guidance. 1–2 sentences.'),
      })
    )
    .max(5)
    .describe('Ranked action items ordered by impact. Maximum 5.'),

  jobAlignment: z
    .number()
    .min(0)
    .max(100)
    .optional()
    .describe(
      'Resume-to-job match percentage, 0–100. ' +
      'ONLY include this field when a job description was provided. ' +
      'Omit entirely if no job description was given.'
    ),
})
