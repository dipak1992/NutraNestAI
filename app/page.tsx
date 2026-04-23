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
      name: 'Is MealEase just another recipe app?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. MealEase is a meal decision engine that knows your household, energy level, and preferences. It tells you exactly what to make tonight — no scrolling, no decision fatigue.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does Household Memory work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Every time you cook, save, or skip a meal, MealEase learns your family\'s preferences. Over time, suggestions get sharper — like a sous chef who knows your household inside out.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is Weekly Autopilot?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'One tap, seven nights planned. Autopilot builds a full week of dinners tailored to your household with a smart grocery list. Sunday planning in under 60 seconds.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can MealEase help picky eaters?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. The Picky Eater tool suggests meals with high acceptance likelihood based on your child\'s texture tolerances, accepted flavors, and gentle ways to introduce new foods.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does MealEase work for couples and families?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Beautifully. Solo users get a streamlined experience. Couples get shared planning. Families get individual profiles for up to six members, conflict balancing, kids tools, and shared grocery lists.',
      },
    },
    {
      '@type': 'Question',
      name: 'What makes MealEase different from ChatGPT meal plans?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'ChatGPT gives a generic list and forgets you. MealEase remembers your household — allergies, preferences, what your toddler refused last Tuesday — and gets smarter every week.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is there a free version of MealEase?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. The free plan includes Tonight Dinner, up to three meal ideas daily, and basic grocery lists. All paid plans include a 7-day free trial.',
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
