import { ArrowRight, Check, Repeat2, ShoppingCart, Sparkles, Star } from 'lucide-react'
import { Container } from './shared/Container'
import { Button } from './shared/Button'
import { FadeIn } from './shared/FadeIn'
import { socialProof } from '@/config/social-proof'

const flow = [
  {
    title: 'Tonight Pick',
    body: 'Choose from meals personalized to your household.',
    icon: Sparkles,
  },
  {
    title: 'Swap',
    body: 'Adjust prep time, cuisine, ingredients, or dietary needs instantly.',
    icon: Repeat2,
  },
  {
    title: 'Save',
    body: 'Keep the meals your household loves so they come back when needed.',
    icon: Star,
  },
  {
    title: 'Grocery List',
    body: 'Turn selected meals into a ready-to-shop list.',
    icon: ShoppingCart,
  },
  {
    title: 'Weekly Plan',
    body: 'Build a flexible week that already feels handled.',
    icon: Check,
  },
]

export function SocialProof() {
  return (
    <section
      className="py-20 md:py-28 bg-white dark:bg-neutral-950"
      aria-labelledby="social-proof-heading"
    >
      <Container>
        <FadeIn>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2
              id="social-proof-heading"
              className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50"
            >
              From &ldquo;what&rsquo;s for dinner?&rdquo;{' '}
              <span className="italic text-[#D97757]">to done in minutes.</span>
            </h2>
            <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
              MealEase turns scattered dinner decisions into one simple flow your
              household can repeat every week.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="mb-20 md:mb-28 rounded-3xl bg-neutral-950 p-5 md:p-7 text-white shadow-xl">
            <div className="grid gap-3 md:grid-cols-5 md:gap-0">
              {flow.map((step, i) => {
                const Icon = step.icon

                return (
                  <div key={step.title} className="relative">
                    <div className="h-full rounded-2xl bg-white/6 p-5 ring-1 ring-white/10 md:rounded-none md:bg-transparent md:ring-0">
                      <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#D97757] text-white">
                        <Icon className="h-5 w-5" aria-hidden />
                      </div>
                      <h3 className="font-serif text-xl font-bold">{step.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-neutral-300">
                        {step.body}
                      </p>
                    </div>
                    {i < flow.length - 1 && (
                      <ArrowRight
                        className="hidden md:block absolute right-0 top-1/2 h-5 w-5 -translate-y-1/2 translate-x-1/2 text-[#F3B18E]"
                        aria-hidden
                      />
                    )}
                  </div>
                )
              })}
            </div>

            <div className="mt-8 text-center">
              <Button href="/signup" ariaLabel="Plan your first week free">
                Plan Your First Week Free
              </Button>
            </div>
          </div>
        </FadeIn>

        {/* Stats row */}
        <FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center mb-20 md:mb-28">
            {[
              { value: socialProof.householdCount, label: 'households cooking smarter' },
              { value: socialProof.dinnersPlanned, label: 'dinners planned' },
              { value: `★ ${socialProof.rating}`, label: 'average rating' },
              { value: `${socialProof.hoursSavedPerWeek}h`, label: 'saved per week, per household' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-serif text-4xl md:text-5xl font-bold text-[#D97757]">
                  {stat.value}
                </div>
                <div className="mt-2 text-sm text-neutral-500 dark:text-neutral-400 leading-snug">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Testimonials grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {socialProof.testimonials.map((t, i) => (
            <FadeIn key={t.name} delay={i * 0.08}>
              <figure className="flex flex-col h-full bg-[#FDF6F1] dark:bg-neutral-900 rounded-2xl p-6 ring-1 ring-black/5 dark:ring-white/5">
                {/* Stars */}
                <div className="text-[#D97757] text-sm mb-4" aria-label="5 stars">
                  ★★★★★
                </div>
                <blockquote className="flex-1">
                  <p className="text-neutral-800 dark:text-neutral-200 leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  {/* Avatar placeholder */}
                  <div
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D97757] to-[#B8935A] flex-shrink-0"
                    aria-hidden
                  />
                  <div>
                    <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                      {t.name}
                    </div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">
                      {t.city}
                    </div>
                  </div>
                </figcaption>
              </figure>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  )
}
