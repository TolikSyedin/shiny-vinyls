import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

// anon-key client for public inserts (requests/reviews). No cookie/session
// handling needed yet — there's no login flow in this MVP scope (/admin auth
// is out of scope), so plain supabase-js is enough; @supabase/ssr becomes
// relevant once an authenticated admin session exists.
export function createAnonClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
