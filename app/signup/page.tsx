import { AuthShell } from '@/components/auth/AuthShell'
import { AuthProviders } from '@/components/auth/AuthProviders'
import { EmailAuthForm } from '@/components/auth/EmailAuthForm'

export const metadata = {
  title: 'Sign up | MealEase',
  description: 'Create your free MealEase account. No credit card required.',
}

export default function SignupPage() {
  return (
    <AuthShell
      title="Start for free"
      subtitle="No credit card required. Cancel anytime."
      footerText="Already have an account?"
      footerLink={{ label: 'Log in', href: '/login' }}
    >
      <div className="space-y-4">
        <AuthProviders next="/onboarding" />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/50" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">or</span>
          </div>
        </div>

        <EmailAuthForm mode="signup" next="/onboarding" />

        <p className="text-center text-xs text-muted-foreground">
          By signing up you agree to our{' '}
          <a href="/terms" className="text-[#D97757] hover:underline">Terms</a>
          {' '}and{' '}
          <a href="/privacy" className="text-[#D97757] hover:underline">Privacy Policy</a>.
        </p>
      </div>
    </AuthShell>
  )
}
