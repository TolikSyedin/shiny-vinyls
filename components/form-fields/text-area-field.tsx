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
    <div className="flex flex-col gap-1">
      <label htmlFor={id}>{label}</label>
      <textarea
        id={id}
        placeholder={placeholder}
        className={`rounded-md border border-border bg-background p-2 ${error ? 'border-red-500' : ''}`}
        {...registerProps}
      />
      <FieldError message={error} />
    </div>
  )
}
