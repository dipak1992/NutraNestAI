/**
 * PostHog analytics helpers — safe to import in client and server components.
 * All calls are no-ops when NEXT_PUBLIC_POSTHOG_KEY is not set.
 */

// ── Event constants ────────────────────────────────────────────────────────────

export const Analytics = {
  LANDING_PAGE_VIEW:      'landing_page_view',
  SIGNUP_STARTED:         'signup_started',
  SIGNUP_COMPLETED:       'signup_completed',
  MEAL_GENERATED:         'meal_generated',
  MEAL_REGENERATED:       'meal_regenerated',
  SWIPE_ACTION:           'swipe_action',
  TONIGHT_MEAL_VIEWED:    'tonight_meal_viewed',
  PAYWALL_VIEW:           'paywall_view',
  SUBSCRIPTION_STARTED:   'subscription_started',
  SUBSCRIPTION_SUCCESS:   'subscription_success',
  REFERRAL_SHARED:        'referral_shared',
  EMAIL_CAPTURED:         'email_captured',
  ONBOARDING_STARTED:     'onboarding_started',
  ONBOARDING_COMPLETED:   'onboarding_completed',
  DELIVERY_FEATURE_OPENED:'delivery_feature_opened',
  SUGGESTION_CLICKED:     'suggestion_clicked',
  PROVIDER_SELECTED:      'provider_selected',
  REDIRECT_COMPLETED:     'redirect_completed',
  RETURNED_USER:          'returned_user',
  CONVERSION_TO_PAID_AFTER_USE: 'conversion_to_paid_after_use',
  // Dashboard message system
  SUPPORT_MESSAGE_SEEN:   'support_message_seen',
  SUPPORT_MESSAGE_CLICK:  'support_message_click',
  REWARD_TOAST_SHOWN:     'reward_toast_shown',
  MEMBER_ADDED:           'member_added',
  CHILD_PROFILE_ADDED:    'child_profile_added',
  FAMILY_PLAN_GENERATED:  'family_plan_generated',
  PICKY_EATER_TOOL_USED:  'picky_eater_tool_used',
  LUNCHBOX_GENERATED:     'lunchbox_generated',
  RETENTION_BY_HOUSEHOLD_SIZE: 'retention_by_household_size',
  // Kids tool CTAs
  KIDS_CTA_START_BAKING:  'cta_clicked_start_baking',
  KIDS_CTA_TRY_THIS:      'cta_clicked_try_this',
  KIDS_CTA_MAKE_THIS:     'cta_clicked_make_this',
  KIDS_CTA_PACK_THIS:     'cta_clicked_pack_this',
  KIDS_CTA_MAKE_NOW:      'cta_clicked_make_now',
  KIDS_SAVE_CLICKED:      'kids_save_clicked',
  KIDS_SHARE_CLICKED:     'kids_share_clicked',
  KIDS_SWAP_CLICKED:      'kids_swap_clicked',
  // Weekend Mode
  WEEKEND_MODE_CARD_VIEWED:  'weekend_mode_card_viewed',
  WEEKEND_MODE_BUTTON_CLICKED: 'weekend_mode_button_clicked',
  WEEKEND_MODE_OPENED:     'weekend_mode_opened',
  // Landing hero daily meal
  HERO_MEAL_SUGGESTION_VIEWED:  'hero_meal_suggestion_viewed',
  HERO_MEAL_SUGGESTION_CLICKED: 'hero_meal_suggestion_clicked',
} as const

export type AnalyticsEvent = (typeof Analytics)[keyof typeof Analytics]

// ── Client-side tracker (use in 'use client' components) ──────────────────────

export function trackEvent(event: AnalyticsEvent | string, properties?: Record<string, unknown>) {
  if (typeof window === 'undefined') return

  try {
    // @ts-expect-error — posthog is loaded by PostHogProvider
    if (window.posthog) {
      // @ts-expect-error
      window.posthog.capture(event, properties)
    }
  } catch {
    // Non-fatal — analytics must never break the app
  }
}
