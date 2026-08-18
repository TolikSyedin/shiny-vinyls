import { z } from 'zod'
import {
  NAME_TOO_SHORT,
  RATING_NOT_DEFINED,
  REVIEW_TOO_SHORT,
} from '../data/constants'

export const reviewSchema = z.object({
  name: z.string().trim().min(2, NAME_TOO_SHORT).max(100),
  rating: z.number(RATING_NOT_DEFINED).int().min(1).max(5),
  text: z.string().trim().min(5, REVIEW_TOO_SHORT).max(2000),
  // Honeypot field: real users don't see or fill it out.
  // Intentionally without a length limit — the check itself (whether it's filled or not) and
  // the quiet response to the bot live in the route handler, not here; if this field
  // failed validation, the entire request would fail with a 400 even before that check.
  website: z.string().optional(),
})

export type ReviewInput = z.infer<typeof reviewSchema>
