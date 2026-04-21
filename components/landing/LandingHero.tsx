'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Play, Users, ShieldCheck, Zap } from 'lucide-react'

export function LandingHero() {
  const videoRef = useRef<HTMLVideoElement>(null)

  function handleWatch() {
    if (!videoRef.current) return
    const rect = videoRef.current.getBoundingClientRect()
    const inView = rect.top >= 0 && rect.bottom <= window.innerHeight
    if (!inView) {
      videoRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    videoRef.current.muted = false
    videoRef.current.play().catch(() => {
      if (videoRef.current) videoRef.current.muted = true
    })
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

          {/* ── Right: Video ── */}
          {/* Mobile: natural grid order puts this below the copy column.
              Desktop: sits in the right lg:grid-col automatically. */}
          <div className="w-full">
            {/* Premium device-frame container */}
            <div className="relative rounded-[20px] overflow-hidden shadow-[0_24px_80px_-12px_rgba(0,0,0,0.20),0_0_0_1px_rgba(0,0,0,0.05)]">
              {/* macOS-style window chrome */}
              <div className="flex items-center gap-1.5 px-4 py-3 bg-white/90 backdrop-blur-md border-b border-black/[0.06]">
                <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                <span className="h-3 w-3 rounded-full bg-[#27c840]" />
                <div className="ml-3 flex-1 h-[22px] rounded-md bg-black/[0.05] flex items-center justify-center">
                  <span className="text-[11px] text-muted-foreground/50 font-medium tracking-tight select-none">mealease.app</span>
                </div>
              </div>

              {/* Video — gradient bg acts as loading fallback thumbnail */}
              <div className="aspect-video bg-gradient-to-br from-emerald-100/80 via-white to-amber-100/60">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  src="/hero.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
              </div>
            </div>

            {/* Floating caption */}
            <div className="mt-3 flex justify-end">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 backdrop-blur border border-black/[0.06] shadow-sm text-xs font-medium text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live demo &middot; No setup required
              </div>
            </div>
          </div>

        </div>
      </div>
      <div id="hero-sentinel" />
    </section>
  )
}
