'use client'

import { useState } from 'react'
import { useForm, useController } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { reviewSchema, type ReviewInput } from '@/lib/schemas/review'
import { CtaSection } from '@/components/common'
import { Note } from '@/components/ui'
import {
  NAME_PLACEHOLDER,
  REVIEW_TEXT_PLACEHOLDER,
} from '@/lib/data/form-fields/placeholders/constants'
import { SUBMIT_ERROR_MESSAGE } from '@/lib/data/form-fields/error-messages/constants'
import {
  FieldError,
  HoneypotField,
  TextField,
  TextAreaField,
  StarRatingField,
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
  // const nameField = register('name')
  const {
    field: { value: rating, onChange: onRatingChange, ref: ratingRef },
  } = useController({ control, name: 'rating' })

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
      <Note>Дякуємо за відгук! Він зʼявиться на сайті після модерації.</Note>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <StarRatingField
        label="Оцінка"
        name="rating"
        value={rating}
        error={errors.rating?.message}
        onChange={onRatingChange}
        ref={ratingRef}
      />

      <TextField
        id="name"
        label="Імʼя"
        autocomplete="name"
        placeholder={NAME_PLACEHOLDER}
        error={errors.name?.message}
        {...register('name')}
      />

      <TextAreaField
        id="text"
        label="Відгук"
        placeholder={REVIEW_TEXT_PLACEHOLDER}
        error={errors.text?.message}
        {...register('text')}
      />

      <HoneypotField register={register} name="website" />

      <FieldError message={submitError ?? undefined} />

      <CtaSection>
        <SubmitButton isSubmitting={isSubmitting} label="Залишити відгук" />
      </CtaSection>
    </form>
  )
}
