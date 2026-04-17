import type { DeliveryProvider, ProviderLink } from './types'

// ── Provider config ─────────────────────────────────────────

const PROVIDERS: Record<DeliveryProvider, { label: string; emoji: string; deepScheme: string; webBase: string }> = {
  ubereats: {
    label: 'Uber Eats',
    emoji: '🟢',
    deepScheme: 'ubereats://food?q=',
    webBase: 'https://www.ubereats.com/search?q=',
  },
  doordash: {
    label: 'DoorDash',
    emoji: '🔴',
    deepScheme: 'doordash://search?query=',
    webBase: 'https://www.doordash.com/search/store/',
  },
  grubhub: {
    label: 'Grubhub',
    emoji: '🟠',
    deepScheme: 'grubhub://search?query=',
    webBase: 'https://www.grubhub.com/search?orderMethod=delivery&query=',
  },
}

export function getProviderLinks(searchQuery: string): ProviderLink[] {
  const q = encodeURIComponent(searchQuery)
  return (['ubereats', 'doordash', 'grubhub'] as DeliveryProvider[]).map((provider) => {
    const cfg = PROVIDERS[provider]
    return {
      provider,
      label: cfg.label,
      emoji: cfg.emoji,
      deepLink: `${cfg.deepScheme}${q}`,
      webUrl: `${cfg.webBase}${q}`,
    }
  })
}

/** Context-aware CTA text based on time of day. */
export function getSmartCTA(): string {
  const h = new Date().getHours()
  if (h >= 11 && h < 14) return 'Get My Lunch'
  if (h >= 17 && h < 20) return 'Feed Me Now ⚡'
  if (h >= 14 && h < 17) return 'Get This Delivered'
  return 'Get It Tonight'
}
