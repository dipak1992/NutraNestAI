'use client'

import { useOnboardingStore } from '@/stores/onboardingStore'
import { OnboardingShell } from '@/components/onboarding/OnboardingShell'
import StepHouseholdSize from '@/components/onboarding/StepHouseholdSize'
import StepDietary from '@/components/onboarding/StepDietary'
import StepDislikes from '@/components/onboarding/StepDislikes'
import StepSkillLevel from '@/components/onboarding/StepSkillLevel'
import StepBudget from '@/components/onboarding/StepBudget'

// ─── Step map ─────────────────────────────────────────────────────────────────

const STEP_COMPONENTS = {
  household: StepHouseholdSize,
  dietary:   StepDietary,
  dislikes:  StepDislikes,
  skill:     StepSkillLevel,
  budget:    StepBudget,
} as const

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Count total preferences selected across all steps */
function countPreferences(data: {
  householdSize: number
  dietary: string[]
  dislikes: string[]
  skillLevel: string
  weeklyBudget: number | null
}): number {
  let count = 0
  // Household size counts as 1 preference if set (always >= 1)
  if (data.householdSize >= 1) count++
  // Each dietary selection counts
  count += data.dietary.length
  // Each dislike counts
  count += data.dislikes.length
  // Skill level always counts as 1
  if (data.skillLevel) count++
  // Budget counts as 1 if set
  if (data.weeklyBudget !== null) count++
  return count
}

// ─── Client ───────────────────────────────────────────────────────────────────

export function OnboardingClient() {
  const step          = useOnboardingStore((s) => s.step)
  const householdSize = useOnboardingStore((s) => s.data.householdSize)
  const skillLevel    = useOnboardingStore((s) => s.data.skillLevel)
  const dietary       = useOnboardingStore((s) => s.data.dietary)
  const dislikes      = useOnboardingStore((s) => s.data.dislikes)
  const weeklyBudget  = useOnboardingStore((s) => s.data.weeklyBudget)

  // Determine whether the current step allows proceeding
  const canProceed: boolean = (() => {
    switch (step) {
      case 'household': return householdSize >= 1
      case 'skill':     return !!skillLevel
      case 'budget': {
        // Last step: require at least 3 total preferences across all steps
        return countPreferences({ householdSize, dietary, dislikes, skillLevel, weeklyBudget }) >= 3
      }
      default:          return true   // dietary / dislikes are optional per-step
    }
  })()

  const StepComponent = STEP_COMPONENTS[step as keyof typeof STEP_COMPONENTS]

  return (
    <OnboardingShell canProceed={canProceed}>
      {StepComponent ? <StepComponent /> : null}
    </OnboardingShell>
  )
}
