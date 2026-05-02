import Link from 'next/link'
import { Nav } from '@/components/landing/Nav'
import { Footer } from '@/components/landing/Footer'
import { Container } from '@/components/landing/shared/Container'
import { FeatureHero } from '@/components/features/FeatureHero'
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
  { icon: '🧠', title: 'Learns your taste', body: 'The more you cook, the smarter it gets. Rate meals and it adapts.' },
  { icon: '🔄', title: 'Swap in one tap', body: "Not feeling it? Tap 'Show another' for a fresh suggestion instantly." },
  { icon: '🥗', title: 'Diet-aware', body: 'Vegetarian, gluten-free, keto, halal — every suggestion respects your restrictions.' },
  { icon: '⏱️', title: 'Under 30 minutes', body: 'Weeknight-friendly meals only. No 3-hour recipes on a Tuesday.' },
  { icon: '📖', title: 'Step-by-step cook mode', body: 'Follow along with a clean, distraction-free cooking interface.' },
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
          image="/features/tonight-hero.jpg"
          mobileImage="/features/tonight-hero-mobile.jpg"
          imageAlt="Tonight dinner suggestion shown in a warm kitchen scene"
          mockup="tonight"
        />

        {/* Problem → Solution */}
        <section className="py-16 md:py-20 bg-white">
          <Container>
            <div className="max-w-3xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="rounded-2xl bg-red-50 border border-red-100 p-7">
                  <p className="text-xs font-semibold uppercase tracking-widest text-red-400 mb-3">The problem</p>
                  <h2 className="font-serif text-2xl font-bold text-neutral-900 mb-3">Decision fatigue is real</h2>
                  <p className="text-neutral-600 leading-relaxed">
                    The average household spends 30+ minutes every evening deciding what to cook. That&rsquo;s 180+ hours a year lost to &ldquo;I don&rsquo;t know, what do you want?&rdquo;
                  </p>
                </div>
                <div className="rounded-2xl bg-[#FDF6F1] border border-[#D97757]/20 p-7">
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#D97757] mb-3">The solution</p>
                  <h2 className="font-serif text-2xl font-bold text-neutral-900 mb-3">One tap. One great dinner.</h2>
                  <p className="text-neutral-600 leading-relaxed">
                    MealEase surfaces the perfect dinner for your household the moment you open the app. No searching, no scrolling, no arguing.
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
              <p className="text-lg text-neutral-600">Three steps. Dinner on the table.</p>
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
                Why households love it
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

        {/* Free vs Plus */}
        <section className="py-16 md:py-20 bg-[#FDF6F1]">
          <Container>
            <div className="max-w-3xl mx-auto">
              <h2 className="font-serif text-3xl font-bold text-neutral-900 mb-8 text-center">Free vs Plus</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="rounded-2xl bg-white border border-neutral-200 p-7">
                  <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-4">Free</p>
                  <ul className="space-y-3 text-sm text-neutral-700">
                    {['1 tonight suggestion per day', 'Step-by-step cook mode', 'Basic dietary filters', '3 recipe swaps per day'].map((f) => (
                      <li key={f} className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span>{f}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl bg-neutral-900 border border-[#D97757]/30 p-7">
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
                </div>
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
              Dinner, <span className="italic text-[#D97757]">decided.</span>
            </h2>
            <p className="text-neutral-400 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of households who never ask &ldquo;what&rsquo;s for dinner?&rdquo; anymore.
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
