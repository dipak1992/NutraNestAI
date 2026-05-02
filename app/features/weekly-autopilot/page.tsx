import Link from 'next/link'
import { Nav } from '@/components/landing/Nav'
import { Footer } from '@/components/landing/Footer'
import { Container } from '@/components/landing/shared/Container'
import { FeatureHero } from '@/components/features/FeatureHero'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Planner / Weekly Autopilot — Your Whole Week of Dinners, Planned in One Tap | MealEase',
  description:
    'Preview 3 days free or unlock the full 7-day Planner / Weekly Autopilot based on your household, preferences, budget, pantry, and leftovers.',
  openGraph: {
    title: 'Planner / Weekly Autopilot — Your Whole Week of Dinners, Planned in One Tap | MealEase',
    description:
      'Preview 3 days free or unlock the full 7-day Planner / Weekly Autopilot.',
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
    title: 'Preview 3 days or unlock the week',
    body: 'Free users can see how Planner thinks with a 3-day preview. Plus unlocks all seven dinners with Autopilot.',
  },
  {
    n: '03',
    title: 'Cook, swap, shop, and learn',
    body: 'Follow the plan, swap any meal you don\'t want, send ingredients to grocery handoff tools where supported, then let cooked meals improve the next plan.',
  },
]

const benefits = [
  { icon: '📅', title: '3-day preview, 7-day Plus plan', body: 'Start with a focused preview, then unlock the full weekly rhythm when you are ready.' },
  { icon: '💰', title: 'Budget-aware planning', body: 'Estimated costs stay visible so expensive weeks can be fixed before checkout.' },
  { icon: '🔄', title: 'Swap without starting over', body: "Don't like Monday's dinner? Swap it while keeping the rest of the plan intact." },
  { icon: '🛒', title: 'Grocery impact included', body: 'Each plan can become a consolidated grocery list with pantry deductions.' },
  { icon: '🧾', title: 'Export-ready shopping', body: 'Edit the list, use supported store handoff, copy it, download PDF, or shop at your local store.' },
  { icon: '🧬', title: 'Learns over time', body: 'Cooked meals, saves, repeats, and dislikes all teach future plans.' },
  { icon: '👨‍👩‍👧', title: 'Household-aware', body: 'Plans around household size, preferences, dietary needs, and real-life routines.' },
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
          eyebrow="Planner / Weekly Autopilot"
          title={<>Preview 3 days. <span className="italic text-[#F3B18E]">Unlock the week.</span></>}
          description="Planner is the canonical weekly flow: preview 3 days free, then unlock the full 7-day Autopilot with grocery impact, budget-aware swaps, leftovers, and household memory."
          primaryHref="/signup"
          primaryLabel="Try free — no card needed"
          secondaryHref="/upgrade?feature=planner"
          secondaryLabel="Upgrade to Plus"
          note={<>Free includes a 3-day Planner preview. Plus unlocks full Weekly Autopilot. <Link href="/pricing" className="text-[#FFD2BD] underline underline-offset-4">Compare plans →</Link></>}
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
                  <h2 className="font-serif text-2xl font-bold text-neutral-900 mb-3">Planner becomes your weekly command center</h2>
                  <p className="text-neutral-600 leading-relaxed">
                    Planner starts with a 3-day preview, then Plus turns it into a full 7-day Autopilot where meals, grocery impact, budget, and leftovers stay connected.
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
              <p className="text-lg text-neutral-600">Preview the rhythm. Unlock the full week.</p>
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

        {/* Grocery Commerce flow */}
        <section className="py-16 md:py-20 bg-[#FDF6F1]">
          <Container>
            <div className="mx-auto max-w-3xl rounded-3xl border border-[#D97757]/20 bg-white p-7 shadow-sm md:p-9">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#D97757] mb-3">
                Grocery Commerce
              </p>
              <h2 className="font-serif text-3xl font-bold tracking-tight text-neutral-900 mb-3">
                From meal plan to groceries in minutes.
              </h2>
              <p className="text-neutral-600 leading-relaxed">
                Weekly Autopilot does not stop at dinner ideas. MealEase turns the plan into an editable grocery list, then helps you shop faster with supported store handoff tools in North America or copy, PDF, and local-store export everywhere else.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {['Meals', 'Grocery List', 'Store Handoff'].map((label, index) => (
                  <div key={label} className="rounded-2xl bg-neutral-50 p-4 text-center ring-1 ring-neutral-200">
                    <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#D97757] text-sm font-bold text-white">
                      {index + 1}
                    </div>
                    <p className="text-sm font-semibold text-neutral-900">{label}</p>
                  </div>
                ))}
              </div>
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
                Full Weekly Autopilot is included in MealEase Plus
              </h2>
              <p className="text-neutral-400 text-lg mb-8">
                Unlock seven dinners, unlimited swaps, grocery impact, budget tracking, household memory, and post-cook learning.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/upgrade?feature=planner"
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
