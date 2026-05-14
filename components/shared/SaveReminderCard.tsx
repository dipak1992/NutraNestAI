'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bookmark, Bell, X } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export interface SaveReminderCardProps {
  mealId: string
  mealName: string
  variant?: 'tonight' | 'scan' | 'plan'
  onSave?: () => void
  onRemind?: () => void
}

const VARIANT_COPY = {
  tonight: 'Want to cook this tonight?',
  scan: 'Like this recipe idea?',
  plan: 'Save this to your plan?',
} as const

export function SaveReminderCard({
  mealId,
  mealName,
  variant = 'tonight',
  onSave,
  onRemind,
}: SaveReminderCardProps) {
  const [dismissed, setDismissed] = useState(true) // start hidden, reveal after check
  const [saved, setSaved] = useState(false)
  const [reminded, setReminded] = useState(false)

  const storageKey = `saveReminderDismissed_${mealId}`

  useEffect(() => {
    // Check sessionStorage to see if already dismissed for this meal
    const wasDismissed = sessionStorage.getItem(storageKey)
    setDismissed(!!wasDismissed)
  }, [storageKey])

  const handleDismiss = () => {
    sessionStorage.setItem(storageKey, '1')
    setDismissed(true)
  }

  const handleSave = async () => {
    try {
      const res = await fetch('/api/saved-meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mealId, mealName }),
      })

      if (!res.ok) throw new Error('Failed to save')

      setSaved(true)
      toast.success('Meal saved! Find it in your saved meals.')
      onSave?.()
    } catch {
      // Fallback to localStorage
      const existing = JSON.parse(localStorage.getItem('savedMeals') || '[]')
      if (!existing.find((m: { id: string }) => m.id === mealId)) {
        existing.push({ id: mealId, name: mealName, savedAt: new Date().toISOString() })
        localStorage.setItem('savedMeals', JSON.stringify(existing))
      }
      setSaved(true)
      toast.success('Meal saved! Find it in your saved meals.')
      onSave?.()
    }
  }

  const handleRemind = () => {
    // Store reminder intent in localStorage
    const reminders = JSON.parse(localStorage.getItem('dinnerReminders') || '[]')
    reminders.push({
      mealId,
      mealName,
      time: '17:00',
      createdAt: new Date().toISOString(),
    })
    localStorage.setItem('dinnerReminders', JSON.stringify(reminders))

    // Check if push notifications are supported
    if ('Notification' in window && Notification.permission === 'granted') {
      toast.success("Reminder set! We'll notify you at 5pm.")
    } else if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          toast.success("Reminder set! We'll notify you at 5pm.")
        } else {
          toast.success("We'll remind you! Check back at 5pm.")
        }
      })
    } else {
      toast.success("We'll remind you! Check back at 5pm.")
    }

    setReminded(true)
    onRemind?.()
  }

  if (dismissed) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 12 }}
        transition={{ duration: 0.35, delay: 1.5 }}
        className="relative mt-5 rounded-xl border border-border/60 bg-gradient-to-br from-orange-50/60 to-white p-4 shadow-sm dark:from-neutral-900/40 dark:to-neutral-950"
      >
        {/* Dismiss X */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Content */}
        <div className="pr-6">
          <p className="text-sm text-muted-foreground">{VARIANT_COPY[variant]}</p>
          <p className="font-semibold text-foreground mt-0.5 text-sm leading-snug line-clamp-1">
            {mealName}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={handleSave}
            disabled={saved}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all border',
              saved
                ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800'
                : 'bg-white text-foreground border-border/60 hover:border-primary/40 hover:bg-primary/5 dark:bg-neutral-900 dark:hover:bg-neutral-800',
            )}
          >
            <Bookmark className={cn('h-3.5 w-3.5', saved && 'fill-current')} />
            {saved ? 'Saved!' : 'Save'}
          </button>

          <button
            onClick={handleRemind}
            disabled={reminded}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all',
              reminded
                ? 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800'
                : 'bg-primary text-white hover:bg-primary/90 shadow-sm',
            )}
          >
            <Bell className={cn('h-3.5 w-3.5', reminded && 'fill-current')} />
            {reminded ? 'Reminder set!' : 'Remind at 5pm'}
          </button>
        </div>

        {/* Not now link */}
        <button
          onClick={handleDismiss}
          className="mt-2.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Not now
        </button>
      </motion.div>
    </AnimatePresence>
  )
}

// ── Weekly Reminder Nudge (simpler variant for dashboard) ─────────────────────

export function WeeklyReminderNudge() {
  const [dismissed, setDismissed] = useState(true)
  const [reminded, setReminded] = useState(false)

  const storageKey = 'weeklyReminderNudgeDismissed'

  useEffect(() => {
    const wasDismissed = sessionStorage.getItem(storageKey)
    setDismissed(!!wasDismissed)
  }, [])

  const handleDismiss = () => {
    sessionStorage.setItem(storageKey, '1')
    setDismissed(true)
  }

  const handleRemind = () => {
    const reminders = JSON.parse(localStorage.getItem('weeklyReminders') || '[]')
    reminders.push({
      type: 'weekly-prep',
      day: 'sunday',
      createdAt: new Date().toISOString(),
    })
    localStorage.setItem('weeklyReminders', JSON.stringify(reminders))
    setReminded(true)
    toast.success("You'll be reminded to prep on Sunday!")
  }

  if (dismissed) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.3, delay: 2 }}
        className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-blue-50/50 px-4 py-3 dark:bg-blue-950/20 dark:border-blue-900/40"
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-base shrink-0">🔔</span>
          <p className="text-sm text-foreground truncate">
            {reminded ? 'Reminder set for Sunday!' : 'Get reminded to prep on Sunday?'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!reminded && (
            <button
              onClick={handleRemind}
              className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary/90 transition-colors"
            >
              <Bell className="h-3 w-3" />
              Yes
            </button>
          )}
          <button
            onClick={handleDismiss}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {reminded ? 'Close' : 'Skip'}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
