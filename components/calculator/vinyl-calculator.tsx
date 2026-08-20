'use client'

import { useState } from 'react'
import { clampQuantity, priceTierRanges } from '@/lib/pricing'
import { Card, Eyebrow, Note } from '@/components/ui'
import { CounterweightKnob } from './counterweight-knob'
import { QuantityInput } from './quantity-input'
import { PricePanel } from './price-panel'

const DEFAULT_QUANTITY = 12

// Owns the quantity and hands it to all three parts. Purely a price beacon:
// the real numbers are entered by hand in the request form, so nothing here is
// submitted anywhere.
export function VinylCalculator({
  initialQuantity = DEFAULT_QUANTITY,
}: {
  initialQuantity?: number
}) {
  const [quantity, setQuantity] = useState(() => clampQuantity(initialQuantity))

  return (
    <Card className="gap-[26px]">
      <header className="grid gap-[8px]">
        <Eyebrow>Розрахунок</Eyebrow>
        <h2>Кількість платівок</h2>
        <Note>
          Противага показує обсяг замовлення, сума перераховується одразу. Це
          попередній розрахунок — остаточний фіксуємо після огляду.
        </Note>
      </header>

      <div className="grid justify-items-start gap-[22px]">
        <CounterweightKnob quantity={quantity} onQuantityChange={setQuantity} />

        <QuantityInput quantity={quantity} onQuantityChange={setQuantity} />

        <Note>
          Кількість можна ввести числом або накрутити противагою — це те саме
          значення. Тариф залежить від обсягу:{' '}
          {priceTierRanges()
            .map(
              ({ rangeLabel, pricePerVinyl }) =>
                `${rangeLabel} — ${pricePerVinyl} ₴`,
            )
            .join(', ')}{' '}
          за платівку.
        </Note>
      </div>

      <PricePanel quantity={quantity} />
    </Card>
  )
}
