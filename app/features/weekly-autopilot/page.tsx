import Link from 'next/link'
import { Nav } from '@/components/landing/Nav'
import { Footer } from '@/components/landing/Footer'
import { Container } from '@/components/landing/shared/Container'
import { FeatureHero } from '@/components/features/FeatureHero'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Weekly Autopilot — Your Whole Week of Dinners, Planned in One Tap | MealEase',
  description:
    'Stop planning meals from scratch every week. MealEase Autopilot generates a full 7-day dinner plan based on your household, preferences, and budget — in one tap.',
  openGraph: {
    title: 'Weekly Autopilot — Your Whole Week of Dinners, Planned in One Tap | MealEase',
    description:
      'Stop planning meals from scratch every week. MealEase Autopilot generates a full 7-day dinner plan in one tap.',
    type: 'website',
  },
  alternates: { canonical: 'https://mealeaseai.com/features/weekly-autopilot' },
}

const steps = [
  {
    n: '01',
    title: 'Set your preferences once',
    body: 'Tell us your household size, dietary restrictions, budget, and a few foods you love. Takes 2 minutes. Never again.',
  },
  {
    n: '02',
    title: 'Tap "Generate Week"',
    body: 'One tap. Seven dinners planned. We balance variety, nutrition, budget, and your household\'s taste profile automatically.',
  },
  {
    n: '03',
    title: 'Cook, swap, or export',
    body: 'Follow the plan, swap any meal you don\'t want, or export the full grocery list to Instacart, Amazon Fresh, or Walmart.',
  },
]

const benefits = [
  { icon: '📅', title: 'Full week in one tap', body: 'Seven dinners planned instantly. No spreadsheets, no Pinterest boards.' },
  { icon: '💰', title: 'Budget-aware planning', body: 'Set a weekly budget. We plan meals that stay under it — automatically.' },
  { icon: '🔄', title: 'Swap any meal', body: "Don't like Monday's dinner? Swap it. The rest of the week stays intact." },
  { icon: '🛒', title: 'Auto grocery list', body: 'Every ingredient for every meal, consolidated into one smart shopping list.' },
  { icon: '🧬', title: 'Learns over time', body: 'The more you use it, the better it gets. Ratings and swaps teach it your taste.' },
  { icon: '👨‍👩‍👧', title: 'Household-aware', body: 'Plans for 1 person or 8. Adjusts servings, portions, and variety accordingly.' },
]

const relatedFeatures = [
  { href: '/features/tonight-suggestions', label: 'Tonight Suggestions', desc: 'Just need dinner tonight?' },
  { href: '/features/budget-intelligence', label: 'Budget Intelligence', desc: 'See your weekly grocery cost' },
  { href: '/features/snap-and-cook', label: 'Snap & Cook', desc: "Cook what's already in your fridge" },
]

export default function WeeklyAutopilotPage() {
  return (
    <>
      <Nav />
      <main id="main">
        <FeatureHero
          eyebrow="Weekly Autopilot"
          title={<>Seven dinners. <span className="italic text-[#F3B18E]">One tap.</span></>}
          description="Stop planning meals from scratch every week. MealEase Autopilot generates a full 7-day dinner plan based on your household, preferences, and budget — instantly."
          primaryHref="/signup"
          primaryLabel="Try free — no card needed"
          secondaryHref="/upgrade"
          secondaryLabel="Upgrade to Plus"
          note={<>Weekly Autopilot is a Plus feature. <Link href="/pricing" className="text-[#FFD2BD] underline underline-offset-4">Compare plans →</Link></>}
          image="/landing/family-dinner.jpg"
          mobileImage="/mobile/family-mobile.jpg"
          mockup="weekly"
        />

        {/* Problem → Solution */}
        <section className="py-16 md:py-20 bg-white">
          <Container>
            <div className="max-w-3xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="rounded-2xl bg-red-50 border border-red-100 p-7">
                  <p className="text-xs font-semibold uppercase tracking-widest text-red-400 mb-3">The problem</p>
                  <h2 className="font-serif text-2xl font-bold text-neutral-900 mb-3">Weekly meal planning is exhausting</h2>
                  <p className="text-neutral-600 leading-relaxed">
                    The average person spends 2+ hours every week planning meals, searching for recipes, and building grocery lists. That&rsquo;s 100+ hours a year on a task that should take 10 seconds.
                  </p>
                </div>
                <div className="rounded-2xl bg-[#FDF6F1] border border-[#D97757]/20 p-7">
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#D97757] mb-3">The solution</p>
                  <h2 className="font-serif text-2xl font-bold text-neutral-900 mb-3">Autopilot does it for you</h2>
                  <p className="text-neutral-600 leading-relaxed">
                    One tap generates a full week of dinners tailored to your household. Swap anything you don&rsquo;t want. Export your grocery list. Done in under a minute.
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
              <p className="text-lg text-neutral-600">Set it up once. Use it every week.</p>
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
                Everything handled for you
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
                Weekly Autopilot is included in MealEase Plus
              </h2>
              <p className="text-neutral-400 text-lg mb-8">
                Unlock the full 7-day planner, unlimited swaps, grocery list export, and budget tracking — all for less than a single takeout order per month.
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
      </main>
      <Footer />
    </>
  )
}
