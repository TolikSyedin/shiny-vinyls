import type { UseFormRegisterReturn } from 'react-hook-form'
import { FieldError } from '@/components/form-fields/field-error'

type TextFieldProps = {
  id: string
  label: string
  placeholder?: string
  error?: string
  type?: string
  autocomplete?: string
} & UseFormRegisterReturn

export function TextField({
  id,
  label,
  placeholder,
  error,
  autocomplete,
  type = 'text',
  ...registerProps
}: TextFieldProps) {
  return (
    <div className="flex flex-col gap-[7px]">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        autoComplete={autocomplete}
        aria-invalid={Boolean(error)}
        {...registerProps}
      />
      <FieldError message={error} />
    </div>
  )
}
