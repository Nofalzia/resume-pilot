import { describe, expect, it } from 'vitest'
import { POST } from '@/app/api/analyze/route'

function requestWith(body: unknown) {
  return new Request('http://localhost/api/analyze', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/analyze validation', () => {
  it('returns a safe 400 response when resume text is missing', async () => {
    const response = await POST(requestWith({}))

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({ message: 'Resume text is required.' })
  })

  it('rejects oversized resume input before contacting the AI provider', async () => {
    const response = await POST(requestWith({ resume: 'x'.repeat(12_001) }))

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toMatchObject({ message: expect.stringContaining('Resume is too long') })
  })

  it('returns a safe 400 response for malformed JSON', async () => {
    const request = new Request('http://localhost/api/analyze', { method: 'POST', body: '{' })

    const response = await POST(request)

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({ message: 'Invalid request body.' })
  })
})