import type { UseFormRegisterReturn } from 'react-hook-form'
import { FieldError } from '@/components/form-fields/field-error'
import { cx } from '@/lib/utils/cx'

type TextFieldProps = {
  id: string
  label: string
  placeholder?: string
  error?: string
  type?: string
  autocomplete?: string
  className?: string
} & UseFormRegisterReturn

export function TextField({
  id,
  label,
  placeholder,
  error,
  autocomplete,
  type = 'text',
  className,
  ...registerProps
}: TextFieldProps) {
  return (
    <div className={cx('flex flex-col gap-[0.5rem]', className)}>
      <label className={error ? 'text-error' : ''} htmlFor={id}>
        {label}
      </label>
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
