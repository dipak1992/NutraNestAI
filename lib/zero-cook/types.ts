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
}

export type DeliveryProvider = 'ubereats' | 'doordash' | 'grubhub'

export interface ProviderLink {
  provider: DeliveryProvider
  label: string
  emoji: string
  deepLink: string
  webUrl: string
}

export interface ZeroCookRequest {
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
}

export interface ZeroCookResponse {
  meals: ZeroCookMeal[]
}
