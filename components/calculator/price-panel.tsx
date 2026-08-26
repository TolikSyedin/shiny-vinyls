import {
  clampQuantity,
  formatHryvnia,
  nextTier,
  pricePerVinyl,
  totalPrice,
  turnaroundEstimate,
} from '@/lib/pricing'
import { vinylsWord } from '@/lib/utils/plural'
import { Card, Eyebrow, Mono, Note, Readout } from '@/components/ui'

export function PricePanel({ quantity }: { quantity: number }) {
  const value = clampQuantity(quantity)
  const perVinyl = pricePerVinyl(value)
  const upcoming = nextTier(value)

  return (
    <Card>
      <div className="flex flex-col gap-4">
        <Eyebrow>Попередня сума</Eyebrow>

        <Readout size="xl">{formatHryvnia(totalPrice(value))} ₴</Readout>

        <Mono>
          {value} {vinylsWord(value)} × {perVinyl} ₴
        </Mono>

        <div className="h-px bg-[var(--rule)]" />

        <Mono>Термін: {turnaroundEstimate(value)}</Mono>

        {upcoming ? (
          <Note>
            Ще{' '}
            <span className="text-[var(--stamp)]">
              {upcoming.vinylsUntil} {vinylsWord(upcoming.vinylsUntil)}
            </span>{' '}
            — і тариф впаде до {upcoming.pricePerVinyl} ₴ за платівку.
          </Note>
        ) : (
          <Note>Це найкращий тариф — {perVinyl} ₴ за платівку.</Note>
        )}
      </div>
    </Card>
  )
}
