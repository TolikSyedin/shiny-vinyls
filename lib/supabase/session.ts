import 'server-only'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database.types'

// Cookie-bound client for admin Server Components and Route Handlers — runs
// queries as the logged-in user, so RLS's `authenticated` policies decide
// access, not a manual "is admin" check. `setAll` is intentionally omitted:
// proxy.ts already refreshes the session before either context runs, and
// Server Components can't set cookies at all.
export async function createSessionClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
      },
    },
  )
}
