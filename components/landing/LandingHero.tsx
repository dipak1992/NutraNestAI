'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Play, Clock, Sparkles, Camera, Truck } from 'lucide-react'
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

export function LandingHero() {
  const [headlineIdx, setHeadlineIdx] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setHeadlineIdx((i) => (i + 1) % HEADLINES.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative overflow-hidden bg-[#FAFBFA] min-h-[90vh] flex items-center">
      {/* Background image */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          opacity: 0.45,
          filter: 'blur(1px)',
        }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[1] bg-[#FAFBFA]/65" />
      {/* Subtle gradient orbs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[2]">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/[0.07] blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-amber-200/30 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-emerald-50/60 blur-3xl" />
      </div>

      <div className="relative z-[3] mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 w-full">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left: Copy */}
          <div className="text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
            {/* Trust pill */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/15 mb-8"
            >
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">3,200+ families use MealEase</span>
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
              MealEase learns your taste, plans meals, adapts for your family,
              helps when you&apos;re busy — and even uses food already at home.
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
          </div>

          {/* Right: Dashboard mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="hidden lg:block"
          >
            <div className="relative">
              {/* Glow behind */}
              <div className="absolute -inset-6 bg-gradient-to-br from-primary/10 via-emerald-100/40 to-amber-100/30 rounded-[2rem] blur-2xl" />

              {/* Main dashboard card */}
              <div className="relative bg-white rounded-3xl shadow-2xl border border-border/40 overflow-hidden">
                {/* Top bar */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border/40">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg bg-primary text-white flex items-center justify-center text-xs font-bold">M</div>
                    <span className="text-sm font-bold text-gradient-sage">MealEase</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Tonight&apos;s Pick</span>
                </div>

                {/* Tonight card */}
                <div className="p-6">
                  <div className="rounded-2xl overflow-hidden border border-border/30 mb-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80&auto=format&fit=crop"
                      alt="Delicious meal"
                      className="w-full aspect-[16/10] object-cover"
                    />
                    <div className="p-4 bg-white">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-foreground">Herb Butter Salmon Bowl</h3>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">98% match</span>
                      </div>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> 25 min</span>
                        <span className="flex items-center gap-1"><Sparkles className="h-3 w-3" /> Personalized</span>
                      </div>
                    </div>
                  </div>

                  {/* Feature pills */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 rounded-xl bg-violet-50 border border-violet-100 p-3">
                      <div className="h-8 w-8 rounded-lg bg-violet-100 flex items-center justify-center">
                        <Truck className="h-4 w-4 text-violet-600" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-violet-900">Zero-Cook Mode</p>
                        <p className="text-[10px] text-violet-600">Delivery picks</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-100 p-3">
                      <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center">
                        <Camera className="h-4 w-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-amber-900">Snap & Cook</p>
                        <p className="text-[10px] text-amber-600">Photo → meals</p>
                      </div>
                    </div>
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
