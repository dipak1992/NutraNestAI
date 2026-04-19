'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Play, Clock, Sparkles, Camera, Truck, Users, ShieldCheck, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const HEADLINES = [
  'Stop thinking about what to eat.',
  'Dinner decisions, solved.',
  'What are you eating tonight? We already know.',
  "AI that knows what you'll actually eat.",
  'Your smartest meal plan starts tonight.',
  'Never stare at your fridge again.',
  'Dinner stress ends here.',
]

const PREVIEW_MEALS = [
  {
    title: 'Herb Butter Salmon Bowl',
    time: 25,
    score: '98% match',
    reason: 'Low effort + kid-approved flavors',
    tone: 'from-emerald-500/15 to-cyan-500/10',
    image: '/images/suggested-meal.svg',
  },
  {
    title: 'One-Pan Chicken Pesto Rice',
    time: 28,
    score: '96% match',
    reason: 'Uses pantry staples already at home',
    tone: 'from-amber-500/15 to-orange-500/10',
    image: '/images/suggested-meal.svg',
  },
  {
    title: 'Creamy Tomato Pasta',
    time: 20,
    score: '95% match',
    reason: 'Fast comfort pick for busy evenings',
    tone: 'from-rose-500/15 to-fuchsia-500/10',
    image: '/images/suggested-meal.svg',
  },
]

export function LandingHero() {
  const [headlineIdx, setHeadlineIdx] = useState(0)
  const [previewIdx, setPreviewIdx] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setHeadlineIdx((i) => (i + 1) % HEADLINES.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setPreviewIdx((i) => (i + 1) % PREVIEW_MEALS.length)
    }, 3200)
    return () => clearInterval(timer)
  }, [])

  const activePreview = PREVIEW_MEALS[previewIdx]

  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center bg-[#f6f8f7]">
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_12%_10%,rgba(16,185,129,0.14),transparent_55%),radial-gradient(900px_500px_at_85%_80%,rgba(245,158,11,0.14),transparent_52%),linear-gradient(180deg,#f8faf9_0%,#f3f7f5_40%,#ffffff_100%)]" />
        <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(15,23,42,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.035)_1px,transparent_1px)] [background-size:42px_42px]" />
        <div className="absolute -top-24 -right-24 h-[420px] w-[420px] rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute -bottom-28 -left-20 h-[320px] w-[320px] rounded-full bg-amber-300/25 blur-3xl" />
      </div>

      <div className="relative z-[1] mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 w-full">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left: Copy */}
          <div className="text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
            {/* Trust pill */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur border border-emerald-600/20 mb-8 shadow-sm"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
              <span className="text-sm font-medium text-emerald-800">3,200+ households use MealEase</span>
            </motion.div>

            {/* Rotating headline */}
            <div className="h-[120px] sm:h-[140px] lg:h-[160px] mb-6 relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.h1
                  key={headlineIdx}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5 }}
                  className="text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-6xl font-bold tracking-tight leading-[1.08] text-foreground absolute inset-x-0"
                >
                  {HEADLINES[headlineIdx]}
                </motion.h1>
              </AnimatePresence>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0"
            >
              Premium meal planning that adapts to your family, schedule, and pantry,
              then gives you a confident dinner decision in seconds.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-4"
            >
              <Button asChild size="lg" className="h-14 px-8 text-base font-semibold rounded-2xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
                <Link href="/signup">
                  Start Free 7-Day Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-14 px-8 text-base font-medium rounded-2xl border-border/80 hover:bg-muted/50">
                <Link href="#how-it-works">
                  <Play className="mr-2 h-4 w-4" />
                  See How It Works
                </Link>
              </Button>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="text-sm text-muted-foreground"
            >
              No credit card required · Cancel anytime
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto lg:mx-0"
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
            </motion.div>
          </div>

          {/* Right: Product highlights (desktop) */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="hidden lg:block"
          >
            <div className="relative">
              {/* Glow behind */}
              <div className="absolute -inset-6 bg-gradient-to-br from-emerald-300/20 via-cyan-100/30 to-amber-200/25 rounded-[2rem] blur-2xl" />

              {/* Main product card */}
              <div className="relative bg-white rounded-3xl shadow-2xl border border-border/40 overflow-hidden">
                {/* Top bar */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border/40">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg bg-primary text-white flex items-center justify-center text-xs font-bold">M</div>
                    <span className="text-sm font-bold text-gradient-sage">MealEase</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Family Command Center</span>
                </div>

                {/* Product highlight card */}
                <div className="p-6">
                  <div className="rounded-2xl overflow-hidden border border-border/30 mb-4">
                    <div className={`aspect-[16/10] bg-gradient-to-br ${activePreview.tone} p-4`}>
                      <div className="h-full w-full rounded-xl border border-white/70 bg-white/85 backdrop-blur p-3 flex gap-3">
                        <img
                          src={activePreview.image}
                          alt={activePreview.title}
                          className="h-full w-[52%] rounded-lg object-cover border border-white/70"
                        />
                        <div className="flex-1 px-1 py-1 flex flex-col justify-between">
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 w-fit">
                          <Sparkles className="h-3 w-3" />
                          AI picked for your household
                        </div>
                          <p className="text-xs text-foreground/75">{activePreview.reason}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-white">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-foreground">{activePreview.reason}</h3>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{activePreview.score}</span>
                      </div>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {activePreview.time} min</span>
                        <span className="flex items-center gap-1"><Sparkles className="h-3 w-3" /> Personalized</span>
                      </div>
                    </div>
                  </div>

                  {/* Feature pills */}
                  <div className="grid grid-cols-2 gap-2">
                    <Link href="/signup" className="flex items-center gap-2 rounded-xl bg-violet-50 border border-violet-100 p-3 hover:shadow-md hover:border-violet-200 transition-all">
                      <div className="h-8 w-8 rounded-lg bg-violet-100 flex items-center justify-center">
                        <Truck className="h-4 w-4 text-violet-600" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-violet-900">Zero-Cook Mode</p>
                        <p className="text-[10px] text-violet-600">Delivery picks</p>
                      </div>
                    </Link>
                    <Link href="/signup" className="flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-100 p-3 hover:shadow-md hover:border-amber-200 transition-all">
                      <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center">
                        <Camera className="h-4 w-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-amber-900">Snap & Cook</p>
                        <p className="text-[10px] text-amber-600">Photo → meals</p>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <div id="hero-sentinel" />
    </section>
  )
}
