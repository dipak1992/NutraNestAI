import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { apiRateLimited } from '@/lib/api-response'
import { rateLimit, rateLimitKeyFromRequest } from '@/lib/rate-limit'
import { authRedirectUrl, safeRelativePath } from '@/lib/auth/redirect'

export async function POST(req: NextRequest) {
  const rl = await rateLimit({
    key: `auth-oauth:${rateLimitKeyFromRequest(req)}`,
    limit: 10,
    windowMs: 60_000,
  })
  if (!rl.success) return apiRateLimited(rl.reset)

  const body = (await req.json().catch(() => ({}))) as { provider?: string; next?: string }
  if (body.provider !== 'google') {
    return NextResponse.json({ error: 'Unsupported provider' }, { status: 400 })
  }

  const supabase = await createClient()
  const next = safeRelativePath(body.next, '/dashboard')
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: authRedirectUrl(`/auth/callback?next=${encodeURIComponent(next)}`),
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })

  if (error || !data.url) {
    console.error('[auth/oauth] signInWithOAuth failed:', error?.message)
    return NextResponse.json({ error: 'Could not start sign-in' }, { status: 500 })
  }

  return NextResponse.json({ url: data.url })
}
