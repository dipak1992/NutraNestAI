import { updateSession } from '@/lib/supabase/middleware'
import { NextResponse, type NextRequest } from 'next/server'
import { isSuspiciousPath, isTrustedOrigin, logSecurityEvent, requestIp } from '@/lib/security'

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
  const requestId = request.headers.get('x-request-id') ?? crypto.randomUUID()
  const pathname = request.nextUrl.pathname
  const origin = request.headers.get('origin')
  const isApi = pathname.startsWith('/api/')
  const forwardedProto = request.headers.get('x-forwarded-proto')
  const method = request.method.toUpperCase()

  if (process.env.NODE_ENV === 'production' && (request.nextUrl.protocol === 'http:' || forwardedProto === 'http')) {
    const url = request.nextUrl.clone()
    url.protocol = 'https:'
    logSecurityEvent('http_redirect', {
      requestId,
      path: pathname,
      ip: requestIp(request.headers),
    }, 'info')
    return NextResponse.redirect(url, 308)
  }

  if (isSuspiciousPath(pathname)) {
    logSecurityEvent('suspicious_path', {
      requestId,
      path: pathname,
      method,
      ip: requestIp(request.headers),
      userAgent: request.headers.get('user-agent') ?? 'unknown',
    })
  }

  if (isApi && origin && !isTrustedOrigin(origin)) {
    logSecurityEvent('blocked_origin', {
      requestId,
      path: pathname,
      method,
      origin,
      ip: requestIp(request.headers),
    })
    return new NextResponse(null, { status: 403, headers: { 'x-request-id': requestId } })
  }

  if (isApi && method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 204 })
    setCommonHeaders(response, requestId)
    setCorsHeaders(response, origin)
    return response
  }

  try {
    const response = await updateSession(request)
    setCommonHeaders(response, requestId)
    if (isApi) setCorsHeaders(response, origin)
    return response
  } catch {
    // Supabase unavailable (e.g. missing env vars) — pass through
    const response = NextResponse.next()
    setCommonHeaders(response, requestId)
    if (isApi) setCorsHeaders(response, origin)
    return response
  }
}

function setCommonHeaders(response: NextResponse, requestId: string) {
  response.headers.set('Content-Security-Policy', buildCsp())
  response.headers.set('x-request-id', requestId)
}

function setCorsHeaders(response: NextResponse, origin: string | null) {
  if (origin && isTrustedOrigin(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set('Access-Control-Allow-Credentials', 'true')
  }
  response.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-Request-ID')
  response.headers.set('Access-Control-Max-Age', '600')
  response.headers.append('Vary', 'Origin')
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
