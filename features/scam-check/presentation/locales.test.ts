import { describe, expect, it } from 'vitest'
import { getCopy } from './locales'

describe('locales', () => {
  it('provides complete copy for every supported language', () => {
    for (const language of ['en', 'fil', 'ceb'] as const) {
      const localized = getCopy(language)
      expect(localized.title).toBeTruthy()
      expect(localized.submit).toBeTruthy()
      expect(localized.footerDisclaimer).toBe('This is a helper, not a guarantee.')
      expect(localized.riskLabels.low).toBeTruthy()
      expect(localized.riskLabels.medium).toBeTruthy()
      expect(localized.riskLabels.high).toBeTruthy()
    }
  })
})
