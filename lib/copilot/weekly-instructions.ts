import { createClient } from '@/lib/supabase/server'

export interface WeeklyInstruction {
  id: string
  user_id: string
  instruction: string
  category: 'cuisine' | 'speed' | 'dietary' | 'avoidance' | 'general'
  expires_at: string
  created_at: string
  is_active: boolean
}

/**
 * Get all active (non-expired) weekly instructions for a user
 */
export async function getActiveInstructions(userId: string): Promise<WeeklyInstruction[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('copilot_weekly_instructions')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[weekly-instructions] fetch error:', error)
    return []
  }

  return (data ?? []) as WeeklyInstruction[]
}

/**
 * Set a new weekly instruction (expires in 7 days by default)
 */
export async function setWeeklyInstruction(
  userId: string,
  instruction: string,
  category: WeeklyInstruction['category'] = 'general',
  durationDays: number = 7
): Promise<WeeklyInstruction | null> {
  const supabase = await createClient()

  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + durationDays)

  // Deactivate any existing instruction in the same category
  await supabase
    .from('copilot_weekly_instructions')
    .update({ is_active: false })
    .eq('user_id', userId)
    .eq('category', category)
    .eq('is_active', true)

  // Insert new instruction
  const { data, error } = await supabase
    .from('copilot_weekly_instructions')
    .insert({
      user_id: userId,
      instruction,
      category,
      expires_at: expiresAt.toISOString(),
      is_active: true,
    })
    .select()
    .single()

  if (error) {
    console.error('[weekly-instructions] insert error:', error)
    return null
  }

  return data as WeeklyInstruction
}

/**
 * Clear a specific instruction or all instructions for a user
 */
export async function clearInstructions(
  userId: string,
  category?: WeeklyInstruction['category']
): Promise<void> {
  const supabase = await createClient()

  let query = supabase
    .from('copilot_weekly_instructions')
    .update({ is_active: false })
    .eq('user_id', userId)
    .eq('is_active', true)

  if (category) {
    query = query.eq('category', category)
  }

  await query
}

/**
 * Format active instructions for injection into system prompt
 */
export function formatInstructionsForPrompt(instructions: WeeklyInstruction[]): string {
  if (instructions.length === 0) return ''

  const lines = instructions.map((i) => {
    const daysLeft = Math.ceil(
      (new Date(i.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    )
    return `- ${i.instruction} (${daysLeft}d remaining, category: ${i.category})`
  })

  return `\n\n## ACTIVE WEEKLY INSTRUCTIONS (from user)\nThe user has set these temporary preferences. Respect them in ALL suggestions this week:\n${lines.join('\n')}\n\nThese override general preferences when they conflict. Do NOT ask about them again — just apply them.`
}

/**
 * Detect the category of an instruction from natural language
 */
export function detectInstructionCategory(instruction: string): WeeklyInstruction['category'] {
  const lower = instruction.toLowerCase()

  // Cuisine patterns
  if (/\b(thai|italian|japanese|indian|mexican|chinese|korean|mediterranean|french|greek|vietnamese|american|spanish|middle eastern|african)\b/.test(lower)) {
    return 'cuisine'
  }

  // Speed patterns
  if (/\b(quick|fast|easy|simple|30.?min|15.?min|under \d+|no.?fuss|one.?pot|minimal)\b/.test(lower)) {
    return 'speed'
  }

  // Dietary patterns
  if (/\b(vegetarian|vegan|keto|low.?carb|high.?protein|paleo|whole30|gluten.?free|dairy.?free)\b/.test(lower)) {
    return 'dietary'
  }

  // Avoidance patterns
  if (/\b(no |avoid|without|don'?t|skip|hate|allergic|can'?t eat)\b/.test(lower)) {
    return 'avoidance'
  }

  return 'general'
}
