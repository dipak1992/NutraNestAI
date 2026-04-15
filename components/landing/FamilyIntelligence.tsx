'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLightOnboardingStore } from '@/lib/store'
import type { KidsAgeGroup } from '@/types'
import { Check, ChevronRight, ShieldCheck, Utensils } from 'lucide-react'

const AGE_OPTIONS: { id: KidsAgeGroup; emoji: string; label: string; range: string }[] = [
  { id: 'baby',       emoji: '👶', label: 'Baby',    range: '0–2 yrs' },
  { id: 'toddler',    emoji: '🧒', label: 'Toddler', range: '3–6 yrs' },
  { id: 'school_age', emoji: '🧑', label: 'Kids',    range: '7–12 yrs' },
]

const TRUST_BULLETS = [
  'Picky-eater friendly — mild, familiar flavours',
  'One base recipe adapted for the whole family',
  'Age-appropriate textures & safety checks built in',
]

export function FamilyIntelligence() {
  const [selected, setSelected] = useState<KidsAgeGroup | null>(null)
  const router = useRouter()
  const { setHasKids, setKidsAgeGroup } = useLightOnboardingStore()

  function handleCta() {
    setHasKids(true)
    if (selected) setKidsAgeGroup(selected)
    router.push('/onboarding')
  }

  return (
    <section id="family" className="py-20 sm:py-24 bg-gradient-to-b from-orange-50/50 to-background">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ─── Left: copy + selector + CTA ─── */}
          <div>
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary/80 mb-3">
              Family Intelligence
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-[1.1] mb-4">
              Meals your kids will{' '}
              <span className="text-gradient-sage">actually eat.</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8 max-w-md">
              Tell us their age — our AI adapts every meal to match textures, spice&nbsp;levels, and portion sizes your child needs. No separate app. No extra steps.
            </p>

            {/* Age selector pills */}
            <p className="text-sm font-medium mb-3">Select your child&apos;s age group</p>
            <div className="flex flex-wrap gap-3 mb-8">
              {AGE_OPTIONS.map((opt) => {
                const active = selected === opt.id
                return (
                  <button
                    key={opt.id}
                    onClick={() => setSelected(active ? null : opt.id)}
                    className={`
                      flex items-center gap-2.5 rounded-2xl border px-5 py-3.5
                      transition-all text-left
                      ${active
                        ? 'border-primary bg-primary/10 shadow-sm ring-1 ring-primary/30'
                        : 'border-border/60 bg-white hover:border-primary/30 hover:shadow-sm'
                      }
                    `}
                  >
                    <span className="text-2xl">{opt.emoji}</span>
                    <div>
                      <span className="block text-sm font-semibold leading-tight">{opt.label}</span>
                      <span className="block text-xs text-muted-foreground">{opt.range}</span>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* CTA */}
            <button
              onClick={handleCta}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-primary/90 transition-colors"
            >
              Start planning for my family
              <ChevronRight className="h-4 w-4" />
            </button>

            {/* Trust bullets */}
            <ul className="mt-8 space-y-2">
              {TRUST_BULLETS.map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          {/* ─── Right: visual meal comparison card ─── */}
          <div className="hidden lg:block" aria-hidden>
            <div className="relative">
              {/* Soft glow */}
              <div className="absolute -inset-4 bg-primary/8 rounded-3xl blur-2xl" />

              <div className="relative rounded-3xl border border-border/40 bg-white shadow-xl overflow-hidden p-6">
                {/* Header */}
                <div className="flex items-center gap-2 mb-5">
                  <Utensils className="h-4 w-4 text-primary" />
                  <span className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">
                    Same recipe, adapted automatically
                  </span>
                </div>

                {/* Base recipe */}
                <div className="rounded-2xl border border-border/50 bg-muted/30 p-4 mb-4">
                  <p className="text-xs text-muted-foreground mb-1">Base recipe</p>
                  <p className="font-semibold text-lg">Chicken Penne Arrabbiata</p>
                  <p className="text-sm text-muted-foreground mt-1">Spicy tomato, garlic, red pepper flakes, parmesan</p>
                </div>

                {/* Adaptations */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Adult */}
                  <div className="rounded-xl border border-border/50 p-4">
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="text-base">🧑‍🍳</span>
                      <span className="text-xs font-semibold">Adults</span>
                    </div>
                    <p className="text-sm font-medium">Spicy garlic arrabbiata</p>
                    <p className="text-xs text-muted-foreground mt-1">Full heat, red pepper flakes, aged parmesan</p>
                    <div className="mt-3 flex gap-1.5">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">🌶️ Spicy</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Bold</span>
                    </div>
                  </div>

                  {/* Kids */}
                  <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="text-base">👶</span>
                      <span className="text-xs font-semibold text-primary">Kids version</span>
                    </div>
                    <p className="text-sm font-medium">Mild creamy tomato penne</p>
                    <p className="text-xs text-muted-foreground mt-1">No spice, cream-stirred sauce, soft veggies</p>
                    <div className="mt-3 flex gap-1.5">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">🛡️ Kid-safe</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">Mild</span>
                    </div>
                  </div>
                </div>

                {/* Footer trust line */}
                <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  AI safety check passed — age-appropriate ingredients verified
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
