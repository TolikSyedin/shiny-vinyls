'use client'

import { useRef, useState } from 'react'
import { MAX_QUANTITY, MIN_QUANTITY, clampQuantity } from '@/lib/pricing'
import { vinylsWord } from '@/lib/utils/plural'
import { Mono, Readout } from '@/components/ui'
import { CounterweightKnobDial } from './counterweight-knob-dial'

// How far the pointer travels sideways for one vinyl. Small enough that the
// knob feels geared to the hand, large enough not to skip on a shaky drag.
const PIXELS_PER_VINYL = 7

function keyboardStep(key: string): number {
  switch (key) {
    case 'ArrowRight':
    case 'ArrowUp':
      return 1
    case 'ArrowLeft':
    case 'ArrowDown':
      return -1
    case 'PageUp':
      return 10
    case 'PageDown':
      return -10
    default:
      return 0
  }
}

export function CounterweightKnob({
  quantity,
  onQuantityChange,
}: {
  quantity: number
  onQuantityChange: (quantity: number) => void
}) {
  const [isDragging, setIsDragging] = useState(false)
  const value = clampQuantity(quantity)

  // Pointer moves arrive faster than React re-renders, so the drag maths reads
  // the committed quantity from a ref instead of the render closure. Both
  // gestures seed it from the current props before they touch it.
  const valueRef = useRef(value)
  const lastXRef = useRef(0)
  // Sideways travel not yet worth a whole vinyl, carried into the next move.
  const remainderRef = useRef(0)

  function commit(next: number) {
    const clamped = clampQuantity(next)
    if (clamped === valueRef.current) return
    valueRef.current = clamped
    onQuantityChange(clamped)
  }

  return (
    <div className="flex items-center gap-[1.5rem]">
      <svg
        className="flex-none cursor-ew-resize touch-pan-y select-none focus-visible:rounded-full focus-visible:outline-[0.1rem_solid_var(--stamp)] focus-visible:-outline-offset-[0.75rem]"
        width="92"
        height="92"
        viewBox="0 0 92 92"
        role="slider"
        tabIndex={0}
        aria-label="Противага — кількість платівок"
        aria-valuemin={MIN_QUANTITY}
        aria-valuemax={MAX_QUANTITY}
        aria-valuenow={value}
        aria-valuetext={`${value} ${vinylsWord(value)}`}
        onPointerDown={(event) => {
          setIsDragging(true)
          valueRef.current = value
          lastXRef.current = event.clientX
          remainderRef.current = 0
          event.currentTarget.setPointerCapture(event.pointerId)
        }}
        onPointerMove={(event) => {
          if (!isDragging) return
          remainderRef.current += event.clientX - lastXRef.current
          lastXRef.current = event.clientX
          const steps = Math.trunc(remainderRef.current / PIXELS_PER_VINYL)
          if (steps === 0) return
          remainderRef.current -= steps * PIXELS_PER_VINYL
          commit(valueRef.current + steps)
        }}
        onPointerUp={() => setIsDragging(false)}
        onPointerCancel={() => setIsDragging(false)}
        onKeyDown={(event) => {
          valueRef.current = value
          if (event.key === 'Home') {
            event.preventDefault()
            commit(MIN_QUANTITY)
            return
          }
          if (event.key === 'End') {
            event.preventDefault()
            commit(MAX_QUANTITY)
            return
          }
          const step = keyboardStep(event.key)
          if (step === 0) return
          event.preventDefault()
          commit(valueRef.current + step)
        }}
      >
        <CounterweightKnobDial value={value} isDragging={isDragging} />
      </svg>

      <div>
        <Readout unit={vinylsWord(value)}>{value}</Readout>
        <Mono className="mt-[0.5rem] block">
          Тягніть противагу вбік або стрілками
        </Mono>
      </div>
    </div>
  )
}
