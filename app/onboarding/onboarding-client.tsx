'use client'

import { useOnboardingStore } from '@/stores/onboardingStore'
import { OnboardingShell } from '@/components/onboarding/OnboardingShell'
import StepHouseholdSize from '@/components/onboarding/StepHouseholdSize'
import StepDietary from '@/components/onboarding/StepDietary'
import StepDislikes from '@/components/onboarding/StepDislikes'
import StepSkillLevel from '@/components/onboarding/StepSkillLevel'
import StepBudget from '@/components/onboarding/StepBudget'
import StepDone from '@/components/onboarding/StepDone'

// ─── Step map ─────────────────────────────────────────────────────────────────

const STEP_COMPONENTS = {
  household: StepHouseholdSize,
  dietary:   StepDietary,
  dislikes:  StepDislikes,
  skill:     StepSkillLevel,
  budget:    StepBudget,
} as const

// ─── Client ───────────────────────────────────────────────────────────────────

export function OnboardingClient() {
  const step         = useOnboardingStore((s) => s.step)
  const householdSize = useOnboardingStore((s) => s.data.householdSize)
  const skillLevel   = useOnboardingStore((s) => s.data.skillLevel)

  // Final "done" step — no shell chrome
  if (step === ('done' as string)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f0f0f] px-4">
        <div className="w-full max-w-md">
          <StepDone />
        </div>
      </div>
    )
  }

  // Determine whether the current step allows proceeding
  const canProceed: boolean = (() => {
    switch (step) {
      case 'household': return householdSize >= 1
      case 'skill':     return !!skillLevel
      default:          return true   // dietary / dislikes / budget are optional
    }
  })()

  const StepComponent = STEP_COMPONENTS[step as keyof typeof STEP_COMPONENTS]

  return (
    <OnboardingShell canProceed={canProceed}>
      {StepComponent ? <StepComponent /> : null}
    </OnboardingShell>
  )
}
