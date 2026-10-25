import type { Language, Risk } from '../domain/result-schema'

export type LocaleCopy = {
  languageName: string
  title: string
  description: string
  messageLabel: string
  placeholder: string
  privacyNote: string
  submit: string
  pending: string
  clear: string
  characterCount: string
  riskHeading: string
  reasonsHeading: string
  actionsHeading: string
  checksHeading: string
  checks: string[]
  errorHeading: string
  retry: string
  footerDisclaimer: string
  riskLabels: Record<Risk, string>
}

const copy: Record<Language, LocaleCopy> = {
  en: {
    languageName: 'English', title: 'Pause before you trust the message.', description: 'Paste a suspicious text, link, or payment request. ScamSignal helps you spot pressure tactics before you click, reply, or send money.', messageLabel: 'Message to check', placeholder: 'Paste the full message here — include the link, sender name, or payment details if they are present.', privacyNote: 'We only use this text to create your assessment. Never paste passwords or one-time codes.', submit: 'Check this message', pending: 'Checking signal…', clear: 'Clear', characterCount: '{count}/5,000', riskHeading: 'Risk signal', reasonsHeading: 'Why it was flagged', actionsHeading: 'What to do next', checksHeading: 'Signals we look for', checks: ['Urgency and threats', 'Requests for OTPs or PINs', 'Prize, job, parcel-fee bait'], errorHeading: 'The check could not finish', retry: 'Try again', footerDisclaimer: 'This is a helper, not a guarantee.', riskLabels: { low: 'Low risk', medium: 'Needs caution', high: 'High risk' },
  },
  fil: {
    languageName: 'Filipino', title: 'Huminto muna bago magtiwala.', description: 'I-paste ang kahina-hinalang text, link, o payment request. Tinutulungan ka ng ScamSignal na makita ang pressure tactics bago mag-click o magpadala ng pera.', messageLabel: 'Mensahe na susuriin', placeholder: 'I-paste dito ang buong mensahe — isama ang link, sender name, o payment details kung mayroon.', privacyNote: 'Gagamitin lang ang text para sa assessment. Huwag mag-paste ng password o one-time code.', submit: 'Suriin ang mensahe', pending: 'Sinusuri ang signal…', clear: 'I-clear', characterCount: '{count}/5,000', riskHeading: 'Risk signal', reasonsHeading: 'Bakit na-flag', actionsHeading: 'Ano ang susunod na gawin', checksHeading: 'Mga signal na hinahanap', checks: ['Urgency at pagbabanta', 'Hingi ng OTP o PIN', 'Premyo, trabaho, o parcel-fee bait'], errorHeading: 'Hindi natapos ang check', retry: 'Subukan ulit', footerDisclaimer: 'This is a helper, not a guarantee.', riskLabels: { low: 'Mababang risk', medium: 'Mag-ingat', high: 'Mataas na risk' },
  },
  ceb: {
    languageName: 'Bisaya', title: 'Hunong sa kadiyot sa dili pa mosalig.', description: 'I-paste ang kadudahang mensahe, link, o payment request. Motabang ang ScamSignal nga makita ang pressure tactics sa dili pa mo-click o mopadala og kwarta.', messageLabel: 'Mensahe nga susihon', placeholder: 'I-paste ang tibuok mensahe dinhi — apila ang link, sender name, o payment details kung naa.', privacyNote: 'Gamita lang namo ang text para sa assessment. Ayaw i-paste ang password o one-time code.', submit: 'Susihi ang mensahe', pending: 'Gisusi ang signal…', clear: 'Limpyohi', characterCount: '{count}/5,000', riskHeading: 'Risk signal', reasonsHeading: 'Nganong na-flag', actionsHeading: 'Unsa ang buhaton sunod', checksHeading: 'Mga signal nga among pangitaon', checks: ['Urgency ug hulga', 'Pangayo og OTP o PIN', 'Premyo, trabaho, o parcel-fee bait'], errorHeading: 'Wala mahuman ang check', retry: 'Sulayi pag-usab', footerDisclaimer: 'This is a helper, not a guarantee.', riskLabels: { low: 'Ubos nga risk', medium: 'Pag-amping', high: 'Ta-as nga risk' },
  },
}

export function getCopy(language: Language): LocaleCopy {
  return copy[language]
}
