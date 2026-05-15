import type { CopilotChip, CopilotScreen } from '@/stores/copilotStore'

interface ChipContext {
  screen: CopilotScreen
  hour: number // 0-23
  hasPantryItems: boolean
  hasWeeklyPlan: boolean
  hasLeftovers: boolean
  budgetRemaining: number | null
}

export function generateChips(ctx: ChipContext): CopilotChip[] {
  const chips: CopilotChip[] = []

  // Screen-specific chips
  switch (ctx.screen) {
    case 'tonight':
      chips.push(
        { id: 'swap', label: 'Swap for something quicker', icon: '⚡', action: { type: 'trigger', feature: 'tonight-swap', params: { mode: 'quick' } } },
        { id: 'veggie', label: 'Make it vegetarian', icon: '🥬', action: { type: 'trigger', feature: 'tonight-swap', params: { mode: 'vegetarian' } } },
        { id: 'budget', label: 'Something cheaper', icon: '💰', action: { type: 'trigger', feature: 'tonight-swap', params: { mode: 'budget' } } },
      )
      break
    case 'cook':
      chips.push(
        { id: 'scan', label: 'Scan my fridge', icon: '📷', action: { type: 'navigate', href: '/dashboard/cook' } },
      )
      if (ctx.hasPantryItems) {
        chips.push({ id: 'pantry-cook', label: 'Cook from pantry', icon: '🧊', action: { type: 'trigger', feature: 'pantry-match' } })
      }
      break
    case 'plan':
      if (!ctx.hasWeeklyPlan) {
        chips.push({ id: 'generate-plan', label: 'Generate my weekly plan', icon: '📅', action: { type: 'trigger', feature: 'autopilot' } })
      } else {
        chips.push(
          { id: 'grocery', label: 'Build grocery list', icon: '🛒', action: { type: 'navigate', href: '/grocery-list' } },
          { id: 'swap-day', label: 'Swap a meal this week', icon: '🔄', action: { type: 'trigger', feature: 'plan-swap' } },
        )
      }
      break
    case 'leftovers':
      chips.push(
        { id: 'use-leftovers', label: 'Use my leftovers tonight', icon: '♻️', action: { type: 'trigger', feature: 'leftover-suggest' } },
      )
      break
    case 'budget':
      chips.push(
        { id: 'cheaper-swaps', label: 'Find cheaper swaps', icon: '💡', action: { type: 'trigger', feature: 'budget-swap' } },
      )
      if (ctx.budgetRemaining !== null && ctx.budgetRemaining < 20) {
        chips.push({ id: 'budget-meals', label: 'Budget-friendly meals only', icon: '🏷️', action: { type: 'trigger', feature: 'budget-filter' } })
      }
      break
  }

  // Time-based universal chips
  if (ctx.hour >= 16 && ctx.hour <= 19 && ctx.screen !== 'tonight') {
    chips.push({ id: 'tonight-quick', label: "What's for dinner?", icon: '🍽️', action: { type: 'navigate', href: '/dashboard/tonight' } })
  }
  if (ctx.hour >= 8 && ctx.hour <= 11 && !ctx.hasWeeklyPlan && ctx.screen !== 'plan') {
    chips.push({ id: 'plan-week', label: 'Plan this week', icon: '📅', action: { type: 'navigate', href: '/dashboard' } })
  }
  if (ctx.hasLeftovers && ctx.screen !== 'leftovers') {
    chips.push({ id: 'leftover-nudge', label: 'Use leftovers tonight', icon: '♻️', action: { type: 'navigate', href: '/leftovers' } })
  }

  return chips.slice(0, 5) // Max 5 chips
}
