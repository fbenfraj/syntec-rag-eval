import type { Metadata } from 'next'
import Surface from '@/app/components/Surface'
import { EN } from '@/app/copy/en'

export const metadata: Metadata = {
  title: 'syntec-rag-eval — measured retrieval over French labour law',
  description:
    'A retrieval system over the French labour code and the Syntec agreement, measured on 142 labelled questions: retrieval failure and generation failure counted separately. Public demo.',
}

export default function Page() {
  return <Surface copy={EN} />
}
