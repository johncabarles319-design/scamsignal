export const languages = ['en', 'fil', 'ceb'] as const
export type Language = (typeof languages)[number]

export const risks = ['low', 'medium', 'high'] as const
export type Risk = (typeof risks)[number]

export type RiskAssessment = {
  risk: Risk
  reasons: string[]
  what_to_do: string[]
}

const isRecord = (value: unknown): value is Record<string, unknown> => Boolean(value) && typeof value === 'object' && !Array.isArray(value)

function parseList(value: unknown) {
  if (!Array.isArray(value) || value.length < 1 || value.length > 6) return null
  const items = value.map((item) => typeof item === 'string' ? item.trim() : null)
  if (items.some((item) => !item || item.length > 240)) return null
  return items as string[]
}

export function parseRiskAssessment(value: unknown): RiskAssessment | null {
  if (!isRecord(value)) return null
  const keys = Object.keys(value).sort()
  if (keys.join(',') !== 'reasons,risk,what_to_do') return null
  if (!risks.includes(value.risk as Risk)) return null
  const reasons = parseList(value.reasons)
  const whatToDo = parseList(value.what_to_do)
  if (!reasons || !whatToDo) return null
  return { risk: value.risk as Risk, reasons, what_to_do: whatToDo }
}

export function isLanguage(value: unknown): value is Language {
  return typeof value === 'string' && languages.includes(value as Language)
}
