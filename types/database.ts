import type { Database } from './database.types'

// Hand-maintained convenience alias on top of the generated file — keep it
// here rather than editing database.types.ts, which gets overwritten on
// every `supabase gen types` run.
export type RequestStatus = Database['public']['Enums']['request_status']
