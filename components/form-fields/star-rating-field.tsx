'use client'

import { useState } from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'
import { FieldError } from '@/components/form-fields/field-error'
import { FIELD_LABEL_CLASS_NAME } from '@/components/form-fields/field-classes'
import { StarIcon } from '@/components/icons'

const STARS = [1, 2, 3, 4, 5] as const

type StarRatingFieldProps = {
  label: string
  value?: number
  error?: string
} & UseFormRegisterReturn

export function StarRatingField({
  label,
  value,
  error,
  name,
  ...registerProps
}: StarRatingFieldProps) {
  const [hovered, setHovered] = useState<number | null>(null)
  const display = hovered ?? value ?? 0

  return (
    <fieldset className="m-0 grid gap-[7px] border-0 p-0">
      <legend className={FIELD_LABEL_CLASS_NAME}>{label}</legend>
      <div className="flex gap-2" onMouseLeave={() => setHovered(null)}>
        {STARS.map((n) => {
          const id = `${name}-${n}`
          const filled = n <= display
          return (
            <label
              key={n}
              htmlFor={id}
              onMouseEnter={() => setHovered(n)}
              className="cursor-pointer rounded-[2px] has-[:focus-visible]:outline-2 has-[:focus-visible]:-outline-offset-2 has-[:focus-visible]:outline-[var(--stamp)]"
            >
              <input
                id={id}
                type="radio"
                value={n}
                name={name}
                className="sr-only"
                {...registerProps}
              />
              <StarIcon
                className={`h-8 w-8 ${filled ? 'text-[var(--stamp)]' : 'text-[var(--rule)]'}`}
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
