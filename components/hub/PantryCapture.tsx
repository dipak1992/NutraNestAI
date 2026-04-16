'use client'

import { useCallback, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Pencil, X, Loader2, Plus, ArrowRight } from 'lucide-react'

interface Props {
  onConfirm: (items: string[]) => void
  onCancel: () => void
}

type Phase = 'choose' | 'scanning' | 'manual' | 'review'

export function PantryCapture({ onConfirm, onCancel }: Props) {
  const [phase, setPhase] = useState<Phase>('choose')
  const [items, setItems] = useState<string[]>([])
  const [manualInput, setManualInput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  // ── Camera / file pick ────────────────────────────────────

  const handleCapture = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setPhase('scanning')
    setError(null)

    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      const res = await fetch('/api/pantry/vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: dataUrl }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.error ?? 'Scan failed')
      }

      const data = await res.json()
      const detected: string[] = data.data?.items ?? []

      if (detected.length === 0) {
        setError('No ingredients detected — try a clearer photo or add manually.')
        setPhase('choose')
        return
      }

      setItems(prev => {
        const set = new Set([...prev, ...detected])
        return [...set]
      })
      setPhase('review')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Scan failed')
      setPhase('choose')
    } finally {
      // Reset file input so the same file can be re-selected
      if (fileRef.current) fileRef.current.value = ''
    }
  }, [])

  // ── Manual add ────────────────────────────────────────────

  const addManualItem = useCallback(() => {
    const val = manualInput.trim().toLowerCase()
    if (!val) return
    setItems(prev => (prev.includes(val) ? prev : [...prev, val]))
    setManualInput('')
  }, [manualInput])

  const removeItem = useCallback((item: string) => {
    setItems(prev => prev.filter(i => i !== item))
  }, [])

  const handleManualKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addManualItem()
    }
  }, [addManualItem])

  // ── Confirm ───────────────────────────────────────────────

  const handleConfirm = useCallback(() => {
    if (items.length === 0) return
    onConfirm(items)
  }, [items, onConfirm])

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
    >
      {/* Hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleCapture}
      />

      <AnimatePresence mode="wait">
        {/* ── CHOOSE MODE ──────────────────────────────────── */}
        {(phase === 'choose') && (
          <motion.div
            key="choose"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="mb-5">
              <h2 className="text-lg font-bold text-foreground leading-snug">
                🥫 What&apos;s in your kitchen?
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Snap a photo or type items manually
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-4 w-full px-5 py-4 rounded-2xl border-2 border-primary/40 bg-primary/5 hover:bg-primary/10 hover:border-primary/60 hover:shadow-lg transition-all group text-left"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 flex-shrink-0">
                  <Camera className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold group-hover:text-primary transition-colors">
                    Take a photo
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Snap your fridge or pantry shelf
                  </p>
                </div>
              </button>

              <button
                onClick={() => setPhase('manual')}
                className="flex items-center gap-4 w-full px-5 py-4 rounded-2xl border border-border/60 bg-white hover:border-primary/40 hover:shadow-md transition-all group text-left"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 flex-shrink-0">
                  <Pencil className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold group-hover:text-primary transition-colors">
                    Type ingredients
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Add items one by one
                  </p>
                </div>
              </button>
            </div>

            {/* Show "Continue with items" if we already have some from a previous scan */}
            {items.length > 0 && (
              <button
                onClick={() => setPhase('review')}
                className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors"
              >
                Review {items.length} item{items.length !== 1 ? 's' : ''}
                <ArrowRight className="h-4 w-4" />
              </button>
            )}

            <button
              onClick={onCancel}
              className="mt-3 w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
            >
              Cancel
            </button>
          </motion.div>
        )}

        {/* ── SCANNING ─────────────────────────────────────── */}
        {phase === 'scanning' && (
          <motion.div
            key="scanning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-16"
          >
            <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
            <p className="text-sm font-semibold text-foreground">Scanning your photo…</p>
            <p className="text-xs text-muted-foreground mt-1">AI is identifying ingredients</p>
          </motion.div>
        )}

        {/* ── MANUAL INPUT ─────────────────────────────────── */}
        {phase === 'manual' && (
          <motion.div
            key="manual"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="mb-5">
              <h2 className="text-lg font-bold text-foreground leading-snug">
                ✏️ Add your ingredients
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Type an item and press Enter or tap +
              </p>
            </div>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={manualInput}
                onChange={e => setManualInput(e.target.value)}
                onKeyDown={handleManualKeyDown}
                placeholder="e.g. chicken breast"
                className="flex-1 rounded-xl border border-border/60 bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all"
                autoFocus
              />
              <button
                onClick={addManualItem}
                disabled={!manualInput.trim()}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>

            {/* Item chips */}
            {items.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {items.map(item => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-sm text-emerald-900"
                  >
                    {item}
                    <button
                      onClick={() => removeItem(item)}
                      className="flex h-5 w-5 items-center justify-center rounded-full hover:bg-emerald-200 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => fileRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border/60 text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
              >
                <Camera className="h-4 w-4" />
                Scan a photo too
              </button>
              {items.length > 0 && (
                <button
                  onClick={() => setPhase('review')}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors"
                >
                  Review ({items.length})
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>

            <button
              onClick={() => setPhase(items.length > 0 ? 'choose' : 'choose')}
              className="mt-3 w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
            >
              Back
            </button>
          </motion.div>
        )}

        {/* ── REVIEW ───────────────────────────────────────── */}
        {phase === 'review' && (
          <motion.div
            key="review"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="mb-5">
              <h2 className="text-lg font-bold text-foreground leading-snug">
                ✅ Confirm your items
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Remove anything that doesn&apos;t look right
              </p>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {items.map(item => (
                <motion.span
                  key={item}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-sm text-emerald-900"
                >
                  {item}
                  <button
                    onClick={() => removeItem(item)}
                    className="flex h-5 w-5 items-center justify-center rounded-full hover:bg-emerald-200 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </motion.span>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-2">
              <button
                onClick={handleConfirm}
                disabled={items.length === 0}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Use these {items.length} item{items.length !== 1 ? 's' : ''}
                <ArrowRight className="h-4 w-4" />
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => fileRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border/60 text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
                >
                  <Camera className="h-4 w-4" />
                  Add more
                </button>
                <button
                  onClick={() => setPhase('manual')}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border/60 text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
                >
                  <Pencil className="h-4 w-4" />
                  Type more
                </button>
              </div>
            </div>

            <button
              onClick={() => setPhase('choose')}
              className="mt-3 w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
            >
              Back
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
