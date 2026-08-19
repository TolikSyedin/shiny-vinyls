import type { UseFormRegisterReturn } from 'react-hook-form'
import { FieldError } from '@/components/form-fields/field-error'
import {
  FIELD_LABEL_CLASS_NAME,
  INPUT_CLASS_NAME,
} from '@/lib/data/form-fields/form-field-classNames/constants'

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
    <div className="grid gap-[7px]">
      <label htmlFor={id} className={FIELD_LABEL_CLASS_NAME}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        autoComplete={autocomplete}
        className={`${INPUT_CLASS_NAME} ${error ? 'border-red-500' : 'border-[var(--rule)]'}`}
        {...registerProps}
      />
      <FieldError message={error} />
    </div>
  )
}
