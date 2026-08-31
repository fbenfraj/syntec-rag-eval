import type { ReactNode } from 'react'
import { Archivo, JetBrains_Mono, Spectral } from 'next/font/google'
import './globals.css'

/**
 * Spectral was commissioned through a French type foundry and reads like the body of a
 * legal text, which is exactly what it is asked to set here: headings, answers, and the
 * articles themselves. Archivo carries the interface. The mono appears only on corpus
 * identifiers, where a fixed width is the point.
 *
 * Marianne, the State's own typeface, is deliberately absent: it belongs to public
 * services, and this is not one.
 */
const serif = Spectral({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
})

const ui = Archivo({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ui',
  display: 'swap',
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata = {
  metadataBase: new URL('https://syntec-rag-eval.vercel.app'),
  title: 'Le Bon Article',
  description:
    'Posez une question de droit du travail : la réponse, l’article qui la fonde, et sa date d’entrée en vigueur. Démonstration technique FrajTech.',
}

export const viewport = {
  themeColor: '#17265e',
  colorScheme: 'light' as const,
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className={`${serif.variable} ${ui.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
