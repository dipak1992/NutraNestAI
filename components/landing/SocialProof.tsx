'use client'

import Image from 'next/image'
import { ArrowRight, Check, Repeat2, ShoppingCart, Sparkles, Star } from 'lucide-react'
import { ScrollReveal, StaggerGroup, HoverCard } from '@/components/motion'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Button } from './shared/Button'
import { socialProof } from '@/config/social-proof'
import { groceryBeforeAfterExamples } from '@/lib/proof-assets'

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
    <Section background="white" padding="lg" className="me-defer-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <SectionHeader
            title="From &ldquo;what&rsquo;s for dinner?&rdquo; to done in minutes."
            subtitle="MealEase turns scattered dinner decisions into one simple flow your household can repeat every week."
            align="center"
          />
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
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
        </ScrollReveal>

        <ScrollReveal delay={0.12}>
          <div className="mb-20 grid gap-4 rounded-3xl border border-neutral-200 bg-[#FDF6F1]/60 p-4 dark:border-neutral-800 dark:bg-neutral-900 md:grid-cols-2 md:p-6">
            {groceryBeforeAfterExamples.map((example) => (
              <HoverCard key={example.title} className="rounded-2xl bg-white p-6 ring-1 ring-neutral-200 shadow-subtle hover:shadow-medium dark:bg-neutral-950 dark:ring-neutral-800">
                <h3 className="font-serif text-2xl font-bold text-neutral-950 dark:text-neutral-50">
                  {example.title}
                </h3>
                <ul className="mt-4 space-y-3">
                  {example.items.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-6 text-neutral-700 dark:text-neutral-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#D97757]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </HoverCard>
            ))}
          </div>
        </ScrollReveal>

        {/* Stats row */}
        <ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center mb-20 md:mb-28">
            {[
              { value: socialProof.householdCount, label: 'household sizes supported' },
              { value: socialProof.dinnersPlanned, label: 'AI-personalized to your taste' },
              { value: socialProof.rating, label: 'from fridge to plan' },
              { value: socialProof.hoursSavedPerWeek, label: 'hours saved per week' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-serif text-4xl md:text-5xl font-bold text-[#D97757]">
                  {stat.value}
                </div>
                <div className="mt-2 text-sm text-neutral-400 leading-snug">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Testimonials grid */}
        <StaggerGroup className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.08}>
          {socialProof.testimonials.map((t) => (
            <HoverCard key={t.name} className="h-full">
              <figure className="flex flex-col h-full bg-[#FDF6F1] dark:bg-neutral-900 rounded-2xl p-6 ring-1 ring-black/5 dark:ring-white/5 shadow-subtle hover:shadow-medium transition-shadow duration-300">
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
                  <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-full ring-2 ring-[#D97757]/25 shadow-sm">
                    <Image
                      src={t.photo}
                      alt={t.name}
                      fill
                      sizes="44px"
                      loading="lazy"
                      className="object-cover object-top"
                    />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                      {t.name}
                    </div>
                    <div className="text-xs text-neutral-400 dark:text-neutral-400">
                      {t.city}
                    </div>
                  </div>
                </figcaption>
              </figure>
            </HoverCard>
          ))}
        </StaggerGroup>
      </div>
    </Section>
  )
}
