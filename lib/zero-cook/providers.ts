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
    webBase: 'https://www.doordash.com/search/store/?q=',
  },
  instacart: {
    label: 'Instacart',
    emoji: '🟣',
    deepScheme: 'instacart://search?query=',
    webBase: 'https://www.instacart.com/store/search_v3/',
  },
  grubhub: {
    label: 'Grubhub',
    emoji: '🟠',
    deepScheme: 'grubhub://search?query=',
    webBase: 'https://www.grubhub.com/search?orderMethod=delivery&query=',
  },
}

function getDefaultPriority(): DeliveryProvider[] {
  const raw = process.env.NEXT_PUBLIC_DELIVERY_PROVIDER_PRIORITY_DEFAULT ?? 'ubereats,doordash,instacart,grubhub'
  const parsed = raw
    .split(',')
    .map((p) => p.trim().toLowerCase())
    .filter((p): p is DeliveryProvider => p in PROVIDERS)
  return parsed.length > 0 ? parsed : ['ubereats', 'doordash', 'instacart', 'grubhub']
}

export function resolveProviderPriority(countryCode?: string): DeliveryProvider[] {
  const cc = (countryCode ?? '').toUpperCase()
  if (cc) {
    const key = `NEXT_PUBLIC_DELIVERY_PROVIDER_PRIORITY_${cc}` as keyof NodeJS.ProcessEnv
    const raw = process.env[key]
    if (raw) {
      const parsed = raw
        .split(',')
        .map((p) => p.trim().toLowerCase())
        .filter((p): p is DeliveryProvider => p in PROVIDERS)
      if (parsed.length > 0) return parsed
    }
  }

  return getDefaultPriority()
}

export function getProviderLinks(searchQuery: string, countryCode?: string): ProviderLink[] {
  const q = encodeURIComponent(searchQuery)
  return resolveProviderPriority(countryCode).map((provider) => {
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
