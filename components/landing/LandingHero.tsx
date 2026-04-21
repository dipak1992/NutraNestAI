'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Play, Sparkles, Users, ShieldCheck, Zap } from 'lucide-react'

export function LandingHero() {
  function handleWatch() {
    const section = document.getElementById('how-it-works-media')
    if (!section) return

    section.scrollIntoView({ behavior: 'smooth', block: 'center' })

    const video = section.querySelector('video')
    if (video instanceof HTMLVideoElement) {
      video.play().catch(() => undefined)
    }
  }

  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center bg-[#f6f8f7]">
      {/* ── Background ── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_12%_10%,rgba(16,185,129,0.14),transparent_55%),radial-gradient(900px_500px_at_85%_80%,rgba(245,158,11,0.14),transparent_52%),linear-gradient(180deg,#f8faf9_0%,#f3f7f5_40%,#ffffff_100%)]" />
        <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(15,23,42,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.035)_1px,transparent_1px)] [background-size:42px_42px]" />
        <div className="absolute -top-24 -right-24 h-[420px] w-[420px] rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute -bottom-28 -left-20 h-[320px] w-[320px] rounded-full bg-amber-300/25 blur-3xl" />
      </div>

      <div className="relative z-[1] mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Left: Copy ── */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Trust pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur border border-emerald-600/20 mb-8 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
              <span className="text-sm font-medium text-emerald-800">3,200+ households use MealEase</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] xl:text-[3.75rem] font-bold tracking-tight leading-[1.1] text-foreground mb-5">
              Stop asking{' '}
              <span className="text-emerald-600 whitespace-nowrap">&ldquo;What&rsquo;s for dinner?&rdquo;</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-8 max-w-xl">
              MealEase turns preferences, pantry items, and family needs into instant meal picks, smart weekly plans, and calmer evenings.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4 w-full sm:w-auto">
              <Button asChild size="lg" className="h-14 px-8 text-base font-semibold rounded-2xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
                <Link href="/signup">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleWatch}
                className="h-14 px-8 text-base font-medium rounded-2xl border-border/80 hover:bg-muted/50 gap-2.5"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-foreground/10">
                  <Play className="h-3 w-3 fill-current ml-0.5" />
                </span>
                Watch How It Works
              </Button>
            </div>

            {/* Trust line */}
            <p className="text-sm text-muted-foreground">
              No credit card required &middot; Free plan available &middot; Built for real households
            </p>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-3 gap-3 w-full max-w-sm">
              <div className="rounded-xl border border-white/70 bg-white/80 backdrop-blur px-3 py-2.5 shadow-sm">
                <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-semibold mb-1">
                  <Users className="h-3.5 w-3.5 shrink-0" />
                  <span>Families</span>
                </div>
                <p className="text-lg font-bold text-foreground">3.2k+</p>
              </div>
              <div className="rounded-xl border border-white/70 bg-white/80 backdrop-blur px-3 py-2.5 shadow-sm">
                <div className="flex items-center gap-1.5 text-amber-700 text-xs font-semibold mb-1">
                  <Zap className="h-3.5 w-3.5 shrink-0" />
                  <span>Decision</span>
                </div>
                <p className="text-lg font-bold text-foreground">18 sec</p>
              </div>
              <div className="rounded-xl border border-white/70 bg-white/80 backdrop-blur px-3 py-2.5 shadow-sm">
                <div className="flex items-center gap-1.5 text-cyan-700 text-xs font-semibold mb-1">
                  <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                  <span>Safe</span>
                </div>
                <p className="text-lg font-bold text-foreground">Always</p>
              </div>
            </div>
          </div>

          {/* ── Right: Premium preview ── */}
          <div className="w-full">
            <div className="relative overflow-hidden rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-[0_24px_80px_-12px_rgba(0,0,0,0.18),0_0_0_1px_rgba(0,0,0,0.05)] backdrop-blur-xl">
              <div className="absolute inset-x-8 top-0 h-24 bg-gradient-to-b from-emerald-200/50 to-transparent blur-2xl" />

              <div className="relative rounded-[22px] border border-black/[0.06] bg-[#fcfdfc] p-4 shadow-[0_12px_40px_-18px_rgba(0,0,0,0.28)]">
                <div className="mb-4 flex items-center justify-between rounded-2xl border border-emerald-100 bg-white px-4 py-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Tonight&apos;s plan</p>
                    <p className="mt-1 text-lg font-semibold text-foreground">Creamy pesto salmon bowls</p>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                    <Sparkles className="h-5 w-5" />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-[1.4fr_0.9fr]">
                  <div className="rounded-2xl bg-[linear-gradient(145deg,#eaf8f1_0%,#ffffff_55%,#fff3df_100%)] p-4">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-emerald-800 shadow-sm">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      Personalized for 4 people
                    </div>
                    <div className="space-y-3">
                      <div className="rounded-2xl bg-white/90 p-3 shadow-sm">
                        <p className="text-sm font-semibold text-foreground">Swap suggestions</p>
                        <p className="mt-1 text-sm text-muted-foreground">Dairy-free sauce for mom, soft veggie sides for the kids.</p>
                      </div>
                      <div className="rounded-2xl bg-white/90 p-3 shadow-sm">
                        <p className="text-sm font-semibold text-foreground">Pantry matched</p>
                        <p className="mt-1 text-sm text-muted-foreground">Uses rice, frozen peas, and garlic you already have.</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="rounded-2xl border border-black/[0.06] bg-white p-4 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Prep time</p>
                      <p className="mt-2 text-3xl font-bold text-foreground">22 min</p>
                    </div>
                    <div className="rounded-2xl border border-black/[0.06] bg-white p-4 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Smart grocery list</p>
                      <ul className="mt-3 space-y-2 text-sm text-foreground">
                        <li>Salmon fillets</li>
                        <li>Basil pesto</li>
                        <li>Cucumber + avocado</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.06] bg-white/70 px-3 py-1 backdrop-blur shadow-sm text-xs font-medium text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Watch the full walkthrough below
              </div>
            </div>
          </div>

        </div>
      </div>
      <div id="hero-sentinel" />
    </section>
  )
}
