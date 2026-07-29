import type { UseFormRegisterReturn } from 'react-hook-form'
import { FieldError } from '@/components/form-fields/field-error'

type TextFieldProps = {
  id: string
  label: string
  placeholder?: string
  error?: string
} & UseFormRegisterReturn

export function TextField({
  id,
  label,
  placeholder,
  error,
  ...registerProps
}: TextFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        placeholder={placeholder}
        className="rounded-md border border-border bg-background p-2"
        {...registerProps}
      />
      <FieldError message={error} />
    </div>
  )
}
