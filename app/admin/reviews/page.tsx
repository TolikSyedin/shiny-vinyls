import { listAllReviews } from '@/lib/repositories/reviews'
import { adminReviewStatusLabels } from '@/lib/admin-status-labels'
import { AdminNav } from '@/components/admin/admin-nav'
import { ReviewModerationControl } from '@/components/admin/review-moderation-control'
import { PageContainer } from '@/components/layout'

export const metadata = {
  title: 'Відгуки — Адмін — Shiny Vinyls',
}

export const dynamic = 'force-dynamic'

export default async function AdminReviewsPage() {
  const reviews = await listAllReviews()

  return (
    <PageContainer className="flex flex-col gap-8 py-4 sm:py-8">
      <AdminNav />
      <h1 className="text-2xl font-semibold">Відгуки</h1>

      {reviews.length === 0 ? (
        <p className="text-muted-foreground">Відгуків ще немає.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="border-b border-border">
                <th className="p-2">Ім&apos;я</th>
                <th className="p-2">Оцінка</th>
                <th className="p-2">Текст</th>
                <th className="p-2">Статус</th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review.id} className="border-b border-border">
                  <td className="p-2">{review.name}</td>
                  <td className="p-2">{review.rating}/5</td>
                  <td className="p-2 max-w-sm">{review.text}</td>
                  <td className="p-2">
                    {adminReviewStatusLabels[review.status]}
                  </td>
                  <td className="p-2">
                    <ReviewModerationControl
                      id={review.id}
                      status={review.status}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageContainer>
  )
}
