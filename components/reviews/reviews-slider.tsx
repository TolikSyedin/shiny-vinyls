import { ReviewCard } from './review-card'
import type { ApprovedReview } from '@/lib/repositories/reviews'

export function ReviewsSlider({ reviews }: { reviews: ApprovedReview[] }) {
  return (
    <div className="overflow-hidden">
      <div className="flex w-max gap-[14px] motion-safe:animate-marquee motion-safe:hover:[animation-play-state:paused]">
        {[...reviews, ...reviews].map((review, i) => (
          <ReviewCard key={`${review.id}-${i}`} review={review} />
        ))}
      </div>
    </div>
  )
}
