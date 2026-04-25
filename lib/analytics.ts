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
