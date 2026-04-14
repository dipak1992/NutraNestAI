// ============================================================
// Adaptive Learning System — Types
// ============================================================

/** A single user feedback event */
export interface MealFeedback {
  mealId: string
  title: string
  cuisineType: string
  proteinType: string
  tags: string[]
  difficulty: 'easy' | 'moderate' | 'hard'
  totalTime: number
  action: 'like' | 'reject' | 'save'
  timestamp: number
}

/** Aggregated preference signal derived from feedback history */
export interface PreferenceSignal {
  // Positive affinity scores (0-1 range, higher = more preferred)
  cuisineAffinities: Record<string, number>
  proteinAffinities: Record<string, number>
  tagAffinities: Record<string, number>

  // Negative signals
  rejectedMealIds: string[]
  rejectedCuisines: Record<string, number> // rejection ratio
  rejectedProteins: Record<string, number>

  // Behavioral patterns
  preferredDifficulty: 'easy' | 'moderate' | 'hard' | null
  preferredTimeRange: { min: number; max: number } | null
  pickyScore: number // 0-1, higher = pickier (lots of rejects)

  // Metadata
  totalInteractions: number
  lastUpdated: number
}

/** Scoring adjustments the engine applies based on learning */
export interface LearnedBoosts {
  cuisineBoost: Record<string, number>   // mealId-agnostic cuisine score adj
  proteinBoost: Record<string, number>
  tagBoost: Record<string, number>
  mealPenalties: string[]                // reject-specific mealId penalties
  difficultyBoost: number                // + for matching preferred difficulty
  timeBoost: number                      // + for matching preferred time range
  pickyMultiplier: number                // amplifies kid-friendly scoring
}
