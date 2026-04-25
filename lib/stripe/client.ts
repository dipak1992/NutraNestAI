// Re-export the existing singleton getter so all new code can import from here
export { getStripe as stripe } from '@/lib/stripe'

// Named export for direct use in server routes
export { getStripe } from '@/lib/stripe'
