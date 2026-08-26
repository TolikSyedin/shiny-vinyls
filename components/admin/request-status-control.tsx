'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { isValidStatusTransition } from '@/lib/request-status'
import { adminRequestStatusLabels } from '@/lib/data/admin-statuses/constants'
import { REQUEST_STATUSES, type RequestStatus } from '@/types/database'
import { FieldError } from '@/components/form-fields'

export function RequestStatusControl({
  id,
  status,
}: {
  id: string
  status: RequestStatus
}) {
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState(false)

  const nextStatuses = REQUEST_STATUSES.filter((candidate) =>
    isValidStatusTransition(status, candidate),
  )

  async function handleTransition(next: RequestStatus) {
    setIsUpdating(true)
    setError(false)

    try {
      const res = await fetch(`/api/admin/requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next }),
      })

      if (res.ok) {
        router.refresh()
      } else {
        // Re-sync with the server's real state too — a rejected transition
        // (e.g. someone else already changed the status) means the buttons
        // shown here are stale, not just that this click failed.
        setError(true)
        router.refresh()
      }
    } catch {
      setError(true)
    } finally {
      setIsUpdating(false)
    }
  }

  if (nextStatuses.length === 0) return null

  return (
    <div className="flex items-center gap-2">
      {nextStatuses.map((next) => (
        <button
          key={next}
          type="button"
          disabled={isUpdating}
          onClick={() => handleTransition(next)}
          className="rounded-[var(--radius)] border border-[var(--rule)] p-1 disabled:opacity-50"
        >
          → {adminRequestStatusLabels[next]}
        </button>
      ))}
      {error && <FieldError message="Помилка" />}
    </div>
  )
}
