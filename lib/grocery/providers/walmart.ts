// ============================================================
// Grocery Commerce — Provider: Walmart US
// ============================================================

import type { GroceryProvider } from '../types'

export const walmartUS: GroceryProvider = {
  id: 'walmart_us',
  name: 'walmart',
  displayName: 'Walmart',
  icon: '🛒',
  supportedCountries: ['US'],
  fulfillmentTypes: ['pickup', 'delivery'],
  estimatedMarkup: 0,
  deliveryFeeRange: [0, 9.95],
  searchUrlTemplate: 'https://www.walmart.com/search?q={{query}}',
  multiItemSearchUrl: 'https://www.walmart.com/search?q={{items}}',
  cartBuilderSupported: false, // No public API for cart building
  estimatedDeliveryTime: '1-3 hours',
  estimatedPickupTime: 'Today',
  color: '#0071DC',
  description: 'Everyday low prices with free pickup and affordable delivery.',
}
