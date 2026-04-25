'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Mail, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

type Mode = 'login' | 'signup'

type Props = {
  mode: Mode
  next?: string
}

export function EmailAuthForm({ mode, next = '/dashboard' }: Props) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const origin = typeof window !== 'undefined' ? window.location.origin : ''

    const { error: authError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
        shouldCreateUser: mode === 'signup',
      },
    })

    setLoading(false)

    if (authError) {
      setError(
        mode === 'login'
          ? 'No account found with that email. Try signing up instead.'
          : authError.message
      )
      return
    }

    setSent(true)
  }

  if (sent) {
    return (
      <div className="rounded-2xl border border-border/60 bg-muted/30 p-6 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#D97757]/10">
          <Check className="h-6 w-6 text-[#D97757]" />
        </div>
        <p className="font-semibold text-foreground">Check your email</p>
        <p className="mt-1 text-sm text-muted-foreground">
          We sent a magic link to <strong>{email}</strong>. Click it to{' '}
          {mode === 'login' ? 'sign in' : 'create your account'}.
        </p>
        <p className="mt-3 text-xs text-muted-foreground">
          Didn&apos;t get it? Check spam, or{' '}
          <button
            onClick={() => setSent(false)}
            className="text-[#D97757] hover:underline"
          >
            try again
          </button>
          .
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
          Email address
        </label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            autoComplete="email"
            className={cn(
              'w-full rounded-xl border bg-background pl-10 pr-4 py-3 text-sm outline-none transition-shadow',
              'ring-1 ring-border/60 focus:ring-[#D97757]',
              error && 'ring-destructive'
            )}
          />
        </div>
        {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
      </div>

      <button
        type="submit"
        disabled={loading || !email}
        className="w-full flex items-center justify-center gap-2 rounded-full bg-[#D97757] px-5 py-3 text-sm font-medium text-white hover:bg-[#c4674a] transition-colors disabled:opacity-60"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {mode === 'login' ? 'Send magic link' : 'Create account'}
      </button>
    </form>
  )
}
