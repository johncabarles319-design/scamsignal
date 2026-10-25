import { beforeEach, describe, expect, it, vi } from 'vitest'
import { assessWithClaude } from './claude'

const { create } = vi.hoisted(() => ({ create: vi.fn() }))
vi.mock('@anthropic-ai/sdk', () => ({ default: vi.fn(function MockAnthropic() { return { messages: { create } } }) }))

describe('assessWithClaude', () => {
  beforeEach(() => {
    vi.stubEnv('ANTHROPIC_API_KEY', 'test-key')
    create.mockReset()
  })

  it('returns a validated assessment and sends the selected language', async () => {
    create.mockResolvedValue({ content: [{ type: 'text', text: JSON.stringify({ risk: 'medium', reasons: ['Uses urgency'], what_to_do: ['Contact the organization directly'] }) }], stop_reason: 'end_turn' })
    const result = await assessWithClaude({ message: 'Ihatag ang OTP karon.', urls: [], ruleHits: [{ code: 'credential_request', label: 'Credential request', evidence: 'Requests a secret code' }], language: 'ceb' })
    expect(result.risk).toBe('medium')
    expect(create).toHaveBeenCalledOnce()
    const request = create.mock.calls[0][0]
    expect(request.model).toBe('claude-haiku-4-5-20251001')
    expect(request.max_tokens).toBeGreaterThan(100)
    expect(request.output_config.format.type).toBe('json_schema')
    expect(request.messages[0].content).toContain('Ihatag ang OTP karon.')
    expect(request.messages[0].content).toContain('ceb')
  })

  it('rejects malformed provider content', async () => {
    create.mockResolvedValue({ content: [{ type: 'text', text: '{"risk":"safe"}' }], stop_reason: 'end_turn' })
    await expect(assessWithClaude({ message: 'hello', urls: [], ruleHits: [], language: 'en' })).rejects.toMatchObject({ code: 'invalid_assessment' })
  })
})
