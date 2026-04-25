import { AuthShell } from '@/components/auth/AuthShell'
import { AuthProviders } from '@/components/auth/AuthProviders'
import { EmailAuthForm } from '@/components/auth/EmailAuthForm'

export const metadata = {
  title: 'Create account | MealEase',
  description: 'Start planning meals for your household — free forever.',
}

export default function SignupPage() {
  return (
    <AuthShell
      title="Start free today"
      subtitle="Plan meals, scan your fridge, and stop the 'what's for dinner?' spiral."
      footerText="Already have an account?"
      footerLink={{ label: 'Sign in', href: '/login' }}
    >
      <div className="space-y-4">
        <AuthProviders next="/onboarding" />

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

        <EmailAuthForm mode="signup" next="/onboarding" />

        <p className="text-center text-xs text-neutral-400 dark:text-neutral-500">
          By signing up you agree to our{' '}
          <a href="/terms" className="underline hover:text-neutral-600">
            Terms
          </a>{' '}
          and{' '}
          <a href="/privacy" className="underline hover:text-neutral-600">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </AuthShell>
  )
}
