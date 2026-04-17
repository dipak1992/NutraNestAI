'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'

// PostHog is initialized via instrumentation-client.ts (Next.js 15.3+ approach).
// This wrapper only provides the React context so usePostHog() works in client components.
export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return <PHProvider client={posthog}>{children}</PHProvider>
}
