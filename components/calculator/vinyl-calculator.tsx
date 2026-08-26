'use client'

import { useState } from 'react'
import { clampQuantity, priceTierRanges } from '@/lib/pricing'
import { Note } from '@/components/ui'
import { Section, SectionHeading } from '@/components/common'
import { CounterweightKnob } from './counterweight-knob'
import { QuantityInput } from './quantity-input'
import { PricePanel } from './price-panel'

const DEFAULT_QUANTITY = 13

export function VinylCalculator({
  initialQuantity = DEFAULT_QUANTITY,
}: {
  initialQuantity?: number
}) {
  const [quantity, setQuantity] = useState(() => clampQuantity(initialQuantity))

  return (
    <Section>
      <SectionHeading eyebrow="Розрахунок">Кількість платівок</SectionHeading>

      <Note>
        Противага показує обсяг замовлення, сума перераховується одразу. Це
        попередній розрахунок — остаточний фіксуємо після огляду.
      </Note>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(17.5rem,1fr))] items-start gap-4">
        <div className="flex flex-col items-start gap-4">
          <CounterweightKnob
            quantity={quantity}
            onQuantityChange={setQuantity}
          />

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
      </div>
    </Section>
  )
}
