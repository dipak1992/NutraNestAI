// ============================================================
// Cook Tools — Types for Smart Menu Scan & Food Check
// ============================================================

// ── Personal Preferences ──────────────────────────────────────────────────────

export type WeightGoal = 'lose' | 'maintain' | 'gain'

export interface PersonalPreferences {
  user_id: string
  weight_goal: WeightGoal
  protein_focus: boolean
  is_vegetarian: boolean
  allergies: string[]
  avoid_foods: string[]
  created_at?: string
  updated_at?: string
}

export const DEFAULT_PERSONAL_PREFS: Omit<PersonalPreferences, 'user_id'> = {
  weight_goal: 'maintain',
  protein_focus: false,
  is_vegetarian: false,
  allergies: [],
  avoid_foods: [],
}

// ── Menu Scan ─────────────────────────────────────────────────────────────────

export type MenuScanGoal =
  | 'best_for_me'
  | 'healthiest'
  | 'high_protein'
  | 'budget_pick'
  | 'kid_friendly'
  | 'treat_yourself'

export interface MenuScanGoalOption {
  id: MenuScanGoal
  label: string
  emoji: string
  description: string
}

export const MENU_SCAN_GOALS: MenuScanGoalOption[] = [
  { id: 'best_for_me',    label: 'Best for Me',     emoji: '⭐', description: 'Matches your personal profile' },
  { id: 'healthiest',     label: 'Healthiest Option', emoji: '🥗', description: 'Lowest calorie, most nutritious' },
  { id: 'high_protein',   label: 'High Protein',    emoji: '💪', description: 'Maximum protein per serving' },
  { id: 'budget_pick',    label: 'Budget Pick',     emoji: '💰', description: 'Best value for money' },
  { id: 'kid_friendly',   label: 'Kid-Friendly',    emoji: '👶', description: 'Safe and appealing for kids' },
  { id: 'treat_yourself', label: 'Treat Yourself',  emoji: '🎉', description: 'Go ahead, you deserve it' },
]

export interface MenuScanRecommendation {
  name: string
  why: string
  price_range?: string
  nutrition_note?: string
}

export interface MenuScanResult {
  recommendations: MenuScanRecommendation[]
  avoid: { name: string; reason: string }[]
  customizations: string[]
  summary: string
}

// ── Food Check ────────────────────────────────────────────────────────────────

export type FoodVerdict = 'healthy' | 'balanced' | 'indulgent'

export interface FoodCheckResult {
  food_name: string
  calorie_range: string
  calorie_confidence: 'low' | 'medium' | 'high'
  protein_level: 'low' | 'moderate' | 'high'
  verdict: FoodVerdict
  fits_goal: boolean
  goal_note: string
  smart_swaps: string[]
  summary: string
}

// ── Scan History ──────────────────────────────────────────────────────────────

export type ScanType = 'menu_scan' | 'food_check'

export interface ScanHistoryEntry {
  id: string
  user_id: string
  scan_type: ScanType
  goal?: string
  result: MenuScanResult | FoodCheckResult
  created_at: string
}
