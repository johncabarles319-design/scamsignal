import { describe, expect, it } from 'vitest'
import { analyzeMessage, extractUrls } from './analyze-message'

describe('extractUrls', () => {
  it('extracts a URL and trims sentence punctuation', () => {
    expect(extractUrls('Check https://gcash-verify.xyz/login.')).toEqual(['https://gcash-verify.xyz/login'])
  })

  it('deduplicates links without fetching them', () => {
    expect(extractUrls('bit.ly/a and bit.ly/a')).toEqual(['bit.ly/a'])
  })
})

describe('analyzeMessage', () => {
  it('flags credential requests and a lookalike GCash host', () => {
    const hits = analyzeMessage('GCash: send your OTP at https://gcash-verify.xyz now!')
    expect(hits.map(({ code }) => code)).toEqual(expect.arrayContaining(['credential_request', 'lookalike_domain', 'urgency']))
  })

  it('flags prize and parcel-fee bait plus a shortener', () => {
    const hits = analyzeMessage('You won a prize! Pay parcel fee at bit.ly/claim')
    expect(hits.map(({ code }) => code)).toEqual(expect.arrayContaining(['bait', 'shortened_link']))
  })

  it('does not create hits for ordinary text', () => {
    expect(analyzeMessage('See you at lunch tomorrow.')).toEqual([])
  })
})
