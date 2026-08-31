import type { ReactNode } from 'react'
import { Instrument_Serif, JetBrains_Mono, Newsreader } from 'next/font/google'
import './globals.css'

/**
 * Three faces, three jobs. Self-hosted at build time by next/font, so the display voice is
 * never a system fallback.
 *
 * Instrument Serif is the only face allowed to be large; Newsreader is the only face
 * allowed to run long; JetBrains Mono is reserved for what the machine produced or
 * measured — ids, timings, percentages, stage names.
 */
const display = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

const prose = Newsreader({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-prose',
  display: 'swap',
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata = {
  metadataBase: new URL('https://syntec-rag-eval.vercel.app'),
  title: 'syntec-rag-eval — recherche mesurée en droit du travail',
  description:
    "Un système de recherche sur le code du travail et la convention Syntec, mesuré sur 142 questions annotées : échecs de recherche et de génération comptés séparément. Démo publique.",
  openGraph: {
    title: 'syntec-rag-eval',
    description: 'Recherche mesurée en droit du travail français — le rapport, et une démo à interroger.',
    type: 'website',
  },
}

export const viewport = {
  themeColor: '#08080a',
  colorScheme: 'dark' as const,
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className={`${display.variable} ${prose.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
