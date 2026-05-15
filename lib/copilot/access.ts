import type { ChatCompletionTool } from 'openai/resources/chat/completions'
import type { CopilotChip } from '@/stores/copilotStore'

export const FREE_COPILOT_DAILY_ASSISTS = 3

export const FREE_COPILOT_QUOTA = {
  key: 'copilot_meal_assist',
  limit: FREE_COPILOT_DAILY_ASSISTS,
  label: 'Copilot meal assist',
}

export const FREE_COPILOT_TOOL_NAMES = new Set([
  'suggest_tonight_dinner',
  'swap_tonight_meal',
  'suggest_leftover_meal',
  'navigate_to_screen',
])

export const PLUS_ONLY_COPILOT_FEATURES = new Set([
  'autopilot',
  'plan-swap',
  'budget-swap',
  'budget-filter',
])

const PLUS_INTENT_PATTERNS = [
  {
    pattern: /\b(under|below|less than|save|cheap|cheaper|budget|cost|over budget|\$\d+)/i,
    message: 'Budget-aware swaps are a Plus feature. Plus can scan your week, find expensive meals, and suggest lower-cost replacements.',
  },
  {
    pattern: /\b(keep|change|swap|replace|regenerate|rebalance|fill|plan|generate|create|make).*\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday|mon|tue|wed|thu|fri|sat|sun|week|weekly|nights|plan)\b/i,
    message: 'Plan-wide refinements are included in Plus. Plus can keep the meals you like, change the rest, and update the week in one flow.',
  },
  {
    pattern: /\b(add|remove|update|check off).*\b(grocery|groceries|shopping list|list)\b/i,
    message: 'Grocery list actions are included in Plus. Free Copilot can answer simple meal questions, but Plus can update your list for you.',
  },
  {
    pattern: /\b(remember|always|every|usually|soccer|practice|date night|schedule)\b/i,
    message: 'Household memory is a Plus feature. Plus can remember recurring schedule patterns and use them when planning meals.',
  },
]

export function filterCopilotToolsForPlan(tools: ChatCompletionTool[], isPlus: boolean): ChatCompletionTool[] {
  if (isPlus) return tools
  return tools.filter((tool) => {
    if (tool.type !== 'function') return false
    const name = tool.function.name
    return !!name && FREE_COPILOT_TOOL_NAMES.has(name)
  })
}

export function isPlusOnlyCopilotChip(chip: CopilotChip): boolean {
  return chip.action.type === 'trigger' && PLUS_ONLY_COPILOT_FEATURES.has(chip.action.feature)
}

export function getFreeCopilotUpgradeMessage(text: string): string | null {
  const match = PLUS_INTENT_PATTERNS.find((entry) => entry.pattern.test(text))
  return match?.message ?? null
}

export function buildFreeLimitMessage(): string {
  return `You've used your ${FREE_COPILOT_DAILY_ASSISTS} free Copilot meal assists today. Plus unlocks unlimited Copilot, voice, memory, proactive nudges, plan refinements, budget swaps, and grocery actions.`
}
