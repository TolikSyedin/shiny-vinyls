import { StarIcon } from '@/components/icons'
import { Card, Eyebrow, Note } from '@/components/ui'
import type { ApprovedReview } from '@/lib/repositories/reviews'

const STARS = [1, 2, 3, 4, 5] as const

export function ReviewCard({ review }: { review: ApprovedReview }) {
  return (
    <Card className="w-[17.5rem] shrink-0 transition-[transform,box-shadow,border-color] duration-200 ease-out hover:translate-z-[0.05rem] hover:border-[var(--stamp)] hover:shadow-[0_0.5rem_1rem_-0.5rem_rgba(0,0,0,0.35)]">
      <div
        role="img"
        aria-label={`Оцінка ${review.rating} з 5`}
        className="flex gap-2"
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
