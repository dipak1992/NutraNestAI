import Link from 'next/link'
import { Nav } from '@/components/landing/Nav'
import { Footer } from '@/components/landing/Footer'
import { Container } from '@/components/landing/shared/Container'
import { FeatureHero } from '@/components/features/FeatureHero'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Budget Intelligence — Eat Well Without Overspending | MealEase',
  description:
    "See your weekly grocery total before you shop. Set a budget, stay under it, and save $100+ a month — without eating worse.",
  openGraph: {
    title: 'Budget Intelligence — Eat Well Without Overspending | MealEase',
    description:
      "See your weekly grocery total before you shop. Set a budget, stay under it, and save $100+ a month.",
    type: 'website',
  },
  alternates: { canonical: 'https://mealeaseai.com/features/budget-intelligence' },
}

const steps = [
  {
    n: '01',
    title: 'Set your weekly budget',
    body: 'Tell us how much you want to spend on groceries each week. We use this as a hard constraint when planning your meals.',
  },
  {
    n: '02',
    title: 'See plan and grocery costs',
    body: "Every meal plan and grocery list shows an estimated total. Swap expensive meals before they become an expensive cart.",
  },
  {
    n: '03',
    title: 'Update spend after cooking',
    body: 'When you mark dinner cooked, MealEase can update weekly spend and keep budget connected to real meals.',
  },
]

const benefits = [
  { icon: '💰', title: 'See costs upfront', body: 'Know your grocery total before you shop. No more surprise bills at checkout.' },
  { icon: '📊', title: 'Cooking updates the budget', body: 'Mark cooked can move estimated dinner cost into the weekly budget picture.' },
  { icon: '🔄', title: 'Budget-aware swaps', body: 'Swap any meal for a cheaper alternative that fits your remaining budget.' },
  { icon: '📉', title: 'Save $100+/month', body: 'Households using Budget Intelligence save an average of $100–$200/month on groceries.' },
  { icon: '🛒', title: 'Grocery list cost visibility', body: 'Consolidated ingredients, pantry deductions, and estimated prices help you shop intentionally.' },
  { icon: '📈', title: 'Monthly insights', body: 'See spending trends over time. Identify where your money goes and where to cut.' },
]

const relatedFeatures = [
  { href: '/features/weekly-autopilot', label: 'Weekly Autopilot', desc: 'Plan the whole week at once' },
  { href: '/features/leftovers-ai', label: 'Leftovers AI', desc: 'Reduce waste, save money' },
  { href: '/features/snap-and-cook', label: 'Snap & Cook', desc: "Cook what you already have" },
]

export default function BudgetIntelligencePage() {
  return (
    <>
      <Nav />
      <main id="main">
        <FeatureHero
          eyebrow="Budget Intelligence"
          title={<>Eat well. <span className="italic text-[#F3B18E]">Spend less.</span></>}
          description="See estimated costs from your plan and grocery list before you shop. When dinner is cooked, MealEase keeps the weekly budget picture moving."
          primaryHref="/signup"
          primaryLabel="Try free — no card needed"
          secondaryHref="/upgrade?feature=budget"
          secondaryLabel="Upgrade to Plus"
          note={<>Budget Intelligence is a Plus feature. <Link href="/pricing" className="text-[#FFD2BD] underline underline-offset-4">Compare plans →</Link></>}
          image="/landing/grocery.jpg"
          mobileImage="/mobile/family-mobile.jpg"
          mockup="budget"
        />

        {/* Problem → Solution */}
        <section className="py-16 md:py-20 bg-white">
          <Container>
            <div className="max-w-3xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="rounded-2xl bg-red-50 border border-red-100 p-7">
                  <p className="text-xs font-semibold uppercase tracking-widest text-red-400 mb-3">The problem</p>
                  <h2 className="font-serif text-2xl font-bold text-neutral-900 mb-3">Grocery bills are out of control</h2>
                  <p className="text-neutral-600 leading-relaxed">
                    The average American household spends $1,000/month on food — and most have no idea where it goes. Without visibility, you can&rsquo;t control it.
                  </p>
                </div>
                <div className="rounded-2xl bg-[#FDF6F1] border border-[#D97757]/20 p-7">
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#D97757] mb-3">The solution</p>
                  <h2 className="font-serif text-2xl font-bold text-neutral-900 mb-3">Costs stay connected to the plan</h2>
                  <p className="text-neutral-600 leading-relaxed">
                    Budget Intelligence uses the Planner, grocery list, and cooked meals together, so you can spot expensive weeks early and correct them with smarter swaps.
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
              <p className="text-lg text-neutral-600">Plan, shop, cook, and keep the budget visible.</p>
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
                Full financial visibility
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

        {/* Savings callout */}
        <section className="py-16 md:py-20 bg-neutral-900 text-white">
          <Container>
            <div className="max-w-3xl mx-auto">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                {[
                  { stat: '$127', label: 'Average monthly savings' },
                  { stat: '23%', label: 'Reduction in food waste' },
                  { stat: '4 min', label: 'Time to plan a week' },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl bg-neutral-800 border border-neutral-700 p-7">
                    <p className="font-serif text-5xl font-bold text-[#D97757] mb-2">{item.stat}</p>
                    <p className="text-neutral-400 text-sm">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* Plus-only callout */}
        <section className="py-16 md:py-20 bg-[#FDF6F1]">
          <Container>
            <div className="max-w-2xl mx-auto text-center">
              <span className="inline-block rounded-full bg-[#D97757]/20 border border-[#D97757]/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#D97757] mb-6">
                Plus Feature
              </span>
              <h2 className="font-serif text-4xl font-bold text-neutral-900 mb-4">
                Budget Intelligence is included in MealEase Plus
              </h2>
              <p className="text-neutral-600 text-lg mb-8">
                Unlock Budget Intelligence, Weekly Autopilot, Leftovers AI, and more — for less than a single takeout order per month.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/upgrade?feature=budget"
                  className="inline-flex items-center justify-center rounded-xl bg-[#D97757] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-[#D97757]/25 hover:bg-[#c4664a] transition-colors"
                >
                  Upgrade to Plus →
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center rounded-xl border border-neutral-300 bg-white px-8 py-3.5 text-base font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
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
              Know what dinner costs{' '}
              <span className="italic text-[#D97757]">before you shop.</span>
            </h2>
            <p className="text-neutral-400 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of households saving $100+ a month on groceries — without eating worse.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-xl bg-[#D97757] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-[#D97757]/25 hover:bg-[#c4664a] transition-colors"
              >
                Start free today
              </Link>
              <Link
                href="/upgrade?feature=budget"
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
