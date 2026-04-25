import type { ReactNode } from 'react'
import Link from 'next/link'
import { PublicSiteHeader } from '@/components/layout/PublicSiteHeader'
import { PublicSiteFooter } from '@/components/layout/PublicSiteFooter'
import { LegalShell } from '@/components/legal/LegalShell'

export const metadata = {
  title: 'Privacy Policy | MealEase',
  description: 'What we collect, how we use it, and your rights. In plain English.',
}

const UPDATED_AT = '2024-12-15'

type Section = { id: string; title: string; content: ReactNode }

const SECTIONS: Section[] = [
  {
    id: 'summary',
    title: 'The short version',
    content: (
      <div className="space-y-3">
        <p><strong className="font-semibold text-foreground">Your data is yours.</strong> We collect what we need to give you meal suggestions, budget tracking, and leftover reminders. Nothing more.</p>
        <p><strong className="font-semibold text-foreground">We never sell your data.</strong> Not your grocery habits, not your dietary preferences, not your kitchen photos — to anyone, ever.</p>
        <p><strong className="font-semibold text-foreground">You can take it with you or delete it.</strong> Anytime. Settings → Your data.</p>
        <p><strong className="font-semibold text-foreground">We use standard tools</strong> — Supabase for auth/database, Stripe for billing, OpenAI/Anthropic for AI features, PostHog for product analytics. More below.</p>
      </div>
    ),
  },
  {
    id: 'what-we-collect',
    title: 'What we collect',
    content: (
      <div className="space-y-3">
        <p><strong className="font-semibold text-foreground">Account info.</strong> Your email, first name, and (if you sign in with Google) your profile photo. Password is never stored in plain text.</p>
        <p><strong className="font-semibold text-foreground">Household preferences.</strong> Size, dietary needs, dislikes, skill level, budget. You provide this during onboarding and in Settings.</p>
        <p><strong className="font-semibold text-foreground">App activity.</strong> Meal plans you create, recipes you cook, leftovers you save, scans you perform. This is how we give you personalized suggestions.</p>
        <p><strong className="font-semibold text-foreground">Camera photos.</strong> When you scan your fridge, a menu, or food, we temporarily process the image through our AI partners. We do not store the raw images after processing. We only store the extracted data (ingredients, menu items, nutrition).</p>
        <p><strong className="font-semibold text-foreground">Payment info.</strong> Processed by Stripe. We never see your card number. We store only your Stripe customer ID.</p>
        <p><strong className="font-semibold text-foreground">Analytics.</strong> Anonymized product usage via PostHog — which features get used, where people get stuck. Never tied to individual identity for marketing.</p>
      </div>
    ),
  },
  {
    id: 'how-we-use-it',
    title: 'How we use it',
    content: (
      <div className="space-y-3">
        <p><strong className="font-semibold text-foreground">To give you the product.</strong> Your preferences, pantry, leftovers, and budget feed directly into the suggestions and plans we generate. Without this data, the app can&apos;t personalize anything.</p>
        <p><strong className="font-semibold text-foreground">To improve the product.</strong> Aggregated, anonymized usage helps us see which features matter. We never use individual data for research without explicit consent.</p>
        <p><strong className="font-semibold text-foreground">To communicate with you.</strong> Account emails (password reset, receipts), product updates if you opt in, and responses when you contact us.</p>
        <p><strong className="font-semibold text-foreground">To keep the service secure.</strong> Detect fraud, abuse, and security issues.</p>
        <p>That&apos;s it. We don&apos;t build advertising profiles, sell to data brokers, or share with third parties for their marketing.</p>
      </div>
    ),
  },
  {
    id: 'ai-and-third-parties',
    title: 'AI and third-party services',
    content: (
      <div className="space-y-3">
        <p>To make MealEase work, we rely on a few trusted providers. Each handles a specific piece:</p>
        <ul className="list-disc list-inside space-y-1">
          <li><strong className="font-semibold text-foreground">Supabase</strong> — hosts your account, profile, and app data.</li>
          <li><strong className="font-semibold text-foreground">OpenAI and Anthropic</strong> — process your scans and generate recipe suggestions. They do not retain your data for training under our contracts.</li>
          <li><strong className="font-semibold text-foreground">Stripe</strong> — handles all payment processing.</li>
          <li><strong className="font-semibold text-foreground">PostHog</strong> — anonymized product analytics.</li>
          <li><strong className="font-semibold text-foreground">Resend</strong> — transactional email.</li>
          <li><strong className="font-semibold text-foreground">Vercel</strong> — hosts the web app.</li>
        </ul>
        <p>Each provider has its own privacy policy. We only share the minimum necessary data with each one.</p>
      </div>
    ),
  },
  {
    id: 'your-rights',
    title: 'Your rights',
    content: (
      <div className="space-y-3">
        <p><strong className="font-semibold text-foreground">Access.</strong> Export everything we have on you as a JSON file. Settings → Your data → Export.</p>
        <p><strong className="font-semibold text-foreground">Correction.</strong> Update your profile, preferences, and household info anytime in Settings.</p>
        <p><strong className="font-semibold text-foreground">Deletion.</strong> Delete your account with one tap in Settings → Your data. Your data is kept for 30 days (in case you change your mind), then permanently removed.</p>
        <p><strong className="font-semibold text-foreground">Opt out of marketing.</strong> We rarely email, but every email has an unsubscribe link. You can also toggle preferences in Settings → Notifications.</p>
        <p><strong className="font-semibold text-foreground">Under GDPR/CCPA?</strong> You have additional rights including data portability, objection to processing, and filing a complaint with a supervisory authority. Email us to exercise any of these.</p>
      </div>
    ),
  },
  {
    id: 'children',
    title: 'Children',
    content: (
      <p>MealEase is not directed at children under 13. We don&apos;t knowingly collect data from anyone under 13. If you&apos;re a parent and believe your child has signed up, email us and we&apos;ll delete the account.</p>
    ),
  },
  {
    id: 'security',
    title: 'Security',
    content: (
      <div className="space-y-3">
        <p>We use standard industry practices: encryption in transit (HTTPS everywhere), encryption at rest in our database, and access controls for the small team that can view account data.</p>
        <p>No system is 100% secure. If you suspect unauthorized access to your account, email <a href="mailto:hello@mealeaseai.com" className="text-[#D97757] hover:underline">hello@mealeaseai.com</a> immediately.</p>
      </div>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to this policy',
    content: (
      <p>If we materially change how we handle your data, we&apos;ll email you before the change takes effect. Minor updates (fixing typos, clarifying language) will be reflected here with an updated &ldquo;last updated&rdquo; date.</p>
    ),
  },
  {
    id: 'contact',
    title: 'Contact us',
    content: (
      <div className="space-y-2">
        <p>Questions, concerns, or requests: <a href="mailto:hello@mealeaseai.com" className="text-[#D97757] hover:underline">hello@mealeaseai.com</a></p>
        <p>Or <Link href="/contact" className="text-[#D97757] hover:underline">use the contact form</Link>. Dipak and Suprabha read every message.</p>
      </div>
    ),
  },
]

export default function PrivacyPage() {
  return (
    <>
      <PublicSiteHeader />
      <main>
        <LegalShell
          title="Privacy Policy"
          intro="Your data is yours. We collect what we need to give you meal suggestions, budget tracking, and leftover reminders. Nothing more."
          updatedAt={UPDATED_AT}
          sections={SECTIONS}
        />
      </main>
      <PublicSiteFooter />
    </>
  )
}
