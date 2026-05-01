'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  BookOpen,
  Brain,
  CalendarDays,
  Camera,
  CheckCircle2,
  Clock,
  DollarSign,
  Moon,
  Salad,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  UserRound,
  UsersRound,
  Utensils,
  Zap,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { toast } from 'sonner'
import { usePaywallStatus } from '@/lib/paywall/use-paywall-status'
import { PRICING_TIERS, PRO_ANNUAL_SAVINGS } from '@/lib/paywall/config'
import { cn } from '@/lib/utils'

/* ─────────────────────── DATA ─────────────────────── */

type FeatureItem = {
  icon: LucideIcon
  text: string
  highlight?: boolean
}

const FREE_FEATURES: FeatureItem[] = [
  { icon: Moon, text: 'Tonight Suggestions for daily dinner help' },
  { icon: Camera, text: 'Basic Snap & Cook' },
  { icon: CalendarDays, text: '3-day Planner preview' },
  { icon: ShoppingCart, text: 'Manual grocery planning with basic preview' },
  { icon: Zap, text: '3 meal swaps per day' },
  { icon: UserRound, text: '1 member profile' },
  { icon: Salad, text: 'Basic dietary filters' },
]

const PLUS_FEATURES: FeatureItem[] = [
  { icon: Sparkles, text: 'Everything in Free, connected across your week', highlight: false },
  { icon: CalendarDays, text: 'Smart weekly plans for all 7 dinners', highlight: true },
  { icon: ShoppingCart, text: 'Auto grocery list + faster shopping workflow', highlight: true },
  { icon: ShoppingCart, text: 'One-tap grocery exports where supported', highlight: true },
  { icon: DollarSign, text: 'Catch expensive weeks before checkout', highlight: true },
  { icon: Utensils, text: 'Turn cooked meals into tracked leftovers and tomorrow lunch', highlight: true },
  { icon: Brain, text: 'MealEase remembers likes, dislikes, and repeat favorites', highlight: true },
  { icon: Camera, text: 'Scan fridge and pantry without basic-plan limits', highlight: false },
  { icon: Moon, text: 'Swap until dinner fits tonight', highlight: false },
  { icon: UsersRound, text: 'Personalize meals for up to 6 household members', highlight: false },
  { icon: BookOpen, text: 'Resurface saved meals and meal history', highlight: false },
  { icon: Zap, text: 'Get faster planning when the week gets busy', highlight: false },
]

const REASSURANCE = [
  { icon: Clock, text: '7-day trial' },
  { icon: ShieldCheck, text: 'Cancel anytime' },
  { icon: CheckCircle2, text: 'No card required' },
]

const PLUS_UNLOCKS = [
  {
    icon: CalendarDays,
    title: 'A full weekly rhythm',
    desc: 'Move beyond a 3-day preview into seven dinners, smarter swaps, and a planning ritual that sticks.',
  },
  {
    icon: Utensils,
    title: 'Less food waste after cooking',
    desc: 'Mark cooked, create leftovers, and get practical next-meal ideas before food disappears in the fridge.',
  },
  {
    icon: DollarSign,
    title: 'Budget decisions before checkout',
    desc: 'See estimated costs from plans and grocery lists, then swap expensive meals before the cart gets painful.',
  },
  {
    icon: ShoppingCart,
    title: 'A grocery workflow worth paying for',
    desc: 'Auto grocery lists, edit-before-you-shop controls, supported store handoff, copy, PDF, and local-store export.',
  },
]

const FAQ = [
  {
    q: 'Is there a free version?',
    a: "Yes. Free gives you useful dinner help: Tonight Suggestions, 3 swaps per day, a 3-day Planner preview, basic Snap & Cook, and a basic grocery preview. Plus unlocks the full connected system.",
  },
  {
    q: 'What is a household profile?',
    a: "A profile stores preferences, allergies, age groups, and food goals for one person. Profiles are not separate logins — they help MealEase personalize every meal for each person at your table. Free plan includes 1 profile. Plus includes up to 6.",
  },
  {
    q: 'What is Weekly Autopilot?',
    a: 'Weekly Autopilot is the full Planner experience. Free users can preview 3 days; Plus unlocks all 7 dinners, budget-aware swaps, grocery impact, and household memory.',
  },
  {
    q: 'Can MealEase help with groceries?',
    a: 'Yes. MealEase turns meal plans into ready-to-shop grocery lists and shopping handoff tools. In supported regions you can use store handoff for Walmart or Instacart; elsewhere you can copy, download PDF, or use the list at your local store.',
  },
  {
    q: 'What is Leftovers AI?',
    a: "After you mark a meal cooked, MealEase can track leftovers, update your weekly budget, and suggest a practical next meal like tomorrow's lunch.",
  },
  {
    q: 'What is Budget Intelligence?',
    a: "Set a weekly food budget and we'll estimate recipe costs, track your spending, warn you before you go over, and suggest cheaper meal swaps when needed. Includes weekly history and category breakdown.",
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes — cancel with one click from your account settings. No questions asked. Your plan stays active until the end of the current billing period.',
  },
]

/* ─────────────────────── COMPONENT ─────────────────────── */

export function PricingContent() {
  const [isAnnual, setIsAnnual] = useState(true)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const { status, loading: paywallLoading } = usePaywallStatus()
  const router = useRouter()

  const proMonthly = PRICING_TIERS.pro.monthlyPrice   // 9.99
  const proAnnual  = PRICING_TIERS.pro.yearlyPrice    // 83
  const proAnnualMonthly = (proAnnual / 12).toFixed(2) // 6.92

  const handleCheckout = useCallback(async (plan: 'pro_monthly' | 'pro_yearly') => {
    if (!status.isAuthenticated) {
      router.push(`/signup?plan=${plan}`)
      return
    }
    if (status.isPro) {
      toast.info('You already have Plus!')
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
        const trialRes = await fetch('/api/paywall/start-trial', { method: 'POST' })
        const trialData = await trialRes.json()
        if (!trialRes.ok) { toast.error(trialData.error || 'Could not start trial'); return }
        toast.success('Your 7-day free trial is active!')
        router.push('/dashboard')
        router.refresh()
        return
      }
      if (!res.ok) { toast.error(data.error || 'Could not start checkout'); return }
      if (data.url) window.location.href = data.url
    } catch {
      toast.error('Something went wrong. Try again.')
    }
  }, [status, router])

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-neutral-950 px-4 py-12 text-center text-white md:py-20">
        {/* Desktop image (lg+) */}
        <div className="absolute inset-0 hidden lg:block">
          <Image
            src="/pricing/pricing_desktop.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
        {/* Mobile image (< lg) */}
        <div className="absolute inset-0 lg:hidden">
          <Image
            src="/pricing/pricing_mobile.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-top"
          />
        </div>
        {/* Overlay: stronger top scrim for text readability */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.72)_0%,rgba(0,0,0,0.58)_55%,rgba(0,0,0,0.44)_100%)]"
        />
        {/* Warm radial accent */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(217,119,87,0.28),transparent_55%)]"
        />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#FFD2BD] backdrop-blur">
            Simple pricing
          </div>
          <h1 className="mx-auto mt-4 max-w-[300px] font-serif text-4xl font-bold tracking-tight text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.45)] sm:max-w-4xl md:text-5xl">
            Stop stressing about dinner.{' '}
            <span className="italic text-[#D97757]">Start tonight.</span>
          </h1>
          <p className="mx-auto mt-3 max-w-[280px] text-base text-white/82 sm:max-w-xl sm:text-lg">
            Free forever. Upgrade when dinner gets easier.
          </p>
        </div>
      </section>

      {/* ── BILLING TOGGLE ── */}
      <section className="flex justify-center pt-6 pb-4 px-4">
        <div className="inline-flex items-center rounded-full border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 p-1 shadow-sm">
          <button
            onClick={() => setIsAnnual(false)}
            className={cn(
              'text-sm font-semibold px-5 py-2 rounded-full transition-all min-w-[88px]',
              !isAnnual
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 shadow-md'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200',
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsAnnual(true)}
            className={cn(
              'text-sm font-semibold px-5 py-2 rounded-full transition-all flex items-center gap-2 min-w-[88px]',
              isAnnual
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 shadow-md'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200',
            )}
          >
            Annual
            <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              SAVE {PRO_ANNUAL_SAVINGS}%
            </span>
          </button>
        </div>
      </section>

      {/* ── TRUST ROW ── */}
      <section className="px-4 pb-4">
        <div className="flex w-full max-w-[320px] flex-row flex-wrap items-center justify-center gap-x-3 gap-y-1.5 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-medium text-neutral-600 shadow-sm shadow-neutral-900/5 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 sm:mx-auto sm:max-w-3xl">
          {REASSURANCE.map((item, i) => {
            const Icon = item.icon

            return (
              <span key={item.text} className="inline-flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5 shrink-0 text-[#D97757]" aria-hidden />
                <span className="font-semibold text-neutral-700 dark:text-neutral-200">{item.text}</span>
                {i < REASSURANCE.length - 1 && (
                  <span className="hidden h-1 w-1 rounded-full bg-neutral-300 dark:bg-neutral-700 sm:inline-block" aria-hidden />
                )}
              </span>
            )
          })}
        </div>
      </section>

      {/* ── PRICING CARDS ── */}
      <section className="pb-16 px-4">
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">

          {/* FREE */}
          <div className="relative flex flex-col h-full rounded-2xl p-8 bg-[#FDF6F1] dark:bg-neutral-900 ring-1 ring-black/5 dark:ring-white/5">
            <div className="mb-6">
              <div className="text-sm font-semibold uppercase tracking-widest mb-2 text-neutral-500 dark:text-neutral-400">
                Free
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-serif text-5xl font-bold text-neutral-900 dark:text-neutral-50">$0</span>
                <span className="text-sm text-neutral-500">/ forever</span>
              </div>
              <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                Great for getting started.
              </p>
            </div>

            <ul className="flex-1 space-y-3 mb-8">
              {FREE_FEATURES.map((f) => {
                const Icon = f.icon

                return (
                <li key={f.text} className="flex items-center gap-2.5 text-sm">
                  <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-[#D97757] ring-1 ring-[#D97757]/15 dark:bg-neutral-800">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="min-w-0 text-neutral-700 dark:text-neutral-300">{f.text}</span>
                </li>
                )
              })}
            </ul>

            <Link
              href="/signup"
              className="block w-full text-center rounded-xl border border-neutral-300 dark:border-neutral-700 py-3 text-sm font-semibold text-neutral-900 dark:text-neutral-50 hover:border-[#D97757] hover:text-[#D97757] transition-colors"
            >
              Start free
            </Link>
          </div>

          {/* PLUS — premium dark card */}
          <div className="relative flex flex-col h-full rounded-2xl overflow-hidden ring-2 ring-[#D97757]">
            {/* Layered gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a0e06] via-[#1e1208] to-neutral-900" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_100%_0%,_rgba(217,119,87,0.25),_transparent)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_0%_100%,_rgba(251,191,36,0.08),_transparent)]" />
            {/* Dot pattern */}
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: 'radial-gradient(circle, #D97757 1px, transparent 1px)',
                backgroundSize: '18px 18px',
              }}
            />

            {/* Most Popular badge */}
            <div className="absolute -top-px left-1/2 -translate-x-1/2">
              <span className="bg-gradient-to-r from-[#D97757] to-[#E8895A] text-white text-xs font-bold px-5 py-1.5 rounded-b-full whitespace-nowrap shadow-lg shadow-[#D97757]/40 tracking-wide">
                ✦ Most Popular
              </span>
            </div>

            <div className="relative z-10 flex flex-col h-full p-8 pt-10">
              <div className="mb-6">
                <div className="text-sm font-bold uppercase tracking-widest mb-2 text-[#D97757]">
                  Plus
                </div>
                <div className="flex items-baseline gap-1">
                  {isAnnual ? (
                    <>
                      <span className="font-serif text-5xl font-bold text-white">${proAnnualMonthly}</span>
                      <span className="text-sm text-neutral-400">/mo</span>
                      <span className="text-sm text-neutral-500 line-through ml-1">${proMonthly}</span>
                    </>
                  ) : (
                    <>
                      <span className="font-serif text-5xl font-bold text-white">${proMonthly}</span>
                      <span className="text-sm text-neutral-400">/month</span>
                    </>
                  )}
                </div>
                {isAnnual && (
                  <p className="mt-1 text-xs text-neutral-400">${proAnnual}/yr · billed annually</p>
                )}
                <p className="mt-2 text-sm text-neutral-400">
                  Everything you need to end the dinner spiral and get groceries ready faster.
                </p>
              </div>

              <ul className="flex-1 space-y-2.5 mb-8">
                {PLUS_FEATURES.map((f) => {
                  const Icon = f.icon

                  return (
                  <li key={f.text} className="flex items-start gap-2.5 text-sm">
                    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/8 text-[#F3B18E] ring-1 ring-white/10">
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    <span className={cn('min-w-0 leading-relaxed', f.highlight ? 'text-white font-medium' : 'text-neutral-300')}>
                      {f.text}
                    </span>
                    {f.highlight && (
                      <span className="ml-auto shrink-0 text-[10px] font-bold text-[#D97757] bg-[#D97757]/15 rounded-full px-1.5 py-0.5 uppercase tracking-wide">
                        Plus
                      </span>
                    )}
                  </li>
                  )
                })}
              </ul>

              <button
                onClick={() => handleCheckout(isAnnual ? 'pro_yearly' : 'pro_monthly')}
                disabled={paywallLoading || status.isPro}
                className="block w-full text-center rounded-xl bg-gradient-to-r from-[#D97757] to-[#E8895A] hover:from-[#C86646] hover:to-[#D97757] disabled:opacity-60 py-3.5 text-sm font-bold text-white transition-all shadow-lg shadow-orange-900/30"
              >
                {status.isPro ? '✓ You have Plus' : isAnnual ? `Start free trial — $${proAnnualMonthly}/mo` : `Start free trial — $${proMonthly}/mo`}
              </button>

              {!status.isPro && (
                <Link
                  href={`/upgrade?plan=${isAnnual ? 'pro_yearly' : 'pro_monthly'}`}
                  className="block w-full text-center rounded-xl border border-[#D97757]/40 hover:border-[#D97757] py-3 text-sm font-semibold text-[#D97757] hover:bg-[#D97757]/10 transition-all mt-2"
                >
                  Buy Plus now →
                </Link>
              )}

              <p className="text-center text-xs text-neutral-500 mt-3">
                7-day free trial · No credit card required · Cancel anytime
              </p>
              <p className="text-center text-[11px] leading-relaxed text-neutral-500 mt-2">
                MealEase subscriptions are securely billed through DDS Supply LLC via Stripe.
              </p>
              <p className="text-center text-xs font-semibold text-[#F3B18E] mt-2">
                Many users upgrade for grocery convenience alone.
              </p>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-5 grid max-w-3xl gap-3 rounded-2xl border border-neutral-200 bg-white p-4 text-sm dark:border-neutral-800 dark:bg-neutral-900 sm:grid-cols-2">
          <div className="rounded-xl bg-neutral-50 p-4 dark:bg-neutral-950">
            <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">Free</p>
            <p className="mt-1 font-semibold text-neutral-900 dark:text-neutral-100">Manual grocery planning</p>
            <p className="mt-1 text-xs leading-5 text-neutral-500 dark:text-neutral-400">Preview the basics and build from there.</p>
          </div>
          <div className="rounded-xl bg-[#FDF6F1] p-4 ring-1 ring-[#D97757]/20 dark:bg-neutral-950">
            <p className="text-xs font-bold uppercase tracking-widest text-[#D97757]">Plus</p>
            <p className="mt-1 font-semibold text-neutral-900 dark:text-neutral-100">Auto grocery list + faster shopping</p>
            <p className="mt-1 text-xs leading-5 text-neutral-500 dark:text-neutral-400">Edit, export, and use supported store handoff tools.</p>
          </div>
        </div>
        <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-[#D97757]/20 bg-[#FDF6F1] p-5 text-center shadow-sm shadow-neutral-900/5 dark:border-[#D97757]/20 dark:bg-neutral-900">
          <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            ★★★★★ “It replaced the nightly group text about dinner.”
          </p>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            Trusted by thousands of households planning dinner, groceries, leftovers, and budget in one place.
          </p>
        </div>
      </section>

      {/* ── FEATURE HIGHLIGHTS ── */}
      <section className="pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-2xl font-bold text-neutral-900 dark:text-neutral-50 text-center mb-8">
            What you unlock with Plus
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {PLUS_UNLOCKS.map((item) => {
              const Icon = item.icon

              return (
              <div
                key={item.title}
                className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 flex gap-4"
              >
                <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#D97757]/10 text-[#D97757]">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <div>
                  <p className="font-semibold text-neutral-900 dark:text-neutral-50 text-sm">{item.title}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 px-4 bg-[#FDF6F1] dark:bg-neutral-900">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 text-center mb-10">
            Common questions
          </h2>
          <div className="space-y-3">
            {FAQ.map(({ q, a }, i) => (
              <div
                key={q}
                className="rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left text-sm font-semibold text-neutral-900 dark:text-neutral-50 hover:text-[#D97757] transition-colors"
                >
                  {q}
                  <span className={cn('ml-4 flex-shrink-0 text-lg leading-none transition-transform', openFaq === i && 'rotate-45')}>+</span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="py-16 px-4 text-center">
        <h3 className="font-serif text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-3">
          Ready to simplify dinner?
        </h3>
        <p className="text-neutral-500 dark:text-neutral-400 mb-8 text-sm max-w-md mx-auto">
          Join thousands of households who stopped stressing about meals. Start free, upgrade when you&rsquo;re ready.
        </p>
        {!status.isAuthenticated ? (
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-xl bg-[#D97757] hover:bg-[#c4694a] px-8 py-3.5 text-sm font-semibold text-white transition-colors shadow-md shadow-orange-200/50 dark:shadow-none"
          >
            Get started free →
          </Link>
        ) : status.isPro ? (
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-8 py-3.5 text-sm font-semibold text-white transition-colors"
          >
            ✓ Go to dashboard →
          </Link>
        ) : (
          <button
            onClick={() => handleCheckout(isAnnual ? 'pro_yearly' : 'pro_monthly')}
            disabled={paywallLoading}
            className="inline-flex items-center gap-2 rounded-xl bg-[#D97757] hover:bg-[#c4694a] px-8 py-3.5 text-sm font-semibold text-white transition-colors disabled:opacity-60"
          >
            Start your free trial →
          </button>
        )}
        <p className="text-neutral-400 text-xs mt-6">
          Questions?{' '}
          <a href="mailto:hello@mealeaseai.com" className="text-[#D97757] hover:underline">
            hello@mealeaseai.com
          </a>
        </p>
      </section>
    </div>
  )
}
