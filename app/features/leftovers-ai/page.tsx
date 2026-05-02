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
    title: 'Mark dinner cooked',
    body: "After dinner, tap 'Mark cooked'. MealEase can create leftovers, update budget, and start tomorrow's lunch idea.",
  },
  {
    n: '02',
    title: 'Track what remains',
    body: "Tell MealEase how many servings are left. We remember what you have, how much, and when it should be used.",
  },
  {
    n: '03',
    title: 'Turn it into the next meal',
    body: 'Your leftover chicken becomes tacos, stir-fry, or lunch salad. Your budget and planner stay aware of what got used.',
  },
]

const benefits = [
  { icon: '🍱', title: 'Zero food waste', body: 'Every leftover becomes an opportunity. Stop throwing away $1,500/year in food.' },
  { icon: '🔄', title: 'Never eat the same thing twice', body: 'We transform leftovers into completely different meals — not just reheated versions.' },
  { icon: '⏰', title: 'Expiry tracking', body: 'We track when your leftovers expire and remind you before they go bad.' },
  { icon: '💡', title: 'Creative suggestions', body: 'Chicken becomes tacos, stir-fry, salad, or soup. We find the best use for what you have.' },
  { icon: '💰', title: 'Budget stays aware', body: 'Mark cooked can update weekly spend and show how leftovers reduce future grocery needs.' },
  { icon: '🧠', title: 'MealEase remembers', body: 'The meals you finish, repeat, or skip make future leftover ideas more personal.' },
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
          description="Mark dinner cooked, track what remains, update your budget, and turn leftovers into tomorrow's lunch or a fresh dinner idea."
          primaryHref="/signup"
          primaryLabel="Try free — no card needed"
          secondaryHref="/upgrade?feature=leftovers"
          secondaryLabel="Upgrade to Plus"
          note={<>Leftovers AI is a Plus feature. <Link href="/pricing" className="text-[#FFD2BD] underline underline-offset-4">Compare plans →</Link></>}
          image="/features/leftovers-hero.jpg"
          mobileImage="/features/leftovers-hero-mobile.jpg"
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
                  <h2 className="font-serif text-2xl font-bold text-neutral-900 mb-3">Mark cooked starts the leftover loop</h2>
                  <p className="text-neutral-600 leading-relaxed">
                    Leftovers AI starts when dinner is done. MealEase logs what remains, keeps budget aware, and turns extra servings into something you actually want next.
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
              <p className="text-lg text-neutral-600">Mark cooked. Track leftovers. Make tomorrow easier.</p>
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
                  href="/upgrade?feature=leftovers"
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
                href="/upgrade?feature=leftovers"
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
