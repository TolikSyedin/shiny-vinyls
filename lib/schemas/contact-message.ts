import { z } from 'zod'
import {
  NAME_TOO_SHORT,
  CONTACT_TOO_SHORT,
  CONTACT_INVALID_FORMAT,
  MESSAGE_TOO_SHORT,
} from '../data/form-fields/error-messages/constants'

// Same character set + digit-count floor as requestSchema.phone.
const PHONE_CHARS_REGEX = /^[\d+()\-\s]+$/

// Telegram's own username rules: 5-32 chars, latin letters/digits/underscore,
// can't start with a digit. The leading "@" is optional since people type it
// either way.
const TELEGRAM_HANDLE_REGEX = /^@?[a-zA-Z][a-zA-Z0-9_]{4,31}$/

function isPhoneLike(value: string): boolean {
  return (
    PHONE_CHARS_REGEX.test(value) &&
    (value.match(/\d/g) ?? []).length >= 7
  )
}

export const contactMessageSchema = z.object({
  name: z.string().trim().min(2, NAME_TOO_SHORT).max(100),
  contact: z
    .string()
    .trim()
    .min(5, CONTACT_TOO_SHORT)
    .max(100)
    .refine(
      (value) => isPhoneLike(value) || TELEGRAM_HANDLE_REGEX.test(value),
      CONTACT_INVALID_FORMAT,
    ),
  message: z.string().trim().min(5, MESSAGE_TOO_SHORT).max(1000),
  // Honeypot field: real users don't see or fill it out.
  // Intentionally without a length limit — the check itself (whether it's filled or not) and
  // the quiet response to the bot live in the route handler, not here; if this field
  // failed validation, the entire request would fail with a 400 even before that check.
  website: z.string().optional(),
})

export type ContactMessageInput = z.infer<typeof contactMessageSchema>
