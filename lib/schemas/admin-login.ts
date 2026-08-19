import { z } from 'zod'
import { EMAIL_IS_INCORRECT, PASSWORD_TOO_SHORT } from '../data/form-fields/error-messages/constants'

export const adminLoginSchema = z.object({
  email: z.string().trim().email(EMAIL_IS_INCORRECT),
  password: z.string().min(6, PASSWORD_TOO_SHORT),
})

export type AdminLoginInput = z.infer<typeof adminLoginSchema>
