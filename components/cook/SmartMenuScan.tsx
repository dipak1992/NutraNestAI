'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Camera,
  Upload,
  Loader2,
  ArrowLeft,
  Star,
  AlertTriangle,
  Wrench,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { MenuScanGoal, MenuScanResult } from '@/types/cook-tools'
import { MENU_SCAN_GOALS } from '@/types/cook-tools'

interface SmartMenuScanProps {
  onBack: () => void
}

type Phase = 'upload' | 'goal' | 'analyzing' | 'results'

export function SmartMenuScan({ onBack }: SmartMenuScanProps) {
  const [phase, setPhase] = useState<Phase>('upload')
  const [imageData, setImageData] = useState<string | null>(null)
  const [imageMime, setImageMime] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedGoal, setSelectedGoal] = useState<MenuScanGoal | null>(null)
  const [result, setResult] = useState<MenuScanResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      const base64 = dataUrl.split(',')[1]
      setImageData(base64)
      setImageMime(file.type)
      setImagePreview(dataUrl)
      setPhase('goal')
      setError(null)
    }
    reader.readAsDataURL(file)
  }, [])

  const handleAnalyze = useCallback(async (goal: MenuScanGoal) => {
    if (!imageData || !imageMime) return

    setSelectedGoal(goal)
    setPhase('analyzing')
    setError(null)

    try {
      const res = await fetch('/api/menu-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageData, mimeType: imageMime, goal }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.error ?? `Server error (${res.status})`)
      }

      const data = await res.json()
      if (data.success && data.data) {
        setResult(data.data as MenuScanResult)
        setPhase('results')
      } else {
        throw new Error(data.error ?? 'No results returned')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze menu')
      setPhase('goal')
    }
  }, [imageData, imageMime])

  const handleReset = useCallback(() => {
    setPhase('upload')
    setImageData(null)
    setImageMime(null)
    setImagePreview(null)
    setSelectedGoal(null)
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
                🍽️ Smart Menu Scan
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Scan any restaurant menu and get personalized recommendations
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
                    Point your camera at the menu
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
                    Upload a menu photo or PDF screenshot
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

        {/* ── Phase 2: Goal Selection ── */}
        {phase === 'goal' && (
          <motion.div
            key="goal"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mb-5">
              <h2 className="text-lg font-bold text-foreground leading-snug">
                What&apos;s your goal?
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Choose how you want to order today
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                {error}
              </div>
            )}

            {/* Menu preview thumbnail */}
            {imagePreview && (
              <div className="mb-4 rounded-xl overflow-hidden border border-border/60 h-32 relative">
                <img
                  src={imagePreview}
                  alt="Menu preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <Badge
                  variant="outline"
                  className="absolute bottom-2 left-2 bg-white/90 text-xs"
                >
                  ✅ Menu captured
                </Badge>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              {MENU_SCAN_GOALS.map((goal) => (
                <motion.button
                  key={goal.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAnalyze(goal.id)}
                  className="flex flex-col items-center gap-1.5 rounded-2xl border border-border/60 bg-white p-4 hover:border-emerald-400/40 hover:shadow-sm transition-all text-center"
                >
                  <span className="text-2xl">{goal.emoji}</span>
                  <span className="text-sm font-medium text-foreground">{goal.label}</span>
                  <span className="text-[10px] text-muted-foreground leading-tight">
                    {goal.description}
                  </span>
                </motion.button>
              ))}
            </div>

            <button
              onClick={handleReset}
              className="mt-4 w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
            >
              ← Scan different menu
            </button>
          </motion.div>
        )}

        {/* ── Phase 3: Analyzing ── */}
        {phase === 'analyzing' && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16"
          >
            <Loader2 className="h-10 w-10 text-emerald-600 animate-spin mb-4" />
            <p className="text-sm font-semibold text-foreground">
              Analyzing your menu…
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Finding the best options for you
            </p>
          </motion.div>
        )}

        {/* ── Phase 4: Results ── */}
        {phase === 'results' && result && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-xs bg-emerald-50 border-emerald-200 text-emerald-700">
                  {MENU_SCAN_GOALS.find(g => g.id === selectedGoal)?.emoji}{' '}
                  {MENU_SCAN_GOALS.find(g => g.id === selectedGoal)?.label}
                </Badge>
              </div>
              <p className="text-sm text-foreground font-medium mt-2">
                {result.summary}
              </p>
            </div>

            {/* Recommendations */}
            {result.recommendations.length > 0 && (
              <div className="mb-5">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5 mb-3">
                  <Star className="h-4 w-4 text-emerald-600" /> Recommended
                </h3>
                <div className="space-y-2">
                  {result.recommendations.map((item, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-emerald-200/60 bg-emerald-50/50 p-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-foreground">
                          {item.name}
                        </p>
                        {item.price_range && (
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {item.price_range}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.why}
                      </p>
                      {item.nutrition_note && (
                        <p className="text-[10px] text-emerald-700 mt-1 font-medium">
                          {item.nutrition_note}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Avoid */}
            {result.avoid.length > 0 && (
              <div className="mb-5">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5 mb-3">
                  <AlertTriangle className="h-4 w-4 text-amber-500" /> Avoid
                </h3>
                <div className="space-y-2">
                  {result.avoid.map((item, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-amber-200/60 bg-amber-50/50 p-3"
                    >
                      <p className="text-sm font-semibold text-foreground">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.reason}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Customizations */}
            {result.customizations.length > 0 && (
              <div className="mb-5">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5 mb-3">
                  <Wrench className="h-4 w-4 text-blue-500" /> Customizations
                </h3>
                <div className="space-y-1.5">
                  {result.customizations.map((tip, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 text-xs text-foreground"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-blue-500 mt-0.5 flex-shrink-0" />
                      {tip}
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
                <Camera className="h-3.5 w-3.5" /> Scan another
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPhase('goal')}
                className="gap-1.5 ml-auto"
              >
                Try different goal
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
