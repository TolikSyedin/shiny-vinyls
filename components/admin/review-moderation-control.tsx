'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { adminReviewStatusLabels } from '@/lib/data/admin-statuses/constants'
import { REVIEW_STATUSES, type ReviewStatus } from '@/types/database'
import { FieldError } from '@/components/form-fields'

export function ReviewModerationControl({
  id,
  status,
}: {
  id: string
  status: ReviewStatus
}) {
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState(false)

  const otherStatuses = REVIEW_STATUSES.filter(
    (candidate) => candidate !== status,
  )

  async function handleChange(next: ReviewStatus) {
    setIsUpdating(true)
    setError(false)

    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next }),
      })

      if (res.ok) {
        router.refresh()
      } else {
        // Re-sync with the server's real state too — a rejected change
        // means the buttons shown here are stale, not just that this click
        // failed.
        setError(true)
        router.refresh()
      }
    } catch {
      setError(true)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {otherStatuses.map((next) => (
        <button
          key={next}
          type="button"
          disabled={isUpdating}
          onClick={() => handleChange(next)}
          className="rounded-[0.3rem] border border-[var(--rule)] p-1 disabled:opacity-50"
        >
          → {adminReviewStatusLabels[next]}
        </button>
      ))}
      {error && <FieldError message="Помилка" />}
    </div>
  )
}
