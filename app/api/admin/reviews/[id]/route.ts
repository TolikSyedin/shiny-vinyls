import { NextResponse } from 'next/server'
import { z } from 'zod'
import {
  updateReviewStatus,
  ReviewNotFoundError,
} from '@/lib/repositories/reviews'
import { REVIEW_STATUSES } from '@/types/database'
import { readJsonBody } from '@/lib/api/json-body'

const patchSchema = z.object({
  status: z.enum(REVIEW_STATUSES),
})

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  const body = await readJsonBody(req)
  if (!body.ok) return body.response

  const parsed = patchSchema.safeParse(body.data)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  try {
    const updated = await updateReviewStatus(id, parsed.data.status)
    return NextResponse.json(updated)
  } catch (error) {
    if (error instanceof ReviewNotFoundError) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    throw error
  }
}
