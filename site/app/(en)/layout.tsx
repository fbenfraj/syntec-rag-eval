import type { ReactNode } from 'react'
import { fontClass, viewport as sharedViewport } from '@/app/fonts'
import '../globals.css'
import { Analytics } from '@/app/components/Analytics'

/** Root layout for the English routes. See the French one for why there are two. */
export const metadata = {
  metadataBase: new URL('https://syntec-rag-eval.vercel.app'),
  title: 'Le Bon Article',
  description:
    'Ask a French labour-law question: the answer, the article it rests on, and the date it applies from. A FrajTech technical demonstration.',
  alternates: { canonical: '/en', languages: { fr: '/', en: '/en' } },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName: 'Le Bon Article',
    title: 'Le Bon Article',
    description: 'The answer, and the article of law it rests on. A FrajTech technical demonstration.',
    images: ['/og.png'],
  },
}

export const viewport = sharedViewport

export default function EnglishLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={fontClass}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
