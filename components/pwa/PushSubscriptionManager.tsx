'use client'

import { useEffect } from 'react'
import { publicEnv } from '@/lib/env'
import { subscribeForPush } from '@/lib/push/subscribe'

export function PushSubscriptionManager() {
  useEffect(() => {
    if (Notification.permission === 'granted') {
      void subscribeForPush()
    }

    const onPermissionChange = () => {
      if (Notification.permission === 'granted') {
        void subscribeForPush()
      }
    }

    document.addEventListener('visibilitychange', onPermissionChange)
    return () => document.removeEventListener('visibilitychange', onPermissionChange)
  }, [])

  return null
}
