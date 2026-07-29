'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { requestSchema, type RequestInput } from '@/lib/schemas/request'

export function RequestForm() {
  const router = useRouter()
  const [submitError, setSubmitError] = useState<string | null>(null)
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
        setSubmitError('Щось пішло не так, спробуйте ще раз')
        return
      }

      const { id } = await res.json()
      router.push(`/request/${id}`)
    } catch {
      setSubmitError('Щось пішло не так, спробуйте ще раз')
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="name">Ім&apos;я</label>
          <input
            id="name"
            {...register('name')}
            className="rounded-md border border-border bg-background p-2"
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="phone">Телефон</label>
          <input
            id="phone"
            {...register('phone')}
            className="rounded-md border border-border bg-background p-2"
          />
          {errors.phone && (
            <p className="text-sm text-red-500">{errors.phone.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="comment">Коментар (необов&apos;язково)</label>
          <textarea
            id="comment"
            {...register('comment')}
            className="rounded-md border border-border bg-background p-2"
          />
          {errors.comment && (
            <p className="text-sm text-red-500">{errors.comment.message}</p>
          )}
        </div>

        {/* Honeypot: off-screen so real (including blind) users never see or
            reach it, but still present in the DOM for bots that don't
            respect visibility/CSS. */}
        <div
          style={{ position: 'absolute', left: '-9999px' }}
          aria-hidden="true"
        >
          <label htmlFor="website">Website</label>
          <input
            id="website"
            tabIndex={-1}
            autoComplete="off"
            {...register('website')}
          />
        </div>

        {submitError && <p className="text-sm text-red-500">{submitError}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md border border-border p-2 disabled:opacity-50"
        >
          {isSubmitting ? 'Надсилаємо...' : 'Надіслати заявку'}
        </button>
      </form>

      <p className="text-sm text-muted-foreground">
        Не вдається надіслати заявку?{' '}
        <Link href="/contacts" className="underline">
          Зв&apos;яжіться з нами напряму
        </Link>
      </p>
    </div>
  )
}
