import type { UseFormRegisterReturn } from 'react-hook-form'
import { FieldError } from '@/components/form-fields/field-error'
import {
  FIELD_LABEL_CLASS_NAME,
  inputClassName,
} from '@/components/form-fields/field-classes'

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
        className={inputClassName(error)}
        {...registerProps}
      />
      <FieldError message={error} />
    </div>
  )
}
