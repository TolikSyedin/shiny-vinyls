import { NextResponse, after } from 'next/server'
import { z } from 'zod'
import {
  updateRequestStatus,
  RequestNotFoundError,
  InvalidStatusTransitionError,
  StatusConflictError,
} from '@/lib/repositories/requests'
import { notifyClient } from '@/lib/telegram/telegram'
import { requestStatusLabels } from '@/lib/data/request-statuses/constants'
import { REQUEST_STATUSES } from '@/types/database'
import { readJsonBody } from '@/lib/api/json-body'

const patchSchema = z.object({
  status: z.enum(REQUEST_STATUSES),
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
    const updated = await updateRequestStatus(id, parsed.data.status)

    if (updated.telegram_chat_id) {
      const chatId = updated.telegram_chat_id
      after(() => notifyClient(chatId, requestStatusLabels[updated.status]))
    }

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
