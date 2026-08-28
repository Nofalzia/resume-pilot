import { convertToModelMessages, streamText, type UIMessage } from 'ai'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { AI_MODEL } from '@/lib/ai/config'
import { buildCopilotSystemPrompt } from '@/lib/ai/copilot-prompt'
import { AnalysisSchema } from '@/lib/ai/schema'
import type { Analysis } from '@/lib/types'

export const runtime = 'nodejs'

const MAX_MESSAGES = 40
const MAX_RESUME_CHARS = 12_000
const MAX_MESSAGE_CHARS = 4_000

function isValidMessage(message: unknown): message is UIMessage {
  if (!message || typeof message !== 'object') return false

  const candidate = message as { id?: unknown; role?: unknown; parts?: unknown }
  if (
    typeof candidate.id !== 'string' ||
    !['user', 'assistant', 'system'].includes(candidate.role as string) ||
    !Array.isArray(candidate.parts)
  ) {
    return false
  }

  return candidate.parts.every((part) => {
    if (!part || typeof part !== 'object' || typeof (part as { type?: unknown }).type !== 'string') {
      return false
    }

    const text = (part as { text?: unknown }).text
    return typeof text !== 'string' || text.length <= MAX_MESSAGE_CHARS
  })
}

function getClient() {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) throw new Error('OPENROUTER_API_KEY is not configured')
  return createOpenRouter({ apiKey })
}

export async function POST(request: Request) {
  let messages: UIMessage[]
  let resumeText: string | null
  let analysis: Analysis | null

  try {
    const body = await request.json()
    messages   = Array.isArray(body.messages) ? body.messages : []
    resumeText = typeof body.resumeText === 'string' && body.resumeText.trim()
      ? body.resumeText.trim()
      : null
    const parsedAnalysis = body.analysis == null ? null : AnalysisSchema.safeParse(body.analysis)
    if (parsedAnalysis && !parsedAnalysis.success) {
      return new Response('Invalid analysis data', { status: 400 })
    }
    analysis = parsedAnalysis ? parsedAnalysis.data : null
  } catch {
    return new Response('Invalid request body', { status: 400 })
  }

  if (!messages.length) {
    return new Response('No messages provided', { status: 400 })
  }

  if (!messages.every(isValidMessage)) {
    return new Response('Invalid message data', { status: 400 })
  }

  if (resumeText && resumeText.length > MAX_RESUME_CHARS) {
    return new Response('Resume text is too long', { status: 400 })
  }

  // Cap history length to avoid runaway token usage
  const trimmedMessages = messages.slice(-MAX_MESSAGES)

  try {
    const openrouter = getClient()

    const result = streamText({
      model: openrouter(process.env.COPILOT_MODEL ?? process.env.ANALYSIS_MODEL ?? AI_MODEL),
      system: buildCopilotSystemPrompt(resumeText, analysis),
      messages: await convertToModelMessages(trimmedMessages),
      temperature: 0.6,
      maxOutputTokens: 1024,
    })

    return result.toUIMessageStreamResponse()
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[/api/chat]', message)

    if (message.toLowerCase().includes('rate limit') || message.includes('429')) {
      return new Response(
        JSON.stringify({ error: 'Rate limited. Please wait a moment and try again.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Chat failed. Please try again.' }),
      { status: 502, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
