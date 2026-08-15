import { describe, it, expect } from 'vitest'
import { reviewSchema } from '@/lib/schemas/review'

describe('reviewSchema', () => {
  it('приймає валідний відгук', () => {
    const result = reviewSchema.safeParse({
      name: 'Максим',
      rating: 5,
      text: 'Дуже задоволений, платівки як нові',
    })
    expect(result.success).toBe(true)
  })

  it('відхиляє рейтинг поза межами 1-5', () => {
    expect(
      reviewSchema.safeParse({ name: 'М', rating: 0, text: 'текст текст' })
        .success,
    ).toBe(false)
    expect(
      reviewSchema.safeParse({ name: 'М', rating: 6, text: 'текст текст' })
        .success,
    ).toBe(false)
  })

  it('відхиляє нецілий рейтинг', () => {
    const result = reviewSchema.safeParse({
      name: 'Максим',
      rating: 4.5,
      text: 'текст текст',
    })
    expect(result.success).toBe(false)
  })

  it('відхиляє занадто короткий текст відгуку', () => {
    const result = reviewSchema.safeParse({
      name: 'Максим',
      rating: 5,
      text: 'ок',
    })
    expect(result.success).toBe(false)
  })

  it('схема сама НЕ визначає бот-логіку — заповнене honeypot-поле все ще валідне значення для zod', () => {
    // Важливо: сама схема пропускає будь-яке значення website, включно з
    // непорожнім. Рішення "це бот" ухвалює route-хендлер, а не схема —
    // інакше заповнений honeypot валив би всю валідацію (400) замість
    // тихої відповіді боту.
    const result = reviewSchema.safeParse({
      name: 'Максим',
      rating: 5,
      text: 'Дуже задоволений сервісом',
      website: 'spam',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.website).toBe('spam')
    }
  })
})
