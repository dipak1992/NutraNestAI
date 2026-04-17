import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { rateLimit, rateLimitKeyFromRequest } from '@/lib/rate-limit'
import { apiError, apiRateLimited } from '@/lib/api-response'
import logger from '@/lib/logger'
import type { ZeroCookRequest, ZeroCookResponse, ZeroCookMeal, DeliveryProvider } from '@/lib/zero-cook/types'

// ── Static meal catalog ──────────────────────────────────────

const ZERO_COOK_CATALOG: ZeroCookMeal[] = [
  { id: 'zc-thai-curry', name: 'Thai Green Curry', reason: 'Warming & aromatic — crowd-pleaser for families', cuisineType: 'thai', priceRange: '$12–18', etaRange: '25–35 min', popularityLabel: 'Most ordered', bestProvider: 'ubereats', searchQuery: 'Thai green curry' },
  { id: 'zc-pizza-marg', name: 'Margherita Pizza', reason: 'Classic choice the whole family loves', cuisineType: 'italian', priceRange: '$10–16', etaRange: '20–30 min', popularityLabel: 'Family favorite', bestProvider: 'doordash', searchQuery: 'Margherita pizza' },
  { id: 'zc-chicken-tikka', name: 'Chicken Tikka Masala', reason: 'Rich & creamy — comfort in a bowl', cuisineType: 'indian', priceRange: '$14–20', etaRange: '30–40 min', popularityLabel: 'Top rated', bestProvider: 'grubhub', searchQuery: 'Chicken tikka masala' },
  { id: 'zc-burrito-bowl', name: 'Burrito Bowl', reason: 'Easy to customize for picky eaters', cuisineType: 'mexican', priceRange: '$10–15', etaRange: '20–30 min', popularityLabel: 'Quick pick', bestProvider: 'doordash', searchQuery: 'Burrito bowl' },
  { id: 'zc-pad-thai', name: 'Pad Thai', reason: 'Kid-friendly noodles with a grown-up twist', cuisineType: 'thai', priceRange: '$11–16', etaRange: '25–35 min', popularityLabel: 'Fan favorite', bestProvider: 'ubereats', searchQuery: 'Pad thai' },
  { id: 'zc-sushi-combo', name: 'Sushi Combo Platter', reason: 'Light & fresh — great for a treat night', cuisineType: 'japanese', priceRange: '$18–28', etaRange: '30–45 min', popularityLabel: 'Treat yourself', bestProvider: 'grubhub', searchQuery: 'Sushi combo platter' },
  { id: 'zc-fried-chicken', name: 'Fried Chicken Bucket', reason: 'Zero effort, max satisfaction', cuisineType: 'american', priceRange: '$12–22', etaRange: '20–30 min', popularityLabel: 'Crowd-pleaser', bestProvider: 'doordash', searchQuery: 'Fried chicken bucket' },
  { id: 'zc-pho', name: 'Beef Pho', reason: 'Soul-warming broth — perfect for a cozy night', cuisineType: 'vietnamese', priceRange: '$12–17', etaRange: '25–35 min', popularityLabel: 'Comfort pick', bestProvider: 'ubereats', searchQuery: 'Beef pho' },
  { id: 'zc-butter-chicken', name: 'Butter Chicken & Naan', reason: 'Mild & creamy — kids love it too', cuisineType: 'indian', priceRange: '$13–19', etaRange: '30–40 min', popularityLabel: 'Family favorite', bestProvider: 'grubhub', searchQuery: 'Butter chicken naan' },
  { id: 'zc-mediterranean', name: 'Mediterranean Platter', reason: 'Healthy & shareable — hummus, falafel, pita', cuisineType: 'mediterranean', priceRange: '$13–20', etaRange: '25–35 min', popularityLabel: 'Healthy pick', bestProvider: 'ubereats', searchQuery: 'Mediterranean platter falafel' },
  { id: 'zc-tacos', name: 'Street Tacos', reason: 'Quick, fun, and everyone gets their own', cuisineType: 'mexican', priceRange: '$10–16', etaRange: '20–30 min', popularityLabel: 'Quick pick', bestProvider: 'doordash', searchQuery: 'Street tacos' },
  { id: 'zc-ramen', name: 'Tonkotsu Ramen', reason: 'Rich pork broth — ultimate comfort bowl', cuisineType: 'japanese', priceRange: '$13–18', etaRange: '25–35 min', popularityLabel: 'Top rated', bestProvider: 'ubereats', searchQuery: 'Tonkotsu ramen' },
  { id: 'zc-pasta', name: 'Pasta Bolognese', reason: 'Hearty & reliable — a weeknight staple', cuisineType: 'italian', priceRange: '$11–17', etaRange: '25–35 min', popularityLabel: 'Classic choice', bestProvider: 'doordash', searchQuery: 'Pasta bolognese' },
  { id: 'zc-shawarma', name: 'Chicken Shawarma Wrap', reason: 'Flavorful & filling — great on the go', cuisineType: 'mediterranean', priceRange: '$10–15', etaRange: '20–30 min', popularityLabel: 'Quick pick', bestProvider: 'grubhub', searchQuery: 'Chicken shawarma wrap' },
  { id: 'zc-mac-cheese', name: 'Mac & Cheese', reason: 'The ultimate kid-approved comfort food', cuisineType: 'american', priceRange: '$9–14', etaRange: '20–30 min', popularityLabel: 'Kid approved', bestProvider: 'doordash', searchQuery: 'Mac and cheese' },
]

// ── Helpers ──────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function filterAndRank(catalog: ZeroCookMeal[], req: ZeroCookRequest): ZeroCookMeal[] {
  let pool = [...catalog]

  // Boost preferred cuisines to top
  if (req.cuisinePreferences?.length) {
    const preferred = new Set(req.cuisinePreferences.map(c => c.toLowerCase()))
    pool.sort((a, b) => {
      const aMatch = preferred.has(a.cuisineType) ? 1 : 0
      const bMatch = preferred.has(b.cuisineType) ? 1 : 0
      return bMatch - aMatch
    })
  }

  // Budget filter: exclude high-priced items for low budget
  if (req.budget === 'low') {
    pool = pool.filter(m => !m.priceRange.includes('28') && !m.priceRange.includes('22'))
  }

  // Kid-friendly boost if household has kids
  const hasKids = (req.household.kidsCount ?? 0) + (req.household.toddlersCount ?? 0) > 0
  if (hasKids) {
    const kidFriendlyIds = new Set(['zc-pizza-marg', 'zc-mac-cheese', 'zc-burrito-bowl', 'zc-fried-chicken', 'zc-pasta', 'zc-pad-thai', 'zc-butter-chicken'])
    pool.sort((a, b) => {
      const aKid = kidFriendlyIds.has(a.id) ? 1 : 0
      const bKid = kidFriendlyIds.has(b.id) ? 1 : 0
      return bKid - aKid
    })
  }

  // Shuffle within tiers to add variety
  const top = pool.slice(0, 6)
  return shuffle(top).slice(0, 3)
}

// ── Route handler ───────────────────────────────────────────

export async function POST(req: NextRequest) {
  const rl = await rateLimit({ key: rateLimitKeyFromRequest(req), limit: 20, windowMs: 60_000 })
  if (!rl.success) return apiRateLimited(rl.reset)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return apiError('Unauthenticated', 401)

  try {
    const body = (await req.json()) as ZeroCookRequest

    if (!body.household) {
      return NextResponse.json({ error: 'Missing required field: household' }, { status: 400 })
    }

    const meals = filterAndRank(ZERO_COOK_CATALOG, body)

    return NextResponse.json({ meals } satisfies ZeroCookResponse)
  } catch (error) {
    logger.error('[zero-cook] Error', { error: error instanceof Error ? error.message : String(error) })
    return apiError('Failed to generate delivery picks')
  }
}
