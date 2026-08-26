import { listAllReviews } from '@/lib/repositories/reviews'
import { adminReviewStatusLabels } from '@/lib/data/admin-statuses/constants'
import { AdminPage } from '@/components/admin/admin-page'
import { ReviewModerationControl } from '@/components/admin/review-moderation-control'
import { Note } from '@/components/ui'

export const metadata = {
  title: 'Відгуки — Адмін — Shiny Vinyls',
}

export const dynamic = 'force-dynamic'

export default async function AdminReviewsPage() {
  const reviews = await listAllReviews()

  return (
    <AdminPage title="Відгуки">
      {reviews.length === 0 ? (
        <Note>Відгуків ще немає.</Note>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[40rem] border-collapse text-left">
            <thead>
              <tr className="border-b border-[var(--rule)]">
                <th className="px-4 py-2">Імʼя</th>
                <th className="px-4 py-2">Оцінка</th>
                <th className="px-4 py-2">Текст</th>
                <th className="px-4 py-2">Статус</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review.id} className="border-b border-[var(--rule)]">
                  <td className="px-4 py-2">{review.name}</td>
                  <td className="px-4 py-2">{review.rating}/5</td>
                  <td className="max-w-sm px-4 py-2">{review.text}</td>
                  <td className="px-4 py-2">
                    {adminReviewStatusLabels[review.status]}
                  </td>
                  <td className="px-4 py-2">
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
    </AdminPage>
  )
}
