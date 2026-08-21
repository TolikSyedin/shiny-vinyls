'use client'

import { useState } from 'react'
import { MAX_QUANTITY, MIN_QUANTITY, parseQuantityInput } from '@/lib/pricing'

// The typed half of the quantity control. It shares no state of its own with
// the counterweight — both read the same `quantity` and call the same setter,
// so turning one moves the other.
//
// The field can't be driven straight from `quantity`, though: clamping on every
// keystroke would snap an emptied field back to 1 and make it impossible to
// retype a number. So the raw text is held locally while it is being edited and
// only the values that parse are committed; `null` means "show whatever the
// quantity is", which is how the counterweight's turns reach the field.
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
        // Dropping the draft is what normalises the field: "999" stays legible
        // while it is being typed and becomes 60 the moment focus leaves.
        onBlur={() => setDraft(null)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault()
            setDraft(null)
          }
        }}
        className="w-[6.5rem] text-center tabular-nums"
      />
    </div>
  )
}
