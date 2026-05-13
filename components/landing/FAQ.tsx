import { Container } from './shared/Container'
import { FadeIn } from './shared/FadeIn'
import { FAQItem } from './FAQItem'
import { faqs } from '@/config/faqs'

export function FAQ() {
  return (
    <section
      id="faq"
      className="me-defer-section py-20 md:py-28 bg-white dark:bg-neutral-950"
      aria-labelledby="faq-heading"
    >
      <Container>
        <FadeIn>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2
              id="faq-heading"
              className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50"
            >
              Questions?{' '}
              <span className="italic text-[#D97757]">Answered.</span>
            </h2>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="max-w-2xl mx-auto">
            {faqs.map((item, i) => (
              <FAQItem key={item.q} q={item.q} a={item.a} index={i} />
            ))}
          </div>
        </FadeIn>
      </Container>
    </section>
  )
}
