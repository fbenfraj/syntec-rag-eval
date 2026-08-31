import { Archivo, JetBrains_Mono, Spectral } from 'next/font/google'

/**
 * Shared by both root layouts.
 *
 * Spectral was commissioned through a French foundry and sets law the way law is set:
 * headings, the answer, and the article extracts. Archivo carries the interface. The mono
 * appears only on corpus identifiers, where a fixed width is the point.
 *
 * Marianne, the State's own typeface, is deliberately absent: it belongs to public
 * services, and this is not one.
 */
export const serif = Spectral({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
})

export const ui = Archivo({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ui',
  display: 'swap',
})

export const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

export const fontClass = `${serif.variable} ${ui.variable} ${mono.variable}`

export const viewport = {
  themeColor: '#17265e',
  colorScheme: 'light' as const,
}
