'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  adminLoginSchema,
  type AdminLoginInput,
} from '@/lib/schemas/admin-login'
import {
  EMAIL_PLACEHOLDER,
  PASSWORD_PLACEHOLDER,
} from '@/lib/data/form-fields/placeholders/constants'
import { LOGIN_ERROR_MESSAGE } from '@/lib/data/form-fields/error-messages/constants'
import { FieldError, TextField, SubmitButton } from '@/components/form-fields'
import { CtaSection } from '@/components/common'
import { createBrowserClient } from '@/lib/supabase/browser'

export function AdminLoginForm() {
  const router = useRouter()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginInput>({
    resolver: zodResolver(adminLoginSchema),
  })

  // Calls Supabase Auth directly rather than one of our own API routes: it's
  // the only form here that doesn't own a DB write, and @supabase/ssr's
  // browser client already handles writing the session into cookies
  // correctly — wrapping it in our own route would just re-implement that.
  async function onSubmit(data: AdminLoginInput) {
    setSubmitError(null)

    const supabase = createBrowserClient()
    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
      setSubmitError(LOGIN_ERROR_MESSAGE)
      return
    }

    // isSubmitting flips back to false the instant this handler returns,
    // which happens right after router.push is called — not once the new
    // route has actually rendered. This flag keeps the loading UI visible
    // through that gap instead of it flashing back to idle mid-navigation.
    setIsRedirecting(true)
    router.push('/admin/requests')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
      <div className="flex flex-col gap-4">
        <TextField
          id="email"
          label="Email"
          placeholder={EMAIL_PLACEHOLDER}
          error={errors.email?.message}
          {...register('email')}
        />

        <TextField
          id="password"
          label="Пароль"
          type="password"
          placeholder={PASSWORD_PLACEHOLDER}
          error={errors.password?.message}
          {...register('password')}
        />

        <FieldError message={submitError ?? undefined} />
      </div>

      <CtaSection>
        <SubmitButton
          isSubmitting={isSubmitting || isRedirecting}
          label="Увійти"
          loadingLabel="Входимо..."
        />
      </CtaSection>
    </form>
  )
}
