import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ScamSignal — Pause before you trust the message',
  description: 'A helper for checking suspicious SMS, links, and wallet messages.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
