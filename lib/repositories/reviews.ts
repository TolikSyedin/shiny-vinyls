import { createAnonClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { ReviewStatus } from '@/types/database'

type CreateReviewInput = {
  name: string
  rating: number
  text: string
}

export async function createReview(input: CreateReviewInput) {
  const id = crypto.randomUUID()
  const supabase = createAnonClient()

  // Same reasoning as createRequest: anon has no select policy on reviews,
  // so we generate the id ourselves and skip .select() entirely.
  const { error } = await supabase.from('reviews').insert({
    id,
    name: input.name,
    rating: input.rating,
    text: input.text,
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
