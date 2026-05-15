'use client'

import { useCallback, useEffect, useMemo } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence, useDragControls, type PanInfo } from 'framer-motion'
import { X } from 'lucide-react'
import { useCopilotStore, type CopilotScreen, type CopilotChip } from '@/stores/copilotStore'
import { generateChips } from '@/lib/copilot/chips'
import { useWeeklyPlanStore } from '@/lib/planner/store'

// ── Helpers ─────────────────────────────────────────────────

function pathnameToScreen(pathname: string): CopilotScreen {
  if (pathname.startsWith('/dashboard/tonight')) return 'tonight'
  if (pathname.startsWith('/dashboard/cook')) return 'cook'
  if (pathname === '/dashboard' || pathname === '/dashboard/') return 'plan'
  if (pathname.startsWith('/leftovers')) return 'leftovers'
  if (pathname.startsWith('/budget')) return 'budget'
  if (pathname.startsWith('/grocery')) return 'grocery'
  return 'home'
}

function getGreeting(hour: number): string {
  if (hour < 12) return 'Good morning! ☀️'
  if (hour < 17) return 'Good afternoon! 🌤️'
  return 'Good evening! 🌙'
}

// ── Component ───────────────────────────────────────────────

export function CopilotSheet() {
  const router = useRouter()
  const pathname = usePathname()
  const { state, close, setScreen, setChips, chips, screen } = useCopilotStore()
  const dragControls = useDragControls()

  // Detect screen from pathname
  const currentScreen = useMemo(() => pathnameToScreen(pathname), [pathname])

  // Get user context from stores
  const weeklyPlan = useWeeklyPlanStore((s) => s.plan)
  const hasWeeklyPlan = weeklyPlan?.days?.some((d) => d.meal) ?? false

  // Update screen + chips when pathname changes
  useEffect(() => {
    setScreen(currentScreen)
    const hour = new Date().getHours()
    const newChips = generateChips({
      screen: currentScreen,
      hour,
      hasPantryItems: false, // TODO: wire to pantry store
      hasWeeklyPlan,
      hasLeftovers: false, // TODO: wire to leftovers store
      budgetRemaining: null, // TODO: wire to budget store
    })
    setChips(newChips)
  }, [currentScreen, hasWeeklyPlan, setScreen, setChips])

  // Handle chip tap
  const handleChipTap = useCallback((chip: CopilotChip) => {
    if (chip.action.type === 'navigate') {
      router.push(chip.action.href)
      close()
    } else if (chip.action.type === 'trigger') {
      // Phase 2: dispatch to feature handlers
      // For now, just close the sheet
      close()
    }
  }, [router, close])

  // Handle drag end
  const handleDragEnd = useCallback((_: unknown, info: PanInfo) => {
    if (info.offset.y > 100) {
      close()
    }
  }, [close])

  const hour = new Date().getHours()
  const isVisible = state === 'peek' || state === 'expanded'

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          {state === 'expanded' && (
            <motion.div
              key="copilot-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[90] bg-black/30 backdrop-blur-sm"
              onClick={close}
            />
          )}

          {/* Sheet */}
          <motion.div
            key="copilot-sheet"
            initial={{ y: '100%' }}
            animate={{
              y: 0,
              height: state === 'expanded' ? 'auto' : 'auto',
            }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            drag="y"
            dragControls={dragControls}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className={`fixed inset-x-0 bottom-0 z-[95] rounded-t-3xl border-t border-neutral-200 bg-[#FFFBF7] shadow-2xl ${
              state === 'expanded' ? 'max-h-[70vh]' : ''
            }`}
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="h-1 w-10 rounded-full bg-neutral-300" />
            </div>

            {/* Content */}
            <div className="px-5 pb-5">
              {/* Expanded: greeting + close */}
              {state === 'expanded' && (
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-base font-semibold text-neutral-800">
                    {getGreeting(hour)}
                  </p>
                  <button
                    onClick={close}
                    className="rounded-full p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 active:bg-neutral-200"
                    aria-label="Close copilot"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}

              {/* Chips */}
              <div
                className={
                  state === 'expanded'
                    ? 'flex flex-wrap gap-2'
                    : 'flex gap-2 overflow-x-auto pb-2 scrollbar-none'
                }
              >
                {chips.map((chip) => (
                  <button
                    key={chip.id}
                    onClick={() => handleChipTap(chip)}
                    className="flex shrink-0 items-center gap-1.5 rounded-2xl border border-[#D97757]/20 bg-white px-3.5 py-2 text-sm font-medium text-neutral-800 shadow-sm transition-all hover:border-[#D97757]/40 hover:shadow-md active:scale-[0.97]"
                  >
                    {chip.icon && <span className="text-base">{chip.icon}</span>}
                    <span>{chip.label}</span>
                  </button>
                ))}
              </div>

              {/* Phase 2 placeholder: text input */}
              {state === 'expanded' && (
                <div className="mt-4 rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-400">
                  Ask MealEase anything… (coming soon)
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
