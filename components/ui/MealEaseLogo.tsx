import { cn } from '@/lib/utils'

interface MealEaseLogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
}

const sizeMap = {
  sm: { icon: 28, text: 'text-base', gap: 'gap-1.5' },
  md: { icon: 34, text: 'text-lg', gap: 'gap-2' },
  lg: { icon: 42, text: 'text-2xl', gap: 'gap-2.5' },
}

export function MealEaseLogo({ className, size = 'md', showText = true }: MealEaseLogoProps) {
  const { icon, text, gap } = sizeMap[size]

  return (
    <span className={cn('flex items-center font-bold', gap, className)}>
      {/* Icon mark: stylised plate with fork */}
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect width="36" height="36" rx="9" fill="currentColor" className="text-primary" />
        {/* Plate circle */}
        <circle cx="18" cy="19" r="8" stroke="white" strokeWidth="1.8" fill="none" />
        <circle cx="18" cy="19" r="4.5" stroke="white" strokeWidth="1.4" fill="none" />
        {/* Fork tines */}
        <line x1="13" y1="8" x2="13" y2="12" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="15" y1="8" x2="15" y2="12" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="17" y1="8" x2="17" y2="12" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        {/* Fork handle */}
        <line x1="15" y1="12" x2="15" y2="16" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </svg>

      {showText && (
        <span className={cn('tracking-tight', text)}>
          <span className="text-primary">Meal</span>
          <span className="text-foreground">Ease</span>
        </span>
      )}
    </span>
  )
}
