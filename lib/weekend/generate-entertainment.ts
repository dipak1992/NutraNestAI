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

IMPORTANT RULES:
- Strongly prefer titles released from 2020 onwards. Older classics (pre-2020) are okay only if they are iconic and highly rated.
- The title MUST have an IMDb score of 6.5 or higher. Never recommend anything below 6.5.
- Vary your picks — avoid always suggesting the most obvious mainstream titles.

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
  "imdbScore": number (e.g. 7.4 — must be 6.5 or higher),
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
