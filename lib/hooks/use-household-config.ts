import { useLightOnboardingStore } from '@/lib/store'

type HouseholdType = 'solo' | 'couple' | 'family'

interface HouseholdConfig {
  householdType: HouseholdType
  greeting: (name: string) => string
  weekendSubtitle: string
  smartToolLabel: string
  showFamilyMode: boolean
}

const configs: Record<HouseholdType, Omit<HouseholdConfig, 'householdType'>> = {
  solo: {
    greeting: (name) => `Hey ${name}, what sounds good tonight?`,
    weekendSubtitle: 'Dinner + entertainment — curated just for you',
    smartToolLabel: '🍽️ Solo Night',
    showFamilyMode: false,
  },
  couple: {
    greeting: (name) => `Hey ${name}, planning a night for two?`,
    weekendSubtitle: 'Dinner + movie night — curated for two',
    smartToolLabel: '💑 Date Night',
    showFamilyMode: false,
  },
  family: {
    greeting: (name) => `Hey ${name}, what's the family craving?`,
    weekendSubtitle: 'Dinner + movie night — curated for the family',
    smartToolLabel: '👨‍👩‍👧 Family Mode',
    showFamilyMode: true,
  },
}

export function useHouseholdConfig(): HouseholdConfig {
  const householdType = useLightOnboardingStore((s) => s.householdType) ?? 'solo'
  return { householdType, ...configs[householdType] }
}
