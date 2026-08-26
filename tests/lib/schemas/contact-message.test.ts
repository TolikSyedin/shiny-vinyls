import { describe, it, expect } from 'vitest'
import { contactMessageSchema } from '@/lib/schemas/contact-message'

describe('contactMessageSchema', () => {
  it('приймає валідне повідомлення з телефоном', () => {
    const result = contactMessageSchema.safeParse({
      name: 'Ксенія',
      contact: '+380501234567',
      message: 'Питання щодо чищення платівок',
    })
    expect(result.success).toBe(true)
  })

  it('приймає валідне повідомлення з Telegram-нікнеймом (з @)', () => {
    const result = contactMessageSchema.safeParse({
      name: 'Ксенія',
      contact: '@xeniia_vinyl',
      message: 'Питання щодо чищення платівок',
    })
    expect(result.success).toBe(true)
  })

  it('приймає Telegram-нікнейм без @', () => {
    const result = contactMessageSchema.safeParse({
      name: 'Ксенія',
      contact: 'xeniia_vinyl',
      message: 'Питання щодо чищення платівок',
    })
    expect(result.success).toBe(true)
  })

  it('відхиляє надто короткий Telegram-нікнейм (менше 5 символів)', () => {
    const result = contactMessageSchema.safeParse({
      name: 'Ксенія',
      contact: '@abc',
      message: 'Питання щодо чищення платівок',
    })
    expect(result.success).toBe(false)
  })

  it('відхиляє нікнейм, що починається з цифри', () => {
    const result = contactMessageSchema.safeParse({
      name: 'Ксенія',
      contact: '1xeniia_vinyl',
      message: 'Питання щодо чищення платівок',
    })
    expect(result.success).toBe(false)
  })

  it('відхиляє телефон із недостатньою кількістю цифр', () => {
    const result = contactMessageSchema.safeParse({
      name: 'Ксенія',
      contact: '123',
      message: 'Питання щодо чищення платівок',
    })
    expect(result.success).toBe(false)
  })

  it('відхиляє довільний текст, що не є ні телефоном, ні Telegram-нікнеймом', () => {
    const result = contactMessageSchema.safeParse({
      name: 'Ксенія',
      contact: 'напишіть мені будь ласка',
      message: 'Питання щодо чищення платівок',
    })
    expect(result.success).toBe(false)
  })

  it('приймає телефон із дужками, пробілами й дефісами', () => {
    const result = contactMessageSchema.safeParse({
      name: 'Ксенія',
      contact: '+38 (050) 123-45-67',
      message: 'Питання щодо чищення платівок',
    })
    expect(result.success).toBe(true)
  })

  it('відхиляє занадто коротке повідомлення', () => {
    const result = contactMessageSchema.safeParse({
      name: 'Ксенія',
      contact: '+380501234567',
      message: 'Хай',
    })
    expect(result.success).toBe(false)
  })

  it("відхиляє занадто коротке ім'я", () => {
    const result = contactMessageSchema.safeParse({
      name: 'О',
      contact: '+380501234567',
      message: 'Питання щодо чищення платівок',
    })
    expect(result.success).toBe(false)
  })

  it('обрізає пробіли навколо всіх полів (trim)', () => {
    const result = contactMessageSchema.safeParse({
      name: '  Ксенія  ',
      contact: '  @xeniia_vinyl  ',
      message: '  Питання щодо чищення платівок  ',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.name).toBe('Ксенія')
      expect(result.data.contact).toBe('@xeniia_vinyl')
      expect(result.data.message).toBe('Питання щодо чищення платівок')
    }
  })

  it('тримає honeypot-поле опціональним і порожнім за замовчуванням', () => {
    const result = contactMessageSchema.safeParse({
      name: 'Ксенія',
      contact: '+380501234567',
      message: 'Питання щодо чищення платівок',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.website).toBeUndefined()
    }
  })

  it('схема сама НЕ визначає бот-логіку — заповнене honeypot-поле все ще валідне значення для zod', () => {
    const result = contactMessageSchema.safeParse({
      name: 'Ксенія',
      contact: '+380501234567',
      message: 'Питання щодо чищення платівок',
      website: 'http://spam.example',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.website).toBe('http://spam.example')
    }
  })
})
