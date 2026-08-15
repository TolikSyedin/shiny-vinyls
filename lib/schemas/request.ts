import { z } from 'zod'

export const requestSchema = z.object({
  name: z.string().trim().min(2, "Ім'я занадто коротке").max(100),
  phone: z
    .string()
    .trim()
    .min(7, 'Телефон занадто короткий')
    .max(20)
    .regex(/^[\d+()\-\s]+$/, 'Телефон містить неприпустимі символи')
    .refine(
      (value) => (value.match(/\d/g) ?? []).length >= 7,
      'Телефон занадто короткий',
    ),
  comment: z.string().trim().max(1000).optional(),
  // Honeypot-поле: реальні користувачі його не бачать і не заповнюють.
  // Навмисно без обмеження довжини — сама перевірка (заповнене чи ні) і
  // тиха відповідь боту живуть у route-хендлері, а не тут; якби це поле
  // валилось на валідації, весь запит впав би з 400 ще до тієї перевірки.
  website: z.string().optional(),
})

export type RequestInput = z.infer<typeof requestSchema>
