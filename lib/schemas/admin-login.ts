import { z } from 'zod'

export const adminLoginSchema = z.object({
  email: z.string().trim().email('Некоректний email'),
  password: z.string().min(6, 'Пароль занадто короткий'),
})

export type AdminLoginInput = z.infer<typeof adminLoginSchema>
