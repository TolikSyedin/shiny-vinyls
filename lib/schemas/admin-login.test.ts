import { describe, it, expect } from 'vitest'
import { adminLoginSchema } from './admin-login'

describe('adminLoginSchema', () => {
  it('приймає валідні email і пароль', () => {
    const result = adminLoginSchema.safeParse({
      email: 'admin@example.com',
      password: 'supersecret',
    })
    expect(result.success).toBe(true)
  })

  it('відхиляє некоректний email', () => {
    const result = adminLoginSchema.safeParse({
      email: 'not-an-email',
      password: 'supersecret',
    })
    expect(result.success).toBe(false)
  })

  it('відхиляє занадто короткий пароль', () => {
    const result = adminLoginSchema.safeParse({
      email: 'admin@example.com',
      password: '123',
    })
    expect(result.success).toBe(false)
  })

  it('відхиляє відсутні email/пароль', () => {
    const result = adminLoginSchema.safeParse({})
    expect(result.success).toBe(false)
  })

  it('обрізає пробіли навколо email (trim)', () => {
    const result = adminLoginSchema.safeParse({
      email: '  admin@example.com  ',
      password: 'supersecret',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.email).toBe('admin@example.com')
    }
  })
})
