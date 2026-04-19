// ============================================================
// Zero-Cook Mode — Type Definitions
// ============================================================

export interface ZeroCookMeal {
  id: string
  name: string
  reason: string
  cuisineType: string
  priceRange: string
  etaRange: string
  popularityLabel: string
  bestProvider: DeliveryProvider
  searchQuery: string
  primaryActionLabel: string
  secondaryActionLabel: string
}

export type DeliveryProvider = 'ubereats' | 'doordash' | 'instacart' | 'grubhub'
export type HouseholdMode = 'single' | 'couple' | 'family'

export interface ProviderLink {
  provider: DeliveryProvider
  label: string
  emoji: string
  deepLink: string
  webUrl: string
}

export interface ZeroCookRequest {
  householdType?: HouseholdMode
  household: {
    adultsCount: number
    kidsCount: number
    toddlersCount: number
    babiesCount: number
  }
  cuisinePreferences?: string[]
  budget?: 'low' | 'medium' | 'high'
  allergies?: string[]
  dietaryRestrictions?: string[]
  dislikedFoods?: string[]
  pickyEater?: boolean
  healthyGoal?: boolean
  lowEnergy?: boolean
  pastAcceptedMeals?: string[]
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'late'
  location?: {
    countryCode?: string
  }
}

export interface ZeroCookResponse {
  meals: ZeroCookMeal[]
}
