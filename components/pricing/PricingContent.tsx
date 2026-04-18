'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  Check,
  Crown,
  Sparkles,
  Star,
  Shield,
  Users,
  Quote,
  ArrowRight,
  Zap,
  X,
  Gift,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { usePaywallStatus } from '@/lib/paywall/use-paywall-status'
import { PRICING_TIERS, PRO_ANNUAL_SAVINGS, FAMILY_ANNUAL_SAVINGS } from '@/lib/paywall/config'

// ── Pricing data ──────────────────────────────────────────────

const TESTIMONIALS = [
  {
    quote: "I used to spend 30 minutes every evening deciding what to cook. Now I just open MealEaseAI and dinner is planned in seconds. My kids actually eat what I make.",
    name: 'Sarah M.',
    role: 'Mom of 3',
    emoji: '👩‍👧‍👧',
  },
  {
    quote: 'Living solo, I used to default to the same 5 takeout places. Now I actually cook and enjoy it. The budget modes helped me save money too.',
    name: 'James K.',
    role: 'Works from home',
    emoji: '👨‍💻',
  },
  {
    quote: 'Family Plus changed everything. My partner and I finally have a system, the kids get kid-friendly options, and our grocery budget actually makes sense now.',
    name: 'Priya R.',
    role: 'Parent of 2',
    emoji: '👨‍👩‍👧‍👦',
  },
]

const COMPARISON_FEATURES = [
  { feature: 'Tonight Dinner', free: true, pro: true, family: true },
  { feature: 'Daily meal generations', free: '3 per day', pro: 'Unlimited', family: 'Unlimited' },
  { feature: 'Simple grocery list', free: true, pro: true, family: true },
  { feature: 'Unlimited regenerations', free: false, pro: true, family: true },
  { feature: 'Weekly Planner', free: '3-day preview', pro: 'Full 7 days', family: 'Full 7 days' },
  { feature: 'Save preferences', free: false, pro: true, family: true },
  { feature: 'Household memory', free: false, pro: '1 household', family: 'Up to 6 members' },
  { feature: 'Budget meal mode', free: false, pro: true, family: true },
  { feature: 'Healthy mode', free: false, pro: true, family: true },
  { feature: 'Meal history', free: false, pro: true, family: true },
  { feature: 'Faster AI responses', free: false, pro: true, family: true },
  { feature: 'Pantry Mode', free: false, pro: false, family: true },
  { feature: 'Kids Mode', free: false, pro: false, family: true },
  { feature: 'Lunchbox Planner', free: false, pro: false, family: true },
  { feature: 'Shared grocery lists', free: false, pro: false, family: true },
  { feature: 'Family dashboard', free: false, pro: false, family: true },
  { feature: 'Multi-profile balancing', free: false, pro: false, family: true },
  { feature: 'Priority support', free: false, pro: false, family: true },
]

const FAQ = [
  {
    q: 'Is MealEaseAI free?',
    a: 'Yes. Free users get Tonight Dinner, 3 meal ideas daily, and simple grocery lists. Perfect to try MealEaseAI risk-free.',
  },
  {
    q: 'What do I get with Pro?',
    a: 'Unlimited meal ideas, full Weekly Planner, saved preferences, budget modes, and faster planning tools. Great for individuals and couples.',
  },
  {
    q: 'What do I get with Family Plus?',
    a: 'Everything in Pro plus Pantry Mode, Kids Mode, Lunchbox Planner, shared grocery lists, and family profiles. Best for households with multiple members.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes, cancel anytime from your account settings. Your plan stays active until the end of the current billing period. No questions asked.',
  },
  {
    q: 'Do you offer yearly plans?',
    a: `Yes. Yearly plans save you money — Pro saves ${PRO_ANNUAL_SAVINGS}% and Family Plus saves ${FAMILY_ANNUAL_SAVINGS}% compared to monthly billing.`,
  },
  {
    q: 'Can I switch plans later?',
    a: 'Yes, upgrade or downgrade anytime. Changes take effect at your next billing cycle.',
  },
  {
    q: 'Do you support allergies and preferences?',
    a: 'Yes. MealEaseAI supports dietary filters and personalized household preferences at every tier.',
  },
  {
    q: 'Is there a free trial?',
    a: 'Free users can try everything without signing up. Paid plans don\'t require a credit card to start — upgrade anytime.',
  },
]

// ── Component ─────────────────────────────────────────────────

export function PricingContent() {
  const [isAnnual, setIsAnnual] = useState(true)
  const [isStartingTrial, setIsStartingTrial] = useState(false)
  const { status, loading: paywallLoading } = usePaywallStatus()
  const router = useRouter()

  const proMonthly = PRICING_TIERS.pro.monthlyPrice
  const proAnnual = PRICING_TIERS.pro.yearlyPrice
  const familyMonthly = PRICING_TIERS.family.monthlyPrice
  const familyAnnual = PRICING_TIERS.family.yearlyPrice

  const handleStartTrial = useCallback(async () => {
    if (!status.isAuthenticated) {
      router.push('/signup?plan=pro&trial=1')
      return
    }

    if (status.isPro) {
      toast.info('You already have Pro or Family Plus!')
      return
    }

    setIsStartingTrial(true)
    try {
      const res = await fetch('/api/paywall/start-trial', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Could not start trial')
        return
      }
      toast.success('Your 7-day free trial is active!', {
        description: 'Enjoy full Pro access to every feature.',
      })
      router.push('/dashboard')
      router.refresh()
    } catch {
      toast.error('Something went wrong. Try again.')
    } finally {
      setIsStartingTrial(false)
    }
  }, [status, router])

  const handleCheckout = useCallback(async (plan: 'pro_monthly' | 'pro_yearly' | 'family_monthly' | 'family_yearly') => {
    if (!status.isAuthenticated) {
      router.push(`/signup?plan=${plan}`)
      return
    }

    try {
      const res = await fetch('/api/checkout/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      const data = await res.json()

      if (data.error === 'billing_not_configured') {
        handleStartTrial()
        return
      }

      if (!res.ok) {
        toast.error(data.error || 'Could not start checkout')
        return
      }

      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      toast.error('Something went wrong. Try again.')
    }
  }, [status, router, handleStartTrial])

  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      {/* ── Hero ── */}
      <div className="text-center mb-16">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/8 px-4 py-2 text-sm font-medium text-primary">
          <Sparkles className="h-4 w-4" />
          Honest pricing, zero surprises
        </div>

        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl leading-[1.1] mb-5">
          Stop stressing about meals.
        </h1>
        <p className="mx-auto max-w-3xl text-lg text-muted-foreground leading-relaxed">
          MealEaseAI helps you decide meals, plan smarter, and simplify family food life.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-primary" /> Cancel anytime</span>
          <span className="text-border">|</span>
          <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-primary" /> Secure checkout</span>
          <span className="text-border">|</span>
          <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-primary" /> Loved by busy households</span>
        </div>
      </div>

      {/* ── Billing toggle ── */}
      <div className="flex items-center justify-center gap-1 mb-16">
        <div className="inline-flex rounded-full border border-border/60 bg-muted/40 p-1">
          <button
            onClick={() => setIsAnnual(false)}
            className={`text-sm font-medium px-5 py-2 rounded-full transition-all ${
              !isAnnual
                ? 'bg-white text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsAnnual(true)}
            className={`text-sm font-medium px-5 py-2 rounded-full transition-all flex items-center gap-2 ${
              isAnnual
                ? 'bg-white text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Annual
            <Badge className="border-0 bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              Save 36–38%
            </Badge>
          </button>
        </div>
      </div>

      {/* ── Pricing cards ── */}
      <div className="mx-auto mb-20 grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-3 lg:gap-6 items-start">
        {/* Free tier */}
        <div className="relative flex flex-col rounded-3xl border border-border/60 bg-white/80 p-8">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="rounded-2xl bg-muted p-3">
                <Sparkles className="h-5 w-5 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-bold">Free</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Try MealEaseAI risk-free
            </p>
            <div>
              <p className="text-4xl font-bold tracking-tight">$0</p>
              <p className="text-sm text-muted-foreground mt-1">Forever free</p>
            </div>
          </div>

          <ul className="mb-8 flex-1 space-y-3.5">
            {[
              'Tonight Dinner',
              '3 meal ideas per day',
              'Simple grocery list',
              'Basic dietary filters',
            ].map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm">
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <span>{f}</span>
              </li>
            ))}
            {[
              'Unlimited generations',
              'Weekly Planner',
              'Pantry Mode',
              'Kids Mode',
            ].map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm text-muted-foreground/60">
                <X className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <Button asChild variant="outline" size="lg" className="w-full">
            <Link href="/signup">Start Free</Link>
          </Button>
        </div>

        {/* Pro tier */}
        <div className="relative flex flex-col rounded-3xl border-2 border-primary/30 bg-white p-8 shadow-xl shadow-primary/8">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="rounded-2xl bg-gradient-to-br from-primary to-emerald-600 p-3 text-white shadow-md shadow-primary/20">
                <Crown className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold">Pro</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              For individuals & couples
            </p>

            <div>
              {isAnnual ? (
                <>
                  <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-bold tracking-tight">
                      ${(proAnnual / 12).toFixed(2)}
                      <span className="ml-1 text-base font-normal text-muted-foreground">/mo</span>
                    </p>
                    <span className="text-sm text-muted-foreground line-through">${proMonthly}</span>
                  </div>
                  <div className="mt-1.5">
                    <Badge className="bg-emerald-100 text-emerald-800 border-0 text-[11px] font-bold">Save {PRO_ANNUAL_SAVINGS}%</Badge>
                    <p className="text-sm text-muted-foreground mt-1.5">
                      ${proAnnual}/year · billed annually
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-4xl font-bold tracking-tight">
                    ${proMonthly}
                    <span className="ml-1 text-base font-normal text-muted-foreground">/month</span>
                  </p>
                  <p className="text-sm text-muted-foreground mt-1.5">
                    Billed monthly
                  </p>
                </>
              )}
            </div>
          </div>

          <ul className="mb-6 flex-1 space-y-3.5">
            {[
              'Unlimited meal generations',
              'Full 7-day Weekly Planner',
              'Save preferences',
              'Household memory (1)',
              'Budget meal mode',
              'Healthy mode',
              'Meal history',
              'Faster AI responses',
              'Unlimited regenerations',
            ].map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm">
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <div className="space-y-2.5">
            {!status.isPro ? (
              <>
                <Button
                  size="lg"
                  className="w-full gradient-sage border-0 text-white hover:opacity-90 shadow-md shadow-primary/15 gap-2 text-[15px]"
                  onClick={handleStartTrial}
                  disabled={isStartingTrial || paywallLoading}
                >
                  {isStartingTrial
                    ? 'Starting trial…'
                    : 'Upgrade to Pro'}
                  {!isStartingTrial && <ArrowRight className="h-4 w-4" />}
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  No credit card required · Cancel anytime
                </p>
              </>
            ) : (
              <Button disabled size="lg" className="w-full">
                ✓ You have Pro
              </Button>
            )}
          </div>
        </div>

        {/* Family Plus tier (highlighted) */}
        <div className="relative flex flex-col rounded-3xl border-2 border-amber-400/60 bg-gradient-to-br from-white via-amber-50/30 to-yellow-50/40 p-8 shadow-2xl shadow-amber-200/30 md:scale-105 md:-translate-y-6">
          <span className="absolute -top-4 right-8 rounded-full gradient-sage px-4 py-1.5 text-xs font-bold text-white tracking-wide shadow-md shadow-primary/20">
            MOST POPULAR ⭐
          </span>

          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 p-3 text-white shadow-md shadow-amber-600/20">
                <Gift className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold">Family Plus</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Best for households & families
            </p>

            <div>
              {isAnnual ? (
                <>
                  <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-bold tracking-tight">
                      ${(familyAnnual / 12).toFixed(2)}
                      <span className="ml-1 text-base font-normal text-muted-foreground">/mo</span>
                    </p>
                    <span className="text-sm text-muted-foreground line-through">${familyMonthly}</span>
                  </div>
                  <div className="mt-1.5">
                    <Badge className="bg-emerald-100 text-emerald-800 border-0 text-[11px] font-bold">Save {FAMILY_ANNUAL_SAVINGS}%</Badge>
                    <p className="text-sm text-muted-foreground mt-1.5">
                      ${familyAnnual}/year · billed annually
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-4xl font-bold tracking-tight">
                    ${familyMonthly}
                    <span className="ml-1 text-base font-normal text-muted-foreground">/month</span>
                  </p>
                  <p className="text-sm text-muted-foreground mt-1.5">
                    Billed monthly
                  </p>
                </>
              )}
            </div>
          </div>

          <ul className="mb-6 flex-1 space-y-3.5">
            {[
              'Everything in Pro, plus:',
              '',
              'Up to 6 family members',
              'Kids Mode',
              'Lunchbox Planner',
              'Picky Eater Mode',
              'Pantry Mode',
              'Shared grocery lists',
              'Family dashboard',
              'Multi-profile balancing',
              'Smart family planning',
              'Household autopilot',
              'Priority support',
            ].map((f) => (
              f === '' ? (
                <div key="spacer" className="h-2" />
              ) : f === 'Everything in Pro, plus:' ? (
                <li key={f} className="text-sm font-semibold text-muted-foreground">{f}</li>
              ) : (
                <li key={f} className="flex items-start gap-3 text-sm">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
                  <span>{f}</span>
                </li>
              )
            ))}
          </ul>

          <div className="space-y-2.5">
            {status.tier !== 'family' ? (
              <>
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-600 border-0 text-white hover:opacity-90 shadow-md shadow-amber-600/15 gap-2 text-[15px]"
                  onClick={() => isAnnual ? handleCheckout('family_yearly') : handleCheckout('family_monthly')}
                >
                  Start Family Plus
                  {<ArrowRight className="h-4 w-4" />}
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  No credit card required · Cancel anytime
                </p>
              </>
            ) : (
              <Button disabled size="lg" className="w-full">
                ✓ You have Family Plus
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ── Social proof ── */}
      <div className="mx-auto max-w-5xl mb-20">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <h2 className="text-2xl font-bold tracking-tight">People are loving this</h2>
          <p className="mt-2 text-sm text-muted-foreground">Real feedback from real households</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {TESTIMONIALS.map(({ quote, name, role, emoji }) => (
            <div
              key={name}
              className="glass-card rounded-2xl border border-border/50 p-6 relative"
            >
              <Quote className="absolute top-4 right-4 h-8 w-8 text-primary/8" />
              <p className="text-sm leading-relaxed text-foreground mb-5">
                &ldquo;{quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{emoji}</span>
                <div>
                  <p className="text-sm font-semibold">{name}</p>
                  <p className="text-xs text-muted-foreground">{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Comparison table ── */}
      <div className="mx-auto max-w-5xl mb-20">
        <h2 className="text-2xl font-bold text-center mb-3 tracking-tight">
          See what's included at each level
        </h2>
        <p className="text-center text-sm text-muted-foreground mb-8">
          Everything you need, nothing you don't
        </p>
        <div className="rounded-2xl border border-border/60 overflow-hidden">
          <div className="grid grid-cols-4 bg-muted/50 text-sm font-semibold sticky top-0">
            <div className="px-5 py-3.5">Feature</div>
            <div className="px-5 py-3.5 text-center">Free</div>
            <div className="px-5 py-3.5 text-center text-primary">Pro</div>
            <div className="px-5 py-3.5 text-center text-amber-600 font-bold">Family Plus</div>
          </div>
          {COMPARISON_FEATURES.map(({ feature, free, pro, family }, i) => (
            <div
              key={feature}
              className={`grid grid-cols-4 text-sm ${
                i % 2 === 0 ? 'bg-background' : 'bg-muted/20'
              }`}
            >
              <div className="px-5 py-3.5 font-medium">
                {feature}
              </div>
              <div className="px-5 py-3.5 text-center text-muted-foreground">
                {typeof free === 'boolean' ? (
                  free ? (
                    <Check className="mx-auto h-4 w-4 text-emerald-600" />
                  ) : (
                    <span className="text-muted-foreground/40">—</span>
                  )
                ) : (
                  free
                )}
              </div>
              <div className="px-5 py-3.5 text-center font-medium">
                {typeof pro === 'boolean' ? (
                  pro ? (
                    <Check className="mx-auto h-4 w-4 text-emerald-600" />
                  ) : (
                    <span className="text-muted-foreground/40">—</span>
                  )
                ) : (
                  pro
                )}
              </div>
              <div className="px-5 py-3.5 text-center font-medium text-amber-700">
                {typeof family === 'boolean' ? (
                  family ? (
                    <Check className="mx-auto h-4 w-4 text-amber-600" />
                  ) : (
                    <span className="text-muted-foreground/40">—</span>
                  )
                ) : (
                  family
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Guarantee ── */}
      <div className="mx-auto max-w-3xl mb-16">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 px-6 py-5 flex items-center gap-4">
          <Shield className="h-8 w-8 text-emerald-600 flex-shrink-0" />
          <div>
            <p className="font-bold text-sm">Risk-free guarantee</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Cancel anytime with one click from your account settings. Your plan stays active until the end of the current billing period.
            </p>
          </div>
        </div>
      </div>

      {/* ── FAQ ── */}
      <div className="mx-auto max-w-3xl mb-16">
        <h2 className="mb-8 text-center text-2xl font-bold tracking-tight">
          Common Questions
        </h2>
        <Accordion className="space-y-2">
          {FAQ.map(({ q, a }, i) => (
            <AccordionItem
              key={q}
              value={`faq-${i}`}
              className="glass-card rounded-2xl border border-border/50 px-5"
            >
              <AccordionTrigger className="font-semibold text-sm text-left py-4 hover:no-underline">
                {q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground pb-4">
                {a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* ── Bottom CTA ── */}
      <div className="text-center">
        <h3 className="text-xl font-bold tracking-tight mb-2">
          Choose your plan today
        </h3>
        <p className="text-muted-foreground mb-6 text-sm">
          No credit card needed. Upgrade anytime. Cancel anytime.
        </p>
        {!status.isAuthenticated ? (
          <Button
            size="lg"
            className="gradient-sage border-0 text-white hover:opacity-90 shadow-md shadow-primary/15 gap-2"
            asChild
          >
            <Link href="/signup">
              Start Free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        ) : (
          <Button asChild size="lg" variant="outline">
            <Link href="/dashboard">Go to dashboard</Link>
          </Button>
        )}
        <p className="text-muted-foreground text-xs mt-8">
          Questions?{' '}
          <a
            href="mailto:hello@mealeaseai.com"
            className="text-primary hover:underline"
          >
            hello@mealeaseai.com
          </a>
        </p>
      </div>
    </div>
  )
}

