import { updateSession } from '@/lib/supabase/middleware'
import { NextResponse, type NextRequest } from 'next/server'

function buildCsp() {
  return [
    `default-src 'self'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `object-src 'none'`,
    // 'unsafe-inline' is required by Next.js 15 for its own injected scripts.
    // 'unsafe-eval' has been removed — it is not required and enables code injection attacks.
    `script-src 'self' 'unsafe-inline' https://*.posthog.com https://*.sentry.io`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: blob: https:`,
    `font-src 'self' data:`,
    `connect-src 'self' https://*.supabase.co https://*.posthog.com https://*.sentry.io https://api.resend.com https://api.openai.com https://api.anthropic.com`,
    `frame-ancestors 'none'`,
    `upgrade-insecure-requests`,
  ].join('; ')
}

export async function middleware(request: NextRequest) {
  try {
    const response = await updateSession(request)
    response.headers.set('Content-Security-Policy', buildCsp())
    return response
  } catch {
    // Supabase unavailable (e.g. missing env vars) — pass through
    const response = NextResponse.next()
    response.headers.set('Content-Security-Policy', buildCsp())
    return response
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
