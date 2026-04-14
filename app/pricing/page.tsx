import Link from 'next/link'
import { Check, Leaf, Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export const metadata = { title: 'Pricing' }

const TIERS = [
  {
    name: 'Starter',
    icon: Leaf,
    price: 0,
    period: 'forever',
    description: 'Try the product first, then upgrade only when you want the full workflow.',
    badge: null,
    features: [
      'Instant meal preview',
      '2 extra Tonight swipes per day',
      '3-day weekly plan preview',
      'Login to save your account',
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
    description: 'Unlock the full planner, grocery flow, and premium family tools.',
    badge: 'Most Popular',
    features: [
      'Full 7-day weekly plan',
      'Auto-built grocery list',
      'Pantry management',
      'Insights dashboard',
      'Unlimited Tonight swipes',
      'Plan publishing and advanced features',
    ],
    cta: 'Upgrade to Pro',
    href: '/signup?plan=pro',
    variant: 'default' as const,
  },
]

const FAQ = [
  { q: 'What is included for free?', a: 'Free includes instant meal previews, two extra Tonight swipes per day, and a 3-day planner preview so users can experience the value before upgrading.' },
  { q: 'Can I change plans anytime?', a: 'Absolutely. You can upgrade, downgrade, or cancel at any time from your account settings.' },
  { q: 'How does NutriNest handle allergies?', a: 'Our AI reads each family member\'s allergy and dietary profile before generating every meal and variation, ensuring complete safety.' },
  { q: 'What AI model powers NutriNest?', a: 'We use Claude by Anthropic to generate personalized, safe meal plans tailored to your family\'s needs.' },
  { q: 'When does the paywall appear?', a: 'Users see the first preview immediately. The paywall appears after the free swipe allowance or once the first weekly plan preview has shown enough value to justify unlocking Pro.' },
]

export default function PricingPage() {
  return (
    <main className="min-h-screen gradient-cream">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <Badge className="bg-primary/10 text-primary border-0 mb-4">Simple Pricing</Badge>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Feed your family well,<br /><span className="text-gradient-sage">without the stress</span></h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Show value first, then unlock the full workflow with Pro: the complete weekly planner, grocery list, pantry, and insights.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 max-w-4xl mx-auto">
          {TIERS.map((tier) => {
            const Icon = tier.icon
            const isPopular = !!tier.badge
            return (
              <div key={tier.name} className={`glass-card rounded-2xl border p-7 flex flex-col relative ${isPopular ? 'border-primary shadow-lg shadow-primary/10 scale-[1.02]' : 'border-border/60'}`}>
                {tier.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-semibold px-4 py-1 rounded-full">
                    {tier.badge}
                  </span>
                )}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2.5 rounded-xl ${isPopular ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-bold">{tier.name}</h2>
                </div>
                <div className="mb-4">
                  {tier.price === 0 ? (
                    <p className="text-3xl font-bold">Free</p>
                  ) : (
                    <p className="text-3xl font-bold">${tier.price}<span className="text-base font-normal text-muted-foreground">/{tier.period}</span></p>
                  )}
                  <p className="text-sm text-muted-foreground mt-1">{tier.description}</p>
                </div>
                <ul className="space-y-2.5 mb-6 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button asChild variant={tier.variant} className={`w-full ${isPopular ? 'gradient-sage text-white border-0 hover:opacity-90' : ''}`}>
                  <Link href={tier.href}>{tier.cta}</Link>
                </Button>
              </div>
            )
          })}
        </div>

        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQ.map(({ q, a }) => (
              <div key={q} className="glass-card rounded-xl border border-border/60 p-5">
                <p className="font-semibold mb-2">{q}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-14">
          <p className="text-muted-foreground mb-4">Still have questions? We&apos;re here to help.</p>
          <Button variant="outline" asChild><Link href="mailto:hello@nutrinest.ai">Contact Us</Link></Button>
        </div>
      </div>
    </main>
  )
}
