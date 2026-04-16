import Link from 'next/link'
import { MealEaseLogo } from '@/components/ui/MealEaseLogo'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh gradient-hero flex flex-col items-center justify-center p-4">
      <div className="mb-8">
        <Link href="/">
          <MealEaseLogo size="lg" />
        </Link>
      </div>
      <div className="w-full max-w-md">{children}</div>
    </div>
  )
}
