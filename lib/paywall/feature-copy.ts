export type UpgradeFeature =
  | 'budget'
  | 'family'
  | 'grocery'
  | 'household'
  | 'leftovers'
  | 'planner'
  | 'scan'
  | 'weekly_autopilot'
  | 'guided_cooking'
  | 'insights'
  | string

type FeatureCopy = {
  eyebrow: string
  title: string
  description: string
  bullets: string[]
}

const FEATURE_COPY: Record<string, FeatureCopy> = {
  budget: {
    eyebrow: 'Budget savings',
    title: 'Unlock cheaper weeks with Plus',
    description: 'See meal costs before you shop, catch budget drift early, and swap pricey dinners for lower-cost options.',
    bullets: ['Budget-aware swaps', 'Weekly spend alerts', 'Cost estimates before shopping'],
  },
  family: {
    eyebrow: 'Household memory',
    title: 'Personalize dinner for everyone',
    description: 'Plus remembers household preferences, profile needs, dislikes, and what actually worked at dinner.',
    bullets: ['Up to 6 profiles', 'Picky-eater memory', 'Household-safe suggestions'],
  },
  grocery: {
    eyebrow: 'Grocery utility',
    title: 'Turn plans into grocery lists',
    description: 'Generate a full weekly grocery list with pantry deductions, quantities, and shopping-ready organization.',
    bullets: ['Auto-built lists', 'Pantry deductions', 'Store-friendly grouping'],
  },
  household: {
    eyebrow: 'Household memory',
    title: 'Stop re-explaining your food life',
    description: 'Plus keeps your household context attached to every Tonight pick, weekly plan, and grocery decision.',
    bullets: ['Shared preferences', 'Family profiles', 'Better repeat suggestions'],
  },
  leftovers: {
    eyebrow: 'Waste less',
    title: 'Use leftovers before they expire',
    description: 'Plus tracks leftovers, alerts you at the right time, and turns extras into practical next meals.',
    bullets: ['Use-before-expiry nudges', 'Leftover recipe ideas', 'Waste reduction tracking'],
  },
  planner: {
    eyebrow: 'Weekly rhythm',
    title: 'Unlock the full 7-day plan',
    description: 'Plan all seven dinners, preview the grocery impact, and keep the week moving with one planning ritual.',
    bullets: ['7 dinners in one tap', 'Locked-day previews', 'Weekly grocery planning'],
  },
  weekly_autopilot: {
    eyebrow: 'Weekly rhythm',
    title: 'Let Autopilot handle the week',
    description: 'Plus plans seven dinners around preferences, budget, leftovers, and what your household actually eats.',
    bullets: ['Full-week planning', 'Unlimited swaps', 'Personalized Autopilot'],
  },
  scan: {
    eyebrow: 'Cook what you have',
    title: 'Unlock unlimited Snap & Cook',
    description: 'Keep scanning your fridge and pantry to turn what is already there into real dinner options.',
    bullets: ['Unlimited scans', 'Pantry meals', 'Leftover-aware ideas'],
  },
  guided_cooking: {
    eyebrow: 'Cook mode',
    title: 'Unlock guided cooking with Plus',
    description: 'The recipe is yours. Plus adds step-by-step Cook Mode, leftover tracking, and smarter follow-up meals.',
    bullets: ['Step-by-step Cook Mode', 'Cook completion tracking', 'Leftover follow-ups'],
  },
  insights: {
    eyebrow: 'Progress',
    title: 'See what MealEase is learning',
    description: 'Plus turns meal history into patterns: cuisines, cook times, household fit, and weekly progress.',
    bullets: ['Weekly insights', 'Household trends', 'Progress recaps'],
  },
}

export function getUpgradeFeatureCopy(feature?: string | null): FeatureCopy {
  if (!feature) {
    return {
      eyebrow: 'Plus',
      title: 'Unlock the full MealEase experience',
      description: 'Get personalized meals, weekly planning, leftovers, grocery lists, and budget intelligence in one food-life system.',
      bullets: ['Weekly Autopilot', 'Unlimited swaps and scans', 'Leftovers, groceries, and budget tools'],
    }
  }

  return FEATURE_COPY[feature] ?? {
    eyebrow: 'Plus',
    title: 'Unlock this with Plus',
    description: 'Upgrade to unlock this feature and the full MealEase planning system around it.',
    bullets: ['Premium meal planning', 'Smarter personalization', 'More useful weekly routines'],
  }
}
