import { Nav } from '@/components/landing/Nav'
import { Hero } from '@/components/landing/Hero'
import { ProductProofStrip } from '@/components/landing/ProductProofStrip'
import { ProofAssetsSection } from '@/components/landing/ProofAssetsSection'
import { ConversionStory } from '@/components/landing/ConversionStory'
import { FounderNote } from '@/components/landing/FounderNote'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { FivePillarsSection } from '@/components/landing/FivePillarsSection'
import { AutopilotSection } from '@/components/landing/AutopilotSection'
import { GroceryCommerceSection } from '@/components/landing/GroceryCommerceSection'
import { ConnectedSystem } from '@/components/landing/ConnectedSystem'
import { SocialProof } from '@/components/landing/SocialProof'
import { ComparisonTable } from '@/components/landing/ComparisonTable'
import { PricingTeaser } from '@/components/landing/PricingTeaser'
import { FAQ } from '@/components/landing/FAQ'
import { FinalCTA } from '@/components/landing/FinalCTA'
import { Footer } from '@/components/landing/Footer'
import { productSchema, softwareAppSchema, faqSchema } from '@/lib/schema'
import { productStory } from '@/lib/marketing/stats'

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
        <ProductProofStrip />
        <ProofAssetsSection />
        <ConversionStory />
        <FounderNote />
        <HowItWorks />
        <FivePillarsSection />
        <AutopilotSection />
        <GroceryCommerceSection />
        <ConnectedSystem />
        <ComparisonTable />
        <SocialProof />
        <PricingTeaser />
        <FAQ />
        <FinalCTA />
      </main>

      <Footer />
    </>
  )
}
