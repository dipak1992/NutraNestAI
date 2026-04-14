import Link from 'next/link'
import { Check, Sparkles, Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PublicSiteHeader } from '@/components/layout/PublicSiteHeader'
import { PublicSiteFooter } from '@/components/layout/PublicSiteFooter'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Pricing',
  description:
    'Simple MealEase pricing for busy families. Start free, upgrade when you want the full weekly planner, grocery list, Pantry Magic, and unlimited usage.',
  path: '/pricing',
  keywords: ['MealEase pricing', 'family meal planning app pricing', 'meal planning subscription'],
})

const TIERS = [
  {
    name: 'Free',
    icon: Sparkles,
    price: 0,
    period: 'forever',
    description: 'A fast, low-friction way to try MealEase and see if it fits your family.',
    badge: null,
    features: [
      'Instant meal preview',
      'Limited swipes to explore ideas quickly',
      'Partial weekly plan preview',
      'Occasional limited unlocks for premium features',
      'No credit card required to start',
    ],
    cta: 'Get Started Free',
    href: '/signup',
    variant: 'outline' as const,
  },
  {
    name: 'Pro',
    icon: Crown,
    price: 19,
    period: 'month',
    description: 'The full MealEase experience for families who want less stress and more consistency.',
    badge: 'Most Popular',
    features: [
      'Full 7-day weekly plan',
      'Smart grocery list',
      'Pantry Magic',
      'Image-to-meal feature',
      'Adaptive learning based on your family',
      'Unlimited usage',
      'Cancel anytime',
    ],
    cta: 'Start Pro',
    href: '/signup?plan=pro',
    variant: 'default' as const,
  },
]

const FAQ = [
  { q: 'What can I do on the free plan?', a: 'You can preview meal ideas instantly, try limited swipes, and see part of a weekly plan before deciding whether Pro is worth it for your family.' },
  { q: 'What do I unlock with Pro?', a: 'Pro gives you the full weekly planner, grocery list, Pantry Magic, image-to-meal support, adaptive learning, and unlimited usage.' },
  { q: 'Do I need a credit card to start?', a: 'No. You can start with the free plan without entering payment details.' },
  { q: 'Can I cancel anytime?', a: 'Yes. Pro is a simple monthly subscription and you can cancel anytime. Your plan stays active until the end of the current billing period.' },
  { q: 'Need help choosing a plan?', a: 'Need help? Contact us at hello@mealeaseai.com and we will point you to the best fit.' },
]

export default function PricingPage() {
  return (
    <>
      <PublicSiteHeader />
      <main className="min-h-screen gradient-cream">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <Badge className="mb-4 border-0 bg-primary/10 text-primary">Simple Pricing</Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
              Choose the plan that makes
              <span className="block text-gradient-sage">family meals feel lighter</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Start free, feel the value fast, and upgrade only when you want the full MealEase workflow for your household.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground">
              <span className="rounded-full border border-border/70 bg-background/80 px-3 py-1">No credit card required to start</span>
              <span className="rounded-full border border-border/70 bg-background/80 px-3 py-1">Cancel anytime</span>
            </div>
          </div>

          <div className="mx-auto mb-8 max-w-5xl rounded-3xl border border-primary/20 bg-primary/5 px-5 py-4 text-center text-sm text-primary shadow-sm">
            A limited 7-day Pro trial may be available for some new families during onboarding.
          </div>

          <div className="mx-auto mb-16 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
            {TIERS.map((tier) => {
              const Icon = tier.icon
              const isPopular = !!tier.badge
              return (
                <div key={tier.name} className={`relative flex flex-col rounded-3xl border p-7 ${isPopular ? 'glass-card border-primary bg-background shadow-xl shadow-primary/10 ring-1 ring-primary/15 md:-translate-y-2' : 'bg-background/85 border-border/70'}`}>
                  {tier.badge ? (
                    <span className="absolute -top-3 left-6 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                      {tier.badge}
                    </span>
                  ) : null}
                  <div className="mb-5 flex items-center gap-3">
                    <div className={`rounded-2xl p-3 ${isPopular ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{tier.name}</h2>
                      <p className="text-sm text-muted-foreground">{tier.description}</p>
                    </div>
                  </div>
                  <div className="mb-6">
                    {tier.price === 0 ? (
                      <p className="text-4xl font-bold">Free</p>
                    ) : (
                      <p className="text-4xl font-bold">
                        ${tier.price}
                        <span className="ml-1 text-base font-normal text-muted-foreground">/{tier.period}</span>
                      </p>
                    )}
                  </div>
                  <ul className="mb-7 flex-1 space-y-3">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm leading-relaxed">
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button asChild variant={tier.variant} className={`w-full ${isPopular ? 'gradient-sage border-0 text-white hover:opacity-90' : ''}`}>
                    <Link href={tier.href}>{tier.cta}</Link>
                  </Button>
                </div>
              )
            })}
          </div>

          <div className="mx-auto mb-14 grid max-w-5xl gap-6 rounded-3xl border border-border/60 bg-background/85 p-6 sm:grid-cols-3">
            <div>
              <p className="text-sm font-semibold text-foreground">Try it before you commit</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Free gives families an immediate feel for how MealEase works before any paid decision.</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Designed for real households</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">MealEase is built for busy parents juggling kids, groceries, and different food needs at the same table.</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Human support when you need it</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Questions about billing or fit? Reach us at hello@mealeaseai.com.</p>
            </div>
          </div>

          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-center text-2xl font-bold">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {FAQ.map(({ q, a }) => (
                <div key={q} className="glass-card rounded-2xl border border-border/60 p-5">
                  <p className="mb-2 font-semibold">{q}</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">{a}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-14 text-center">
            <p className="mb-4 text-muted-foreground">Need help? Contact us at hello@mealeaseai.com</p>
            <Button variant="outline" asChild>
              <a href="mailto:hello@mealeaseai.com">Contact Us</a>
            </Button>
          </div>
        </div>
      </main>
      <PublicSiteFooter />
    </>
  )
}
