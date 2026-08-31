import type { ReactNode } from 'react'
import { fontClass, viewport as sharedViewport } from '@/app/fonts'
import '../globals.css'

/**
 * Root layout for the French routes.
 *
 * Two root layouts rather than one, because `lang` belongs on `<html>` and a single shared
 * layout can only declare one language. Serving the English pages under `lang="fr"` is a
 * WCAG 3.1.1 failure and makes a screen reader read English copy in a French voice.
 */
export const metadata = {
  metadataBase: new URL('https://syntec-rag-eval.vercel.app'),
  title: 'Le Bon Article',
  description:
    'Posez une question de droit du travail : la réponse, l’article qui la fonde, et sa date d’entrée en vigueur. Démonstration technique FrajTech.',
  alternates: { canonical: '/', languages: { fr: '/', en: '/en' } },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'Le Bon Article',
    title: 'Le Bon Article',
    description: 'La réponse, et l’article de loi qui la fonde. Démonstration technique FrajTech.',
    images: ['/og.png'],
  },
}

export const viewport = sharedViewport

export default function FrenchLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className={fontClass}>
      <body>{children}</body>
    </html>
  )
}
