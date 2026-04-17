import { PublicSiteHeader } from '@/components/layout/PublicSiteHeader'
import { PublicSiteFooter } from '@/components/layout/PublicSiteFooter'
import { StickyMobileCta } from '@/components/landing/StickyMobileCta'
import { LandingHero } from '@/components/landing/LandingHero'
import { LandingPain } from '@/components/landing/LandingPain'
import { LandingHowItWorks } from '@/components/landing/LandingHowItWorks'
import { LandingFeatures } from '@/components/landing/LandingFeatures'
import { LandingSmartAI } from '@/components/landing/LandingSmartAI'
import { LandingBeforeAfter } from '@/components/landing/LandingBeforeAfter'
import { LandingTestimonials } from '@/components/landing/LandingTestimonials'
import { LandingPricing } from '@/components/landing/LandingPricing'
import { LandingFinalCTA } from '@/components/landing/LandingFinalCTA'
import { Heart } from 'lucide-react'


/* ─────────────────────── DISCLAIMER ─────────────────────── */
function FriendlyDisclaimer() {
  return (
    <section className="py-10 border-t border-border/60 bg-background">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
        <div className="inline-flex items-center gap-2 text-muted-foreground mb-3">
          <Heart className="h-4 w-4 text-rose-400" aria-hidden="true" />
          <span className="text-base font-semibold">A note from our team</span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          MealEase is a meal planning assistant — not a substitute for a medical professional or registered dietitian.
          Our built-in safety rules are designed to help reduce risk, but they are not a guarantee.
          Always consult your pediatrician or healthcare provider for specific dietary guidance, especially for infants,
          children with health conditions, or during pregnancy. When you are unsure, please ask your doctor first.
        </p>
      </div>
    </section>
  )
}

/* ─────────────────────── PAGE ─────────────────────── */
export default function LandingPage() {
  return (
    <>
      <PublicSiteHeader />
      <main>
        <LandingHero />
        <LandingPain />
        <LandingHowItWorks />
        <LandingFeatures />
        <LandingSmartAI />
        <LandingBeforeAfter />
        <LandingTestimonials />
        <LandingPricing />
        <LandingFinalCTA />
        <FriendlyDisclaimer />
      </main>
      <StickyMobileCta />
      <PublicSiteFooter />
    </>
  )
}
