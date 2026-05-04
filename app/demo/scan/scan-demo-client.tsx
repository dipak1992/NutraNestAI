'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Upload, Sparkles, Clock, ChefHat, ShieldCheck, ArrowRight, RefreshCw, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Nav } from '@/components/landing/Nav'

// ── Demo data — simulated scan results ──────────────────────────────────────

const DEMO_INGREDIENTS = [
  { name: 'Chicken breast', confidence: 0.95, fromPantry: true },
  { name: 'Bell peppers', confidence: 0.92, fromPantry: true },
  { name: 'Rice', confidence: 0.88, fromPantry: true },
  { name: 'Soy sauce', confidence: 0.85, fromPantry: true },
  { name: 'Garlic', confidence: 0.90, fromPantry: true },
  { name: 'Broccoli', confidence: 0.87, fromPantry: true },
]

const DEMO_MEALS = [
  {
    id: 'demo-1',
    title: 'Chicken Stir-Fry Bowl',
    tagline: 'Quick, colorful, and uses everything in your fridge.',
    cookTime: 22,
    difficulty: 'easy' as const,
    pantryMatch: 92,
    tags: ['Quick', 'High Protein', 'Family-Friendly'],
  },
  {
    id: 'demo-2',
    title: 'Garlic Chicken & Rice',
    tagline: 'Comfort food that practically cooks itself.',
    cookTime: 28,
    difficulty: 'easy' as const,
    pantryMatch: 85,
    tags: ['Budget', 'One-Pan', 'Meal Prep'],
  },
  {
    id: 'demo-3',
    title: 'Pepper & Chicken Fajita Bowl',
    tagline: 'All the flavor, zero the takeout guilt.',
    cookTime: 25,
    difficulty: 'easy' as const,
    pantryMatch: 88,
    tags: ['Quick', 'Customizable', 'Kid-Approved'],
  },
]

// ── Component ───────────────────────────────────────────────────────────────

type DemoPhase = 'upload' | 'scanning' | 'results'

export function ScanDemoClient() {
  const [phase, setPhase] = useState<DemoPhase>('upload')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    setPhase('scanning')

    // Simulate AI processing delay
    setTimeout(() => setPhase('results'), 2400)
  }, [])

  const handleCameraCapture = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleReset = useCallback(() => {
    setPhase('upload')
    setPreviewUrl(null)
  }, [])

  const handleDemoWithoutPhoto = useCallback(() => {
    setPreviewUrl('/landing/pantry.jpg')
    setPhase('scanning')
    setTimeout(() => setPhase('results'), 2000)
  }, [])

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-gradient-to-b from-emerald-50/50 via-white to-white dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-950">
        <div className="mx-auto max-w-2xl px-4 pb-20 pt-24 sm:px-6 sm:pt-28">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 mb-4">
              <Camera className="h-3 w-3" />
              Free Demo — No Sign-Up Required
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white tracking-tight">
              Snap your fridge. Get dinner ideas.
            </h1>
            <p className="mt-3 text-lg text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
              See how MealEase turns a photo of your ingredients into personalized meal suggestions in seconds.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {/* ── Phase 1: Upload ── */}
            {phase === 'upload' && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {/* Upload area */}
                <div
                  className="relative rounded-3xl border-2 border-dashed border-emerald-300 dark:border-emerald-700 bg-white dark:bg-neutral-900 p-8 sm:p-12 text-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20 transition-all"
                  onClick={handleCameraCapture}
                >
                  <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center mb-4">
                    <Camera className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <p className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
                    Take a photo or upload an image
                  </p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                    Snap your fridge, pantry, or any ingredients you have
                  </p>
                  <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      size="lg"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-6"
                      onClick={(e) => { e.stopPropagation(); handleCameraCapture() }}
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Take Photo
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="rounded-full px-6"
                      onClick={(e) => { e.stopPropagation(); handleCameraCapture() }}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Image
                    </Button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </div>

                {/* Or try without photo */}
                <div className="text-center">
                  <button
                    onClick={handleDemoWithoutPhoto}
                    className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 underline underline-offset-2"
                  >
                    Or try with a sample photo →
                  </button>
                </div>

                {/* Trust signals */}
                <div className="grid grid-cols-3 gap-4 pt-4">
                  {[
                    { icon: ShieldCheck, label: 'No sign-up needed' },
                    { icon: Clock, label: 'Results in 3 seconds' },
                    { icon: Sparkles, label: 'AI-powered matching' },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="text-center">
                      <Icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mx-auto mb-1" />
                      <p className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">{label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── Phase 2: Scanning animation ── */}
            {phase === 'scanning' && (
              <motion.div
                key="scanning"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="text-center space-y-6"
              >
                {previewUrl && (
                  <div className="relative mx-auto w-64 h-64 rounded-2xl overflow-hidden shadow-lg">
                    <Image
                      src={previewUrl}
                      alt="Your ingredients"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-emerald-600/20 animate-pulse" />
                    {/* Scanning line animation */}
                    <motion.div
                      className="absolute left-0 right-0 h-0.5 bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.6)]"
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <RefreshCw className="h-5 w-5 text-emerald-600 animate-spin" />
                    <p className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
                      Analyzing your ingredients...
                    </p>
                  </div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Our AI is identifying what you have and finding the best meal matches
                  </p>
                </div>
              </motion.div>
            )}

            {/* ── Phase 3: Results ── */}
            {phase === 'results' && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Detected ingredients */}
                <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800/50 bg-white dark:bg-neutral-900 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    <h2 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                      {DEMO_INGREDIENTS.length} ingredients detected
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {DEMO_INGREDIENTS.map((ing) => (
                      <span
                        key={ing.name}
                        className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-medium px-2.5 py-1 border border-emerald-200 dark:border-emerald-800/50"
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        {ing.name}
                        <span className="text-emerald-500 text-[10px]">{Math.round(ing.confidence * 100)}%</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Meal suggestions */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="h-5 w-5 text-[#D97757]" />
                    <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                      Meals you can make tonight
                    </h2>
                  </div>
                  <div className="space-y-3">
                    {DEMO_MEALS.map((meal, i) => (
                      <motion.div
                        key={meal.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.12, duration: 0.25 }}
                        className="rounded-2xl border border-border/60 bg-white dark:bg-neutral-900 p-5 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <h3 className="font-bold text-neutral-900 dark:text-white">{meal.title}</h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">{meal.tagline}</p>
                          </div>
                          <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold px-2.5 py-1 border border-emerald-200 dark:border-emerald-800/50">
                            {meal.pantryMatch}% match
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-3">
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 rounded-full px-2.5 py-0.5">
                            <Clock className="h-3 w-3" />
                            {meal.cookTime} min
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 rounded-full px-2.5 py-0.5 capitalize">
                            <ChefHat className="h-3 w-3" />
                            {meal.difficulty}
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/40 rounded-full px-2.5 py-0.5 border border-teal-200 dark:border-teal-800/50">
                            <ShieldCheck className="h-3 w-3" />
                            Chef-Verified
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                          {meal.tags.map((tag) => (
                            <span key={tag} className="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-800/50 rounded-full px-2 py-0.5">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* CTA section */}
                <div className="rounded-2xl bg-gradient-to-br from-[#D97757]/10 to-orange-50 dark:from-[#D97757]/20 dark:to-neutral-900 border border-[#D97757]/20 p-6 text-center">
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
                    Like what you see? Get the full experience.
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-5 max-w-sm mx-auto">
                    Sign up free to unlock full recipes, step-by-step cooking, grocery lists, and personalized meal plans for your whole family.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                      href="/signup"
                      className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#D97757] to-[#E8895A] hover:from-[#C86646] hover:to-[#D97757] text-white font-semibold rounded-full px-6 py-3 transition-all shadow-md shadow-orange-200/50 dark:shadow-none"
                    >
                      Start free — no credit card
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={handleReset}
                      className="inline-flex items-center justify-center gap-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium rounded-full px-6 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Try another photo
                    </button>
                  </div>
                </div>

                {/* Social proof */}
                <div className="text-center pt-4">
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Trusted by 2,000+ families • Free forever plan available • No credit card required
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </>
  )
}
