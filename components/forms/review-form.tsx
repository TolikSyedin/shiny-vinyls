'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { reviewSchema, type ReviewInput } from '@/lib/schemas/review'
import {
  SUBMIT_ERROR_MESSAGE,
  NAME_PLACEHOLDER,
  REVIEW_TEXT_PLACEHOLDER,
} from '@/lib/data/constants'
import {
  FieldError,
  HoneypotField,
  TextField,
  TextAreaField,
  SubmitButton,
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
        Дякуємо за відгук! Він зʼявиться на сайті після модерації.
      </p>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-[18px]"
    >
      <TextField
        id="name"
        label="Ім'я"
        autocomplete="name"
        placeholder={NAME_PLACEHOLDER}
        error={errors.name?.message}
        {...register('name')}
      />

      <div className="flex flex-col gap-1 font-[family-name:var(--f-display)] font-muted">
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

      <div className="col-span-full">
        <TextAreaField
          id="text"
          label="Відгук"
          placeholder={REVIEW_TEXT_PLACEHOLDER}
          error={errors.text?.message}
          {...register('text')}
        />
      </div>

      <HoneypotField register={register} name="website" />

      <div className="col-span-full">
        <FieldError message={submitError ?? undefined} />
      </div>

      <div className="col-span-full">
        <SubmitButton isSubmitting={isSubmitting} label="Залишити відгук" />
      </div>
    </form>
  )
}
