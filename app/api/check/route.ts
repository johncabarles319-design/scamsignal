import { analyzeMessage, extractUrls } from '../../../features/scam-check/domain/analyze-message'
import { assessWithClaude } from '../../../features/scam-check/infrastructure/claude'
import { isLanguage } from '../../../features/scam-check/domain/result-schema'

export const runtime = 'nodejs'

const MAX_MESSAGE_LENGTH = 5000

type JsonObject = Record<string, unknown>

function isObject(value: unknown): value is JsonObject {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function jsonError(status: number, code: string, message: string) {
  return Response.json({ error: { code, message } }, { status })
}

function serviceCode(error: unknown) {
  if (!isObject(error) || typeof error.code !== 'string') return 'provider_error'
  return error.code
}

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return jsonError(400, 'invalid_json', 'Send a valid JSON request body.')
  }

  if (!isObject(body) || typeof body.message !== 'string' || !isLanguage(body.language)) {
    return jsonError(400, 'invalid_request', 'Include a message and a supported language.')
  }

  const message = body.message.trim()
  if (!message) return jsonError(400, 'empty_message', 'Paste a message to check.')
  if (message.length > MAX_MESSAGE_LENGTH) return jsonError(413, 'message_too_long', 'Keep the message under 5,000 characters.')

  if (!process.env.ANTHROPIC_API_KEY) {
    return jsonError(503, 'missing_api_key', 'The checker is not configured yet. Add ANTHROPIC_API_KEY and try again.')
  }

  try {
    const result = await assessWithClaude({
      message,
      language: body.language,
      urls: extractUrls(message),
      ruleHits: analyzeMessage(message),
    })
    return Response.json(result)
  } catch (error) {
    const code = serviceCode(error)
    if (code === 'missing_key') return jsonError(503, 'missing_api_key', 'The checker is not configured yet.')
    if (code === 'invalid_assessment') return jsonError(502, 'invalid_assessment', 'The checker returned an unusable assessment. Try again.')
    return jsonError(502, 'provider_error', 'The AI checker is temporarily unavailable. Try again in a moment.')
  }
}
