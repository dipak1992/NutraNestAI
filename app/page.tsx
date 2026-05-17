import dynamic from 'next/dynamic'
import { Nav } from '@/components/landing/Nav'
import { Hero } from '@/components/landing/Hero'
import { ProductProofStrip } from '@/components/landing/ProductProofStrip'
import { MobileStickyCTA } from '@/components/landing/MobileStickyCTA'
import { productSchema, softwareAppSchema, faqSchema } from '@/lib/schema'
import { productStory } from '@/lib/marketing/stats'

// Below-the-fold sections — lazy-loaded to reduce initial JS bundle
// SSR is kept so the HTML is still rendered server-side for SEO
const ConversionStory = dynamic(() => import('@/components/landing/ConversionStory').then(m => m.ConversionStory), { ssr: true })
const FounderNote = dynamic(() => import('@/components/landing/FounderNote').then(m => m.FounderNote), { ssr: true })
const FivePillarsSection = dynamic(() => import('@/components/landing/FivePillarsSection').then(m => m.FivePillarsSection), { ssr: true })
const AutopilotSection = dynamic(() => import('@/components/landing/AutopilotSection').then(m => m.AutopilotSection), { ssr: true })
const GroceryCommerceSection = dynamic(() => import('@/components/landing/GroceryCommerceSection').then(m => m.GroceryCommerceSection), { ssr: true })
const SocialProof = dynamic(() => import('@/components/landing/SocialProof').then(m => m.SocialProof), { ssr: true })
const ComparisonTable = dynamic(() => import('@/components/landing/ComparisonTable').then(m => m.ComparisonTable), { ssr: true })
const PricingTeaser = dynamic(() => import('@/components/landing/PricingTeaser').then(m => m.PricingTeaser), { ssr: true })
const FAQ = dynamic(() => import('@/components/landing/FAQ').then(m => m.FAQ), { ssr: true })
const FinalCTA = dynamic(() => import('@/components/landing/FinalCTA').then(m => m.FinalCTA), { ssr: true })
const Footer = dynamic(() => import('@/components/landing/Footer').then(m => m.Footer), { ssr: true })

// Revalidate every 30 minutes so the "Tonight's meal" rotates at 7am CT
// ISR ensures the page is regenerated after the meal day boundary
export const revalidate = 1800

export const metadata = {
  title: 'MealEase — Dinner Planned. Grocery List Built.',
  description: productStory,
  openGraph: {
    title: 'MealEase — Dinner Planned. Grocery List Built.',
    description: productStory,
    type: 'website',
  },
}

export default async function LandingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:bg-white focus:text-neutral-900 focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg focus:font-medium"
      >
        Skip to main content
      </a>

      <Nav />

      <main id="main-content">
        <Hero />
        <MobileStickyCTA />
        <ProductProofStrip />
        <ConversionStory />
        <FivePillarsSection />
        <AutopilotSection />
        <GroceryCommerceSection />
        <ComparisonTable />
        <SocialProof />
        <FounderNote />
        <PricingTeaser />
        <FAQ />
        <FinalCTA />
      </main>

      <Footer />
    </>
  )
}
