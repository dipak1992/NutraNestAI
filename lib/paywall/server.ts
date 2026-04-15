import type { User } from '@supabase/supabase-js'
import type { SubscriptionTier } from '@/types'
import { createClient } from '@/lib/supabase/server'
import {
  FREE_PLAN_PREVIEW_DAYS,
  FREE_TONIGHT_SWIPE_LIMIT,
  FREE_KIDS_RECIPE_LIMIT,
  isProTier,
  normalizeTier,
} from '@/lib/paywall/config'
import { REFERRAL_MAX_BONUS_DAYS } from '@/lib/referral/config'

export interface PaywallStatus {
  isAuthenticated: boolean
  tier: SubscriptionTier
  isPro: boolean
  isTempPro: boolean
  effectivePlanPreviewDays: number
  freePlanPreviewDays: number
  freeTonightSwipeLimit: number
  freeKidsRecipeLimit: number
  bonusDays: number
  tempProUntil: string | null
}

async function ensureProfile(user: User): Promise<{
  tier: SubscriptionTier
  bonusDays: number
  tempProUntil: string | null
}> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('profiles')
    .select('subscription_tier, bonus_days, temp_pro_until')
    .eq('id', user.id)
    .maybeSingle()

  if (data?.subscription_tier) {
    return {
      tier: normalizeTier(data.subscription_tier),
      bonusDays: data.bonus_days ?? 0,
      tempProUntil: data.temp_pro_until ?? null,
    }
  }

  const fallbackTier: SubscriptionTier = 'free'
  await supabase.from('profiles').upsert(
    {
      id: user.id,
      email: user.email ?? null,
      subscription_tier: fallbackTier,
    },
    { onConflict: 'id' },
  )

  return { tier: fallbackTier, bonusDays: 0, tempProUntil: null }
}

export async function getPaywallStatus(): Promise<PaywallStatus> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      isAuthenticated: false,
      tier: 'free',
      isPro: false,
      isTempPro: false,
      effectivePlanPreviewDays: FREE_PLAN_PREVIEW_DAYS,
      freePlanPreviewDays: FREE_PLAN_PREVIEW_DAYS,
      freeTonightSwipeLimit: FREE_TONIGHT_SWIPE_LIMIT,
      freeKidsRecipeLimit: FREE_KIDS_RECIPE_LIMIT,
      bonusDays: 0,
      tempProUntil: null,
    }
  }

  const { tier, bonusDays, tempProUntil } = await ensureProfile(user)

  const isTempPro = !!tempProUntil && new Date(tempProUntil) > new Date()
  const isPro = isProTier(tier) || isTempPro
  const clampedBonusDays = Math.min(bonusDays, REFERRAL_MAX_BONUS_DAYS)
  const effectivePlanPreviewDays = isPro
    ? 7
    : Math.min(FREE_PLAN_PREVIEW_DAYS + clampedBonusDays, 7)

  return {
    isAuthenticated: true,
    tier,
    isPro,
    isTempPro,
    effectivePlanPreviewDays,
    freePlanPreviewDays: FREE_PLAN_PREVIEW_DAYS,
    freeTonightSwipeLimit: FREE_TONIGHT_SWIPE_LIMIT,
    freeKidsRecipeLimit: FREE_KIDS_RECIPE_LIMIT,
    bonusDays: clampedBonusDays,
    tempProUntil,
  }
}

export async function requireProStatus(): Promise<PaywallStatus> {
  return getPaywallStatus()
}
