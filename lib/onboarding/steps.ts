export const STEPS = [
  { id: 'household', label: 'Household' },
  { id: 'dietary', label: 'Dietary' },
  { id: 'dislikes', label: 'Dislikes' },
  { id: 'skill', label: 'Skill' },
  { id: 'budget', label: 'Budget' },
] as const

export type StepId = (typeof STEPS)[number]['id']
