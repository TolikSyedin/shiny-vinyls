import type { UseFormRegisterReturn } from 'react-hook-form'
import { FieldError } from '@/components/form-fields/field-error'

type TextAreaFieldProps = {
  id: string
  label: string
  placeholder?: string
  error?: string
} & UseFormRegisterReturn

export function TextAreaField({
  id,
  label,
  placeholder,
  error,
  ...registerProps
}: TextAreaFieldProps) {
  return (
    <div className="flex flex-col gap-[7px]">
      <label className={error ? 'text-error' : ''} htmlFor={id}>
        {label}
      </label>
      <textarea
        id={id}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        {...registerProps}
      />
      <FieldError message={error} />
    </div>
  )
}
