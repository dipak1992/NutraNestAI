'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function LandingFinalCTA() {
  return (
    <section className="relative py-24 sm:py-32 bg-slate-950 text-white overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-1/4 left-1/4 h-80 w-80 rounded-full bg-primary/10 blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-violet-500/10 blur-[100px]" />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-400 mb-4">
            Let&apos;s fix dinner
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            What are you eating tonight?
          </h2>
          <p className="text-lg sm:text-xl text-white/50 max-w-xl mx-auto mb-10">
            Stop deciding. Start enjoying. Let MealEase handle the hardest question of the day.
          </p>

          <Link href="/signup">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white font-semibold text-base h-14 px-10 rounded-xl shadow-lg shadow-primary/25"
            >
              Let MealEase Decide
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>

          <p className="text-sm text-white/30 mt-6">
            Free 7-day trial &middot; No credit card required
          </p>
        </motion.div>
      </div>
    </section>
  )
}
