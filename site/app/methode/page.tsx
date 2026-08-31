import type { Metadata } from 'next'
import MethodPage from '@/app/components/MethodPage'
import { FR_METHOD } from '@/app/copy/fr'

export const metadata: Metadata = { title: FR_METHOD.title, description: FR_METHOD.metaDescription }

export default function Page() {
  return <MethodPage copy={FR_METHOD} />
}
