'use client'

import { useState } from 'react'
import { clampQuantity, priceTierRanges } from '@/lib/pricing'
import { Note } from '@/components/ui'
import { Section, SectionHeading } from '@/components/common'
import { CounterweightKnob } from './counterweight-knob'
import { QuantityInput } from './quantity-input'
import { PricePanel } from './price-panel'

const DEFAULT_QUANTITY = 13

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
    <Section>
      <div className="grid gap-[1.5rem]">
        <SectionHeading eyebrow="Розрахунок">Кількість платівок</SectionHeading>

        <Note className="max-w-none">
          Противага показує обсяг замовлення, сума перераховується одразу. Це
          попередній розрахунок — остаточний фіксуємо після огляду.
        </Note>

        <div className="grid gap-[1.5rem] lg:grid-cols-2 lg:items-start">
          <div className="grid justify-items-start gap-[1.25rem]">
            <CounterweightKnob
              quantity={quantity}
              onQuantityChange={setQuantity}
            />

            <QuantityInput quantity={quantity} onQuantityChange={setQuantity} />
          </div>

          <PricePanel quantity={quantity} />
        </div>

        <Note className="max-w-none">
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
    </Section>
  )
}
