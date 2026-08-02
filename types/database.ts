import type { Database } from './database.types'

// Hand-maintained convenience alias on top of the generated file — keep it
// here rather than editing database.types.ts, which gets overwritten on
// every `supabase gen types` run.
export type RequestStatus = Database['public']['Enums']['request_status']
export type ReviewStatus = Database['public']['Enums']['review_status']

// Full value sets, kept next to the types they enumerate — the single place
// admin UI code reaches for "every possible status" instead of each call
// site hardcoding its own copy of the enum.
export const REQUEST_STATUSES: RequestStatus[] = [
  'new',
  'contacted',
  'in_progress',
  'done',
  'cancelled',
]
export const REVIEW_STATUSES: ReviewStatus[] = [
  'pending',
  'approved',
  'rejected',
]
