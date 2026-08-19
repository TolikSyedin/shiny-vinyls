import { CtaButton } from '../ui'
import { VinylSpinnerIcon } from '../icons/vinyl-spinner-icon'

type SubmitButtonProps = {
  isSubmitting: boolean
  label: string
  loadingLabel?: string
}

export function SubmitButton({
  isSubmitting,
  label,
  loadingLabel = 'Надсилаємо...',
}: SubmitButtonProps) {
  return (
    <CtaButton
      type="submit"
      disabled={isSubmitting}
      aria-busy={isSubmitting}
      className="flex min-h-12 items-center justify-center gap-2 rounded-md border border-border p-2 disabled:opacity-50"
    >
      {isSubmitting && <VinylSpinnerIcon />}
      {isSubmitting ? loadingLabel : label}
    </CtaButton>
  )
}
