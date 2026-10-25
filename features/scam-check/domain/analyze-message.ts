export type RuleCode =
  | 'urgency'
  | 'credential_request'
  | 'bait'
  | 'shortened_link'
  | 'lookalike_domain'

export type RuleHit = {
  code: RuleCode
  label: string
  evidence: string
}

const urlPattern = /(?:https?:\/\/|www\.)[^\s<>"']+|(?:[a-z0-9-]+\.)+[a-z]{2,}(?:\/[^\s<>"']*)?/gi
const trailingPunctuation = /[),.!?:;]+$/
const shortenerHosts = new Set([
  'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'is.gd', 'cutt.ly', 'ow.ly', 'buff.ly', 'rb.gy', 'shorturl.at',
])
const officialBrandHosts = new Map([
  ['gcash', new Set(['gcash.com', 'www.gcash.com'])],
  ['maya', new Set(['maya.ph', 'www.maya.ph'])],
  ['bdo', new Set(['bdo.com.ph', 'www.bdo.com.ph'])],
])

const patterns: Array<{ code: RuleCode; label: string; pattern: RegExp; evidence: string }> = [
  { code: 'urgency', label: 'Urgency or threat', pattern: /\b(urgent|immediately|right now|act now|now|last chance|account will be closed|expire|suspend|karon|dali|dayon|karon dayon|agad|ngayon|kaagad|mapuputol)\b/i, evidence: 'Uses urgent or threatening language' },
  { code: 'credential_request', label: 'Credential request', pattern: /\b(otp|one[- ]time password|pin|password|passcode|security code|verification code|login details|send your code|share your otp|ibigay ang otp|ipadala ang pin)\b/i, evidence: 'Requests a secret code or account credential' },
  { code: 'bait', label: 'Prize, job, or fee bait', pattern: /\b(you won|winner|prize|reward|cash grant|free money|job offer|hired|parcel fee|delivery fee|customs fee|claim now|congratulations|nanalo|premyo|trabaho|bayad sa parcel|bayad sa delivery|gantimpala)\b/i, evidence: 'Uses prize, job, or parcel-fee bait' },
]

function normalizeCandidate(candidate: string) {
  return candidate.replace(trailingPunctuation, '').replace(/[)>]+$/, '')
}

function hostnameFor(value: string) {
  try {
    return new URL(value.startsWith('http') ? value : `https://${value}`).hostname.toLowerCase()
  } catch {
    return null
  }
}

function rootDomain(hostname: string) {
  const parts = hostname.split('.').filter(Boolean)
  return parts.length > 2 ? parts.slice(-2).join('.') : parts.join('.')
}

export function extractUrls(message: string): string[] {
  const urls = message.match(urlPattern)?.map(normalizeCandidate).filter(Boolean) ?? []
  return [...new Set(urls)]
}

export function analyzeMessage(message: string): RuleHit[] {
  const hits = patterns.filter(({ pattern }) => pattern.test(message)).map(({ code, label, evidence }) => ({ code, label, evidence }))
  const urls = extractUrls(message)

  if (urls.some((url) => {
    const hostname = hostnameFor(url)
    return hostname ? shortenerHosts.has(hostname) : false
  })) {
    hits.push({ code: 'shortened_link', label: 'Shortened link', evidence: 'Contains a link-shortener address' })
  }

  const lookalike = urls.find((url) => {
    const hostname = hostnameFor(url)
    if (!hostname) return false
    const domain = rootDomain(hostname)
    return [...officialBrandHosts].some(([brand, officialHosts]) => hostname.includes(brand) && !officialHosts.has(hostname) && domain !== brand)
  })
  if (lookalike) hits.push({ code: 'lookalike_domain', label: 'Lookalike domain', evidence: 'Uses a domain that imitates a known service' })

  return hits
}
