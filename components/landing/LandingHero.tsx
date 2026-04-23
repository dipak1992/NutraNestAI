'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ProductDemoModal } from '@/components/landing/ProductDemoModal'
import {
  ArrowRight,
  Play,
  Sparkles,
  Users,
  ShieldCheck,
  Zap,
  Clock,
} from 'lucide-react'

export function LandingHero() {
  const [demoOpen, setDemoOpen] = useState(false)

  return (
    <section className="relative overflow-hidden min-h-[92vh] flex items-center">
      {/* ── Cinematic photo background ── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        {/* Desktop hero image */}
        <Image
          src="/landing/hero.jpg"
          alt=""
          fill
          priority
          sizes="(max-width: 767px) 0px, 100vw"
          className="object-cover object-center hidden md:block"
          quality={85}
        />

        {/* Mobile-optimized portrait image — hero-mobile.jpg, focal point upper-center for face/food prominence */}
        <Image
          src="/mobile/hero-mobile.jpg"
          alt=""
          fill
          priority
          sizes="(max-width: 767px) 100vw, 0px"
          className="object-cover object-[center_25%] md:hidden"
          quality={85}
        />

        {/* Premium multi-layer overlay system */}
        {/* Base darkening — slightly heavier on mobile for text legibility */}
        <div className="absolute inset-0 bg-black/40 md:bg-black/40" />
        {/* Warm gradient from left for text readability — stronger bottom-up on mobile */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/50 to-transparent" />
        {/* Bottom fade — deeper on mobile so CTA text pops */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-slate-950/20 md:from-slate-950/60 md:via-transparent md:to-slate-950/20" />
        {/* Subtle warm tint */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 via-transparent to-amber-950/15" />
        {/* Fine grain texture for premium feel */}
        <div className="absolute inset-0 opacity-[0.03] [background-image:url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWx0ZXI9InVybCgjYSkiIG9wYWNpdHk9IjAuMDUiLz48L3N2Zz4=')]" />
      </div>

      <div className="relative z-[1] mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ── Left: Copy (light text on dark photo) ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            {/* Trust pill */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 mb-8 shadow-lg"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm font-medium text-white/90">3,200+ households use MealEase</span>
            </motion.div>

            {/* Headline */}
            <h1 className="text-[2.5rem] sm:text-5xl lg:text-[3.5rem] xl:text-[4rem] font-bold tracking-tight leading-[1.08] text-white mb-6 drop-shadow-[0_2px_12px_rgba(0,0,0,0.3)]">
              Stop asking{' '}
              <span className="relative">
                <span className="text-emerald-400">&ldquo;What&rsquo;s for dinner?&rdquo;</span>
                <svg className="absolute -bottom-1 left-0 w-full h-3 text-emerald-400/40" viewBox="0 0 200 8" preserveAspectRatio="none">
                  <path d="M0 7 Q50 0 100 5 Q150 10 200 3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-white/75 leading-relaxed mb-8 max-w-xl drop-shadow-[0_1px_4px_rgba(0,0,0,0.2)]">
              MealEase helps busy households decide dinner fast, plan the week, use what they have, and stress less.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5 w-full sm:w-auto">
              <Button asChild size="lg" className="h-14 px-8 text-base font-semibold rounded-2xl shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 hover:scale-[1.02] transition-all">
                <Link href="/signup">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setDemoOpen(true)}
                className="h-14 px-8 text-base font-medium rounded-2xl border-white/20 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:border-white/30 gap-2.5"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
                  <Play className="h-3 w-3 fill-current ml-0.5" />
                </span>
                Watch How It Works
              </Button>
            </div>

            {/* Trust line */}
            <p className="text-sm text-white/50">
              No credit card required · Free plan available · Cancel anytime
            </p>

            {/* Micro stats */}
            <div className="mt-10 grid grid-cols-3 gap-3 w-full max-w-sm">
              {[
                { icon: Users, label: 'Families', value: '3.2k+', color: 'text-emerald-400' },
                { icon: Zap, label: 'Decision', value: '18 sec', color: 'text-amber-400' },
                { icon: ShieldCheck, label: 'Allergy-safe', value: 'Always', color: 'text-cyan-400' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl border border-white/10 bg-white/[0.07] backdrop-blur-md px-3 py-2.5 shadow-lg">
                  <div className={`flex items-center gap-1.5 ${stat.color} text-xs font-semibold mb-1`}>
                    <stat.icon className="h-3.5 w-3.5 shrink-0" />
                    <span>{stat.label}</span>
                  </div>
                  <p className="text-lg font-bold text-white">{stat.value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Right: Premium product preview (glass card over photo) ── */}
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="w-full"
          >
            <div className="relative overflow-hidden rounded-[28px] border border-white/15 bg-white/[0.08] p-5 shadow-[0_24px_80px_-12px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.06)] backdrop-blur-xl">
              <div className="absolute inset-x-8 top-0 h-24 bg-gradient-to-b from-emerald-400/20 to-transparent blur-2xl" />

              <div className="relative rounded-[22px] border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm">
                {/* Tonight's plan header */}
                <div className="mb-4 flex items-center justify-between rounded-2xl border border-emerald-400/20 bg-white/[0.08] px-4 py-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-400">Tonight&apos;s plan</p>
                    <p className="mt-1 text-lg font-semibold text-white">Creamy pesto salmon bowls</p>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-400">
                    <Sparkles className="h-5 w-5" />
                  </div>
                </div>

                {/* Dashboard preview grid */}
                <div className="grid gap-3 sm:grid-cols-[1.4fr_0.9fr]">
                  <div className="rounded-2xl bg-gradient-to-br from-emerald-400/10 via-white/[0.04] to-amber-400/10 p-4">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-emerald-300 shadow-sm">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      Personalized for 4 people
                    </div>
                    <div className="space-y-3">
                      <div className="rounded-2xl bg-white/[0.07] backdrop-blur-sm p-3">
                        <p className="text-sm font-semibold text-white">Swap suggestions</p>
                        <p className="mt-1 text-sm text-white/60">Dairy-free sauce for mom, soft veggie sides for the kids.</p>
                      </div>
                      <div className="rounded-2xl bg-white/[0.07] backdrop-blur-sm p-3">
                        <p className="text-sm font-semibold text-white">Pantry matched</p>
                        <p className="mt-1 text-sm text-white/60">Uses rice, frozen peas, and garlic you already have.</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/50">Prep time</p>
                      <p className="mt-2 text-3xl font-bold text-white">22 min</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/50">Smart grocery list</p>
                      <ul className="mt-3 space-y-2 text-sm text-white/80">
                        <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Salmon fillets</li>
                        <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Basil pesto</li>
                        <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Cucumber + avocado</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="mt-4 flex justify-end">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.07] px-3 py-1 backdrop-blur-md shadow-lg text-xs font-medium text-white/60">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Watch the full walkthrough below
              </div>
            </div>
          </motion.div>

        </div>
      </div>
      <div id="hero-sentinel" />

      {/* Product demo modal */}
      <ProductDemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </section>
  )
}
