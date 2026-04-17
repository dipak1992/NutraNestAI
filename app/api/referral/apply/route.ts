import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { applyReferralCode } from '@/lib/referral/server'
import { getPostHogClient } from '@/lib/posthog-server'

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let code: string | undefined
  try {
    const body = await req.json()
    code = body?.code
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (!code || typeof code !== 'string') {
    return NextResponse.json({ error: 'code is required' }, { status: 400 })
  }

  const result = await applyReferralCode(code, user.id)

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 422 })
  }

  const posthog = getPostHogClient()
  posthog.capture({
    distinctId: user.id,
    event: 'referral_applied',
    properties: {
      referral_code: code,
      bonus_days_granted: result.bonusDaysGranted,
      temp_pro_granted: result.tempProGranted,
    },
  })

  return NextResponse.json({
    bonusDaysGranted: result.bonusDaysGranted,
    tempProGranted: result.tempProGranted,
  })
}
