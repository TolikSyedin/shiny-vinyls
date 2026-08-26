'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Note } from '@/components/ui'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { requestSchema, type RequestInput } from '@/lib/schemas/request'
import { CtaSection } from '@/components/common'
import {
  NAME_PLACEHOLDER,
  PHONE_PLACEHOLDER,
  COMMENT_PLACEHOLDER,
} from '@/lib/data/form-fields/placeholders/constants'
import { SUBMIT_ERROR_MESSAGE } from '@/lib/data/form-fields/error-messages/constants'
import {
  FieldError,
  HoneypotField,
  TextField,
  TextAreaField,
  SubmitButton,
} from '@/components/form-fields'

export function RequestForm() {
  const router = useRouter()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RequestInput>({
    resolver: zodResolver(requestSchema),
  })

  async function onSubmit(data: RequestInput) {
    setSubmitError(null)

    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        setSubmitError(SUBMIT_ERROR_MESSAGE)
        return
      }

      const { id } = await res.json()
      // isSubmitting flips back to false the instant this handler returns,
      // which happens right after router.push is called — not once the new
      // route has actually rendered. This flag keeps the loading UI visible
      // through that gap instead of it flashing back to idle mid-navigation.
      setIsRedirecting(true)
      router.push(`/request/${id}`)
    } catch {
      setSubmitError(SUBMIT_ERROR_MESSAGE)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <TextField
              className="min-w-0 flex-1"
              id="name"
              label="Імʼя"
              autocomplete="name"
              placeholder={NAME_PLACEHOLDER}
              error={errors.name?.message}
              {...register('name')}
            />

            <TextField
              className="min-w-0 flex-1"
              id="phone"
              label="Телефон"
              type="tel"
              autocomplete="tel"
              placeholder={PHONE_PLACEHOLDER}
              error={errors.phone?.message}
              {...register('phone')}
            />
          </div>

          <TextAreaField
            id="comment"
            label="Коментар (необовʼязково)"
            placeholder={COMMENT_PLACEHOLDER}
            error={errors.comment?.message}
            {...register('comment')}
          />

          <HoneypotField register={register} name="website" />

          <FieldError message={submitError ?? undefined} />
        </div>

        <CtaSection>
          <SubmitButton
            isSubmitting={isSubmitting || isRedirecting}
            label="Надіслати замовлення"
          />
        </CtaSection>
      </form>

      <Note>
        Не вдається надіслати замовлення?{' '}
        <Link href="/contacts">Звʼяжіться з нами напряму</Link>
      </Note>
    </div>
  )
}
