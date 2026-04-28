'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PostHogProvider } from '@/components/providers/PostHogProvider'
import { PushSubscriptionManager } from '@/components/pwa/PushSubscriptionManager'
import { useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
          },
        },
      })
  )

  return (
    <PostHogProvider>
      <QueryClientProvider client={queryClient}>
        <PushSubscriptionManager />
        {children}
      </QueryClientProvider>
    </PostHogProvider>
  )
}
