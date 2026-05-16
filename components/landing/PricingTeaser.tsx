'use client'

import { ScrollReveal, StaggerGroup, HoverCard } from '@/components/motion'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Button } from './shared/Button'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'For households just getting started.',
    features: [
      'Tonight Suggestions',
      '3 basic Copilot meal assists/day',
      '3 meal swaps per day',
      '3-day Planner preview',
      'Basic Snap & Cook',
      'Basic grocery preview',
    ],
    cta: 'Start free',
    href: '/signup',
    highlight: false,
  },
  {
    name: 'Plus',
    price: '$9.99',
    period: '/month · or $79/yr (save 34%)',
    description: 'Everything you need to stop the dinner spiral.',
    features: [
      'Copilot weekly briefings, voice, memory, and nudges',
      'Full 7-day Planner / Weekly Autopilot',
      'Pantry-aware grocery list with estimated cost',
      'Budget-aware swaps before checkout',
      'Post-cook leftovers and lunch ideas',
      'Household memory for likes, dislikes, and schedule patterns',
      'Unlimited swaps and Snap & Cook usage',
    ],
    cta: 'Start free — upgrade anytime',
    href: '/signup',
    highlight: true,
  },
]

export function PricingTeaser() {
  return (
    <Section id="pricing" background="white" padding="lg" className="me-defer-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <SectionHeader
            title="Simple pricing. No surprises."
            subtitle="Start with basic Copilot. Upgrade when you want it to run the plan, grocery, budget, leftover, and schedule workflows together."
            align="center"
          />
        </ScrollReveal>

        <StaggerGroup className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto" staggerDelay={0.1}>
          {plans.map((plan) => (
            <HoverCard key={plan.name} className="h-full" lift={plan.highlight ? 4 : 2}>
              <div
                className={[
                  'relative flex flex-col h-full rounded-3xl p-8 transition-shadow duration-300',
                  plan.highlight
                    ? 'bg-neutral-900 dark:bg-neutral-800 text-white ring-2 ring-[#D97757] shadow-xl shadow-[#D97757]/10'
                    : 'bg-[#FDF6F1] dark:bg-neutral-900 ring-1 ring-black/5 dark:ring-white/5 shadow-subtle hover:shadow-medium',
                ].join(' ')}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-[#D97757] text-white text-xs font-semibold px-4 py-1 rounded-full shadow-md shadow-[#D97757]/30">
                      Most popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <div className={`text-sm font-semibold uppercase tracking-widest mb-2 ${plan.highlight ? 'text-[#D97757]' : 'text-neutral-400 dark:text-neutral-400'}`}>
                    {plan.name}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className={`font-serif text-5xl font-bold ${plan.highlight ? 'text-white' : 'text-neutral-900 dark:text-neutral-50'}`}>
                      {plan.price}
                    </span>
                    <span className={`text-sm ${plan.highlight ? 'text-neutral-400' : 'text-neutral-500'}`}>
                      {plan.period}
                    </span>
                  </div>
                  <p className={`mt-2 text-sm ${plan.highlight ? 'text-neutral-400' : 'text-neutral-500 dark:text-neutral-400'}`}>
                    {plan.description}
                  </p>
                </div>

                <ul className="flex-1 space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <span className="text-emerald-500 mt-0.5 flex-shrink-0">✓</span>
                      <span className={plan.highlight ? 'text-neutral-300' : 'text-neutral-700 dark:text-neutral-300'}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  href={plan.href}
                  variant={plan.highlight ? 'primary' : 'ghost'}
                  className={plan.highlight ? '' : 'border border-neutral-300 dark:border-neutral-700 hover:border-[#D97757]'}
                >
                  {plan.cta}
                </Button>
              </div>
            </HoverCard>
          ))}
        </StaggerGroup>

        <ScrollReveal delay={0.3}>
          <p className="text-center text-sm text-neutral-400 dark:text-neutral-400 mt-8">
            No credit card required. Cancel anytime.
          </p>
        </ScrollReveal>
      </div>
    </Section>
  )
}
