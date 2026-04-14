'use client'

import { useState } from 'react'
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
import { Loader2, Check, Gift } from 'lucide-react'

const schema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})
type FormValues = z.infer<typeof schema>

export default function SignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema) })

  // Read referral code from URL at submit time to avoid useSearchParams Suspense
  function getRefCode(): string | null {
    try {
      return new URLSearchParams(window.location.search).get('ref')
    } catch {
      return null
    }
  }

  async function onSubmit(values: FormValues) {
    setLoading(true)
    const refCode = getRefCode()
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: { emailRedirectTo: `${window.location.origin}/onboarding` },
    })
    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    // Apply referral code if present — fire-and-forget (non-blocking)
    if (refCode) {
      fetch('/api/referral/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: refCode }),
      }).catch(() => { /* silent – referral is best-effort */ })
    }

    toast.success('Account created! Redirecting to setup…')
    router.push('/onboarding')
    router.refresh()
  }

  const refCode = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('ref')
    : null

  return (
    <div className="glass-card rounded-2xl border border-border/60 p-8 shadow-xl">
      {refCode && (
        <div className="mb-5 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
          <Gift className="h-4 w-4 flex-shrink-0" />
          <span>You were invited by a friend — you&apos;ll unlock bonus days for them!</span>
        </div>
      )}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="text-sm text-muted-foreground mt-1">Start free, then upgrade to Pro when you want the full planner</p>
      </div>
      <div className="mb-5 space-y-1.5">
        {['Instant meal previews and Tonight swipes', '3-day weekly planner preview', 'Upgrade to Pro for the full plan and grocery list'].map((f) => (
          <div key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
            <Check className="h-4 w-4 text-primary flex-shrink-0" />
            <span dangerouslySetInnerHTML={{ __html: f }} />
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" autoComplete="email" {...register('email')} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="Min. 8 characters" autoComplete="new-password" {...register('password')} />
          {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input id="confirmPassword" type="password" placeholder="••••••••" autoComplete="new-password" {...register('confirmPassword')} />
          {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating account…</> : 'Create free account'}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-primary hover:underline">Sign in</Link>
      </p>
    </div>
  )
}
