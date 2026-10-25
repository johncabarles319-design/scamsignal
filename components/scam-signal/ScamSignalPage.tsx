'use client'

import { FormEvent, useMemo, useState } from 'react'
import { getCopy } from '../../features/scam-check/presentation/locales'
import { type Language, type Risk, type RiskAssessment } from '../../features/scam-check/domain/result-schema'

const languageOptions: Array<{ value: Language; label: string }> = [
  { value: 'en', label: 'English' },
  { value: 'fil', label: 'Filipino' },
  { value: 'ceb', label: 'Bisaya' },
]

const riskClass: Record<Risk, string> = { low: 'risk-low', medium: 'risk-medium', high: 'risk-high' }

function SignalMark() {
  return <span aria-hidden="true" className="signal-mark"><span /><span /><span /></span>
}

function ArrowIcon() {
  return <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 16 16" fill="none"><path d="M3 8h9m0 0-3.5-3.5M12 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

function ShieldIcon() {
  return <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none"><path d="M12 3.5 19 6v5.2c0 4.7-2.9 7.8-7 9.3-4.1-1.5-7-4.6-7-9.3V6l7-2.5Z" stroke="currentColor" strokeWidth="1.5" /><path d="m8.8 12 2.1 2.1 4.4-4.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

function AlertIcon() {
  return <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 16 16" fill="none"><path d="M8 2.2 14 13H2L8 2.2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /><path d="M8 5.5v3.2M8 11.2v.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
}

export default function ScamSignalPage() {
  const [language, setLanguage] = useState<Language>('en')
  const [message, setMessage] = useState('')
  const [assessment, setAssessment] = useState<RiskAssessment | null>(null)
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const copy = useMemo(() => getCopy(language), [language])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError('')
    setAssessment(null)
    try {
      const response = await fetch('/api/check', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ message, language }) })
      const body = await response.json() as RiskAssessment | { error?: { message?: string } }
      if (!response.ok) throw new Error('error' in body ? body.error?.message : undefined)
      setAssessment(body as RiskAssessment)
    } catch (requestError) {
      setError(requestError instanceof Error && requestError.message ? requestError.message : 'Something went wrong. Please try again.')
    } finally {
      setPending(false)
    }
  }

  function clearMessage() {
    setMessage('')
    setAssessment(null)
    setError('')
  }

  return (
    <main className="site-shell">
      <div className="scan-line" aria-hidden="true" />
      <header className="site-header page-wrap"><a className="brand" href="#top" aria-label="ScamSignal home"><SignalMark /><span>ScamSignal</span></a><div className="header-meta"><span className="status-dot" aria-hidden="true" /><span>Built for safer decisions</span></div></header>

      <section id="top" className="hero page-wrap">
        <div className="hero-copy"><p className="hero-label"><span>01</span> Message intelligence</p><h1>{copy.title}</h1><p className="hero-description">{copy.description}</p><div className="trust-note"><ShieldIcon /><span>{copy.privacyNote}</span></div></div>
        <div className="checker-column">
          <form className="checker-form" onSubmit={handleSubmit}>
            <div className="form-topline"><label htmlFor="message">{copy.messageLabel}</label><label className="language-picker"><span className="sr-only">Response language</span><select value={language} onChange={(event) => setLanguage(event.target.value as Language)}>{languageOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label></div>
            <div className="textarea-wrap"><textarea id="message" value={message} onChange={(event) => setMessage(event.target.value.slice(0, 5000))} placeholder={copy.placeholder} maxLength={5000} /><div className="textarea-footer"><span>{copy.characterCount.replace('{count}', message.length.toLocaleString())}</span>{message && <button type="button" className="clear-button" onClick={clearMessage}>{copy.clear}</button>}</div></div>
            <button className="submit-button" type="submit" disabled={pending || !message.trim()}><span>{pending ? copy.pending : copy.submit}</span>{!pending && <ArrowIcon />}</button>
          </form>

          {error && <div className="error-panel" role="alert"><AlertIcon /><div><strong>{copy.errorHeading}</strong><p>{error}</p></div><button type="button" onClick={() => void handleSubmit({ preventDefault() {} } as FormEvent<HTMLFormElement>)}>{copy.retry}</button></div>}
          {assessment && <section className={`assessment ${riskClass[assessment.risk]}`} aria-live="polite" aria-labelledby="assessment-heading"><div className="assessment-header"><div><p className="result-label">{copy.riskHeading}</p><h2 id="assessment-heading">{copy.riskLabels[assessment.risk]}</h2></div><div className="risk-pulse" aria-hidden="true"><span /></div></div><div className="assessment-body"><div><h3>{copy.reasonsHeading}</h3><ul>{assessment.reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul></div><div><h3>{copy.actionsHeading}</h3><ul>{assessment.what_to_do.map((action) => <li key={action}>{action}</li>)}</ul></div></div></section>}
        </div>
      </section>

      <section className="checks-section page-wrap" aria-labelledby="checks-heading"><div className="checks-heading"><p className="hero-label"><span>02</span> Signal scan</p><h2 id="checks-heading">{copy.checksHeading}</h2></div><ul className="checks-list">{copy.checks.map((item, index) => <li key={item}><span>0{index + 1}</span>{item}</li>)}</ul></section>
      <footer className="site-footer page-wrap"><span>SCAMSIGNAL / 2026</span><span>{copy.footerDisclaimer}</span></footer>
    </main>
  )
}
