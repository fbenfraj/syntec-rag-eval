import type { Metadata } from 'next'
import DemoPage from '@/app/components/DemoPage'
import { FR_DEMO } from '@/app/copy/fr'

export const metadata: Metadata = { title: FR_DEMO.title, description: FR_DEMO.metaDescription }

export default function Page() {
  return <DemoPage copy={FR_DEMO} />
}
