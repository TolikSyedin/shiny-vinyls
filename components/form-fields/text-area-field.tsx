import type { UseFormRegisterReturn } from 'react-hook-form'
import { FieldError } from '@/components/form-fields/field-error'
import {
  FIELD_LABEL_CLASS_NAME,
  inputClassName,
} from '@/components/form-fields/field-classes'

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
    <div className="grid gap-[7px]">
      <label htmlFor={id} className={FIELD_LABEL_CLASS_NAME}>
        {label}
      </label>
      <textarea
        id={id}
        placeholder={placeholder}
        className={`min-h-[104px] resize-y ${inputClassName(error)}`}
        {...registerProps}
      />
      <FieldError message={error} />
    </div>
  )
}
