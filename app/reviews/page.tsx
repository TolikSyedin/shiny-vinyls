import { listApprovedReviews } from '@/lib/repositories/reviews'
import { ReviewForm } from '@/components/forms'
import { PageContainer } from '@/components/layout'
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
    <PageContainer className="flex flex-col gap-8 py-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">Відгуки</h1>
        {reviews.length === 0 ? (
          <p className="text-muted-foreground">Поки що немає відгуків.</p>
        ) : (
          <ReviewsSlider reviews={reviews} />
        )}
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Залишити відгук</h2>
        <ReviewForm />
      </div>
    </PageContainer>
  )
}
