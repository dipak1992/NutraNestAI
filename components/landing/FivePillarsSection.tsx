'use client'

import Image from 'next/image'
import { ScrollReveal, StaggerGroup, HoverCard } from '@/components/motion'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { pillars } from '@/config/pillars'

export function FivePillarsSection() {
  return (
    <Section
      id="pillars"
      background="white"
      padding="lg"
      className="me-defer-section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <SectionHeader
            title="Six questions. One app. Zero stress."
            subtitle="Every food question your household asks — answered, with Copilot ready when you need to refine the plan."
            align="center"
          />
        </ScrollReveal>

        {/* 3 + 3 grid on desktop */}
        <StaggerGroup className="grid grid-cols-1 md:grid-cols-6 gap-5 md:gap-6" staggerDelay={0.08}>
          {pillars.map((p) => (
            <div key={p.id} className="md:col-span-2">
              <PillarCard pillar={p} />
            </div>
          ))}
        </StaggerGroup>
      </div>
    </Section>
  )
}

function PillarCard({
  pillar,
}: {
  pillar: (typeof pillars)[number]
}) {
  return (
    <HoverCard className="h-full" lift={4} scale={1.015}>
      <article className="group relative h-full rounded-3xl bg-neutral-50 dark:bg-neutral-900 ring-1 ring-neutral-200/70 dark:ring-neutral-800 hover:ring-[#D97757]/40 transition-all duration-300 shadow-subtle hover:shadow-medium overflow-hidden">
        {/* Feature image — 16:10 aspect ratio */}
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16/10' }}>
          <Image
            src={pillar.image}
            alt={pillar.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
            loading="lazy"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          {/* Subtle bottom gradient for visual continuity into card body */}
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-neutral-50 dark:from-neutral-900 to-transparent" />
        </div>

        {/* Card body */}
        <div className="relative px-6 pb-7 pt-4 md:px-7 md:pb-8">
          {/* Badge */}
          {pillar.badge && (
            <span className="absolute top-4 right-5 text-[10px] font-semibold tracking-wider uppercase bg-[#D97757] text-white px-2 py-1 rounded-full">
              {pillar.badge}
            </span>
          )}

          <p className="text-sm font-medium text-[#D97757] mb-2">
            &ldquo;{pillar.question}&rdquo;
          </p>

          <h3 className="font-serif text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-3">
            {pillar.title}
          </h3>

          <p className="text-[15px] leading-relaxed text-neutral-500 dark:text-neutral-400">
            {pillar.answer}
          </p>
        </div>
      </article>
    </HoverCard>
  )
}
