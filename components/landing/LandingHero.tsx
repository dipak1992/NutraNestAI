'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, ChevronDown, Users, ShieldCheck, Zap } from 'lucide-react'

export function LandingHero() {

  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center bg-[#f6f8f7]">
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_12%_10%,rgba(16,185,129,0.14),transparent_55%),radial-gradient(900px_500px_at_85%_80%,rgba(245,158,11,0.14),transparent_52%),linear-gradient(180deg,#f8faf9_0%,#f3f7f5_40%,#ffffff_100%)]" />
        <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(15,23,42,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.035)_1px,transparent_1px)] [background-size:42px_42px]" />
        <div className="absolute -top-24 -right-24 h-[420px] w-[420px] rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute -bottom-28 -left-20 h-[320px] w-[320px] rounded-full bg-amber-300/25 blur-3xl" />
      </div>

      <div className="relative z-[1] mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 w-full">
        <div className="text-center max-w-3xl mx-auto">
            {/* Trust pill */}
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur border border-emerald-600/20 mb-8 shadow-sm"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
              <span className="text-sm font-medium text-emerald-800">3,200+ households use MealEase</span>
            </div>

            {/* Headline */}
            <h1
              className="text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-6xl font-bold tracking-tight leading-[1.08] text-foreground mb-6"
            >
              Dinner stress ends here.
            </h1>

            <p
              className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto"
            >
              Premium meal planning that adapts to your family, schedule, and pantry,
              then gives you a confident dinner decision in seconds.
            </p>

            {/* CTAs */}
            <div
              className="flex flex-col sm:flex-row gap-3 justify-center mb-4"
            >
              <Button asChild size="lg" className="h-14 px-8 text-base font-semibold rounded-2xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
                <Link href="/signup">
                  Start Free 7-Day Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-14 px-8 text-base font-medium rounded-2xl border-border/80 hover:bg-muted/50">
                <Link href="#how-it-works">
                  <ChevronDown className="mr-2 h-4 w-4" />
                  See How It Works
                </Link>
              </Button>
            </div>

            <p
              className="text-sm text-muted-foreground"
            >
              Cancel anytime · No commitment
            </p>

            <div
              className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto"
            >
              <div className="rounded-xl border border-white/70 bg-white/80 backdrop-blur px-3 py-2.5 shadow-sm">
                <div className="flex items-center gap-2 text-emerald-700 text-xs font-semibold">
                  <Users className="h-3.5 w-3.5" />
                  Families onboarded
                </div>
                <p className="mt-1 text-lg font-bold text-foreground">3.2k+</p>
              </div>
              <div className="rounded-xl border border-white/70 bg-white/80 backdrop-blur px-3 py-2.5 shadow-sm">
                <div className="flex items-center gap-2 text-amber-700 text-xs font-semibold">
                  <Zap className="h-3.5 w-3.5" />
                  Avg decision time
                </div>
                <p className="mt-1 text-lg font-bold text-foreground">18 sec</p>
              </div>
              <div className="rounded-xl border border-white/70 bg-white/80 backdrop-blur px-3 py-2.5 shadow-sm">
                <div className="flex items-center gap-2 text-cyan-700 text-xs font-semibold">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Allergy-safe rules
                </div>
                <p className="mt-1 text-lg font-bold text-foreground">Always on</p>
              </div>
            </div>
        </div>
      </div>
      <div id="hero-sentinel" />
    </section>
  )
}
