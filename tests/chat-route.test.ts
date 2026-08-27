import { describe, expect, it } from 'vitest'
import { POST } from '@/app/api/chat/route'

function requestWith(body: unknown) {
  return new Request('http://localhost/api/chat', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/chat validation', () => {
  it('requires at least one message', async () => {
    const response = await POST(requestWith({ messages: [] }))

    expect(response.status).toBe(400)
    await expect(response.text()).resolves.toBe('No messages provided')
  })

  it('rejects malformed message data before contacting the provider', async () => {
    const response = await POST(requestWith({ messages: [{ role: 'user', parts: [] }] }))

    expect(response.status).toBe(400)
    await expect(response.text()).resolves.toBe('Invalid message data')
  })

  it('rejects an oversized resume context', async () => {
    const response = await POST(requestWith({
      messages: [{ id: '1', role: 'user', parts: [{ type: 'text', text: 'Hello' }] }],
      resumeText: 'x'.repeat(12_001),
    }))

    expect(response.status).toBe(400)
    await expect(response.text()).resolves.toBe('Resume text is too long')
  })
})