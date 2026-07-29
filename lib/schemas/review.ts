import { z } from 'zod'

export const reviewSchema = z.object({
  name: z.string().trim().min(2).max(100),
  rating: z.number().int().min(1).max(5),
  text: z.string().trim().min(5, 'Занадто короткий відгук').max(2000),
  // Honeypot-поле: реальні користувачі його не бачать і не заповнюють.
  // Навмисно без обмеження довжини — сама перевірка (заповнене чи ні) і
  // тиха відповідь боту живуть у route-хендлері, а не тут; якби це поле
  // валилось на валідації, весь запит впав би з 400 ще до тієї перевірки.
  website: z.string().optional(),
})

export type ReviewInput = z.infer<typeof reviewSchema>
