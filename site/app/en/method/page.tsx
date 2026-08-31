import type { Metadata } from 'next'
import MethodPage from '@/app/components/MethodPage'
import { EN_METHOD } from '@/app/copy/en'

export const metadata: Metadata = { title: EN_METHOD.title, description: EN_METHOD.metaDescription }

export default function Page() {
  return <MethodPage copy={EN_METHOD} />
}
