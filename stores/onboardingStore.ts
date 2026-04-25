import { create } from 'zustand'
import { STEPS, type StepId } from '@/lib/onboarding/steps'

// ─── Types ────────────────────────────────────────────────────────────────────

type OnboardingData = {
  householdSize: number
  dietary: string[]
  dislikes: string[]
  skillLevel: 'beginner' | 'intermediate' | 'advanced'
  weeklyBudget: number | null
}

type OnboardingStore = {
  step: StepId
  data: OnboardingData
  isSubmitting: boolean
  error: string | null

  setStep: (s: StepId) => void
  next: () => void
  back: () => void
  patch: (patch: Partial<OnboardingData>) => void
  submit: () => Promise<boolean>
}

const DEFAULT_DATA: OnboardingData = {
  householdSize: 2,
  dietary: [],
  dislikes: [],
  skillLevel: 'intermediate',
  weeklyBudget: null,
}

// ─── Store (plain Zustand v5, no immer) ───────────────────────────────────────

export const useOnboardingStore = create<OnboardingStore>((set, get) => ({
  step: 'household',
  data: DEFAULT_DATA,
  isSubmitting: false,
  error: null,

  setStep: (s) => set({ step: s }),

  next: () => {
    const idx = STEPS.findIndex((s) => s.id === get().step)
    if (idx < STEPS.length - 1) set({ step: STEPS[idx + 1].id })
  },

  back: () => {
    const idx = STEPS.findIndex((s) => s.id === get().step)
    if (idx > 0) set({ step: STEPS[idx - 1].id })
  },

  patch: (patch) =>
    set((state) => ({
      data: { ...state.data, ...patch },
    })),

  submit: async () => {
    set({ isSubmitting: true, error: null })
    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(get().data),
      })
      if (!res.ok) throw new Error('Save failed')
      set({ isSubmitting: false })
      return true
    } catch (e: unknown) {
      set({
        isSubmitting: false,
        error: e instanceof Error ? e.message : 'Something went wrong',
      })
      return false
    }
  },
}))
