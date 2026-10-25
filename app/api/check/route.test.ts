import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ClaudeServiceError, assessWithClaude } from '../../../features/scam-check/infrastructure/claude'
import { POST } from './route'

vi.mock('../../../features/scam-check/infrastructure/claude', () => ({
  ClaudeServiceError: class ClaudeServiceError extends Error { constructor(public code: string, message: string) { super(message) } },
  assessWithClaude: vi.fn(),
}))

const assessment = { risk: 'low' as const, reasons: ['No obvious indicators'], what_to_do: ['Verify with the sender'] }

function request(body: unknown) {
  return new Request('http://localhost/api/check', {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body),
  })
}

describe('POST /api/check', () => {
  beforeEach(() => {
    vi.stubEnv('ANTHROPIC_API_KEY', 'test-key')
    vi.mocked(assessWithClaude).mockReset()
  })

  it('returns the documented assessment contract as JSON', async () => {
    vi.mocked(assessWithClaude).mockResolvedValue(assessment)
    const response = await POST(request({ message: 'Can we meet tomorrow?', language: 'en' }))
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual(assessment)
  })

  it('rejects empty, invalid-language, malformed, and oversized input', async () => {
    expect((await POST(request({ message: '  ', language: 'en' }))).status).toBe(400)
    expect((await POST(request({ message: 'hello', language: 'xx' }))).status).toBe(400)
    expect((await POST(new Request('http://localhost/api/check', { method: 'POST', body: '{' }))).status).toBe(400)
    expect((await POST(request({ message: 'x'.repeat(5001), language: 'en' }))).status).toBe(413)
  })

  it('returns JSON service errors without exposing provider details', async () => {
    vi.mocked(assessWithClaude).mockRejectedValue(new ClaudeServiceError('provider_error', 'provider secret details'))
    const response = await POST(request({ message: 'secret user content', language: 'en' }))
    expect(response.status).toBe(502)
    const body = await response.json()
    expect(body.error.code).toBe('provider_error')
    expect(JSON.stringify(body)).not.toContain('provider secret details')
    expect(JSON.stringify(body)).not.toContain('secret user content')
  })

  it('returns setup error before calling Claude when the key is missing', async () => {
    vi.stubEnv('ANTHROPIC_API_KEY', '')
    const response = await POST(request({ message: 'hello', language: 'en' }))
    expect(response.status).toBe(503)
    expect(assessWithClaude).not.toHaveBeenCalled()
  })
})
