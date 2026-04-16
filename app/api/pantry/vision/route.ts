import { NextRequest } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@/lib/supabase/server'
import { rateLimit, rateLimitKeyFromRequest } from '@/lib/rate-limit'
import { apiError, apiRateLimited, apiSuccess, withErrorHandler } from '@/lib/api-response'

let _openai: OpenAI | null = null
function getOpenAI() {
  if (!_openai) _openai = new OpenAI()
  return _openai
}

const SYSTEM_PROMPT = `You are a kitchen-inventory scanner. The user will show you a photo of their fridge, pantry shelf, or grocery items. List every distinct food ingredient you can see. Return ONLY a JSON array of lowercase English strings — no quantities, no brands, no packaging. Example: ["eggs","milk","cheddar cheese","spinach","chicken breast"]. If you cannot identify any food, return [].`

export const POST = withErrorHandler('pantry/vision', async (req: Request) => {
  const nextReq = req as unknown as NextRequest
  const rl = rateLimit({ key: rateLimitKeyFromRequest(nextReq), limit: 5, windowMs: 60_000 })
  if (!rl.success) return apiRateLimited(rl.reset)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return apiError('Authentication required', 401)

  const body = await req.json()
  const { image } = body as { image?: string }

  if (!image || typeof image !== 'string') {
    return apiError('Missing image data', 400)
  }

  // Validate base64 data URL format
  if (!image.startsWith('data:image/')) {
    return apiError('Invalid image format — expected a data URL', 400)
  }

  // Cap payload size (~10 MB base64)
  if (image.length > 14_000_000) {
    return apiError('Image too large — max 10 MB', 413)
  }

  const completion = await getOpenAI().chat.completions.create({
    model: 'gpt-4o-mini',
    max_tokens: 1024,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: { url: image, detail: 'low' },
          },
          { type: 'text', text: 'What food ingredients do you see?' },
        ],
      },
    ],
  })

  const raw = completion.choices[0]?.message?.content?.trim() ?? '[]'

  // Parse the JSON array — strip markdown fences if present
  let items: string[]
  try {
    const cleaned = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
    items = JSON.parse(cleaned)
    if (!Array.isArray(items)) throw new Error('not an array')
    items = items
      .filter((i): i is string => typeof i === 'string' && i.length > 0)
      .map(i => i.toLowerCase().trim().slice(0, 100))
      .slice(0, 50)
  } catch {
    return apiError('Failed to parse vision response', 502)
  }

  return apiSuccess({ items })
})
