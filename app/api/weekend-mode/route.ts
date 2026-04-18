import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getPaywallStatus } from '@/lib/paywall/server'
import { generateSmartMeal } from '@/lib/engine/engine'
import { generateEntertainment } from '@/lib/weekend/generate-entertainment'
import { rateLimit, rateLimitKeyFromRequest } from '@/lib/rate-limit'
import { apiError, apiRateLimited } from '@/lib/api-response'
import logger from '@/lib/logger'
import type { EntertainmentPrefs } from '@/types'

export async function POST(req: NextRequest) {
  const rl = await rateLimit({ key: rateLimitKeyFromRequest(req), limit: 10, windowMs: 60_000 })
  if (!rl.success) return apiRateLimited(rl.reset)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return apiError('Unauthenticated', 401)

  const paywall = await getPaywallStatus()
  if (!paywall.isPro) {
    return NextResponse.json({ error: 'Weekend Mode is a PRO feature' }, { status: 403 })
  }

  try {
    const body = (await req.json().catch(() => ({}))) as {
      excludeTitles?: string[]
      swapMeal?: boolean
      swapEntertainment?: boolean
      entertainmentPrefs?: EntertainmentPrefs
    }

    // Load user preferences from DB
    const { data: prefs } = await supabase
      .from('onboarding_preferences')
      .select(
        'has_kids, picky_eater, cuisines, disliked_foods, cooking_time_minutes, low_energy, country, entertainment_prefs',
      )
      .eq('user_id', user.id)
      .single()

    const hasKids = prefs?.has_kids ?? false
    const household = {
      adultsCount: 2,
      kidsCount: hasKids ? 1 : 0,
      toddlersCount: 0,
      babiesCount: 0,
    }

    const entertainmentPrefs: EntertainmentPrefs = body.entertainmentPrefs ?? prefs?.entertainment_prefs ?? {
      language: 'English',
      genre: ['Comedy', 'Drama'],
      watchStyle: hasKids ? 'family' : 'couple',
    }

    const mealRequest = {
      household,
      cuisinePreferences: prefs?.cuisines ?? [],
      lowEnergy: false, // Weekend = more energy/time
      maxCookTime: Math.max(prefs?.cooking_time_minutes ?? 45, 45), // at least 45 min on weekends
      pickyEater: prefs?.picky_eater
        ? {
            active: true,
            dislikedFoods: prefs.disliked_foods ?? [],
          }
        : undefined,
      locality: prefs?.country ?? undefined,
    }

    // Run both generators in parallel
    const [meal, entertainment] = await Promise.all([
      Promise.resolve(generateSmartMeal(mealRequest)),
      generateEntertainment({
        prefs: entertainmentPrefs,
        excludeTitles: body.excludeTitles ?? [],
        householdHasKids: hasKids,
      }),
    ])

    logger.info('[weekend-mode] Generated plan', { userId: user.id })

    return NextResponse.json({ meal, entertainment })
  } catch (error) {
    logger.error('[weekend-mode] Error', {
      error: error instanceof Error ? error.message : String(error),
    })
    return apiError('Failed to generate weekend plan')
  }
}
