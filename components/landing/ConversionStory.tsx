'use client'

import Image from 'next/image'
import { CheckCircle2, RefreshCcw, ShoppingCart, Sparkles } from 'lucide-react'
import { ScrollReveal, StaggerGroup, HoverCard } from '@/components/motion'
import { Section } from '@/components/ui/Section'
import conversionStoryImage from '@/public/landing/optimized/conversion-story.webp'

const workflow = [
  { icon: Sparkles, label: 'Tonight Pick' },
  { icon: RefreshCcw, label: 'Swap' },
  { icon: CheckCircle2, label: 'Save' },
  { icon: ShoppingCart, label: 'Grocery List' },
]

export function ConversionStory() {
  return (
    <Section background="white" padding="lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <ScrollReveal direction="left" className="lg:col-span-5">
            <span className="inline-block mb-3 px-3 py-1 text-xs font-medium uppercase tracking-wider text-[#D97757] bg-[#D97757]/8 rounded-full">
              Built for the dinner moment
            </span>
            <h2 className="mt-4 font-serif text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 md:text-5xl">
              From blank fridge stare to grocery-ready plan.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-neutral-500 dark:text-neutral-300">
              MealEase keeps the household context generic AI forgets: what you like, what you have, what you spent, and what needs to happen next.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.1} className="lg:col-span-7">
            <div className="relative overflow-hidden rounded-[2rem] bg-neutral-950 p-5 text-white shadow-2xl shadow-neutral-950/10">
              <div className="absolute inset-0">
                <Image
                  src={conversionStoryImage}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  placeholder="blur"
                  loading="lazy"
                  className="object-cover opacity-65"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/85 via-neutral-950/55 to-neutral-950/20" />
              </div>
              <StaggerGroup className="relative grid gap-4 sm:grid-cols-4" staggerDelay={0.08}>
                {workflow.map((step, index) => {
                  const Icon = step.icon

                  return (
                    <HoverCard key={step.label} className="rounded-2xl border border-white/12 bg-white/10 p-4 backdrop-blur transition-shadow hover:shadow-medium">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D97757] text-white">
                        <Icon className="h-5 w-5" aria-hidden />
                      </div>
                      <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-white/45">
                        Step {index + 1}
                      </p>
                      <p className="mt-1 font-semibold">{step.label}</p>
                    </HoverCard>
                  )
                })}
              </StaggerGroup>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </Section>
  )
}
