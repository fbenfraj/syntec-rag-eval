import type { Metadata } from 'next'
import LimitsPage from '@/app/components/LimitsPage'
import { EN_LIMITS } from '@/app/copy/en'

export const metadata: Metadata = { title: EN_LIMITS.title, description: EN_LIMITS.metaDescription }

export default function Page() {
  return <LimitsPage copy={EN_LIMITS} />
}
