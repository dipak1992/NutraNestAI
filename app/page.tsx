import { PublicSiteHeader } from '@/components/layout/PublicSiteHeader'
import { PublicSiteFooter } from '@/components/layout/PublicSiteFooter'
import { StickyMobileCta } from '@/components/landing/StickyMobileCta'
import { LandingHero } from '@/components/landing/LandingHero'
import { LandingOutcomes } from '@/components/landing/LandingOutcomes'
import { LandingProductProof } from '@/components/landing/LandingProductProof'
import { LandingEmotionalStory } from '@/components/landing/LandingEmotionalStory'
import { LandingTestimonials } from '@/components/landing/LandingTestimonials'
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

/* ─────────────────────── FAQ JSON-LD ─────────────────────── */
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is MealEase?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'MealEase is an AI-powered meal planning assistant that helps busy families decide what to cook each night based on their dietary needs, preferences, and schedule.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does MealEase work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Tell MealEase about your household — ages, allergies, and preferences — and it generates a personalized weekly meal plan with recipes, grocery lists, and step-by-step instructions.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is MealEase free to use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'MealEase offers a free tier that lets you generate up to 5 meals per week. Paid plans unlock unlimited meals, advanced dietary filters, and more.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does MealEase handle food allergies?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. You can specify allergies and intolerances for each household member and MealEase will exclude those ingredients from every suggested meal.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can MealEase plan meals for toddlers and babies?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely. MealEase includes age-appropriate safety rules and portion guidance so the whole family — including little ones — can eat together.',
      },
    },
  ],
}

/* ─────────────────────── PAGE ─────────────────────── */
export default function LandingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <PublicSiteHeader />
      <main>
        <LandingHero />
        <LandingOutcomes />
        <LandingProductProof />
        <LandingEmotionalStory />
        <LandingTestimonials />
        <LandingFinalCTA />
        <FriendlyDisclaimer />
      </main>
      <StickyMobileCta />
      <PublicSiteFooter />
    </>
  )
}
