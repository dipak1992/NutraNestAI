import { Nav } from '@/components/landing/Nav'
import { PricingContent } from '@/components/pricing/PricingContent'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing — MealEase',
  description: 'Simple, honest pricing. Free includes basic Copilot meal assists; Plus unlocks weekly briefings, voice, weekly instructions, memory, proactive nudges, plan refinements, budget swaps, leftover monitoring, and grocery actions.',
  alternates: {
    canonical: '/pricing',
  },
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
