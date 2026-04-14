'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { useEffect } from 'react'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com'

    if (!key) return

    posthog.init(key, {
      api_host: host,
      // Capture pageviews automatically
      capture_pageview: true,
      // Capture pageleave events
      capture_pageleave: true,
      // Don't capture PII in autocapture
      autocapture: false,
      // Respect Do Not Track
      respect_dnt: true,
      // Don't send events in development
      loaded: (ph) => {
        if (process.env.NODE_ENV !== 'production') ph.opt_out_capturing()
      },
    })
  }, [])

  return <PHProvider client={posthog}>{children}</PHProvider>
}
