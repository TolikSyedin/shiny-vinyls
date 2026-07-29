import 'server-only'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

// service-role client — bypasses RLS entirely. Never import this from a
// 'use client' component. The only public use of this client is
// reading back safe fields (id/status/created_at) for GET /api/requests/[id];
// every other public action must go through RLS via createAnonClient().
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
