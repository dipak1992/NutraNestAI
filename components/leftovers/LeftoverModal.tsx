'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Trash2, CheckCircle, Clock, UtensilsCrossed } from 'lucide-react'
import { useLeftoversStore } from '@/stores/leftoversStore'
import { LeftoverRecipeSuggestions } from './LeftoverRecipeSuggestions'
import type { Urgency } from '@/lib/leftovers/types'

const URGENCY_COLOR: Record<Urgency, string> = {
  fresh: 'text-emerald-400',
  soon: 'text-amber-400',
  today: 'text-red-400',
  expired: 'text-zinc-500',
}

const URGENCY_LABEL: Record<Urgency, string> = {
  fresh: 'Fresh',
  soon: 'Use soon',
  today: 'Use today!',
  expired: 'Expired',
}

type Props = {
  isPlusMember: boolean
}

export function LeftoverModal({ isPlusMember }: Props) {
  const { isModalOpen, selectedId, closeModal, getById, markUsed, markDiscarded } =
    useLeftoversStore((s) => ({
      isModalOpen: s.isModalOpen,
      selectedId: s.selectedId,
      closeModal: s.closeModal,
      getById: s.getById,
      markUsed: s.markUsed,
      markDiscarded: s.markDiscarded,
    }))

  const leftover = selectedId ? getById(selectedId) : null
  const urgency = leftover?.urgency ?? 'fresh'

  return (
    <AnimatePresence>
      {isModalOpen && leftover && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* Sheet */}
          <motion.div
            key="modal"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-md rounded-t-3xl bg-zinc-900 shadow-2xl"
            style={{ maxHeight: '90dvh', overflowY: 'auto' }}
          >
            {/* Handle */}
            <div className="sticky top-0 z-10 bg-zinc-900 px-5 pt-4 pb-2">
              <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-white/20" />
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white truncate pr-4">{leftover.name}</h2>
                <button
                  onClick={closeModal}
                  className="shrink-0 rounded-full p-1.5 text-zinc-400 hover:bg-white/10 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="px-5 pb-10 space-y-5">
              {/* Image */}
              {leftover.image && (
                <div className="overflow-hidden rounded-2xl h-40 w-full">
                  <img
                    src={leftover.image}
                    alt={leftover.name}
                    className="h-full w-full object-cover"
                    style={{
                      filter:
                        urgency === 'expired'
                          ? 'grayscale(100%) brightness(60%)'
                          : urgency === 'today'
                          ? 'saturate(60%)'
                          : 'none',
                    }}
                  />
                </div>
              )}

              {/* Meta */}
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-xl bg-white/5 p-3 text-center">
                  <p className="text-xs text-zinc-500">Servings</p>
                  <p className="text-lg font-bold text-white">{leftover.servingsRemaining}</p>
                </div>
                <div className="rounded-xl bg-white/5 p-3 text-center">
                  <p className="text-xs text-zinc-500">Status</p>
                  <p className={`text-sm font-bold ${URGENCY_COLOR[urgency]}`}>
                    {URGENCY_LABEL[urgency]}
                  </p>
                </div>
                <div className="rounded-xl bg-white/5 p-3 text-center">
                  <p className="text-xs text-zinc-500">Days left</p>
                  <p className="text-lg font-bold text-white">
                    {leftover.daysUntilExpiry != null && leftover.daysUntilExpiry < 0
                      ? '—'
                      : leftover.daysUntilExpiry ?? '—'}
                  </p>
                </div>
              </div>

              {/* Ingredients */}
              {leftover.mainIngredients.length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-semibold text-zinc-400 uppercase tracking-wide">
                    Main Ingredients
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {leftover.mainIngredients.map((ing) => (
                      <span
                        key={ing.name}
                        className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-zinc-300"
                      >
                        {ing.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {leftover.notes && (
                <div className="rounded-xl bg-white/5 p-3">
                  <p className="text-xs text-zinc-400">{leftover.notes}</p>
                </div>
              )}

              {/* AI Suggestions */}
              {leftover.status === 'active' && (
                <LeftoverRecipeSuggestions
                  leftoverId={leftover.id}
                  leftoverName={leftover.name}
                  isPlusMember={isPlusMember}
                />
              )}

              {/* Actions */}
              {leftover.status === 'active' && (
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => markDiscarded(leftover.id)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 py-3 text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                    Discard
                  </button>
                  <button
                    onClick={() => markUsed(leftover.id)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-500"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Mark used
                  </button>
                </div>
              )}

              {leftover.status !== 'active' && (
                <div className="rounded-xl bg-white/5 p-3 text-center">
                  <p className="text-sm text-zinc-400">
                    {leftover.status === 'used' ? '✅ Marked as used' : '🗑 Discarded'}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
