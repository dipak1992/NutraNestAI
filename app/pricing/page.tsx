import { createClient } from '@/lib/supabase/server'
import { PublicSiteHeader } from '@/components/layout/PublicSiteHeader'
import { PricingContent } from '@/components/pricing/PricingContent'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing — MealEase',
  description: 'Simple, honest pricing. Free and Plus plans for every household.',
}

export default async function PricingPage() {
  return (
    <>
      <PublicSiteHeader />
      <main className="min-h-screen bg-background">
        <PricingContent />
      </main>
    </>
  )
}
