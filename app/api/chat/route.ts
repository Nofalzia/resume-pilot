import { convertToModelMessages, streamText, type UIMessage } from 'ai'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { buildCopilotSystemPrompt } from '@/lib/ai/copilot-prompt'
import type { Analysis } from '@/lib/types'

export const runtime = 'nodejs'

const MAX_MESSAGES = 40

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
    analysis   = body.analysis ?? null
  } catch {
    return new Response('Invalid request body', { status: 400 })
  }

  if (!messages.length) {
    return new Response('No messages provided', { status: 400 })
  }

  // Cap history length to avoid runaway token usage
  const trimmedMessages = messages.slice(-MAX_MESSAGES)

  try {
    const openrouter = getClient()

    const result = streamText({
      model: openrouter(process.env.COPILOT_MODEL ?? 'anthropic/claude-3.5-sonnet'),
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
