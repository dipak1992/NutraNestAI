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
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { usePaywallStatus } from '@/lib/paywall/use-paywall-status'

// ── Pricing data ──────────────────────────────────────────────

const MONTHLY_PRICE = 9.99
const ANNUAL_PRICE = 79.99
const FULL_ANNUAL_PRICE = (MONTHLY_PRICE * 12).toFixed(2) // $119.88
const ANNUAL_MONTHLY = Math.round((ANNUAL_PRICE / 12) * 100) / 100 // $6.67
const ANNUAL_SAVINGS = Math.round((1 - ANNUAL_PRICE / (MONTHLY_PRICE * 12)) * 100) // 33%

const TESTIMONIALS = [
  {
    quote: 'Saved 4 hours every week on meal planning. I actually look forward to cooking now.',
    name: 'Sarah M.',
    role: 'Mom of 2',
    emoji: '👩‍👧‍👦',
  },
  {
    quote: 'Stopped eating out on Tuesdays and Thursdays. We save over $200/month.',
    name: 'James K.',
    role: 'Dad of 3',
    emoji: '👨‍👧‍👦',
  },
  {
    quote: 'My picky eater actually tries the meals MealEase suggests. Game changer.',
    name: 'Priya R.',
    role: 'Mom of 1',
    emoji: '👩‍👦',
  },
]

const COMPARISON_FEATURES = [
  { feature: 'Tonight meal previews', free: '2 per day', pro: 'Unlimited' },
  { feature: 'Weekly meal plan', free: '3-day preview', pro: 'Full 7 days' },
  { feature: 'Smart grocery list', free: false, pro: true },
  { feature: 'Pantry Magic tools', free: false, pro: true },
  { feature: 'Image-to-meal', free: false, pro: true },
  { feature: 'Family meal variations', free: '3 max', pro: 'Unlimited' },
  { feature: 'Adaptive learning', free: false, pro: true },
  { feature: 'Plan publishing & sharing', free: false, pro: true },
]

const FAQ = [
  {
    q: 'What happens during my 7-day free trial?',
    a: 'You get full Pro access — the complete weekly planner, grocery list, Pantry Magic, and unlimited swipes. No credit card needed. After 7 days, you simply choose to subscribe or stay on Free.',
  },
  {
    q: 'What can I do on the free plan?',
    a: 'Preview meal ideas instantly, try 2 Tonight swipes per day, and see 3 days of your weekly plan. It\'s enough to feel whether MealEase fits your family.',
  },
  {
    q: 'Is annual billing worth it?',
    a: `Annual saves you ${ANNUAL_SAVINGS}% compared to monthly — that's $${(MONTHLY_PRICE * 12 - ANNUAL_PRICE)} back in your pocket every year. Most families choose annual after their first month.`,
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Cancel with one click — your plan stays active until the end of the current billing period. No questions, no fees. Full refund within 14 days if Pro isn\'t right for you.',
  },
  {
    q: 'Does one plan cover my whole family?',
    a: 'Yes. One Pro subscription covers every family member — adults, kids, toddlers, babies. MealEase adapts each meal for every age at the table.',
  },
]

// ── Component ─────────────────────────────────────────────────

export function PricingContent() {
  const [isAnnual, setIsAnnual] = useState(true)
  const [isStartingTrial, setIsStartingTrial] = useState(false)
  const { status, loading: paywallLoading } = usePaywallStatus()
  const router = useRouter()

  const plan = isAnnual ? 'yearly' : 'monthly'

  const handleStartTrial = useCallback(async () => {
    if (!status.isAuthenticated) {
      router.push('/signup?plan=pro&trial=1')
      return
    }

    if (status.isPro) {
      toast.info('You already have Pro!')
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
      toast.success('Your 7-day Pro trial is active!', {
        description: 'Enjoy full access to every feature.',
      })
      router.push('/dashboard')
      router.refresh()
    } catch {
      toast.error('Something went wrong. Try again.')
    } finally {
      setIsStartingTrial(false)
    }
  }, [status, router])

  const handleCheckout = useCallback(async () => {
    if (!status.isAuthenticated) {
      router.push(`/signup?plan=pro`)
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
        // Stripe not live yet — start trial instead
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
  }, [plan, status, router, handleStartTrial])

  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      {/* ── Hero ── */}
      <div className="text-center mb-14">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
          <Users className="h-4 w-4" />
          Join 2,400+ families eating better this week
        </div>

        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
          Your whole week of dinners,
          <span className="block text-gradient-sage">decided before Monday morning</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          One plan covers every mouth in your house. Skip the nightly &ldquo;what&rsquo;s for dinner?&rdquo; panic for less than the price of takeout.
        </p>
      </div>

      {/* ── Billing toggle ── */}
      <div className="flex items-center justify-center gap-3 mb-10">
        <button
          onClick={() => setIsAnnual(false)}
          className={`text-sm font-medium px-4 py-2 rounded-full transition-colors ${
            !isAnnual
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setIsAnnual(true)}
          className={`text-sm font-medium px-4 py-2 rounded-full transition-colors ${
            isAnnual
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Annual
          <Badge className="ml-2 border-0 bg-emerald-100 text-emerald-800 text-[10px]">
            Save {ANNUAL_SAVINGS}%
          </Badge>
        </button>
      </div>

      {/* ── Pricing cards ── */}
      <div className="mx-auto mb-16 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
        {/* Free tier */}
        <div className="relative flex flex-col rounded-3xl border border-border/70 bg-background/85 p-7">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Free</h2>
              <p className="text-sm text-muted-foreground">
                See if MealEase fits your family
              </p>
            </div>
          </div>
          <div className="mb-6">
            <p className="text-4xl font-bold">$0</p>
            <p className="text-sm text-muted-foreground">forever</p>
          </div>
          <ul className="mb-7 flex-1 space-y-3">
            {[
              'Instant meal previews',
              '2 Tonight swipes per day',
              '3-day weekly plan preview',
              'Limited kid recipe variations',
              'No credit card required',
            ].map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm">
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <Button asChild variant="outline" className="w-full">
            <Link href="/signup">Get Started Free</Link>
          </Button>
        </div>

        {/* Pro tier */}
        <div className="relative flex flex-col rounded-3xl border glass-card border-primary bg-background shadow-xl shadow-primary/10 ring-1 ring-primary/15 md:-translate-y-2 p-7">
          <span className="absolute -top-3 left-6 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
            Most Popular
          </span>
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-2xl bg-primary p-3 text-primary-foreground">
              <Crown className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Pro</h2>
              <p className="text-sm text-muted-foreground">
                Every meal, every family member, every week
              </p>
            </div>
          </div>
          <div className="mb-1">
            {isAnnual ? (
              <>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-bold">
                    ${ANNUAL_PRICE}
                    <span className="ml-1 text-base font-normal text-muted-foreground">/year</span>
                  </p>
                  <span className="text-sm text-muted-foreground line-through">${FULL_ANNUAL_PRICE}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="bg-emerald-100 text-emerald-800 border-0 text-xs">{ANNUAL_SAVINGS}% off</Badge>
                  <p className="text-sm text-emerald-700 font-medium">
                    Just ${ANNUAL_MONTHLY.toFixed(2)}/month
                  </p>
                </div>
              </>
            ) : (
              <p className="text-4xl font-bold">
                ${MONTHLY_PRICE}
                <span className="ml-1 text-base font-normal text-muted-foreground">/month</span>
              </p>
            )}
          </div>
          <p className="text-xs text-muted-foreground mb-5">
            That&rsquo;s less than one takeout dinner
          </p>
          <ul className="mb-7 flex-1 space-y-3">
            {[
              'Full 7-day weekly plan',
              'Smart auto-built grocery list',
              'Pantry Magic tools',
              'Image-to-meal feature',
              'Adaptive learning for your family',
              'Unlimited Tonight swipes',
              'Plan publishing & sharing',
              'Cancel anytime',
            ].map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm">
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <div className="space-y-2">
            <Button
              className="w-full gradient-sage border-0 text-white hover:opacity-90"
              onClick={handleStartTrial}
              disabled={isStartingTrial || (status.isPro && !paywallLoading)}
            >
              {isStartingTrial
                ? 'Starting trial…'
                : status.isPro
                ? 'You have Pro'
                : 'Start 7-day free trial'}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              No credit card required
            </p>
            {!status.isPro && (
              <Button
                variant="outline"
                className="w-full"
                onClick={handleCheckout}
              >
                Subscribe now — ${isAnnual ? `${ANNUAL_PRICE}/yr` : `${MONTHLY_PRICE}/mo`}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ── Testimonials ── */}
      <div className="mx-auto max-w-5xl mb-16">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <h2 className="text-2xl font-bold">Loved by families like yours</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {TESTIMONIALS.map(({ quote, name, role, emoji }) => (
            <div
              key={name}
              className="glass-card rounded-2xl border border-border/60 p-6 relative"
            >
              <Quote className="absolute top-4 right-4 h-8 w-8 text-primary/10" />
              <p className="text-sm leading-relaxed text-foreground mb-4">
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
      <div className="mx-auto max-w-3xl mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">
          Free vs Pro — side by side
        </h2>
        <div className="rounded-2xl border border-border/60 overflow-hidden">
          <div className="grid grid-cols-3 bg-muted/50 text-sm font-semibold">
            <div className="px-4 py-3">Feature</div>
            <div className="px-4 py-3 text-center">Free</div>
            <div className="px-4 py-3 text-center text-primary">Pro</div>
          </div>
          {COMPARISON_FEATURES.map(({ feature, free, pro }, i) => (
            <div
              key={feature}
              className={`grid grid-cols-3 text-sm ${
                i % 2 === 0 ? 'bg-background' : 'bg-muted/20'
              }`}
            >
              <div className="px-4 py-3 font-medium">{feature}</div>
              <div className="px-4 py-3 text-center text-muted-foreground">
                {typeof free === 'boolean' ? (
                  free ? (
                    <Check className="mx-auto h-4 w-4 text-emerald-600" />
                  ) : (
                    <span className="text-muted-foreground/50">—</span>
                  )
                ) : (
                  free
                )}
              </div>
              <div className="px-4 py-3 text-center font-medium">
                {typeof pro === 'boolean' ? (
                  pro ? (
                    <Check className="mx-auto h-4 w-4 text-emerald-600" />
                  ) : (
                    <span className="text-muted-foreground/50">—</span>
                  )
                ) : (
                  pro
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Guarantee ── */}
      <div className="mx-auto max-w-3xl mb-14">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 px-6 py-5 flex items-center gap-4">
          <Shield className="h-8 w-8 text-emerald-600 flex-shrink-0" />
          <div>
            <p className="font-semibold text-sm">Risk-free guarantee</p>
            <p className="text-sm text-muted-foreground">
              Cancel anytime with one click. Full refund within 14 days if Pro isn&rsquo;t right for your family. No questions asked.
            </p>
          </div>
        </div>
      </div>

      {/* ── FAQ ── */}
      <div className="mx-auto max-w-3xl mb-14">
        <h2 className="mb-8 text-center text-2xl font-bold">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {FAQ.map(({ q, a }) => (
            <div
              key={q}
              className="glass-card rounded-2xl border border-border/60 p-5"
            >
              <p className="mb-2 font-semibold">{q}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom CTA ── */}
      <div className="text-center">
        <p className="text-muted-foreground mb-4">
          Questions? Contact us at{' '}
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
