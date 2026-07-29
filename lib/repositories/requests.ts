import { z } from 'zod'
import { createAnonClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { RequestStatus } from '@/types/database'

const uuidSchema = z.string().uuid()

type CreateRequestInput = {
  name: string
  phone: string
  comment?: string
}

export async function createRequest(input: CreateRequestInput) {
  const id = crypto.randomUUID()
  const supabase = createAnonClient()

  // No .select() here on purpose: anon has no select policy on requests,
  // so asking PostgREST to return the inserted row would fail. The id is
  // generated here, so the caller doesn't need it read back.
  const { error } = await supabase.from('requests').insert({
    id,
    name: input.name,
    phone: input.phone,
    comment: input.comment,
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
