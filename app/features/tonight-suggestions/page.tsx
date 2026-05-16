import Link from 'next/link'
import { Nav } from '@/components/landing/Nav'
import { Footer } from '@/components/landing/Footer'
import { Container } from '@/components/landing/shared/Container'
import { FeatureHero } from '@/components/features/FeatureHero'
import { FeatureMotionSections } from '@/components/features/FeatureMotionSections'
import { ScrollReveal, StaggerGroup, HoverCard } from '@/components/motion'
import { Section } from '@/components/ui/Section'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Tonight Suggestions — What's for Dinner Tonight? | MealEase",
  description:
    "Stop staring at the fridge. MealEase gives you a personalized dinner suggestion in seconds — tailored to your household, preferences, and what you already have.",
  openGraph: {
    title: "Tonight Suggestions — What's for Dinner Tonight? | MealEase",
    description:
      "Stop staring at the fridge. MealEase gives you a personalized dinner suggestion in seconds.",
    type: 'website',
  },
  alternates: { canonical: 'https://mealeaseai.com/features/tonight-suggestions' },
}

const steps = [
  {
    n: '01',
    title: 'Open MealEase',
    body: 'No searching, no scrolling. Your personalized dinner suggestion is waiting on the dashboard the moment you open the app.',
  },
  {
    n: '02',
    title: 'See tonight\'s dinner',
    body: 'We factor in your household size, dietary preferences, what you cooked recently, and what\'s in your fridge to surface the perfect meal.',
  },
  {
    n: '03',
    title: 'Cook in under 30 minutes',
    body: 'Every suggestion comes with a step-by-step cook mode, ingredient list, and serving calculator. Dinner is done.',
  },
]

const benefits = [
  { icon: '⚡', title: 'Instant answer', body: 'No more "what should I make?" paralysis. One tap, one great dinner.' },
  { icon: '🧠', title: 'Connected intelligence', body: 'Tonight checks your weekly plan, avoids repeats, uses expiring leftovers, and respects your budget — all automatically.' },
  { icon: '🔄', title: 'Swap in one tap', body: "Not feeling it? Tap 'Show another' for a fresh suggestion instantly." },
  { icon: '🥗', title: 'Diet-aware', body: 'Vegetarian, gluten-free, keto, halal — every suggestion respects your restrictions.' },
  { icon: '⏱️', title: 'Under 30 minutes', body: 'Weeknight-friendly meals only. No 3-hour recipes on a Tuesday.' },
  { icon: '📅', title: 'Weekly plan aware', body: 'If you have a meal planned for today, Tonight suggests it. No conflicts between features.' },
]

const relatedFeatures = [
  { href: '/features/snap-and-cook', label: 'Snap & Cook', desc: "Use what's in your fridge" },
  { href: '/features/weekly-autopilot', label: 'Weekly Autopilot', desc: 'Plan the whole week at once' },
  { href: '/features/leftovers-ai', label: 'Leftovers AI', desc: 'Turn last night into tonight' },
]

export default function TonightSuggestionsPage() {
  return (
    <>
      <Nav />
      <main id="main">
        <FeatureHero
          eyebrow="Tonight Suggestions"
          title={<>&ldquo;What&rsquo;s for dinner?&rdquo; <span className="italic text-[#F3B18E]">Answered.</span></>}
          description="Stop staring at the fridge. MealEase gives you a personalized dinner suggestion in seconds — tailored to your household, your preferences, and what you already have."
          primaryHref="/signup"
          primaryLabel="Try free — no card needed"
          secondaryHref="/pricing"
          secondaryLabel="See pricing"
          mockup="tonight"
        />

        <FeatureMotionSections
          problemTitle="Decision fatigue is real"
          problemBody={"The average household spends 30+ minutes every evening deciding what to cook. That\u2019s 180+ hours a year lost to \u201cI don\u2019t know, what do you want?\u201d"}
          solutionTitle="One tap. One great dinner."
          solutionBody="MealEase surfaces the perfect dinner for your household the moment you open the app. No searching, no scrolling, no arguing."
          howItWorksSubtitle="Three steps. Dinner on the table."
          steps={steps}
          benefitsTitle="Why households love it"
          benefits={benefits}
          relatedFeatures={relatedFeatures}
          ctaTitle={<>Dinner, <span className="italic text-[#D97757]">decided.</span></>}
          ctaSubtitle="Get a dinner answer that fits what your household actually eats."
          ctaPrimaryHref="/signup"
          ctaPrimaryLabel="Start free today"
          ctaSecondaryHref="/upgrade"
          ctaSecondaryLabel="Upgrade to Plus"
        >
          {/* Free vs Plus */}
          <Section background="cream" padding="md">
            <Container>
              <ScrollReveal>
                <div className="max-w-3xl mx-auto">
                  <h2 className="font-serif text-3xl font-bold text-neutral-900 mb-8 text-center">Free vs Plus</h2>
                  <StaggerGroup className="grid md:grid-cols-2 gap-6" staggerDelay={0.15}>
                    <HoverCard className="rounded-2xl bg-white border border-neutral-200 p-7 shadow-subtle hover:shadow-medium transition-shadow">
                      <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-4">Free</p>
                      <ul className="space-y-3 text-sm text-neutral-700">
                        {['1 tonight suggestion per day', 'Step-by-step cook mode', 'Basic dietary filters', '3 recipe swaps per day'].map((f) => (
                          <li key={f} className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span>{f}</li>
                        ))}
                      </ul>
                    </HoverCard>
                    <HoverCard className="rounded-2xl bg-neutral-900 border border-[#D97757]/30 p-7 shadow-subtle hover:shadow-medium transition-shadow">
                      <p className="text-xs font-semibold uppercase tracking-widest text-[#D97757] mb-4">Plus</p>
                      <ul className="space-y-3 text-sm text-neutral-300">
                        {['Everything in Free', 'Unlimited swaps', 'AI learns your taste over time', 'Audio cook mode narration', 'Fridge-aware suggestions', 'Priority support'].map((f) => (
                          <li key={f} className="flex items-start gap-2"><span className="text-[#D97757] mt-0.5">✓</span>{f}</li>
                        ))}
                      </ul>
                      <Link
                        href="/upgrade"
                        className="mt-6 block text-center rounded-xl bg-[#D97757] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#c4664a] transition-colors"
                      >
                        Upgrade to Plus →
                      </Link>
                    </HoverCard>
                  </StaggerGroup>
                </div>
              </ScrollReveal>
            </Container>
          </Section>
        </FeatureMotionSections>
      </main>
      <Footer />
    </>
  )
}
