import { NextResponse } from 'next/server'
import { z } from 'zod'
import {
  updateRequestStatus,
  RequestNotFoundError,
  InvalidStatusTransitionError,
  StatusConflictError,
} from '@/lib/repositories/requests'
import { REQUEST_STATUSES } from '@/types/database'

const patchSchema = z.object({
  status: z.enum(REQUEST_STATUSES),
})

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const body = await req.json()
  const parsed = patchSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  try {
    const updated = await updateRequestStatus(id, parsed.data.status)
    return NextResponse.json(updated)
  } catch (error) {
    if (error instanceof RequestNotFoundError) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    if (error instanceof InvalidStatusTransitionError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    if (error instanceof StatusConflictError) {
      return NextResponse.json({ error: error.message }, { status: 409 })
    }
    throw error
  }
}
