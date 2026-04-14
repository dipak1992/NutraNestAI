import { createElement } from 'react'
import { sendEmail } from './send'
import { EMAIL_ADMIN } from './client'

// User templates
import { WelcomeEmail } from './templates/welcome'
import { MagicLinkEmail } from './templates/magic-link'
import { ProConfirmationEmail } from './templates/pro-confirmation'
import { PaymentReceiptEmail } from './templates/payment-receipt'
import { WeeklyReminderEmail } from './templates/weekly-reminder'
import { DinnerReminderEmail } from './templates/dinner-reminder'
import { ReferralRewardEmail } from './templates/referral-reward'
import { SupportConfirmationEmail } from './templates/support-confirmation'

// Admin templates
import {
  AdminNewUserEmail,
  AdminNewProEmail,
  AdminFailedPaymentEmail,
  AdminReferralEmail,
  AdminContactFormEmail,
  AdminWeeklySummaryEmail,
} from './templates/admin'

// ─── User triggers ──────────────────────────────────────────────────────────

export async function sendWelcomeEmail(params: {
  to: string
  firstName?: string
}) {
  return sendEmail({
    to: params.to,
    subject: 'Welcome to MealEase 👋',
    react: createElement(WelcomeEmail, { firstName: params.firstName }),
    idempotencyKey: `welcome:${params.to}`,
  })
}

export async function sendMagicLinkEmail(params: {
  to: string
  magicLink: string
}) {
  return sendEmail({
    to: params.to,
    subject: 'Your MealEase sign-in link',
    react: createElement(MagicLinkEmail, {
      magicLink: params.magicLink,
      email: params.to,
    }),
    // Magic links are time-sensitive — no idempotency key
  })
}

export async function sendProConfirmationEmail(params: {
  to: string
  firstName?: string
  planName?: string
}) {
  return sendEmail({
    to: params.to,
    subject: 'You\'re on MealEase Pro ✨',
    react: createElement(ProConfirmationEmail, {
      firstName: params.firstName,
      planName: params.planName,
    }),
    idempotencyKey: `pro-confirm:${params.to}:${params.planName ?? 'Pro'}`,
  })
}

export async function sendPaymentReceiptEmail(params: {
  to: string
  firstName?: string
  amount: string
  date: string
  invoiceId?: string
  planName?: string
}) {
  return sendEmail({
    to: params.to,
    subject: 'MealEase payment confirmed',
    react: createElement(PaymentReceiptEmail, params),
    idempotencyKey: params.invoiceId ? `receipt:${params.invoiceId}` : undefined,
  })
}

export async function sendWeeklyReminderEmail(params: {
  to: string
  firstName?: string
}) {
  const week = getWeekKey()
  return sendEmail({
    to: params.to,
    subject: 'Plan your week in 30 seconds',
    react: createElement(WeeklyReminderEmail, { firstName: params.firstName }),
    idempotencyKey: `weekly:${params.to}:${week}`,
  })
}

export async function sendDinnerReminderEmail(params: {
  to: string
  firstName?: string
  mealTitle?: string
  mealDescription?: string
}) {
  const today = getTodayKey()
  return sendEmail({
    to: params.to,
    subject: params.mealTitle
      ? `Tonight: ${params.mealTitle}`
      : 'Here\'s your dinner for tonight',
    react: createElement(DinnerReminderEmail, {
      firstName: params.firstName,
      mealTitle: params.mealTitle,
      mealDescription: params.mealDescription,
    }),
    idempotencyKey: `dinner:${params.to}:${today}`,
  })
}

export async function sendReferralRewardEmail(params: {
  to: string
  firstName?: string
  referrerName?: string
  rewardDescription?: string
}) {
  return sendEmail({
    to: params.to,
    subject: 'Your referral reward has arrived 🎁',
    react: createElement(ReferralRewardEmail, params),
    idempotencyKey: `referral-reward:${params.to}:${params.referrerName ?? ''}`,
  })
}

export async function sendSupportConfirmationEmail(params: {
  to: string
  firstName?: string
}) {
  return sendEmail({
    to: params.to,
    subject: 'We\'ve got your message',
    react: createElement(SupportConfirmationEmail, {
      firstName: params.firstName,
      email: params.to,
    }),
  })
}

// ─── Admin triggers ─────────────────────────────────────────────────────────

export async function alertAdminNewUser(params: {
  userEmail: string
  userId: string
  signupAt?: string
  referralCode?: string
}) {
  return sendEmail({
    to: EMAIL_ADMIN,
    subject: `[MealEase] New signup — ${params.userEmail}`,
    react: createElement(AdminNewUserEmail, params),
    skipLog: true,
  })
}

export async function alertAdminNewPro(params: {
  userEmail: string
  userId: string
  planName?: string
  amount?: string
}) {
  return sendEmail({
    to: EMAIL_ADMIN,
    subject: `[MealEase] New Pro — ${params.userEmail}`,
    react: createElement(AdminNewProEmail, params),
    skipLog: true,
  })
}

export async function alertAdminFailedPayment(params: {
  userEmail: string
  userId: string
  reason?: string
  amount?: string
}) {
  return sendEmail({
    to: EMAIL_ADMIN,
    subject: `[MealEase] ⚠️ Failed payment — ${params.userEmail}`,
    react: createElement(AdminFailedPaymentEmail, params),
    skipLog: true,
  })
}

export async function alertAdminReferral(params: {
  referrerEmail: string
  referrerId: string
  newUserEmail: string
}) {
  return sendEmail({
    to: EMAIL_ADMIN,
    subject: `[MealEase] Referral conversion — ${params.referrerEmail}`,
    react: createElement(AdminReferralEmail, params),
    skipLog: true,
  })
}

export async function alertAdminContactForm(params: {
  senderEmail: string
  senderName?: string
  message: string
}) {
  return sendEmail({
    to: EMAIL_ADMIN,
    subject: `[MealEase] Contact form — ${params.senderEmail}`,
    react: createElement(AdminContactFormEmail, params),
    skipLog: true,
  })
}

export async function sendAdminWeeklySummary(params: {
  weekStart: string
  newUsers: number
  newPro: number
  totalUsers: number
  emailsSent: number
  failures: number
}) {
  return sendEmail({
    to: EMAIL_ADMIN,
    subject: `[MealEase] Weekly summary — ${params.weekStart}`,
    react: createElement(AdminWeeklySummaryEmail, params),
    skipLog: true,
  })
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getTodayKey() {
  return new Date().toISOString().slice(0, 10) // YYYY-MM-DD
}

function getWeekKey() {
  const d = new Date()
  const day = d.getDay()
  const diff = d.getDate() - day
  const monday = new Date(d.setDate(diff))
  return monday.toISOString().slice(0, 10)
}
