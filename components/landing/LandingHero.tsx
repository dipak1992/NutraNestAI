'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  Play,
  Sparkles,
  Users,
  ShieldCheck,
  Zap,
  Clock,
  Moon,
  Calendar,
  Camera,
  DollarSign,
} from 'lucide-react'

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
    <section className="relative overflow-hidden min-h-[92vh] flex items-center bg-[#f6f8f7]">
      {/* ── Cinematic background ── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        {/* Warm kitchen atmosphere */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1920&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(2px)',
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(1400px_700px_at_8%_8%,rgba(16,185,129,0.16),transparent_55%),radial-gradient(1000px_600px_at_90%_85%,rgba(245,158,11,0.16),transparent_52%),linear-gradient(180deg,#f8faf9_0%,#f3f7f5_40%,#ffffff_100%)]" />
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(15,23,42,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.025)_1px,transparent_1px)] [background-size:48px_48px]" />
        <div className="absolute -top-32 -right-32 h-[520px] w-[520px] rounded-full bg-emerald-400/15 blur-[100px]" />
        <div className="absolute -bottom-36 -left-24 h-[400px] w-[400px] rounded-full bg-amber-300/20 blur-[100px]" />
      </div>

      <div className="relative z-[1] mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ── Left: Copy ── */}
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
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm border border-emerald-600/15 mb-8 shadow-sm"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-medium text-emerald-800">3,200+ households use MealEase</span>
            </motion.div>

            {/* Headline */}
            <h1 className="text-[2.5rem] sm:text-5xl lg:text-[3.5rem] xl:text-[4rem] font-bold tracking-tight leading-[1.08] text-foreground mb-6">
              Stop asking{' '}
              <span className="relative">
                <span className="text-emerald-600">&ldquo;What&rsquo;s for dinner?&rdquo;</span>
                <svg className="absolute -bottom-1 left-0 w-full h-3 text-emerald-400/30" viewBox="0 0 200 8" preserveAspectRatio="none">
                  <path d="M0 7 Q50 0 100 5 Q150 10 200 3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-8 max-w-xl">
              MealEase helps busy households decide dinner fast, plan the week, use what they have, and stress less.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5 w-full sm:w-auto">
              <Button asChild size="lg" className="h-14 px-8 text-base font-semibold rounded-2xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] transition-all">
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
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground/10">
                  <Play className="h-3 w-3 fill-current ml-0.5" />
                </span>
                Watch How It Works
              </Button>
            </div>

            {/* Trust line */}
            <p className="text-sm text-muted-foreground/80">
              No credit card required · Free plan available · Cancel anytime
            </p>

            {/* Micro stats */}
            <div className="mt-10 grid grid-cols-3 gap-3 w-full max-w-sm">
              {[
                { icon: Users, label: 'Families', value: '3.2k+', color: 'text-emerald-700' },
                { icon: Zap, label: 'Decision', value: '18 sec', color: 'text-amber-700' },
                { icon: ShieldCheck, label: 'Allergy-safe', value: 'Always', color: 'text-cyan-700' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl border border-white/70 bg-white/85 backdrop-blur px-3 py-2.5 shadow-sm">
                  <div className={`flex items-center gap-1.5 ${stat.color} text-xs font-semibold mb-1`}>
                    <stat.icon className="h-3.5 w-3.5 shrink-0" />
                    <span>{stat.label}</span>
                  </div>
                  <p className="text-lg font-bold text-foreground">{stat.value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Right: Premium product preview ── */}
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="w-full"
          >
            <div className="relative overflow-hidden rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-[0_24px_80px_-12px_rgba(0,0,0,0.18),0_0_0_1px_rgba(0,0,0,0.05)] backdrop-blur-xl">
              <div className="absolute inset-x-8 top-0 h-24 bg-gradient-to-b from-emerald-200/50 to-transparent blur-2xl" />

              <div className="relative rounded-[22px] border border-black/[0.06] bg-[#fcfdfc] p-4 shadow-[0_12px_40px_-18px_rgba(0,0,0,0.28)]">
                {/* Tonight's plan header */}
                <div className="mb-4 flex items-center justify-between rounded-2xl border border-emerald-100 bg-white px-4 py-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Tonight&apos;s plan</p>
                    <p className="mt-1 text-lg font-semibold text-foreground">Creamy pesto salmon bowls</p>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                    <Sparkles className="h-5 w-5" />
                  </div>
                </div>

                {/* Dashboard preview grid */}
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
              <div className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.06] bg-white/70 px-3 py-1 backdrop-blur shadow-sm text-xs font-medium text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Watch the full walkthrough below
              </div>
            </div>
          </motion.div>

        </div>
      </div>
      <div id="hero-sentinel" />
    </section>
  )
}
