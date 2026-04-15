'use client'

import { useId } from 'react'
import { cn } from '@/lib/utils'

interface MealEaseLogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showText?: boolean
  /** Show the small "AI" badge next to the text */
  showBadge?: boolean
  /** Force white text (e.g. on dark/photo backgrounds) */
  invertText?: boolean
}

const sizeMap = {
  sm: { icon: 28, text: 'text-[15px]', gap: 'gap-1.5' },
  md: { icon: 34, text: 'text-[18px]', gap: 'gap-2' },
  lg: { icon: 42, text: 'text-[22px]', gap: 'gap-2.5' },
  xl: { icon: 56, text: 'text-[28px]', gap: 'gap-3' },
}

export function MealEaseLogo({
  className,
  size = 'md',
  showText = true,
  showBadge = false,
  invertText = false,
}: MealEaseLogoProps) {
  const uid = useId()
  const gradId  = `me-bg-${uid}`
  const clipId  = `me-clip-${uid}`
  const { icon, text, gap } = sizeMap[size]

  return (
    <span className={cn('inline-flex items-center font-bold select-none', gap, className)}>
      {/* ── Icon mark ───────────────────────────────────────────────── */}
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ flexShrink: 0 }}
      >
        <defs>
          {/* Green gradient background */}
          <linearGradient id={gradId} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#66BB6A" />
            <stop offset="100%" stopColor="#2E7D32" />
          </linearGradient>
          {/* Clip to rounded rect */}
          <clipPath id={clipId}>
            <rect width="40" height="40" rx="9.5" />
          </clipPath>
        </defs>

        {/* Background */}
        <rect width="40" height="40" rx="9.5" fill={`url(#${gradId})`} />

        <g clipPath={`url(#${clipId})`}>
          {/* ── House outline (home = family) — subtle above bowl ── */}
          <path
            d="M 13 19 L 20 11.5 L 27 19"
            stroke="white"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.55"
            fill="none"
          />

          {/* ── Bowl rim ── */}
          <line
            x1="7" y1="20.5" x2="33" y2="20.5"
            stroke="white"
            strokeWidth="2.6"
            strokeLinecap="round"
          />

          {/* ── Bowl body (white filled) ── */}
          <path
            d="M 8.5 20.5 Q 8.5 36.5 20 36.5 Q 31.5 36.5 31.5 20.5 Z"
            fill="white"
          />

          {/* ── Spoon (dark green) ── */}
          {/* Spoon head — oval */}
          <ellipse cx="14" cy="26.5" rx="2.9" ry="2.3" fill="#2E7D32" />
          {/* Spoon handle */}
          <path
            d="M 16.5 28 L 22.5 32.5"
            stroke="#2E7D32"
            strokeWidth="2.1"
            strokeLinecap="round"
          />

          {/* ── Leaf (fresh greens) ── */}
          <path
            d="M 22.5 28.5 Q 26 24.5 29 28 Q 26 31.5 22.5 28.5 Z"
            fill="#81C784"
          />
          {/* Leaf vein */}
          <path
            d="M 22.5 28.5 Q 25.5 28 29 28"
            stroke="#4CAF50"
            strokeWidth="0.8"
            strokeLinecap="round"
            fill="none"
            opacity="0.7"
          />

          {/* ── Carrot / veggie pop (orange accent) ── */}
          <circle cx="26" cy="24" r="2.3" fill="#FF7043" />
          {/* Carrot top leaves */}
          <path
            d="M 25 22 Q 26 20.5 27 22"
            stroke="#66BB6A"
            strokeWidth="1.1"
            strokeLinecap="round"
            fill="none"
          />

          {/* ── Sparkle top-right ── */}
          <path
            d="M 34.5 7 L 34.5 11.5 M 32.2 9.2 L 36.8 9.2"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.85"
          />
          {/* Sparkle cross top-left (smaller) */}
          <path
            d="M 5.5 8 L 5.5 11.5 M 3.8 9.8 L 7.2 9.8"
            stroke="white"
            strokeWidth="1.1"
            strokeLinecap="round"
            opacity="0.5"
          />
        </g>
      </svg>

      {/* ── Wordmark ─────────────────────────────────────────────────── */}
      {showText && (
        <span className={cn('tracking-tight leading-none', text)}>
          <span style={{ color: invertText ? 'white' : '#1F2937' }}>Meal</span>
          <span style={{ color: invertText ? '#A5D6A7' : '#4CAF50' }}>Ease</span>

          {showBadge && (
            <sup
              className="ml-0.5 inline-flex items-center rounded px-[3px] py-px text-[8px] font-bold tracking-tight leading-none border align-super"
              style={{
                background: 'rgba(76,175,80,0.1)',
                color: '#2E7D32',
                borderColor: 'rgba(76,175,80,0.25)',
              }}
            >
              AI
            </sup>
          )}
        </span>
      )}
    </span>
  )
}
