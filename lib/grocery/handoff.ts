import { buildProviderCartItems, buildProviderSearchUrl, buildSingleItemSearchUrl } from '@/lib/grocery/comparison'
import { getProvider } from '@/lib/grocery/providers/registry'
import type { ProviderCartItem, ProviderId } from '@/lib/grocery/types'
import type { GroceryList } from '@/lib/planner/types'

const DIRECT_HANDOFF_LIMIT = 12

export type GroceryHandoffResult = {
  providerId: ProviderId
  providerName: string
  url: string
  itemCount: number
  mode: 'multi_item_search' | 'single_item_fallback'
  cartItems: ProviderCartItem[]
}

export function buildGroceryHandoff(
  groceryList: GroceryList,
  providerId: ProviderId,
): GroceryHandoffResult {
  const provider = getProvider(providerId)
  if (!provider) {
    throw new Error(`Unsupported grocery provider: ${providerId}`)
  }

  const cartItems = buildProviderCartItems(groceryList)
  if (cartItems.length === 0) {
    throw new Error('No missing grocery items to hand off')
  }

  const mode = cartItems.length > DIRECT_HANDOFF_LIMIT
    ? 'single_item_fallback'
    : 'multi_item_search'
  const url = mode === 'single_item_fallback'
    ? buildSingleItemSearchUrl(provider, cartItems[0])
    : buildProviderSearchUrl(provider, cartItems)

  return {
    providerId,
    providerName: provider.displayName,
    url,
    itemCount: cartItems.length,
    mode,
    cartItems,
  }
}
