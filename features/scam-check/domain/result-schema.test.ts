import { describe, expect, it } from 'vitest'
import { parseRiskAssessment } from './result-schema'

describe('parseRiskAssessment', () => {
  it('accepts the exact response contract', () => {
    expect(parseRiskAssessment({ risk: 'medium', reasons: ['Uses urgency'], what_to_do: ['Verify independently'] })).toEqual({ risk: 'medium', reasons: ['Uses urgency'], what_to_do: ['Verify independently'] })
  })

  it('rejects extra keys and malformed lists', () => {
    expect(parseRiskAssessment({ risk: 'low', reasons: ['Fine'], what_to_do: ['Check'], extra: true })).toBeNull()
    expect(parseRiskAssessment({ risk: 'safe', reasons: ['Fine'], what_to_do: ['Check'] })).toBeNull()
    expect(parseRiskAssessment({ risk: 'low', reasons: [], what_to_do: ['Check'] })).toBeNull()
  })
})
