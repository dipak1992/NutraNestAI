import { NextResponse } from 'next/server'
import webpush from 'web-push'
import { createClient } from '@/lib/supabase/server'
import { getServerVapidConfig } from '@/lib/push/vapid'

export async function POST() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const vapid = getServerVapidConfig()
  if (!vapid) {
    return NextResponse.json({ error: 'VAPID keys are not configured' }, { status: 400 })
  }

  webpush.setVapidDetails(vapid.subject, vapid.publicKey, vapid.privateKey)

  const { data: subscription, error } = await supabase
    .from('push_subscriptions')
    .select('endpoint, p256dh, auth')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: 'Failed to load push subscription' }, { status: 500 })
  }

  if (!subscription) {
    return NextResponse.json({ error: 'No active push subscription found' }, { status: 404 })
  }

  try {
    await webpush.sendNotification(
      {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.p256dh,
          auth: subscription.auth,
        },
      },
      JSON.stringify({
        title: 'MealEase',
        body: 'Push notifications are ready on this device.',
        url: '/dashboard',
      }),
    )
  } catch {
    await supabase
      .from('push_subscriptions')
      .update({ is_active: false })
      .eq('user_id', user.id)
      .eq('endpoint', subscription.endpoint)

    return NextResponse.json({ error: 'Failed to send push test notification' }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
