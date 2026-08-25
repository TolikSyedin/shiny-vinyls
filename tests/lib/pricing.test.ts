import { describe, it, expect } from 'vitest'
import {
  MAX_QUANTITY,
  MIN_QUANTITY,
  basePricePerVinyl,
  clampQuantity,
  formatHryvnia,
  nextTier,
  parseQuantityInput,
  priceTierRanges,
  pricePerVinyl,
  totalPrice,
  turnaroundEstimate,
} from '@/lib/pricing'

describe('clampQuantity', () => {
  it('тримає значення в межах діапазону', () => {
    expect(clampQuantity(0)).toBe(MIN_QUANTITY)
    expect(clampQuantity(-5)).toBe(MIN_QUANTITY)
    expect(clampQuantity(999)).toBe(MAX_QUANTITY)
    expect(clampQuantity(12)).toBe(12)
  })

  it('округлює дробові та відкидає NaN', () => {
    expect(clampQuantity(7.4)).toBe(7)
    expect(clampQuantity(7.6)).toBe(8)
    expect(clampQuantity(Number.NaN)).toBe(MIN_QUANTITY)
  })
})

describe('pricePerVinyl', () => {
  it('до 10 шт — 130 ₴', () => {
    expect(pricePerVinyl(1)).toBe(130)
    expect(pricePerVinyl(10)).toBe(130)
  })

  it('11–20 шт — 110 ₴', () => {
    expect(pricePerVinyl(11)).toBe(110)
    expect(pricePerVinyl(20)).toBe(110)
  })

  it('від 21 шт — 90 ₴', () => {
    expect(pricePerVinyl(21)).toBe(90)
    expect(pricePerVinyl(MAX_QUANTITY)).toBe(90)
  })
})

describe('basePricePerVinyl', () => {
  it('це тариф найменшого обсягу — те, що показує головна', () => {
    expect(basePricePerVinyl()).toBe(130)
  })
})

describe('totalPrice', () => {
  it('множить кількість на тариф відповідного рівня', () => {
    expect(totalPrice(1)).toBe(130)
    expect(totalPrice(10)).toBe(1300)
    expect(totalPrice(11)).toBe(1210)
    expect(totalPrice(20)).toBe(2200)
    expect(totalPrice(21)).toBe(1890)
  })

  it('перехід на 11-ту платівку не робить замовлення дорожчим', () => {
    expect(totalPrice(11)).toBeLessThan(totalPrice(10) + 130)
  })

  it('перехід на 21-шу платівку теж не робить дорожчим', () => {
    expect(totalPrice(21)).toBeLessThan(totalPrice(20) + 110)
  })
})

describe('priceTierRanges', () => {
  it('віддає тарифи від меншого обсягу до більшого з підписами меж', () => {
    expect(priceTierRanges()).toEqual([
      { rangeLabel: '1–10 шт', pricePerVinyl: 130 },
      { rangeLabel: '11–20 шт', pricePerVinyl: 110 },
      { rangeLabel: 'від 21 шт', pricePerVinyl: 90 },
    ])
  })
})

describe('turnaroundEstimate', () => {
  it('зростає сходинками разом з обсягом', () => {
    expect(turnaroundEstimate(1)).toBe('2–3 робочі дні')
    expect(turnaroundEstimate(10)).toBe('2–3 робочі дні')
    expect(turnaroundEstimate(11)).toBe('4–6 робочих днів')
    expect(turnaroundEstimate(25)).toBe('4–6 робочих днів')
    expect(turnaroundEstimate(26)).toBe('від тижня, узгоджуємо')
    expect(turnaroundEstimate(MAX_QUANTITY)).toBe('від тижня, узгоджуємо')
  })
})

describe('nextTier', () => {
  it('показує, скільки платівок лишилось до дешевшого тарифу', () => {
    expect(nextTier(10)).toEqual({ vinylsUntil: 1, pricePerVinyl: 110 })
    expect(nextTier(15)).toEqual({ vinylsUntil: 6, pricePerVinyl: 90 })
  })

  it('повертає null на найдешевшому тарифі', () => {
    expect(nextTier(21)).toBeNull()
    expect(nextTier(MAX_QUANTITY)).toBeNull()
  })
})

describe('parseQuantityInput', () => {
  it('повертає null, поки введене ще не є числом', () => {
    expect(parseQuantityInput('')).toBeNull()
    expect(parseQuantityInput('   ')).toBeNull()
    expect(parseQuantityInput('-')).toBeNull()
    expect(parseQuantityInput('abc')).toBeNull()
  })

  it('затискає введене в межі діапазону', () => {
    expect(parseQuantityInput('0')).toBe(MIN_QUANTITY)
    expect(parseQuantityInput('100')).toBe(MAX_QUANTITY)
    expect(parseQuantityInput('37')).toBe(37)
  })
})

describe('formatHryvnia', () => {
  it('групує тисячі нерозривним пробілом', () => {
    expect(formatHryvnia(130)).toBe('130')
    expect(formatHryvnia(1300)).toBe('1 300')
    expect(formatHryvnia(5400)).toBe('5 400')
  })
})
