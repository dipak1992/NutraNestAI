import { PublicSiteHeader } from '@/components/layout/PublicSiteHeader'
import { PublicSiteFooter } from '@/components/layout/PublicSiteFooter'
import { PricingContent } from '@/components/pricing/PricingContent'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Pricing',
  description:
    'Your whole week of dinners, decided before Monday morning. MealEase Pro: full 7-day plan, smart grocery list, and family meal adaptations for less than one takeout dinner.',
  path: '/pricing',
  keywords: ['MealEase pricing', 'family meal planning app pricing', 'meal planning subscription', 'weekly meal plan free trial'],
})

export default function PricingPage() {
  return (
    <>
      <PublicSiteHeader />
      <main className="min-h-screen gradient-cream">
        <PricingContent />
      </main>
      <PublicSiteFooter />
    </>
  )
}
