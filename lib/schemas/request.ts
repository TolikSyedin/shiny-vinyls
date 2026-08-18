import { z } from 'zod'
import {
  NAME_TOO_SHORT,
  PHONE_TOO_SHORT,
  PHONE_CONTAINS_UNEXPECTED_VALUES,
} from '../data/constants'

export const requestSchema = z.object({
  name: z.string().trim().min(2, NAME_TOO_SHORT).max(100),
  phone: z
    .string()
    .trim()
    .min(7, PHONE_TOO_SHORT)
    .max(20)
    .regex(/^[\d+()\-\s]+$/, PHONE_CONTAINS_UNEXPECTED_VALUES)
    .refine((value) => (value.match(/\d/g) ?? []).length >= 7, PHONE_TOO_SHORT),
  comment: z.string().trim().max(1000).optional(),
  // Honeypot field: real users don't see or fill it out.
  // Intentionally without a length limit — the check itself (whether it's filled or not) and
  // the quiet response to the bot live in the route handler, not here; if this field
  // failed validation, the entire request would fail with a 400 even before that check.
  website: z.string().optional(),
})

export type RequestInput = z.infer<typeof requestSchema>
