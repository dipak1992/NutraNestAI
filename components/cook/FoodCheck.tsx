'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Camera,
  Upload,
  Loader2,
  Flame,
  Beef,
  Heart,
  Target,
  ArrowRightLeft,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { FoodCheckResult, FoodVerdict } from '@/types/cook-tools'

interface FoodCheckProps {
  onBack: () => void
}

type Phase = 'upload' | 'analyzing' | 'results'

const VERDICT_CONFIG: Record<FoodVerdict, { label: string; emoji: string; color: string; bg: string; border: string }> = {
  healthy:   { label: 'Healthy',   emoji: '🥗', color: 'text-emerald-700', bg: 'bg-emerald-50',  border: 'border-emerald-200' },
  balanced:  { label: 'Balanced',  emoji: '⚖️', color: 'text-blue-700',    bg: 'bg-blue-50',     border: 'border-blue-200' },
  indulgent: { label: 'Indulgent', emoji: '🍰', color: 'text-amber-700',   bg: 'bg-amber-50',    border: 'border-amber-200' },
}

const PROTEIN_CONFIG: Record<string, { label: string; color: string }> = {
  low:      { label: 'Low Protein',      color: 'text-red-600' },
  moderate: { label: 'Moderate Protein',  color: 'text-amber-600' },
  high:     { label: 'High Protein',      color: 'text-emerald-600' },
}

export function FoodCheck({ onBack }: FoodCheckProps) {
  const [phase, setPhase] = useState<Phase>('upload')
  const [imageData, setImageData] = useState<string | null>(null)
  const [imageMime, setImageMime] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [result, setResult] = useState<FoodCheckResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async () => {
      const dataUrl = reader.result as string
      const base64 = dataUrl.split(',')[1]
      setImageData(base64)
      setImageMime(file.type)
      setImagePreview(dataUrl)
      setError(null)

      // Auto-analyze immediately
      setPhase('analyzing')

      try {
        const res = await fetch('/api/food-check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64, mimeType: file.type }),
        })

        if (!res.ok) {
          const body = await res.json().catch(() => null)
          throw new Error(body?.error ?? `Server error (${res.status})`)
        }

        const data = await res.json()
        if (data.success && data.data) {
          setResult(data.data as FoodCheckResult)
          setPhase('results')
        } else {
          throw new Error(data.error ?? 'No results returned')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to analyze food')
        setPhase('upload')
      }
    }
    reader.readAsDataURL(file)
  }, [])

  const handleReset = useCallback(() => {
    setPhase('upload')
    setImageData(null)
    setImageMime(null)
    setImagePreview(null)
    setResult(null)
    setError(null)
  }, [])

  return (
    <div>
      <AnimatePresence mode="wait">
        {/* ── Phase 1: Upload ── */}
        {phase === 'upload' && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mb-5">
              <h2 className="text-lg font-bold text-foreground leading-snug flex items-center gap-2">
                📸 Food Check
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Snap any food and see if it fits your goals
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                {error}
              </div>
            )}

            <div className="space-y-3">
              {/* Camera capture */}
              <button
                onClick={() => cameraInputRef.current?.click()}
                className="w-full flex items-center gap-3 rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/50 p-6 hover:border-emerald-400 hover:bg-emerald-50 transition-all"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
                  <Camera className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-foreground">Take a Photo</p>
                  <p className="text-xs text-muted-foreground">
                    Point your camera at the food
                  </p>
                </div>
              </button>

              {/* File upload */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center gap-3 rounded-2xl border border-border/60 bg-white p-6 hover:border-emerald-300 hover:shadow-sm transition-all"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                  <Upload className="h-6 w-6 text-gray-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-foreground">Upload Image</p>
                  <p className="text-xs text-muted-foreground">
                    Upload a photo of your food, snack, or drink
                  </p>
                </div>
              </button>

              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileSelect}
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>

            <button
              onClick={onBack}
              className="mt-4 w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
            >
              Cancel
            </button>
          </motion.div>
        )}

        {/* ── Phase 2: Analyzing ── */}
        {phase === 'analyzing' && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16"
          >
            {imagePreview && (
              <div className="mb-4 w-24 h-24 rounded-2xl overflow-hidden border border-border/60">
                <img
                  src={imagePreview}
                  alt="Food preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <Loader2 className="h-10 w-10 text-emerald-600 animate-spin mb-4" />
            <p className="text-sm font-semibold text-foreground">
              Analyzing your food…
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Estimating nutrition and checking your goals
            </p>
          </motion.div>
        )}

        {/* ── Phase 3: Results ── */}
        {phase === 'results' && result && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Food image + name */}
            <div className="flex items-start gap-3 mb-5">
              {imagePreview && (
                <div className="w-20 h-20 rounded-2xl overflow-hidden border border-border/60 flex-shrink-0">
                  <img
                    src={imagePreview}
                    alt={result.food_name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-foreground leading-snug">
                  {result.food_name}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {result.summary}
                </p>
              </div>
            </div>

            {/* Verdict badge */}
            {(() => {
              const v = VERDICT_CONFIG[result.verdict]
              return (
                <div className={cn('rounded-2xl border p-4 mb-4', v.bg, v.border)}>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{v.emoji}</span>
                    <div>
                      <p className={cn('text-sm font-bold', v.color)}>{v.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {result.fits_goal ? (
                          <span className="flex items-center gap-1 text-emerald-600">
                            <CheckCircle2 className="h-3 w-3" /> Fits your goal
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-amber-600">
                            <XCircle className="h-3 w-3" /> Doesn&apos;t fit your goal
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  {result.goal_note && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {result.goal_note}
                    </p>
                  )}
                </div>
              )
            })()}

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-2 mb-5">
              {/* Calories */}
              <div className="rounded-xl border border-border/60 bg-white p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Flame className="h-3.5 w-3.5 text-orange-500" />
                  <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                    Calories
                  </span>
                </div>
                <p className="text-sm font-bold text-foreground">
                  {result.calorie_range}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Confidence: {result.calorie_confidence}
                </p>
              </div>

              {/* Protein */}
              <div className="rounded-xl border border-border/60 bg-white p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Beef className="h-3.5 w-3.5 text-red-500" />
                  <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                    Protein
                  </span>
                </div>
                <p className={cn('text-sm font-bold', PROTEIN_CONFIG[result.protein_level]?.color ?? 'text-foreground')}>
                  {PROTEIN_CONFIG[result.protein_level]?.label ?? result.protein_level}
                </p>
              </div>
            </div>

            {/* Smart Swaps */}
            {result.smart_swaps.length > 0 && (
              <div className="mb-5">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5 mb-3">
                  <ArrowRightLeft className="h-4 w-4 text-blue-500" /> Smart Swaps
                </h3>
                <div className="space-y-1.5">
                  {result.smart_swaps.map((swap, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 rounded-xl border border-blue-100 bg-blue-50/50 p-2.5 text-xs text-foreground"
                    >
                      <span className="text-blue-500 mt-0.5">💡</span>
                      {swap}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="gap-1.5"
              >
                <Camera className="h-3.5 w-3.5" /> Check another
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
