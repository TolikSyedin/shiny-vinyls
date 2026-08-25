'use client'

import { useState } from 'react'
import { MAX_QUANTITY, MIN_QUANTITY, parseQuantityInput } from '@/lib/pricing'

export function QuantityInput({
  quantity,
  onQuantityChange,
}: {
  quantity: number
  onQuantityChange: (quantity: number) => void
}) {
  const [draft, setDraft] = useState<string | null>(null)

  return (
    <div className="flex flex-col items-start gap-[0.5rem]">
      <label htmlFor="vinyl-quantity">Кількість</label>
      <input
        id="vinyl-quantity"
        type="number"
        inputMode="numeric"
        min={MIN_QUANTITY}
        max={MAX_QUANTITY}
        step={1}
        value={draft ?? String(quantity)}
        onChange={(event) => {
          const raw = event.target.value
          setDraft(raw)
          const parsed = parseQuantityInput(raw)
          if (parsed !== null) onQuantityChange(parsed)
        }}
        onBlur={() => setDraft(null)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault()
            setDraft(null)
          }
        }}
        onWheel={(event) => event.currentTarget.blur()}
        className="w-[6.5rem] text-center tabular-nums"
      />
    </div>
  )
}
