import { generateText } from '@/lib/ai/service'
import type { EntertainmentPrefs, EntertainmentResult } from '@/types'

interface GenerateEntertainmentOptions {
  prefs: EntertainmentPrefs
  excludeTitles?: string[]
  householdHasKids?: boolean
}

export async function generateEntertainment(
  options: GenerateEntertainmentOptions,
): Promise<EntertainmentResult> {
  const { prefs, excludeTitles = [], householdHasKids = false } = options

  const exclusionNote =
    excludeTitles.length > 0
      ? `Do NOT suggest any of these titles (already seen): ${excludeTitles.join(', ')}.`
      : ''

  const kidsNote = householdHasKids
    ? 'The household has children — keep the content family-friendly.'
    : ''

  const system = `You are a film and TV recommendation engine. You respond ONLY with valid JSON — no markdown, no explanation.`

  const user = `Recommend a single ${prefs.watchStyle === 'family' ? 'family-friendly' : ''} movie or series for tonight.

Preferences:
- Language: ${prefs.language}
- Genres: ${prefs.genre.join(', ')}
- Watch style: ${prefs.watchStyle}
${kidsNote}
${exclusionNote}

Return ONLY this JSON object (no wrapper, no code fences):
{
  "title": "string",
  "type": "movie" | "series",
  "year": number,
  "rating": "string (e.g. PG, PG-13, R, TV-14)",
  "whereToWatch": ["string", ...],
  "reason": "string (1–2 sentences why this fits tonight)",
  "posterEmoji": "string (single emoji representing the vibe)"
}`

  const { text } = await generateText({ system, user, maxTokens: 512 })

  const cleaned = text
    .replace(/```json\s*/g, '')
    .replace(/```\s*/g, '')
    .trim()

  const parsed = JSON.parse(cleaned) as EntertainmentResult
  return parsed
}
