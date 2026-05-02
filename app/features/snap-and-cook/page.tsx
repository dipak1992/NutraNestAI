import Link from 'next/link'
import { Nav } from '@/components/landing/Nav'
import { Footer } from '@/components/landing/Footer'
import { Container } from '@/components/landing/shared/Container'
import { FeatureHero } from '@/components/features/FeatureHero'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Snap & Cook — Cook From What's In Your Fridge | MealEase",
  description:
    "Point your camera at your fridge. MealEase identifies your ingredients and suggests 3 recipes you can make right now — no grocery run needed.",
  openGraph: {
    title: "Snap & Cook — Cook From What's In Your Fridge | MealEase",
    description:
      "Point your camera at your fridge. MealEase identifies your ingredients and suggests 3 recipes you can make right now.",
    type: 'website',
  },
  alternates: { canonical: 'https://mealeaseai.com/features/snap-and-cook' },
}

const steps = [
  {
    n: '01',
    title: 'Open the scanner',
    body: 'Tap the camera icon in MealEase. Point it at your open fridge, pantry shelf, or any ingredients on your counter.',
  },
  {
    n: '02',
    title: 'We identify everything',
    body: 'Our AI recognizes 500+ common ingredients with ~94% accuracy. Review the list and tap to correct anything in seconds.',
  },
  {
    n: '03',
    title: 'Pick a recipe and cook',
    body: 'We surface 3 recipes you can make right now with what you have. Choose one and follow the step-by-step cook mode.',
  },
]

const benefits = [
  { icon: '📸', title: '94% accuracy', body: 'Recognizes 500+ ingredients from a single photo. No manual entry.' },
  { icon: '🛒', title: 'Skip the grocery run', body: 'Cook what you already have. Reduce waste and save money.' },
  { icon: '🍳', title: '3 recipes instantly', body: 'Three different meal options surfaced from your exact ingredients.' },
  { icon: '✏️', title: 'Easy corrections', body: 'Tap any ingredient to edit. The AI learns from your corrections.' },
  { icon: '🥡', title: 'Pantry-aware', body: 'Scan your pantry too. We combine fridge + pantry for more options.' },
  { icon: '♻️', title: 'Reduce food waste', body: 'Use ingredients before they expire. Save $50–$100/month on wasted food.' },
]

const relatedFeatures = [
  { href: '/features/tonight-suggestions', label: 'Tonight Suggestions', desc: 'Personalized dinner in one tap' },
  { href: '/features/leftovers-ai', label: 'Leftovers AI', desc: 'Turn leftovers into new meals' },
  { href: '/features/budget-intelligence', label: 'Budget Intelligence', desc: 'See costs before you shop' },
]

export default function SnapAndCookPage() {
  return (
    <>
      <Nav />
      <main id="main">
        <FeatureHero
          eyebrow="Snap & Cook"
          title={<>Cook what&rsquo;s <span className="italic text-[#F3B18E]">already in your fridge.</span></>}
          description="Point your camera at your fridge. MealEase identifies your ingredients and suggests 3 recipes you can make right now — no grocery run needed."
          primaryHref="/signup"
          primaryLabel="Try free — no card needed"
          secondaryHref="/pricing"
          secondaryLabel="See pricing"
          image="/features/snap-hero.jpg"
          mobileImage="/features/snap-hero-mobile.jpg"
          imageAlt="Fridge scan ingredients matched to dinner ideas"
          mockup="snap"
        />

        {/* Problem → Solution */}
        <section className="py-16 md:py-20 bg-white">
          <Container>
            <div className="max-w-3xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="rounded-2xl bg-red-50 border border-red-100 p-7">
                  <p className="text-xs font-semibold uppercase tracking-widest text-red-400 mb-3">The problem</p>
                  <h2 className="font-serif text-2xl font-bold text-neutral-900 mb-3">Full fridge, empty ideas</h2>
                  <p className="text-neutral-600 leading-relaxed">
                    The average household throws away $1,500 in food every year — not because they don&rsquo;t have ingredients, but because they don&rsquo;t know what to make with them.
                  </p>
                </div>
                <div className="rounded-2xl bg-[#FDF6F1] border border-[#D97757]/20 p-7">
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#D97757] mb-3">The solution</p>
                  <h2 className="font-serif text-2xl font-bold text-neutral-900 mb-3">Snap. Identify. Cook.</h2>
                  <p className="text-neutral-600 leading-relaxed">
                    One photo turns your fridge into a recipe generator. We identify what you have and surface meals you can make right now — no extra shopping required.
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
              <p className="text-lg text-neutral-600">From fridge to dinner in three steps.</p>
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
                Why it works
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

        {/* Grocery workflow */}
        <section className="py-16 md:py-20 bg-neutral-950 text-white">
          <Container>
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#F3B18E] mb-4">
                Grocery workflow
              </p>
              <h2 className="font-serif text-4xl font-bold tracking-tight mb-4">
                Snap & Cook also improves the list.
              </h2>
              <p className="text-neutral-300 text-lg leading-relaxed">
                Plus turns fridge and pantry context into smarter grocery planning:
                deduct what you already have, estimate the remaining cost, organize
                by store format, and track checked progress while you shop.
              </p>
            </div>
            <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { title: 'Pantry deduction', body: 'Avoid buying ingredients already on your shelf.' },
                { title: 'Estimated cost', body: 'See the likely cart impact before checkout.' },
                { title: 'Store format', body: 'Group items for produce, pantry, dairy, freezer, and more.' },
                { title: 'Checked progress', body: 'Track what is done while the list stays organized.' },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.06] p-5">
                  <p className="font-semibold text-white">{item.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-400">{item.body}</p>
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
                    {['Basic Snap & Cook', 'Ingredient recognition', '3 recipe suggestions per scan', 'Manual ingredient editing'].map((f) => (
                      <li key={f} className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span>{f}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl bg-neutral-900 border border-[#D97757]/30 p-7">
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#D97757] mb-4">Plus</p>
                  <ul className="space-y-3 text-sm text-neutral-300">
                    {['Unlimited scans', 'Pantry + fridge combined', 'Ingredient preferences remembered', 'Pantry deductions for grocery lists', 'Estimated cost and store grouping', 'Checked shopping progress'].map((f) => (
                      <li key={f} className="flex items-start gap-2"><span className="text-[#D97757] mt-0.5">✓</span>{f}</li>
                    ))}
                  </ul>
                  <Link
                    href="/upgrade?feature=scan"
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
              Your fridge is full.{' '}
              <span className="italic text-[#D97757]">Use it.</span>
            </h2>
            <p className="text-neutral-400 text-lg mb-8 max-w-xl mx-auto">
              Stop wasting food and money. Start cooking what you already have.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-xl bg-[#D97757] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-[#D97757]/25 hover:bg-[#c4664a] transition-colors"
              >
                Start free today
              </Link>
              <Link
                href="/upgrade?feature=scan"
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
