import {
  Body, Container, Head, Heading, Html, Link,
  Preview, Section, Text, Hr,
} from '@react-email/components'
import { styles, colors } from './shared'
import { SITE_URL as SITE } from '../client'

interface Props {
  firstName?: string
  mealTitle?: string
  entertainmentTitle?: string
  unsubscribeUrl?: string
}

const amber = '#d97706'

export function WeekendReminderEmail({
  firstName,
  mealTitle,
  entertainmentTitle,
  unsubscribeUrl,
}: Props) {
  const name = firstName ?? 'there'
  return (
    <Html>
      <Head />
      <Preview>🎬 Your weekend plan is ready — dinner + a movie, all picked for you.</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>

          <Section style={{ ...styles.header, backgroundColor: amber }}>
            <Link href={SITE} style={styles.logo}>MealEase</Link>
          </Section>

          <Section style={styles.body_inner}>
            <Heading style={styles.h1}>Your weekend plan is ready 🎬</Heading>

            <Text style={styles.p}>
              Hi {name}, the weekend is here. We&apos;ve picked a dinner recipe and a
              movie night recommendation tailored just for your household — so you can
              relax and enjoy.
            </Text>

            {(mealTitle || entertainmentTitle) && (
              <Section
                style={{
                  backgroundColor: '#fffbeb',
                  border: `1px solid #fde68a`,
                  borderRadius: '8px',
                  padding: '16px 20px',
                  margin: '0 0 20px',
                }}
              >
                {mealTitle && (
                  <Text style={{ ...styles.p, margin: '0 0 6px', fontWeight: 600 }}>
                    🍽️ Tonight&apos;s dinner: {mealTitle}
                  </Text>
                )}
                {entertainmentTitle && (
                  <Text style={{ ...styles.p, margin: 0, fontWeight: 600 }}>
                    🎥 Movie night: {entertainmentTitle}
                  </Text>
                )}
              </Section>
            )}

            <Link href={`${SITE}/weekend`} style={{ ...styles.button, backgroundColor: amber }}>
              See the full plan →
            </Link>

            <Hr style={styles.divider} />

            <Text style={styles.muted}>
              You&apos;re receiving this because you have weekend reminders enabled. Turn it off in your{' '}
              <Link href={`${SITE}/settings?tab=notifications`} style={{ color: colors.sage }}>notification settings</Link>.
            </Text>
          </Section>

          <Section style={styles.footer}>
            <Text style={styles.footerText}>MealEase · Weekend Mode reminder</Text>
            {unsubscribeUrl && (
              <Text style={styles.footerText}>
                <Link href={unsubscribeUrl} style={{ color: colors.sage, fontSize: '12px' }}>Unsubscribe</Link>
              </Text>
            )}
          </Section>

        </Container>
      </Body>
    </Html>
  )
}

export default WeekendReminderEmail
