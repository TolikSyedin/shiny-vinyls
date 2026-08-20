import { StarIcon } from '@/components/icons'
import { Card, Eyebrow, Note } from '@/components/ui'
import type { ApprovedReview } from '@/lib/repositories/reviews'

const STARS = [1, 2, 3, 4, 5] as const

export function ReviewCard({ review }: { review: ApprovedReview }) {
  return (
    <Card className="w-[280px] shrink-0 transition-[transform,box-shadow,border-color] duration-200 ease-out hover:translate-z-[1px] hover:border-[var(--stamp)] hover:shadow-[0_20px_40px_-16px_rgba(0,0,0,0.45)]">
      <div
        role="img"
        aria-label={`Оцінка ${review.rating} з 5`}
        className="flex gap-[1px]"
      >
        {STARS.map((n) => (
          <StarIcon
            key={n}
            className={`h-4 w-4 ${n <= review.rating ? 'text-[var(--stamp)]' : 'text-[var(--ink)]/25'}`}
          />
        ))}
      </div>
      <Note tone="ink">{review.text}</Note>
      <Eyebrow>{review.name}</Eyebrow>
    </Card>
  )
}
