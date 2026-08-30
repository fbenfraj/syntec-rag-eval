import type { ReactNode } from 'react'
import './globals.css'

export const metadata = {
  title: 'syntec-rag-eval — recherche mesurée en droit du travail',
  description:
    "Un système de recherche sur le code du travail et la convention Syntec, mesuré sur 142 questions annotées : échecs de recherche et de génération comptés séparément.",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
