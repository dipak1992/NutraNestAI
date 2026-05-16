'use client'

import { ScrollReveal, StaggerGroup, HoverCard } from '@/components/motion'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'

const steps = [
  {
    n: '01',
    title: 'Tell us about your household',
    body: '30 seconds of quick questions — solo, couple, or family? Any dietary needs? What\'s your weekly budget?',
  },
  {
    n: '02',
    title: "We plan tonight's dinner",
    body: 'Based on your household, your pantry, the weather, and the day of the week. Ready in one tap.',
  },
  {
    n: '03',
    title: 'You cook, we remember',
    body: 'Every meal you cook teaches us. Over time, we know exactly what your household loves.',
  },
]

export function HowItWorks() {
  return (
    <Section
      id="how-it-works"
      background="cream"
      padding="lg"
      className="me-defer-section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <SectionHeader
            title="Get your first dinner in 60 seconds."
            align="center"
          />
        </ScrollReveal>

        <div className="relative">
          {/* Dotted connector (desktop only) */}
          <div
            aria-hidden
            className="hidden md:block absolute top-10 left-[16%] right-[16%] h-px border-t-2 border-dashed border-[#D97757]/30"
          />

          <StaggerGroup className="grid md:grid-cols-3 gap-8 md:gap-12" staggerDelay={0.12}>
            {steps.map((s) => (
              <HoverCard key={s.n} className="relative text-center md:text-left">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white dark:bg-neutral-800 ring-1 ring-[#D97757]/20 shadow-subtle font-serif text-2xl font-bold text-[#D97757] mb-6 relative z-10">
                  {s.n}
                </div>
                <h3 className="font-serif text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-3">
                  {s.title}
                </h3>
                <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  {s.body}
                </p>
              </HoverCard>
            ))}
          </StaggerGroup>
        </div>
      </div>
    </Section>
  )
}
