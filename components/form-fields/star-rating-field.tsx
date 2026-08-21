'use client'

import { useState, type Ref } from 'react'
import { FieldError } from '@/components/form-fields/field-error'
import { StarIcon } from '@/components/icons'
import { cx } from '@/lib/utils/cx'

const STARS = [1, 2, 3, 4, 5] as const

type StarRatingFieldProps = {
  label: string
  name: string
  value?: number
  error?: string
  onChange: (rating: number) => void
  ref: Ref<HTMLInputElement>
}

export function StarRatingField({
  label,
  name,
  value,
  error,
  onChange,
  ref,
}: StarRatingFieldProps) {
  const [hovered, setHovered] = useState<number | null>(null)
  const display = hovered ?? value ?? 0

  return (
    <fieldset className="flex flex-col items-start gap-[0.5rem] border-0 p-0">
      <legend className={error ? 'text-error' : ''}>{label}</legend>
      <div
        aria-invalid={Boolean(error)}
        className={cx(
          'mt-4 flex rounded-[0.1rem]',
          error ? 'outline-1 outline-[var(--error)]' : '',
        )}
        onMouseLeave={() => setHovered(null)}
      >
        {STARS.map((n) => {
          const id = `${name}-${n}`
          const filled = n <= display
          return (
            <label
              key={n}
              htmlFor={id}
              onMouseEnter={() => setHovered(n)}
              className="cursor-pointer rounded-[0.1rem] has-[:focus-visible]:outline-[0.1rem] has-[:focus-visible]:-outline-offset-2 has-[:focus-visible]:outline-[var(--stamp)]"
            >
              <input
                id={id}
                type="radio"
                name={name}
                checked={value === n}
                onChange={() => onChange(n)}
                ref={n === 1 ? ref : undefined}
                className="sr-only"
              />
              <StarIcon
                className={`h-8 w-8 ${filled ? 'text-[var(--stamp)]' : 'text-[var(--ink)]/25'}`}
              />
              <span className="sr-only">{`Оцінка ${n} з 5`}</span>
            </label>
          )
        })}
      </div>
      <FieldError message={error} />
    </fieldset>
  )
}
