'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import posthog from 'posthog-js'

const schema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})
type FormValues = z.infer<typeof schema>

// Inline Google "G" icon — no external dependency needed
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" className="flex-shrink-0">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908C16.658 14.108 17.64 11.8 17.64 9.2z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"/>
      <path fill="#FBBC05" d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"/>
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z"/>
    </svg>
  )
}

// Whitelist of known error codes → user-visible messages
const URL_ERROR_MESSAGES: Record<string, string> = {
  oauth_error: 'Google sign-in failed. Please try again.',
  email_not_confirmed: 'Please confirm your email before signing in.',
  invalid_credentials: 'Invalid email or password.',
  session_expired: 'Your session has expired. Please sign in again.',
}

function sanitizeUrlError(raw: string): string {
  const key = raw.toLowerCase().replace(/[^a-z_]/g, '')
  return URL_ERROR_MESSAGES[key] ?? 'Something went wrong. Please try again.'
}

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [urlError, setUrlError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema) })

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const err = params.get('error')
    if (err) setUrlError(sanitizeUrlError(decodeURIComponent(err)))
  }, [])

  async function onSubmit(values: FormValues) {
    setLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword({ email: values.email, password: values.password })
    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }
    posthog.identify(data.user.id, { email: data.user.email })
    posthog.capture('user_logged_in', { method: 'email' })
    const redirectTarget = new URLSearchParams(window.location.search).get('redirect') || '/dashboard'
    router.push(redirectTarget)
    router.refresh()
  }

  async function handleGoogleSignIn() {
    setGoogleLoading(true)
    posthog.capture('user_logged_in', { method: 'google' })
    const supabase = createClient()
    const redirectTarget = new URLSearchParams(window.location.search).get('redirect') || '/dashboard'
    // Note: Google provider must be enabled in Supabase dashboard → Authentication → Providers → Google
    // redirectTo must exactly match an allowed URL in Supabase dashboard (no query params)
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    setGoogleLoading(false)
  }

  return (
    <div className="glass-card rounded-2xl border border-border/60 p-8 shadow-xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-sm text-muted-foreground mt-1">Sign in to your MealEase account</p>
      </div>

      {urlError && (
        <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {urlError}
        </div>
      )}

      {/* Google OAuth */}
      <Button
        type="button"
        variant="outline"
        className="w-full h-12 flex items-center justify-center gap-2 mb-4"
        onClick={handleGoogleSignIn}
        disabled={googleLoading || loading}
      >
        {googleLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleIcon />}
        Continue with Google
      </Button>

      <div className="relative mb-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border/50" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">or</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" autoComplete="email" {...register('email')} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="/forgot-password" className="text-xs text-muted-foreground hover:text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" autoComplete="current-password" {...register('password')} />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
        </div>
        <Button type="submit" className="w-full" disabled={loading || googleLoading}>
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Signing in…</> : 'Sign in'}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="font-medium text-primary hover:underline">Sign up free</Link>
      </p>
    </div>
  )
}
