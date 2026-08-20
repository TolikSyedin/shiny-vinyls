// Tariffs for the vinyl cleaning service. The per-vinyl rate drops as the
// batch grows, so the calculator on /how-it-works can act as a price beacon:
// people see the rate change before they ever open the request form.

export const MIN_QUANTITY = 1
export const MAX_QUANTITY = 60

export type PriceTier = {
  minQuantity: number
  pricePerVinyl: number
}

// Ordered high-to-low by minQuantity so the first match is the right one.
export const PRICE_TIERS: PriceTier[] = [
  { minQuantity: 21, pricePerVinyl: 90 },
  { minQuantity: 11, pricePerVinyl: 110 },
  { minQuantity: 1, pricePerVinyl: 130 },
]

export function clampQuantity(quantity: number): number {
  if (!Number.isFinite(quantity)) return MIN_QUANTITY
  return Math.min(MAX_QUANTITY, Math.max(MIN_QUANTITY, Math.round(quantity)))
}

export function pricePerVinyl(quantity: number): number {
  const clamped = clampQuantity(quantity)
  const tier = PRICE_TIERS.find(({ minQuantity }) => clamped >= minQuantity)
  // The last tier starts at MIN_QUANTITY, so a clamped value always matches.
  return tier!.pricePerVinyl
}

// The rate a single vinyl costs — what the home page quotes before anyone has
// said how many they have.
export function basePricePerVinyl(): number {
  return pricePerVinyl(MIN_QUANTITY)
}

export function totalPrice(quantity: number): number {
  const clamped = clampQuantity(quantity)
  return clamped * pricePerVinyl(clamped)
}

export type PriceTierRange = {
  rangeLabel: string
  pricePerVinyl: number
}

// The tariff table the way it is quoted to people: cheapest batch first, each
// row labelled with the span it covers. Derived from PRICE_TIERS so a change to
// the thresholds can never leave the copy saying something else.
export function priceTierRanges(): PriceTierRange[] {
  const ascending = [...PRICE_TIERS].reverse()
  return ascending.map(({ minQuantity, pricePerVinyl }, index) => {
    const above = ascending[index + 1]
    return {
      rangeLabel: above
        ? `${minQuantity}–${above.minQuantity - 1} шт`
        : `від ${minQuantity} шт`,
      pricePerVinyl,
    }
  })
}

// Turnaround shown next to the estimate: bigger batches queue behind the bath,
// so the wait grows in steps rather than per vinyl.
export function turnaroundEstimate(quantity: number): string {
  const clamped = clampQuantity(quantity)
  if (clamped <= 10) return '2–3 робочі дні'
  if (clamped <= 25) return '4–6 робочих днів'
  return 'від тижня, узгоджуємо'
}

export type NextTier = {
  vinylsUntil: number
  pricePerVinyl: number
}

// The cheaper tier immediately above the current quantity, or null once the
// batch is already in the cheapest one.
export function nextTier(quantity: number): NextTier | null {
  const clamped = clampQuantity(quantity)
  const cheaper = PRICE_TIERS.filter(({ minQuantity }) => minQuantity > clamped)
  if (cheaper.length === 0) return null
  // PRICE_TIERS runs high-to-low, so the nearest tier up is the last match.
  const nearest = cheaper[cheaper.length - 1]
  return {
    vinylsUntil: nearest.minQuantity - clamped,
    pricePerVinyl: nearest.pricePerVinyl,
  }
}

// Reads what someone typed into the quantity field. Returns null while the
// text isn't a usable number yet — an empty field, a lone minus — so the
// caller can leave the committed quantity alone instead of snapping it to the
// minimum between two keystrokes.
export function parseQuantityInput(raw: string): number | null {
  const trimmed = raw.trim()
  if (trimmed === '') return null
  const parsed = Number(trimmed)
  if (!Number.isFinite(parsed)) return null
  return clampQuantity(parsed)
}

// Groups thousands with a non-breaking space (uk-UA convention). Done by hand
// rather than via toLocaleString so the server and the client always render
// byte-identical strings and hydration stays quiet.
export function formatHryvnia(value: number): string {
  return String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}
