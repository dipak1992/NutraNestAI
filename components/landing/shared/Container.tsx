import { cn } from '@/lib/utils'

type Props = {
  className?: string
  children: React.ReactNode
}

export function Container({ className, children }: Props) {
  return (
    <div className={cn('mx-auto max-w-6xl px-4 sm:px-6 lg:px-8', className)}>
      {children}
    </div>
  )
}
