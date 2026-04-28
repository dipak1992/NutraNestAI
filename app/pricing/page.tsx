import { Nav } from '@/components/landing/Nav'
import { PricingContent } from '@/components/pricing/PricingContent'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing — MealEase',
  description: 'Simple, honest pricing. Free and Plus plans for every household.',
}

export default async function PricingPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-white dark:bg-neutral-950">
        <PricingContent />
      </main>
    </>
  )
}
