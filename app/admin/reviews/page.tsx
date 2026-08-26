import { listAllReviews } from '@/lib/repositories/reviews'
import { adminReviewStatusLabels } from '@/lib/data/admin-statuses/constants'
import { AdminPage } from '@/components/admin/admin-page'
import {
  AdminTable,
  type AdminTableColumn,
} from '@/components/admin/admin-table'
import { ReviewModerationControl } from '@/components/admin/review-moderation-control'
import { Note } from '@/components/ui'

export const metadata = {
  title: 'Відгуки — Адмін — Shiny Vinyls',
}

export const dynamic = 'force-dynamic'

type ReviewRow = Awaited<ReturnType<typeof listAllReviews>>[number]

const columns: AdminTableColumn<ReviewRow>[] = [
  { key: 'name', header: 'Імʼя', cell: (review) => review.name },
  { key: 'rating', header: 'Оцінка', cell: (review) => `${review.rating}/5` },
  {
    key: 'text',
    header: 'Текст',
    cell: (review) => <div className="max-w-sm">{review.text}</div>,
  },
  {
    key: 'status',
    header: 'Статус',
    cell: (review) => adminReviewStatusLabels[review.status],
  },
  {
    key: 'control',
    header: '',
    cell: (review) => (
      <ReviewModerationControl id={review.id} status={review.status} />
    ),
  },
]

export default async function AdminReviewsPage() {
  const reviews = await listAllReviews()

  return (
    <AdminPage title="Відгуки">
      {reviews.length === 0 ? (
        <Note>Відгуків ще немає.</Note>
      ) : (
        <AdminTable
          columns={columns}
          rows={reviews}
          rowKey={(review) => review.id}
        />
      )}
    </AdminPage>
  )
}
