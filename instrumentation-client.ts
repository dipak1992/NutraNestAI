import posthog from 'posthog-js'

// Only initialize PostHog if the key is available
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: '/ingest',
    ui_host: 'https://us.posthog.com',
    person_profiles: 'identified_only',
    capture_exceptions: true,
    debug: process.env.NODE_ENV === 'development',
  })
}
