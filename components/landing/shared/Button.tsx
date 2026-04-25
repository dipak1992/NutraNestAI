import Link from 'next/link'
import { cn } from '@/lib/utils'

type Props = {
  href?: string
  onClick?: () => void
  className?: string
  children: React.ReactNode
  type?: 'button' | 'submit' | 'reset'
}

/**
 * Shared Button component used by landing/about components.
 * Renders as <Link> when href is provided, otherwise as <button>.
 */
export function Button({ href, onClick, className, children, type = 'button' }: Props) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 min-h-[48px] px-6 text-base bg-[#D97757] text-white hover:bg-[#c4674a]'

  if (href) {
    return (
      <Link href={href} className={cn(base, className)}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} onClick={onClick} className={cn(base, className)}>
      {children}
    </button>
  )
}
