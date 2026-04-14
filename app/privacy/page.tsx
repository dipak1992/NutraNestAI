import { PublicSiteFooter } from '@/components/layout/PublicSiteFooter'
import { PublicSiteHeader } from '@/components/layout/PublicSiteHeader'
import { LegalDocument, LegalSection } from '@/components/layout/LegalDocument'
import { buildMetadata } from '@/lib/seo'

const lastUpdated = 'April 14, 2026'

export const metadata = buildMetadata({
  title: 'Privacy Policy',
  description:
    'Read how MealEase collects, uses, stores, and protects your data, including account details, family preferences, AI-generated meal content, and your privacy rights.',
  path: '/privacy',
  keywords: ['MealEase privacy policy', 'family meal app privacy', 'MealEase data policy'],
})

export default function PrivacyPage() {
  return (
    <>
      <PublicSiteHeader />
      <LegalDocument
        title="Privacy Policy"
        intro="This Privacy Policy explains how MealEase collects, uses, stores, and protects information when you use mealeaseai.com and related services."
        lastUpdated={lastUpdated}
      >
        <LegalSection title="Overview">
          <p>
            MealEase is an AI-powered meal planning assistant designed to help families decide what to cook, organize meals, and reduce day-to-day dinner stress. We work hard to keep your information private, secure, and used only in ways that support the service.
          </p>
        </LegalSection>

        <LegalSection title="Information We Collect">
          <p>
            We collect account information such as your name, email address, login details, and authentication identifiers when you create or access an account.
          </p>
          <p>
            We also collect household and meal-planning preferences you choose to provide, including dietary preferences, allergies, pantry details, family composition, cooking goals, and meal feedback.
          </p>
          <p>
            In addition, we collect usage data such as app interactions, page visits, device or browser information, approximate location based on IP address, and performance logs that help us understand how the product is working.
          </p>
        </LegalSection>

        <LegalSection title="Authentication and Account Access">
          <p>
            MealEase supports sign-in through email-based authentication and third-party login providers such as Google. When you sign in with Google, we receive basic account details that are necessary to authenticate you and operate your account.
          </p>
          <p>
            Authentication and account storage are managed through Supabase and related infrastructure providers acting on our behalf.
          </p>
        </LegalSection>

        <LegalSection title="How We Use Your Information">
          <p>We use collected information to provide, maintain, and improve MealEase, including to:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>create and secure your account</li>
            <li>generate meal ideas, meal plans, grocery lists, and family-specific variations</li>
            <li>personalize recommendations based on your preferences and feedback</li>
            <li>process subscriptions, billing, and support requests</li>
            <li>monitor performance, fix bugs, and prevent abuse or fraud</li>
            <li>communicate product updates, service notices, and important legal or security messages</li>
          </ul>
        </LegalSection>

        <LegalSection title="Cookies and Tracking">
          <p>
            We use cookies and similar technologies to keep you signed in, remember preferences, measure site performance, understand product usage, and improve the experience over time.
          </p>
          <p>
            Some cookies are necessary for the service to function. Others may support analytics, experimentation, or fraud prevention. You can control cookies through your browser settings, but disabling certain cookies may affect how MealEase works.
          </p>
        </LegalSection>

        <LegalSection title="AI-Generated Content Handling">
          <p>
            MealEase uses AI systems to generate meal suggestions, meal plans, ingredient ideas, and related text. To produce relevant outputs, we may send limited request data such as household preferences, dietary restrictions, pantry details, and meal context to AI service providers.
          </p>
          <p>
            We do not use AI-generated content as a substitute for medical advice. We may log prompts, outputs, errors, and feedback to improve quality, reliability, and safety.
          </p>
        </LegalSection>

        <LegalSection title="Third-Party Services">
          <p>
            We rely on third-party providers to operate MealEase. These may include Supabase for authentication and database services, payment processors for subscription billing, analytics providers to understand app usage, hosting providers, and AI model providers that help generate content.
          </p>
          <p>
            These providers only receive information necessary for their services and are expected to handle data according to their own privacy and security obligations.
          </p>
        </LegalSection>

        <LegalSection title="Children's Data">
          <p>
            MealEase is intended for parents, guardians, and adult household planners. It is not designed for direct use by children.
          </p>
          <p>
            Because the service may involve meal planning for babies or children, adults may choose to enter information about a child&apos;s age, dietary needs, allergies, or food preferences. We treat that information carefully and use it only to provide the requested meal-planning experience.
          </p>
          <p>
            If you believe a child has provided personal information to MealEase directly without appropriate adult involvement, contact us at hello@mealeaseai.com and we will review and delete the information when appropriate.
          </p>
        </LegalSection>

        <LegalSection title="Data Retention and Security">
          <p>
            We retain personal information for as long as needed to provide the service, comply with legal obligations, resolve disputes, and enforce our agreements.
          </p>
          <p>
            We use reasonable administrative, technical, and organizational safeguards to protect your data. No system is completely secure, so we cannot guarantee absolute security.
          </p>
        </LegalSection>

        <LegalSection title="Your Rights and Choices">
          <p>Depending on where you live, you may have the right to request access to, correction of, export of, or deletion of your personal information.</p>
          <p>
            You may also ask us to restrict certain processing or object to certain uses of your data where applicable. We may need to verify your identity before fulfilling a request.
          </p>
          <p>
            You can contact us at hello@mealeaseai.com to request access, correction, or deletion of your information.
          </p>
        </LegalSection>

        <LegalSection title="International Transfers">
          <p>
            MealEase is based in the United States. If you use the service from another country, your information may be transferred to and processed in the United States or other countries where our providers operate.
          </p>
        </LegalSection>

        <LegalSection title="Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. When we make material changes, we will update the date above and may provide additional notice inside the product or by email when appropriate.
          </p>
        </LegalSection>

        <LegalSection title="Contact Us">
          <p>
            If you have questions about this Privacy Policy, data practices, or your privacy rights, contact us at hello@mealeaseai.com.
          </p>
        </LegalSection>
      </LegalDocument>
      <PublicSiteFooter />
    </>
  )
}