'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { adminReviewStatusLabels } from '@/lib/admin-status-labels'
import { REVIEW_STATUSES, type ReviewStatus } from '@/types/database'

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
        setError(true)
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
          className="rounded-md border border-border p-1 text-sm disabled:opacity-50"
        >
          → {adminReviewStatusLabels[next]}
        </button>
      ))}
      {error && <span className="text-sm text-red-500">Помилка</span>}
    </div>
  )
}
