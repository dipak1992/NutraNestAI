'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'

// PostHog is initialized via instrumentation-client.ts (Next.js 15.3+ approach).
// This wrapper provides the React context so usePostHog() works in client components.
// PHProvider gracefully handles the case where posthog hasn't been initialized.
export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return <PHProvider client={posthog}>{children}</PHProvider>
}
