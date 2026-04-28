'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { usePaywallStatus } from '@/lib/paywall/use-paywall-status'
import { PRICING_TIERS, PRO_ANNUAL_SAVINGS } from '@/lib/paywall/config'
import { cn } from '@/lib/utils'

/* ─────────────────────── DATA ─────────────────────── */

const FREE_FEATURES = [
  { icon: '🌙', text: 'Tonight Suggestions (3/day)' },
  { icon: '📸', text: 'Snap & Cook — fridge scan (3/week)' },
  { icon: '🛒', text: 'Basic grocery list' },
  { icon: '👤', text: '1 member profile' },
  { icon: '🥗', text: 'Basic dietary filters' },
]

const PLUS_FEATURES = [
  { icon: '✨', text: 'Everything in Free', highlight: false },
  { icon: '🌙', text: 'Unlimited Tonight Suggestions', highlight: true },
  { icon: '📸', text: 'Unlimited Snap & Cook scans', highlight: false },
  { icon: '🗓️', text: 'Weekly Autopilot — 7 dinners, one tap', highlight: true },
  { icon: '🍱', text: 'Leftovers AI — track & use leftovers', highlight: true },
  { icon: '💰', text: 'Budget Intelligence — weekly spend tracking', highlight: true },
  { icon: '🛒', text: 'Smart grocery list export', highlight: false },
  { icon: '👨‍👩‍👧‍👦', text: 'Up to 6 household members', highlight: false },
  { icon: '🧠', text: 'Household memory & preferences', highlight: false },
  { icon: '📖', text: 'Meal history & saved favorites', highlight: false },
  { icon: '⚡', text: 'Faster AI responses', highlight: false },
]

const FAQ = [
  {
    q: 'Is there a free version?',
    a: "Yes. The free plan gives you Tonight Suggestions, up to 3 Snap & Cook scans per week, and a basic grocery list — enough to experience how MealEase thinks. When you're ready for Weekly Autopilot, Leftovers AI, or Budget Intelligence, upgrade anytime.",
  },
  {
    q: 'What is a household profile?',
    a: "A profile stores preferences, allergies, age groups, and food goals for one person. Profiles are not separate logins — they help MealEase personalize every meal for each person at your table. Free plan includes 1 profile. Plus includes up to 6.",
  },
  {
    q: 'What is Weekly Autopilot?',
    a: 'One tap, seven nights planned. Autopilot builds a full week of dinners tailored to your household — balancing variety, nutrition, prep time, and what you already have on hand. It generates a smart grocery list alongside it.',
  },
  {
    q: 'What is Leftovers AI?',
    a: "After you cook, MealEase asks if you have leftovers. Say yes and we track them — what they are, when they expire, and how many servings remain. We'll remind you before they go bad and suggest recipes that use them up.",
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
      <section className="pt-16 pb-10 text-center px-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#D97757]/10 text-[#D97757] text-xs font-bold px-4 py-1.5 mb-5 uppercase tracking-widest">
          ✦ Simple pricing
        </div>
        <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
          Stop stressing about dinner.{' '}
          <span className="italic text-[#D97757]">Start tonight.</span>
        </h1>
        <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto">
          Free forever. Upgrade when you want the full experience.
        </p>
      </section>

      {/* ── BILLING TOGGLE ── */}
      <section className="flex justify-center pb-8 px-4">
        <div className="inline-flex items-center rounded-full border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 p-1">
          <button
            onClick={() => setIsAnnual(false)}
            className={cn(
              'text-sm font-semibold px-5 py-2 rounded-full transition-all',
              !isAnnual
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 shadow-sm'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200',
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsAnnual(true)}
            className={cn(
              'text-sm font-semibold px-5 py-2 rounded-full transition-all flex items-center gap-2',
              isAnnual
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 shadow-sm'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200',
            )}
          >
            Annual
            <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              SAVE {PRO_ANNUAL_SAVINGS}%
            </span>
          </button>
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
                For households just getting started.
              </p>
            </div>

            <ul className="flex-1 space-y-3 mb-8">
              {FREE_FEATURES.map((f) => (
                <li key={f.text} className="flex items-center gap-2.5 text-sm">
                  <span className="text-base shrink-0">{f.icon}</span>
                  <span className="text-neutral-700 dark:text-neutral-300">{f.text}</span>
                </li>
              ))}
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

            {/* Most popular badge */}
            <div className="absolute -top-px left-1/2 -translate-x-1/2">
              <span className="bg-[#D97757] text-white text-xs font-bold px-5 py-1 rounded-b-full whitespace-nowrap shadow-lg">
                ✦ Most popular
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
                  Everything you need to end the dinner spiral.
                </p>
              </div>

              <ul className="flex-1 space-y-2.5 mb-8">
                {PLUS_FEATURES.map((f) => (
                  <li key={f.text} className="flex items-center gap-2.5 text-sm">
                    <span className="text-base shrink-0">{f.icon}</span>
                    <span className={f.highlight ? 'text-white font-medium' : 'text-neutral-300'}>
                      {f.text}
                    </span>
                    {f.highlight && (
                      <span className="ml-auto shrink-0 text-[10px] font-bold text-[#D97757] bg-[#D97757]/15 rounded-full px-1.5 py-0.5 uppercase tracking-wide">
                        Plus
                      </span>
                    )}
                  </li>
                ))}
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
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURE HIGHLIGHTS ── */}
      <section className="pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-2xl font-bold text-neutral-900 dark:text-neutral-50 text-center mb-8">
            What you unlock with Plus
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                icon: '🗓️',
                title: 'Weekly Autopilot',
                desc: 'One tap. Seven dinners planned, personalised to your household and budget.',
              },
              {
                icon: '🍱',
                title: 'Leftovers AI',
                desc: 'Track leftovers after cooking. Get reminders and recipes before they expire.',
              },
              {
                icon: '💰',
                title: 'Budget Intelligence',
                desc: 'Set a weekly food budget. We track spend, warn you early, and suggest swaps.',
              },
              {
                icon: '🛒',
                title: 'Smart Grocery List',
                desc: 'Auto-generated from your week plan. Export or share with one tap.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 flex gap-4"
              >
                <div className="shrink-0 text-2xl">{item.icon}</div>
                <div>
                  <p className="font-semibold text-neutral-900 dark:text-neutral-50 text-sm">{item.title}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
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
