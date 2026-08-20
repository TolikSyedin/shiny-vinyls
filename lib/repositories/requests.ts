import { createAnonClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createSessionClient } from '@/lib/supabase/session'
import { isValidStatusTransition } from '@/lib/request-status'
import { uuidSchema } from '@/lib/utils/uuid'
import type { RequestStatus } from '@/types/database'

type CreateRequestInput = {
  name: string
  phone: string
  comment?: string
}

export async function createRequest(input: CreateRequestInput) {
  const id = crypto.randomUUID()
  const { name, phone, comment } = input
  const supabase = createAnonClient()

  // No .select() here on purpose: anon has no select policy on requests,
  // so asking PostgREST to return the inserted row would fail. The id is
  // generated here, so the caller doesn't need it read back.
  const { error } = await supabase.from('requests').insert({
    id,
    name,
    phone,
    comment,
  })

  if (error) throw error

  return { id, status: 'new' satisfies RequestStatus }
}

export type RequestPublicStatus = {
  id: string
  status: RequestStatus
  created_at: string
}

export async function getRequestStatus(
  id: string,
): Promise<RequestPublicStatus | null> {
  // A malformed id is indistinguishable from a nonexistent one as far as the
  // caller is concerned — both mean "no such request." Checking the format
  // here avoids hitting Postgres with a value it would reject outright
  // (invalid input syntax for type uuid).
  if (!uuidSchema.safeParse(id).success) return null

  // service-role read, narrowed to safe fields only (id/status/created_at).
  // anon has no select policy on requests, so the public status page
  // deliberately reads through the admin client instead — never
  // name/phone/comment here.
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('requests')
    .select('id, status, created_at')
    .eq('id', id)
    .maybeSingle()

  if (error) throw error

  return data
}

export class RequestNotFoundError extends Error {}
export class InvalidStatusTransitionError extends Error {}
export class StatusConflictError extends Error {}

export type AdminRequest = {
  id: string
  name: string
  phone: string
  comment: string | null
  status: RequestStatus
  telegram_chat_id: string | null
  created_at: string
}

export async function listRequests(): Promise<AdminRequest[]> {
  const supabase = await createSessionClient()
  const { data, error } = await supabase
    .from('requests')
    .select('id, name, phone, comment, status, telegram_chat_id, created_at')
    .order('created_at', { ascending: false })

  if (error) throw error

  return data
}

export async function updateRequestStatus(
  id: string,
  status: RequestStatus,
): Promise<AdminRequest> {
  // A malformed id is indistinguishable from a nonexistent one to the
  // caller — see getRequestStatus's version of this same check.
  if (!uuidSchema.safeParse(id).success) {
    throw new RequestNotFoundError(`Request ${id} not found`)
  }

  const supabase = await createSessionClient()

  // Needed to validate the transition — the update below can't check
  // "from what" without first reading the current status.
  const { data: current, error: fetchError } = await supabase
    .from('requests')
    .select('status')
    .eq('id', id)
    .maybeSingle()

  if (fetchError) throw fetchError
  if (!current) throw new RequestNotFoundError(`Request ${id} not found`)

  if (!isValidStatusTransition(current.status, status)) {
    throw new InvalidStatusTransitionError(
      `Cannot transition from "${current.status}" to "${status}"`,
    )
  }

  // Conditioned on the status we just read: if another request changed it
  // in between, this matches zero rows instead of blindly overwriting a
  // transition that's no longer valid from the row's real current state.
  const { data, error } = await supabase
    .from('requests')
    .update({ status })
    .eq('id', id)
    .eq('status', current.status)
    .select('id, name, phone, comment, status, telegram_chat_id, created_at')
    .maybeSingle()

  if (error) throw error
  if (!data) {
    throw new StatusConflictError(
      `Request ${id} status changed before the update could be applied`,
    )
  }

  return data
}

// Overwrites any previously linked chat: the request UUID itself is the
// credential (same trust model as getRequestStatus's public link), so the
// most recent /start wins rather than rejecting a re-link.
export async function linkTelegramChat(
  requestId: string,
  chatId: string,
): Promise<AdminRequest | null> {
  // Same rationale as getRequestStatus: a malformed id can't match a row
  // anyway, so skip the round-trip to Postgres for an id it would reject.
  if (!uuidSchema.safeParse(requestId).success) return null

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('requests')
    .update({ telegram_chat_id: chatId })
    .eq('id', requestId)
    .select('id, name, phone, comment, status, telegram_chat_id, created_at')
    .maybeSingle()

  if (error) throw error

  return data
}

export async function getLatestRequestStatusByChatId(
  chatId: string,
): Promise<RequestPublicStatus | null> {
  // service-role read, narrowed to the same safe fields as
  // getRequestStatus — the bot chat is the client's own, but there's no
  // reason to widen the surface beyond what the site itself ever shows.
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('requests')
    .select('id, status, created_at')
    .eq('telegram_chat_id', chatId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) throw error

  return data
}
