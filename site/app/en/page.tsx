import type { Metadata } from 'next'
import DemoPage from '@/app/components/DemoPage'
import { EN_DEMO } from '@/app/copy/en'

export const metadata: Metadata = { title: EN_DEMO.title, description: EN_DEMO.metaDescription }

export default function Page() {
  return <DemoPage copy={EN_DEMO} />
}
