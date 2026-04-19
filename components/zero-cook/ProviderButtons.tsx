'use client'

import { useCallback } from 'react'
import type { ProviderLink } from '@/lib/zero-cook/types'
import { Button } from '@/components/ui/button'
import { trackEvent, Analytics } from '@/lib/analytics'

interface ProviderButtonsProps {
  links: ProviderLink[]
  onSelect: (provider: string, url: string) => void
}

function isMobile(): boolean {
  if (typeof navigator === 'undefined') return false
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
}

export function openProviderLink(
  link: ProviderLink,
  onSelect: (provider: string, url: string) => void,
) {
  try {
    sessionStorage.setItem(
      'mealease_delivery_redirected',
      JSON.stringify({ provider: link.provider, at: Date.now(), query: link.webUrl }),
    )
  } catch {
    // non-fatal
  }

  trackEvent(Analytics.REDIRECT_COMPLETED, {
    provider: link.provider,
    redirect_url: link.webUrl,
  })

  onSelect(link.provider, link.webUrl)

  if (isMobile()) {
    // Try deep link first, fall back to web URL
    const timeout = setTimeout(() => {
      window.open(link.webUrl, '_blank', 'noopener')
    }, 1500)

    const handleBlur = () => {
      clearTimeout(timeout)
      window.removeEventListener('blur', handleBlur)
    }
    window.addEventListener('blur', handleBlur)

    window.location.href = link.deepLink
  } else {
    window.open(link.webUrl, '_blank', 'noopener')
  }
}

export function ProviderButtons({ links, onSelect }: ProviderButtonsProps) {
  const handleClick = useCallback(
    (link: ProviderLink) => {
      openProviderLink(link, onSelect)
    },
    [onSelect],
  )

  return (
    <div className="flex gap-2">
      {links.map((link) => (
        <Button
          key={link.provider}
          variant="outline"
          size="sm"
          className="flex-1 text-xs"
          onClick={() => handleClick(link)}
        >
          {link.emoji} {link.label}
        </Button>
      ))}
    </div>
  )
}
