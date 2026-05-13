import { AuthShell } from '@/components/auth/AuthShell'
import { AuthProviders } from '@/components/auth/AuthProviders'
import { EmailAuthForm } from '@/components/auth/EmailAuthForm'
import { productStory } from '@/lib/marketing/stats'
import Link from 'next/link'

export const metadata = {
  title: 'Create account | MealEase',
  description: productStory,
}

export default async function SignupPage({
  searchParams,
}: {
  searchParams?: Promise<{ next?: string }>
}) {
  const params = searchParams ? await searchParams : {}
  const next = params.next?.startsWith('/') ? params.next : '/onboarding'

  return (
    <AuthShell
      title="Start free today"
      subtitle={productStory}
      footerText="Already have an account?"
      footerLink={{ label: 'Sign in', href: '/login' }}
    >
      <div className="space-y-4">
        <AuthProviders next={next} />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-neutral-200 dark:border-neutral-700" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-neutral-950 px-2 text-neutral-400">
              or continue with email
            </span>
          </div>
        </div>

        <EmailAuthForm mode="signup" next={next} />

        <p className="text-center text-xs text-neutral-400 dark:text-neutral-500">
          By signing up you agree to our{' '}
          <Link href="/terms" className="underline hover:text-neutral-600">
            Terms
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="underline hover:text-neutral-600">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </AuthShell>
  )
}
