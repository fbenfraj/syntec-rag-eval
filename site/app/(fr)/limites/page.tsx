import type { Metadata } from 'next'
import LimitsPage from '@/app/components/LimitsPage'
import { FR_LIMITS } from '@/app/copy/fr'

export const metadata: Metadata = { title: FR_LIMITS.title, description: FR_LIMITS.metaDescription }

export default function Page() {
  return <LimitsPage copy={FR_LIMITS} />
}
