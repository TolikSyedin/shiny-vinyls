import { createAnonClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createSessionClient } from '@/lib/supabase/session'
import type { ReviewStatus } from '@/types/database'

type CreateReviewInput = {
  name: string
  rating: number
  text: string
}

export async function createReview(input: CreateReviewInput) {
  const id = crypto.randomUUID()
  const { name, rating, text } = input
  const supabase = createAnonClient()

  // Same reasoning as createRequest: anon has no select policy on reviews,
  // so we generate the id ourselves and skip .select() entirely.
  const { error } = await supabase.from('reviews').insert({
    id,
    name,
    rating,
    text,
  })

  if (error) throw error

  return { id, status: 'pending' satisfies ReviewStatus }
}

export type ApprovedReview = {
  id: string
  name: string
  rating: number
  text: string
  created_at: string
}

export async function listApprovedReviews(): Promise<ApprovedReview[]> {
  // Public reviews list reads through the admin client — anon has no select
  // policy on reviews either, so this mirrors getRequestStatus's approach.
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('reviews')
    .select('id, name, rating, text, created_at')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  if (error) throw error

  return data
}

export class ReviewNotFoundError extends Error {}

export type AdminReview = {
  id: string
  name: string
  rating: number
  text: string
  status: ReviewStatus
  created_at: string
}

export async function listAllReviews(): Promise<AdminReview[]> {
  const supabase = await createSessionClient()
  const { data, error } = await supabase
    .from('reviews')
    .select('id, name, rating, text, status, created_at')
    .order('created_at', { ascending: false })

  if (error) throw error

  return data
}

// Unlike request status, review moderation has no transition guard: it's a
// visibility flag with no audit trigger or side effects, so the admin can
// freely correct a misclick (approve -> reject, rejected -> pending, etc).
export async function updateReviewStatus(
  id: string,
  status: ReviewStatus,
): Promise<AdminReview> {
  const supabase = await createSessionClient()

  const { data, error } = await supabase
    .from('reviews')
    .update({ status })
    .eq('id', id)
    .select('id, name, rating, text, status, created_at')
    .maybeSingle()

  if (error) throw error
  if (!data) throw new ReviewNotFoundError(`Review ${id} not found`)

  return data
}
