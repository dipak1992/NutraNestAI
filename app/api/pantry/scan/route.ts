import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { rateLimit, rateLimitKeyFromRequest } from '@/lib/rate-limit'
import { apiError, apiRateLimited, apiSuccess, withErrorHandler } from '@/lib/api-response'

interface ScanBody {
  items: { name: string; category?: string; quantity?: number; unit?: string }[]
}

export const POST = withErrorHandler('pantry/scan', async (req: Request) => {
  const nextReq = req as unknown as NextRequest
  const rl = rateLimit({ key: rateLimitKeyFromRequest(nextReq), limit: 10, windowMs: 60_000 })
  if (!rl.success) return apiRateLimited(rl.reset)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return apiError('Authentication required', 401)

  const body = (await req.json()) as ScanBody
  if (!body.items?.length) return apiError('No items provided', 400)

  // Validate and sanitize items
  const sanitized = body.items
    .filter(item => item.name && typeof item.name === 'string')
    .slice(0, 50) // cap at 50 items per scan
    .map(item => ({
      user_id: user.id,
      name: item.name.trim().slice(0, 100),
      category: item.category?.trim().slice(0, 50) ?? 'other',
      quantity: Math.max(0, Math.min(item.quantity ?? 1, 999)),
      unit: item.unit?.trim().slice(0, 20) ?? 'unit',
      added_via: 'receipt' as const,
    }))

  if (!sanitized.length) return apiError('No valid items after sanitization', 400)

  const { data, error } = await supabase
    .from('pantry_items')
    .insert(sanitized)
    .select()

  if (error) return apiError('Failed to save pantry items', 500)

  return apiSuccess({ added: data?.length ?? 0, items: data })
})
