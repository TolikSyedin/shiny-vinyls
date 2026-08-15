import { describe, it, expect } from 'vitest'
import { requestSchema } from '@/lib/schemas/request'

describe('requestSchema', () => {
  it('приймає валідну заявку', () => {
    const result = requestSchema.safeParse({
      name: 'Олена',
      phone: '+380501234567',
      comment: '3 платівки, помірний бруд',
    })
    expect(result.success).toBe(true)
  })

  it('приймає заявку без коментаря (optional поле)', () => {
    const result = requestSchema.safeParse({
      name: 'Олена',
      phone: '+380501234567',
    })
    expect(result.success).toBe(true)
  })

  it("відхиляє занадто коротке ім'я", () => {
    const result = requestSchema.safeParse({
      name: 'О',
      phone: '+380501234567',
    })
    expect(result.success).toBe(false)
  })

  it('відхиляє занадто короткий телефон', () => {
    const result = requestSchema.safeParse({
      name: 'Олена',
      phone: '123',
    })
    expect(result.success).toBe(false)
  })

  it("відхиляє відсутнє ім'я/телефон", () => {
    const result = requestSchema.safeParse({})
    expect(result.success).toBe(false)
  })

  it('тримає honeypot-поле опціональним і порожнім за замовчуванням', () => {
    const result = requestSchema.safeParse({
      name: 'Олена',
      phone: '+380501234567',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.website).toBeUndefined()
    }
  })

  it('схема сама НЕ визначає бот-логіку — заповнене honeypot-поле все ще валідне значення для zod', () => {
    // Важливо: сама схема пропускає будь-яке значення website, включно з
    // непорожнім. Рішення "це бот" ухвалює route-хендлер, а не схема —
    // інакше заповнений honeypot валив би всю валідацію (400) замість
    // тихої відповіді боту.
    const result = requestSchema.safeParse({
      name: 'Олена',
      phone: '+380501234567',
      website: 'http://spam.example',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.website).toBe('http://spam.example')
    }
  })

  it('обрізає пробіли навколо імені й телефону (trim)', () => {
    const result = requestSchema.safeParse({
      name: '  Олена  ',
      phone: '  +380501234567  ',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.name).toBe('Олена')
      expect(result.data.phone).toBe('+380501234567')
    }
  })
})
