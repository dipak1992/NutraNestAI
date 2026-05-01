// ============================================================
// Multi-Brand Stripe Architecture
// One Stripe account (DDS Supply LLC) → multiple brand experiences
// ============================================================

/**
 * MULTI-BRAND STRIPE ARCHITECTURE
 * ================================
 * 
 * Legal entity: DDS Supply LLC (Stripe account owner)
 * Brands: MealEase, SnapTrip, future products
 * 
 * APPROACH: Per-session branding with statement descriptor overrides
 * 
 * Stripe supports:
 * 1. `statement_descriptor` per Checkout Session (22 chars max)
 * 2. `statement_descriptor_suffix` per session (appended to account descriptor)
 * 3. Custom branding via Stripe Checkout appearance API
 * 4. `payment_intent_data.statement_descriptor` for one-time payments
 * 5. `subscription_data.metadata` for brand identification in webhooks
 * 
 * RECOMMENDED ARCHITECTURE:
 * 
 * Account-level settings (Stripe Dashboard):
 *   - Business name: DDS Supply LLC
 *   - Statement descriptor: DDS SUPPLY (shortened)
 *   - Support email: support@ddssupply.com (or brand-specific)
 * 
 * Per-session overrides (in code):
 *   - statement_descriptor_suffix: "MEALEASE" or "SNAPTRIP"
 *   - Customer sees: "DDS SUPPLY* MEALEASE" on bank statement
 *   - Checkout page shows brand logo, colors, name
 *   - Receipt email shows brand name
 */

export type BrandId = 'mealease' | 'snaptrip'

export interface BrandConfig {
  id: BrandId
  name: string
  displayName: string
  /** Statement descriptor suffix (max 22 chars minus account prefix) */
  statementDescriptorSuffix: string
  /** Support email shown on receipts */
  supportEmail: string
  /** Support URL for disputes */
  supportUrl: string
  /** Brand color for Stripe Checkout (hex) */
  primaryColor: string
  /** Brand accent color */
  accentColor: string
  /** Logo URL for Stripe Checkout (must be https, hosted publicly) */
  logoUrl: string
  /** Icon URL (square, for Stripe Checkout) */
  iconUrl: string
  /** Product description shown in checkout */
  productDescription: string
  /** Success URL pattern */
  successUrlPattern: string
  /** Cancel URL pattern */
  cancelUrlPattern: string
}

/**
 * Brand configurations for all products under DDS Supply LLC.
 */
export const BRANDS: Record<BrandId, BrandConfig> = {
  mealease: {
    id: 'mealease',
    name: 'MealEase',
    displayName: 'MealEase AI',
    statementDescriptorSuffix: 'MEALEASE',
    supportEmail: 'support@mealeaseai.com',
    supportUrl: 'https://mealeaseai.com/help',
    primaryColor: '#D97757',
    accentColor: '#E8895A',
    logoUrl: 'https://mealeaseai.com/press/mealease-logo-color.svg',
    iconUrl: 'https://mealeaseai.com/icons/icon-192.png',
    productDescription: 'MealEase Plus — AI meal planning & grocery intelligence',
    successUrlPattern: '/dashboard?upgraded=1',
    cancelUrlPattern: '/upgrade?cancelled=1',
  },
  snaptrip: {
    id: 'snaptrip',
    name: 'SnapTrip',
    displayName: 'SnapTrip',
    statementDescriptorSuffix: 'SNAPTRIP',
    supportEmail: 'support@snaptrip.app',
    supportUrl: 'https://snaptrip.app/help',
    primaryColor: '#3B82F6',
    accentColor: '#60A5FA',
    logoUrl: 'https://snaptrip.app/logo.svg',
    iconUrl: 'https://snaptrip.app/icon-192.png',
    productDescription: 'SnapTrip Pro — AI travel planning',
    successUrlPattern: '/dashboard?upgraded=1',
    cancelUrlPattern: '/pricing?cancelled=1',
  },
}

/**
 * Get brand config by ID. Defaults to MealEase if not found.
 */
export function getBrand(brandId: BrandId | string | undefined): BrandConfig {
  if (brandId && brandId in BRANDS) {
    return BRANDS[brandId as BrandId]
  }
  return BRANDS.mealease
}

/**
 * Get the current brand based on environment/domain.
 * In MealEase project, this always returns 'mealease'.
 * Override via NEXT_PUBLIC_BRAND_ID env var for other projects.
 */
export function getCurrentBrand(): BrandConfig {
  const brandId = process.env.NEXT_PUBLIC_BRAND_ID ?? 'mealease'
  return getBrand(brandId)
}
