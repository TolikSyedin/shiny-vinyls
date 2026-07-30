'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase/browser'

export function AdminNav() {
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createBrowserClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <nav className="flex items-center justify-between border-b border-border pb-4">
      <div className="flex gap-4">
        <Link href="/admin/requests">Заявки</Link>
        <Link href="/admin/reviews">Відгуки</Link>
      </div>
      <button onClick={handleSignOut} className="underline">
        Вийти
      </button>
    </nav>
  )
}
