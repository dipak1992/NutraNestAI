import { PublicSiteFooter } from '@/components/layout/PublicSiteFooter'
import { PublicSiteHeader } from '@/components/layout/PublicSiteHeader'
import { LegalDocument, LegalSection } from '@/components/layout/LegalDocument'
import { buildMetadata } from '@/lib/seo'

const lastUpdated = 'April 14, 2026'

export const metadata = buildMetadata({
  title: 'Terms of Service',
  description:
    'Read the MealEase Terms of Service covering account use, subscriptions, billing, intellectual property, and important limitations including the medical advice disclaimer.',
  path: '/terms',
  keywords: ['MealEase terms', 'MealEase terms of service', 'meal planning app terms'],
})

export default function TermsPage() {
  return (
    <>
      <PublicSiteHeader />
      <LegalDocument
        title="Terms of Service"
        intro="These Terms of Service govern your use of MealEase, including mealeaseai.com and related websites, applications, and services."
        lastUpdated={lastUpdated}
      >
        <LegalSection title="Acceptance of Terms">
          <p>
            By accessing or using MealEase, you agree to these Terms of Service. If you do not agree, do not use the service.
          </p>
          <p>
            If you use MealEase on behalf of a household, company, or other entity, you represent that you have authority to bind that party to these terms.
          </p>
        </LegalSection>

        <LegalSection title="Description of Service">
          <p>
            MealEase is an AI-powered meal planning assistant that helps users explore meal ideas, build meal plans, organize grocery lists, adapt meals for different household needs, and manage related food-planning workflows.
          </p>
          <p>
            We may update, improve, limit, or discontinue parts of the service from time to time.
          </p>
        </LegalSection>

        <LegalSection title="Accounts and User Responsibilities">
          <p>
            You are responsible for providing accurate information, keeping your login credentials secure, and using MealEase in a lawful and respectful way.
          </p>
          <p>You agree not to:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>use the service to violate laws or infringe the rights of others</li>
            <li>attempt to access systems or data you are not authorized to access</li>
            <li>interfere with the operation, integrity, or security of MealEase</li>
            <li>copy, scrape, reverse engineer, or misuse the service beyond what is permitted by law</li>
          </ul>
        </LegalSection>

        <LegalSection title="Important Health and Medical Disclaimer">
          <p>
            MealEase is for informational and planning purposes only. It is not medical advice, nutritional therapy, diagnosis, treatment, or a substitute for advice from a physician, pediatrician, registered dietitian, or other qualified healthcare professional.
          </p>
          <p>
            You are responsible for reviewing ingredients, recipes, allergens, and meal suitability before serving food to yourself or anyone else. If you or a family member has allergies, medical conditions, special nutritional needs, or safety concerns, you should consult a qualified professional.
          </p>
        </LegalSection>

        <LegalSection title="Subscriptions, Billing, and Trials">
          <p>
            Some parts of MealEase may require a paid subscription. Prices, plan details, trial offers, and included features may change over time.
          </p>
          <p>
            If you start a paid plan, you authorize us and our payment processor to charge the applicable subscription fees, taxes, and any related charges using your chosen payment method.
          </p>
          <p>
            Any trial or promotional access is offered at our discretion and may be modified or withdrawn at any time.
          </p>
        </LegalSection>

        <LegalSection title="Cancellation Policy">
          <p>
            You may cancel your subscription at any time. Unless otherwise stated, cancellation stops future renewal charges but does not automatically create a refund for the current billing period.
          </p>
          <p>
            Your access to paid features will usually continue until the end of the active billing period, after which your account may return to the free version of MealEase.
          </p>
        </LegalSection>

        <LegalSection title="Refunds">
          <p>
            Except where required by law or expressly stated otherwise, payments are non-refundable. If you believe a charge was made in error, contact hello@mealeaseai.com.
          </p>
        </LegalSection>

        <LegalSection title="Intellectual Property">
          <p>
            MealEase, including its branding, design, software, content, and service features, is owned by MealEase or its licensors and is protected by intellectual property laws.
          </p>
          <p>
            Subject to these terms, we grant you a limited, non-exclusive, non-transferable, revocable right to use the service for personal or internal household purposes.
          </p>
        </LegalSection>

        <LegalSection title="AI Output and Service Availability">
          <p>
            MealEase uses AI-generated outputs, which may occasionally be incomplete, inaccurate, or unsuitable for your circumstances. You should review all output carefully before relying on it.
          </p>
          <p>
            We do not guarantee uninterrupted availability, perfect accuracy, or error-free operation.
          </p>
        </LegalSection>

        <LegalSection title="Limitation of Liability">
          <p>
            To the fullest extent permitted by law, MealEase and its founders, affiliates, employees, and service providers will not be liable for indirect, incidental, special, consequential, exemplary, or punitive damages, or for any loss of data, profits, goodwill, or business opportunity arising from your use of the service.
          </p>
          <p>
            To the fullest extent permitted by law, our total liability for any claim relating to MealEase will not exceed the amount you paid us in the twelve months before the claim arose, or one hundred U.S. dollars if you have not made any payments.
          </p>
        </LegalSection>

        <LegalSection title="Termination">
          <p>
            We may suspend or terminate access to MealEase if you violate these terms, create risk for other users or the service, or if we decide to discontinue the service.
          </p>
          <p>
            You may stop using MealEase at any time. Sections that reasonably should survive termination, including payment obligations, limitations of liability, and intellectual property protections, will continue to apply.
          </p>
        </LegalSection>

        <LegalSection title="Changes to These Terms">
          <p>
            We may update these terms from time to time. When we do, we will post the updated version here and revise the date above. Continued use of MealEase after changes take effect means you accept the updated terms.
          </p>
        </LegalSection>

        <LegalSection title="Contact and Support">
          <p>
            Questions about these terms, subscriptions, or billing can be sent to hello@mealeaseai.com.
          </p>
        </LegalSection>
      </LegalDocument>
      <PublicSiteFooter />
    </>
  )
}