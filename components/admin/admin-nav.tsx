'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase/browser'
import { FieldError } from '@/components/form-fields'

export function AdminNav() {
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [error, setError] = useState(false)

  async function handleSignOut() {
    setIsSigningOut(true)
    setError(false)

    try {
      const supabase = createBrowserClient()
      const { error: signOutError } = await supabase.auth.signOut()

      if (signOutError) {
        setError(true)
        return
      }

      router.push('/admin/login')
    } catch {
      setError(true)
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <nav className="flex items-center justify-between border-b border-[var(--rule)] pb-4">
      <div className="flex gap-4">
        <Link href="/admin/requests">Замовлення</Link>
        <Link href="/admin/reviews">Відгуки</Link>
      </div>
      <div className="flex items-center gap-4">
        {error && <FieldError message="Помилка виходу" />}
        <button
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="underline disabled:opacity-50"
        >
          Вийти
        </button>
      </div>
    </nav>
  )
}
