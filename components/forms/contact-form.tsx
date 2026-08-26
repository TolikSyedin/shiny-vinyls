'use client'

import { useState } from 'react'
import { Note } from '@/components/ui'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  contactMessageSchema,
  type ContactMessageInput,
} from '@/lib/schemas/contact-message'
import { CtaSection } from '@/components/common'
import {
  NAME_PLACEHOLDER,
  CONTACT_PLACEHOLDER,
  MESSAGE_PLACEHOLDER,
} from '@/lib/data/form-fields/placeholders/constants'
import { SUBMIT_ERROR_MESSAGE } from '@/lib/data/form-fields/error-messages/constants'
import {
  FieldError,
  HoneypotField,
  TextField,
  TextAreaField,
  SubmitButton,
} from '@/components/form-fields'
import { CONTACT_INFO } from '@/lib/data/contact-info/constants'

export function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactMessageInput>({
    resolver: zodResolver(contactMessageSchema),
  })

  async function onSubmit(data: ContactMessageInput) {
    setSubmitError(null)

    try {
      const res = await fetch('/api/contact-messages', {
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
      <Note>
        Дякуємо за повідомлення! Ми звʼяжемося з Вами найближчим часом.
      </Note>
    )
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
              id="contact"
              label="Телефон або Telegram"
              autocomplete="tel"
              placeholder={CONTACT_PLACEHOLDER}
              error={errors.contact?.message}
              {...register('contact')}
            />
          </div>

          <TextAreaField
            id="message"
            label="Повідомлення"
            placeholder={MESSAGE_PLACEHOLDER}
            error={errors.message?.message}
            {...register('message')}
          />

          <HoneypotField register={register} name="website" />

          <FieldError message={submitError ?? undefined} />
        </div>

        <CtaSection>
          <SubmitButton
            isSubmitting={isSubmitting}
            label="Надіслати повідомлення"
          />
        </CtaSection>
      </form>

      <Note>
        Не вдається надіслати повідомлення?{' '}
        <a href={CONTACT_INFO.telegram.url}>Напишіть у Telegram напряму</a>
      </Note>
    </div>
  )
}
