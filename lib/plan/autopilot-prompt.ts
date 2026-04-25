import type { AutopilotOptions } from './types'

// ─── System prompt ────────────────────────────────────────────────────────────

export const AUTOPILOT_SYSTEM_PROMPT = `
You are MealEase's meal planner. You're warm, practical, and never preachy.
You plan one week of dinners for a household.

Hard rules:
1. Never repeat the same protein two days in a row.
2. Never repeat the same main dish twice in a week.
3. Respect dietary restrictions absolutely (allergies, vegetarian, etc.).
4. Stay within the weekly budget (soft unless strict_mode=true).
5. Prefer recipes that use active leftovers or about-to-expire pantry items.
6. Respect skill level — don't suggest hard recipes to beginners.
7. Match the household size.

Soft preferences:
- Easier meals on weekdays, slightly more involved on weekends.
- Variety across cuisines over the week.
- At least one vegetarian or fish dinner for most omnivore households.

Output format: strict JSON matching the schema provided. No prose.
`.trim()

// ─── Build user prompt ────────────────────────────────────────────────────────

export function buildAutopilotPrompt(ctx: {
  household: {
    size: number
    dietary: string[]
    dislikes: string[]
    skillLevel: string
  }
  budget: {
    weeklyLimit: number | null
    strictMode: boolean
    spentThisWeek: number
  }
  activeLeftovers: Array<{
    name: string
    ingredients: string[]
    expiresInDays: number
  }>
  pantryItems: string[]
  lockedDays: Array<{
    dayAbbrev: string
    recipeName: string
  }>
  daysToFill: Array<{
    dayIndex: number
    dayAbbrev: string
    date: string
  }>
  cuisinePreferences?: string[]
  options: AutopilotOptions
}): string {
  const {
    household,
    budget,
    activeLeftovers,
    pantryItems,
    lockedDays,
    daysToFill,
    cuisinePreferences,
    options,
  } = ctx

  const remainingBudget =
    budget.weeklyLimit != null
      ? Math.max(0, budget.weeklyLimit - budget.spentThisWeek)
      : null
  const budgetPerDay =
    remainingBudget != null && daysToFill.length > 0
      ? remainingBudget / daysToFill.length
      : null

  return `
Household:
- Size: ${household.size} ${household.size === 1 ? 'person' : 'people'}
- Dietary: ${household.dietary.length ? household.dietary.join(', ') : 'none'}
- Dislikes / avoid: ${household.dislikes.length ? household.dislikes.join(', ') : 'none'}
- Skill level: ${household.skillLevel}
${cuisinePreferences?.length ? `- Cuisine preferences: ${cuisinePreferences.join(', ')}` : ''}

Budget:
${
  budget.weeklyLimit != null
    ? `- Weekly limit: $${budget.weeklyLimit}
- Already spent: $${budget.spentThisWeek.toFixed(0)}
- Remaining: $${remainingBudget!.toFixed(0)} across ${daysToFill.length} days (~$${budgetPerDay!.toFixed(0)}/day)
- ${budget.strictMode ? 'STRICT MODE: do not exceed.' : 'Soft guardrail.'}`
    : '- No weekly budget set; aim for average household value.'
}

Active leftovers (use these first — they expire soon):
${
  activeLeftovers.length === 0
    ? '- (none)'
    : activeLeftovers
        .map(
          (l) =>
            `- ${l.name} (${l.ingredients.join(', ')}) — expires in ${l.expiresInDays} day${l.expiresInDays === 1 ? '' : 's'}`,
        )
        .join('\n')
}

Pantry staples available:
${pantryItems.length === 0 ? '- (none recorded)' : pantryItems.slice(0, 30).map((p) => `- ${p}`).join('\n')}

Already locked (do not replace):
${lockedDays.length === 0 ? '- (none)' : lockedDays.map((d) => `- ${d.dayAbbrev}: ${d.recipeName}`).join('\n')}

Generate dinners for these days (${options.overwriteEmptyOnly ? 'empty slots only' : 'all non-locked slots'}):
${daysToFill.map((d) => `- ${d.dayAbbrev} (${d.date})`).join('\n')}

Return JSON:
{
  "days": [
    {
      "dayIndex": 0,
      "dayAbbrev": "Mon",
      "recipe": {
        "id": "slug-like-id",
        "name": "...",
        "image": null,
        "cookTimeMin": 30,
        "difficulty": "easy",
        "servings": ${household.size},
        "costTotal": 14,
        "costPerServing": 3.5,
        "tags": ["..."],
        "ingredients": ["..."]
      },
      "reason": "one sentence explaining the pick",
      "usesLeftoverId": null
    }
  ]
}
`.trim()
}
