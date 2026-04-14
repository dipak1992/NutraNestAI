import type { User } from '@supabase/supabase-js'
import type { SubscriptionTier } from '@/types'
import { createClient } from '@/lib/supabase/server'
import {
  FREE_PLAN_PREVIEW_DAYS,
  FREE_TONIGHT_SWIPE_LIMIT,
  isProTier,
  normalizeTier,
} from '@/lib/paywall/config'

export interface PaywallStatus {
  isAuthenticated: boolean
  tier: SubscriptionTier
  isPro: boolean
  freePlanPreviewDays: number
  freeTonightSwipeLimit: number
}

async function ensureProfile(user: User): Promise<SubscriptionTier> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('profiles')
    .select('subscription_tier')
    .eq('id', user.id)
    .maybeSingle()

  if (data?.subscription_tier) {
    return normalizeTier(data.subscription_tier)
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

  return fallbackTier
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
      freePlanPreviewDays: FREE_PLAN_PREVIEW_DAYS,
      freeTonightSwipeLimit: FREE_TONIGHT_SWIPE_LIMIT,
    }
  }

  const tier = await ensureProfile(user)

  return {
    isAuthenticated: true,
    tier,
    isPro: isProTier(tier),
    freePlanPreviewDays: FREE_PLAN_PREVIEW_DAYS,
    freeTonightSwipeLimit: FREE_TONIGHT_SWIPE_LIMIT,
  }
}

export async function requireProStatus(): Promise<PaywallStatus> {
  return getPaywallStatus()
}
