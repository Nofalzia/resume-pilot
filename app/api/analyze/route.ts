import { generateObject } from 'ai'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { AI_MODEL } from '@/lib/ai/config'
import { AnalysisSchema } from '@/lib/ai/schema'
import { buildAnalysisPrompt } from '@/lib/ai/prompt'
import type { DocumentType } from '@/lib/types'

// Enforce server-side only — API key must never reach the client
export const runtime = 'nodejs'

const MAX_RESUME_CHARS = 12_000
const MAX_JOB_CHARS = 6_000

function getClient() {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not configured')
  }
  return createOpenRouter({ apiKey })
}

export async function POST(request: Request) {
  // Parse and validate request body
  let resume: string
  let jobDescription: string | undefined
  let documentType: DocumentType

  try {
    const body = await request.json()
    resume = typeof body.resume === 'string' ? body.resume.trim() : ''
    jobDescription =
      typeof body.jobDescription === 'string' && body.jobDescription.trim()
        ? body.jobDescription.trim()
        : undefined
    documentType = body.docType === 'cv' ? 'cv' : 'resume'
  } catch {
    return Response.json(
      { message: 'Invalid request body.' },
      { status: 400 }
    )
  }

  if (!resume) {
    return Response.json(
      { message: 'Resume text is required.' },
      { status: 400 }
    )
  }

  if (resume.length > MAX_RESUME_CHARS) {
    return Response.json(
      {
        message: `Resume is too long (${resume.length.toLocaleString()} characters). Please trim it to under ${MAX_RESUME_CHARS.toLocaleString()} characters.`,
      },
      { status: 400 }
    )
  }

  if (jobDescription && jobDescription.length > MAX_JOB_CHARS) {
    return Response.json(
      {
        message: `Job description is too long. Please trim it to under ${MAX_JOB_CHARS.toLocaleString()} characters.`,
      },
      { status: 400 }
    )
  }

  try {
    const openrouter = getClient()

    const { object } = await generateObject({
      // Defaults to the shared OpenRouter model configuration.
      // Set ANALYSIS_MODEL in .env.local to override it for this route.
      model: openrouter(
        process.env.ANALYSIS_MODEL ?? AI_MODEL
      ),
      schema: AnalysisSchema,
      schemaName: 'resume_analysis',
      prompt: buildAnalysisPrompt(resume, jobDescription, documentType),
      // The full schema is compact; avoid reserving Gemini's 65K-token default.
      maxOutputTokens: 3_000,
      // Slightly lower temperature for consistent, structured output
      temperature: 0.3,
    })

    return Response.json(object)
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Unknown error occurred'

    // Log server-side for debugging — never expose raw error to client
    console.error('[/api/analyze]', message)

    // Surface rate limit signal to the client so the UI can explain it
    if (message.toLowerCase().includes('rate limit') || message.includes('429')) {
      return Response.json(
        {
          message:
            'The AI service is temporarily rate-limited. Please wait a moment and try again.',
          code: 'RATE_LIMITED',
        },
        { status: 429 }
      )
    }

    return Response.json(
      { message: 'Analysis failed. Please try again.' },
      { status: 502 }
    )
  }
}
