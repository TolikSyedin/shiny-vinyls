import { listApprovedReviews } from '@/lib/repositories/reviews'
import { ReviewForm } from '@/components/forms'
import { PageContainer } from '@/components/layout'
import { PageHeader, Section, SectionHeading } from '@/components/common'
import { Note } from '@/components/ui'
import { ReviewsSlider } from '@/components/reviews/reviews-slider'

export const metadata = {
  title: 'Відгуки — Shiny Vinyls',
}

// Without this, Next.js would prerender the review list once at build time
// (no dynamic API is used otherwise) and keep serving that stale snapshot
// until the next deploy — newly approved reviews wouldn't show up.
export const dynamic = 'force-dynamic'

export default async function ReviewsPage() {
  const reviews = await listApprovedReviews()

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Відгуки"
        title="Нам важлива Ваша думка"
        lead="Ми завжди раді бачити коментарі та відгуки від наших клієнтів"
      />

      <Section>
        <SectionHeading eyebrow="Досвід клієнтів">
          Що кажуть власники
        </SectionHeading>
        {reviews.length === 0 ? (
          <Note>Поки що немає відгуків.</Note>
        ) : (
          <ReviewsSlider reviews={reviews} />
        )}
      </Section>

      <Section>
        <SectionHeading eyebrow="Ваш відгук">Залишити відгук</SectionHeading>
        <ReviewForm />
      </Section>
    </PageContainer>
  )
}
