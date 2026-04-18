import { useLightOnboardingStore } from '@/lib/store'

export type HouseholdType = 'solo' | 'couple' | 'family'

export interface CardLabels {
  quickDecide: { title: string; sub: string }
  zeroCook: { title: string; sub: string }
  planWeek: { title: string; sub: string }
}

export interface KidsTool {
  emoji: string
  label: string
  href: string
}

export interface HouseholdConfig {
  householdType: HouseholdType
  hasKids: boolean
  greeting: (name: string) => string
  weekendTitle: string
  weekendSubtitle: string
  smartToolLabel: string
  showFamilyMode: boolean
  cardLabels: CardLabels
  kidsPriorityTools: KidsTool[]
}

// ─── Config tables ────────────────────────────────────────────────────────────

const cardLabelMap: Record<HouseholdType, CardLabels> = {
  solo: {
    quickDecide: { title: "I Don't Want to Think", sub: 'One tap — dinner decided' },
    zeroCook: { title: 'Zero-Cook Tonight', sub: 'Get it delivered — we pick for you' },
    planWeek: { title: 'Plan My Week', sub: '7 dinners, zero repeats' },
  },
  couple: {
    quickDecide: { title: 'Dinner for Two', sub: 'One tap — dinner decided' },
    zeroCook: { title: 'Busy Night Delivery', sub: 'Get it delivered — we pick for you' },
    planWeek: { title: 'Plan Our Week', sub: '7 dinners, zero repeats' },
  },
  family: {
    quickDecide: { title: 'Feed Everyone Tonight', sub: 'One tap — dinner decided' },
    zeroCook: { title: 'Busy Family Night', sub: 'Get it delivered — we pick for you' },
    planWeek: { title: 'Plan Family Week', sub: '7 dinners, zero repeats' },
  },
}

const weekendTitleMap: Record<HouseholdType, string> = {
  solo: 'Solo Movie Night 🍿',
  couple: 'Date Night Mode ✨',
  family: 'Family Movie Night 🎬',
}

const weekendSubtitleMap: Record<HouseholdType, string> = {
  solo: 'Dinner + entertainment — curated just for you',
  couple: 'Dinner + a night for two — curated for you both',
  family: 'Dinner + movie night — curated for the family',
}

const smartToolLabelMap: Record<HouseholdType, string> = {
  solo: '🍽️ Solo Night',
  couple: '💑 Date Night',
  family: '👨‍👩‍👧 Family Mode',
}

const greetingMap: Record<HouseholdType, (name: string) => string> = {
  solo: (name) => `Hey ${name}, what sounds good tonight?`,
  couple: (name) => `Hey ${name}, planning a night for two?`,
  family: (name) => `Hey ${name}, what's the family craving?`,
}

// ─── Kids tools with time-of-day priority ─────────────────────────────────────

function getKidsPriorityTools(): KidsTool[] {
  const hour = new Date().getHours()
  const day = new Date().getDay()
  const isWeekend = day === 0 || day === 5 || day === 6
  const isMorning = hour >= 6 && hour < 12
  const isAfterSchool = hour >= 14 && hour < 17
  const isBusyEvening = hour >= 17 && hour < 21

  type Sortable = KidsTool & { _order: number }
  const tools: Sortable[] = [
    { emoji: '🍱', label: 'Lunchbox Help',      href: '/kids-tool?mode=lunchbox', _order: isMorning ? 0 : 4 },
    { emoji: '🍎', label: 'Snack for Kids',      href: '/kids-tool?mode=snack',    _order: isAfterSchool ? 0 : 3 },
    { emoji: '🧁', label: 'Bake With Kids',      href: '/kids-tool?mode=bake',     _order: isWeekend ? 1 : 5 },
    { emoji: '🍽', label: 'Picky Eater Help',    href: '/kids-tool?mode=picky',    _order: 2 },
    { emoji: '⚡', label: 'Need Food in 5 Min',  href: '/kids-tool?mode=fast',     _order: isBusyEvening ? 0 : 6 },
  ]

  return tools
    .sort((a, b) => a._order - b._order)
    .map(({ _order: _, ...tool }) => tool)
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useHouseholdConfig(): HouseholdConfig {
  const householdType = useLightOnboardingStore((s) => s.householdType) ?? 'solo'
  const hasKids = useLightOnboardingStore((s) => s.hasKids) ?? false

  return {
    householdType,
    hasKids,
    greeting: greetingMap[householdType],
    weekendTitle: weekendTitleMap[householdType],
    weekendSubtitle: weekendSubtitleMap[householdType],
    smartToolLabel: smartToolLabelMap[householdType],
    showFamilyMode: householdType === 'family',
    cardLabels: cardLabelMap[householdType],
    kidsPriorityTools: hasKids ? getKidsPriorityTools() : [],
  }
}
