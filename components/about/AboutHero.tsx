import { Container } from '@/components/landing/shared/Container'
import { FadeIn } from '@/components/landing/shared/FadeIn'

export function AboutHero() {
  return (
    <section className="relative pt-16 pb-12 md:pt-24 md:pb-16">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-[#FDF6F1] via-white to-white dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-950"
      />
      <Container>
        <FadeIn>
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-[#D97757] uppercase tracking-wider mb-4">
              Our story
            </p>
            <h1 className="font-serif text-4xl md:text-6xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 leading-[1.05]">
              We got tired of asking{' '}
              <span className="italic text-[#D97757]">
                &ldquo;what&apos;s for dinner?&rdquo;
              </span>
              <br />
              So we built the answer.
            </h1>
            <p className="mt-6 text-lg md:text-xl text-neutral-600 dark:text-neutral-300 leading-relaxed">
              MealEase is made by two parents of two little kids who burned out
              on meal planning, grocery waste, shopping friction, and $280 takeout
              months — and couldn&apos;t find a tool that actually finished the job.
            </p>
          </div>
        </FadeIn>
      </Container>
    </section>
  )
}
