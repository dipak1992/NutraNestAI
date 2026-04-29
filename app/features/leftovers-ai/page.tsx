import Link from 'next/link'
import { Nav } from '@/components/landing/Nav'
import { Footer } from '@/components/landing/Footer'
import { Container } from '@/components/landing/shared/Container'
import { FeatureHero } from '@/components/features/FeatureHero'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Leftovers AI — Turn Last Night Into Tonight | MealEase',
  description:
    "Cooked chicken last night? MealEase turns your leftovers into tacos, stir-fry, or a lunch salad — automatically. Stop throwing away food and money.",
  openGraph: {
    title: 'Leftovers AI — Turn Last Night Into Tonight | MealEase',
    description:
      "Cooked chicken last night? MealEase turns your leftovers into tacos, stir-fry, or a lunch salad — automatically.",
    type: 'website',
  },
  alternates: { canonical: 'https://mealeaseai.com/features/leftovers-ai' },
}

const steps = [
  {
    n: '01',
    title: 'Log what you cooked',
    body: "After dinner, tap 'Save as leftover' in MealEase. We track what you have, how much, and when it expires.",
  },
  {
    n: '02',
    title: 'Get transformation ideas',
    body: "Open Leftovers AI and we'll suggest 3 ways to transform your leftovers into a completely different meal. No repetition.",
  },
  {
    n: '03',
    title: 'Cook something new',
    body: 'Follow the recipe. Your leftover chicken becomes tacos. Your rice becomes fried rice. Nothing goes to waste.',
  },
]

const benefits = [
  { icon: '🍱', title: 'Zero food waste', body: 'Every leftover becomes an opportunity. Stop throwing away $1,500/year in food.' },
  { icon: '🔄', title: 'Never eat the same thing twice', body: 'We transform leftovers into completely different meals — not just reheated versions.' },
  { icon: '⏰', title: 'Expiry tracking', body: 'We track when your leftovers expire and remind you before they go bad.' },
  { icon: '💡', title: 'Creative suggestions', body: 'Chicken becomes tacos, stir-fry, salad, or soup. We find the best use for what you have.' },
  { icon: '💰', title: 'Save $100+/month', body: 'Using leftovers instead of buying new ingredients saves the average household $100–$150/month.' },
  { icon: '🧠', title: 'AI-powered', body: 'Our AI understands flavor profiles and cooking techniques to make transformations that actually taste good.' },
]

const relatedFeatures = [
  { href: '/features/snap-and-cook', label: 'Snap & Cook', desc: "Cook what's in your fridge now" },
  { href: '/features/tonight-suggestions', label: 'Tonight Suggestions', desc: 'Personalized dinner in one tap' },
  { href: '/features/budget-intelligence', label: 'Budget Intelligence', desc: 'See your weekly grocery cost' },
]

export default function LeftoversAIPage() {
  return (
    <>
      <Nav />
      <main id="main">
        <FeatureHero
          eyebrow="Leftovers AI"
          title={<>Turn last night into <span className="italic text-[#F3B18E]">tonight.</span></>}
          description="Cooked chicken last night? MealEase turns your leftovers into tacos, stir-fry, or a lunch salad — automatically. Stop throwing away food and money."
          primaryHref="/signup"
          primaryLabel="Try free — no card needed"
          secondaryHref="/upgrade"
          secondaryLabel="Upgrade to Plus"
          note={<>Leftovers AI is a Plus feature. <Link href="/pricing" className="text-[#FFD2BD] underline underline-offset-4">Compare plans →</Link></>}
          image="/landing/app-cooking.jpg"
          mobileImage="/mobile/date-night-mobile.jpg"
          mockup="leftovers"
        />

        {/* Problem → Solution */}
        <section className="py-16 md:py-20 bg-white">
          <Container>
            <div className="max-w-3xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="rounded-2xl bg-red-50 border border-red-100 p-7">
                  <p className="text-xs font-semibold uppercase tracking-widest text-red-400 mb-3">The problem</p>
                  <h2 className="font-serif text-2xl font-bold text-neutral-900 mb-3">Leftovers get thrown away</h2>
                  <p className="text-neutral-600 leading-relaxed">
                    The average American household throws away $1,500 in food every year. Most of it is leftovers that sat in the fridge for 3 days because nobody knew what to do with them.
                  </p>
                </div>
                <div className="rounded-2xl bg-[#FDF6F1] border border-[#D97757]/20 p-7">
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#D97757] mb-3">The solution</p>
                  <h2 className="font-serif text-2xl font-bold text-neutral-900 mb-3">AI that transforms, not reheats</h2>
                  <p className="text-neutral-600 leading-relaxed">
                    Leftovers AI doesn&rsquo;t just tell you to reheat last night&rsquo;s dinner. It transforms your ingredients into something completely new — so you actually want to eat it.
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* How it works */}
        <section className="py-16 md:py-24 bg-neutral-50">
          <Container>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="font-serif text-4xl font-bold tracking-tight text-neutral-900 mb-4">
                How it works
              </h2>
              <p className="text-lg text-neutral-600">Log it. Transform it. Eat it.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {steps.map((s) => (
                <div key={s.n} className="relative rounded-2xl bg-white border border-neutral-200 p-7 shadow-sm">
                  <span className="text-5xl font-bold text-[#D97757]/15 font-serif absolute top-5 right-6 select-none">{s.n}</span>
                  <h3 className="font-semibold text-lg text-neutral-900 mb-2">{s.title}</h3>
                  <p className="text-neutral-600 text-sm leading-relaxed">{s.body}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Benefits */}
        <section className="py-16 md:py-24 bg-white">
          <Container>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="font-serif text-4xl font-bold tracking-tight text-neutral-900 mb-4">
                Why it saves you money
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
              {benefits.map((b) => (
                <div key={b.title} className="rounded-2xl bg-neutral-50 border border-neutral-200 p-6">
                  <div className="text-3xl mb-3">{b.icon}</div>
                  <h3 className="font-semibold text-neutral-900 mb-1">{b.title}</h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">{b.body}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Plus-only callout */}
        <section className="py-16 md:py-20 bg-neutral-900 text-white">
          <Container>
            <div className="max-w-2xl mx-auto text-center">
              <span className="inline-block rounded-full bg-[#D97757]/20 border border-[#D97757]/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#D97757] mb-6">
                Plus Feature
              </span>
              <h2 className="font-serif text-4xl font-bold mb-4">
                Leftovers AI is included in MealEase Plus
              </h2>
              <p className="text-neutral-400 text-lg mb-8">
                Unlock Leftovers AI, Weekly Autopilot, Budget Intelligence, and more — for less than a single takeout order per month.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/upgrade"
                  className="inline-flex items-center justify-center rounded-xl bg-[#D97757] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-[#D97757]/25 hover:bg-[#c4664a] transition-colors"
                >
                  Upgrade to Plus →
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center rounded-xl border border-neutral-700 px-8 py-3.5 text-base font-semibold text-neutral-300 hover:border-neutral-500 hover:text-white transition-colors"
                >
                  Compare plans
                </Link>
              </div>
            </div>
          </Container>
        </section>

        {/* Related features */}
        <section className="py-16 md:py-20 bg-white">
          <Container>
            <div className="max-w-3xl mx-auto">
              <h2 className="font-serif text-3xl font-bold text-neutral-900 mb-8 text-center">Explore more features</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {relatedFeatures.map((f) => (
                  <Link
                    key={f.href}
                    href={f.href}
                    className="group rounded-2xl border border-neutral-200 bg-neutral-50 p-5 hover:border-[#D97757]/40 hover:bg-[#FDF6F1] transition-all"
                  >
                    <p className="font-semibold text-neutral-900 group-hover:text-[#D97757] transition-colors mb-1">{f.label}</p>
                    <p className="text-sm text-neutral-500">{f.desc}</p>
                  </Link>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-28 bg-neutral-950 text-white text-center">
          <Container>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">
              Stop wasting food.{' '}
              <span className="italic text-[#D97757]">Start saving money.</span>
            </h2>
            <p className="text-neutral-400 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of households who turned their leftovers problem into a superpower.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-xl bg-[#D97757] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-[#D97757]/25 hover:bg-[#c4664a] transition-colors"
              >
                Start free today
              </Link>
              <Link
                href="/upgrade"
                className="inline-flex items-center justify-center rounded-xl border border-neutral-700 px-8 py-3.5 text-base font-semibold text-neutral-300 hover:border-neutral-500 hover:text-white transition-colors"
              >
                Upgrade to Plus
              </Link>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  )
}
