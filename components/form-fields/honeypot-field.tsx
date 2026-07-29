import type { FieldValues, Path, UseFormRegister } from 'react-hook-form'

type HoneypotFieldProps<T extends FieldValues> = {
  register: UseFormRegister<T>
  name: Path<T>
}

// Off-screen so real (including blind) users never see or reach it, but
// still present in the DOM for bots that don't respect visibility/CSS.
export function HoneypotField<T extends FieldValues>({
  register,
  name,
}: HoneypotFieldProps<T>) {
  return (
    <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
      <label htmlFor={name}>Website</label>
      <input id={name} tabIndex={-1} autoComplete="off" {...register(name)} />
    </div>
  )
}
