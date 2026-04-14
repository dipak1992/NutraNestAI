import Link from 'next/link'
import { Leaf } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen gradient-hero flex flex-col items-center justify-center p-4">
      <div className="mb-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-md">
            <Leaf className="h-5 w-5" />
          </span>
          <span className="text-gradient-sage">NutriNest AI</span>
        </Link>
      </div>
      <div className="w-full max-w-md">{children}</div>
    </div>
  )
}
