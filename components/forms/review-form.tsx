'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { reviewSchema, type ReviewInput } from '@/lib/schemas/review'
import { SUBMIT_ERROR_MESSAGE } from '@/lib/form-content'
import {
  FieldError,
  HoneypotField,
  TextField,
  TextAreaField,
} from '@/components/form-fields'

export function ReviewForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ReviewInput>({
    resolver: zodResolver(reviewSchema),
  })

  async function onSubmit(data: ReviewInput) {
    setSubmitError(null)

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        setSubmitError(SUBMIT_ERROR_MESSAGE)
        return
      }

      setIsSubmitted(true)
    } catch {
      setSubmitError(SUBMIT_ERROR_MESSAGE)
    }
  }

  if (isSubmitted) {
    return (
      <p className="text-muted-foreground">
        Дякуємо за відгук! Він з&apos;явиться на сайті після модерації.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <TextField
        id="name"
        label="Ім'я"
        error={errors.name?.message}
        {...register('name')}
      />

      <div className="flex flex-col gap-1">
        <span>Оцінка</span>
        <Controller
          name="rating"
          control={control}
          render={({ field }) => (
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => field.onChange(star)}
                  aria-label={`Оцінка ${star} з 5`}
                  className="text-2xl leading-none"
                >
                  {star <= (field.value ?? 0) ? '★' : '☆'}
                </button>
              ))}
            </div>
          )}
        />
        <FieldError message={errors.rating?.message} />
      </div>

      <TextAreaField
        id="text"
        label="Відгук"
        error={errors.text?.message}
        {...register('text')}
      />

      <HoneypotField register={register} name="website" />

      <FieldError message={submitError ?? undefined} />

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md border border-border p-2 disabled:opacity-50"
      >
        {isSubmitting ? 'Надсилаємо...' : 'Залишити відгук'}
      </button>
    </form>
  )
}
