import Image from 'next/image'
import { Container } from './shared/Container'
import { FadeIn } from './shared/FadeIn'
import { MobileCarouselRail } from './shared/MobileCarouselRail'
import { socialProof } from '@/config/social-proof'

export function SocialProof() {
  return (
    <section
      className="bg-white py-10 dark:bg-neutral-950 md:py-28"
      aria-labelledby="social-proof-heading"
    >
      <Container>
        <FadeIn>
          <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
            <h2
              id="social-proof-heading"
              className="font-serif text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 md:text-5xl"
            >
              Built with household feedback,{' '}
              <span className="italic text-[#D97757]">not generic AI guesses.</span>
            </h2>
            <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
              Real dinner routines shaped the product: faster planning, less repeat work, and meals households actually want.
            </p>
          </div>
        </FadeIn>

        <FadeIn>
          <div className="mb-12 grid grid-cols-2 gap-8 text-center md:mb-20 md:grid-cols-4 md:gap-12">
            {[
              { value: socialProof.householdCount, label: 'household feedback program' },
              { value: socialProof.dinnersPlanned, label: 'dinner-plan data under review' },
              { value: socialProof.rating, label: 'feedback stage' },
              { value: socialProof.hoursSavedPerWeek, label: 'time-saved study status' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-serif text-4xl font-bold text-[#D97757] md:text-5xl">
                  {stat.value}
                </div>
                <div className="mt-2 text-sm leading-snug text-neutral-500 dark:text-neutral-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </FadeIn>

        <MobileCarouselRail className="md:hidden" itemClassName="min-w-full" ariaLabel="Swipe through MealEase reviews">
          {socialProof.testimonials.map((t) => (
            <div key={t.name}>
              <TestimonialCard testimonial={t} />
            </div>
          ))}
        </MobileCarouselRail>

        <div className="hidden gap-6 md:grid md:grid-cols-2 lg:grid-cols-3">
          {socialProof.testimonials.map((t, i) => (
            <FadeIn key={t.name} delay={i * 0.08}>
              <TestimonialCard testimonial={t} />
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  )
}

function TestimonialCard({
  testimonial,
}: {
  testimonial: (typeof socialProof.testimonials)[number]
}) {
  return (
    <figure className="flex h-full flex-col rounded-2xl bg-[#FDF6F1] p-6 ring-1 ring-black/5 dark:bg-neutral-900 dark:ring-white/5">
      <div className="mb-4 text-sm text-[#D97757]" aria-label="5 stars">
        ★★★★★
      </div>
      <blockquote className="flex-1">
        <p className="leading-relaxed text-neutral-800 dark:text-neutral-200">
          &ldquo;{testimonial.quote}&rdquo;
        </p>
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-full shadow-sm ring-2 ring-[#D97757]/25">
          <Image
            src={testimonial.photo}
            alt={testimonial.name}
            fill
            sizes="44px"
            className="object-cover object-top"
          />
        </div>
        <div>
          <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            {testimonial.name}
          </div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            {testimonial.city}
          </div>
        </div>
      </figcaption>
    </figure>
  )
}
