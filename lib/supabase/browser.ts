import { createBrowserClient as createSupabaseBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database.types'

// Cookie-backed client for the browser — used only by the admin login form's
// supabase.auth calls, so the resulting session is readable by proxy.ts and
// server-side admin routes via the same cookies.
export function createBrowserClient() {
  return createSupabaseBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
