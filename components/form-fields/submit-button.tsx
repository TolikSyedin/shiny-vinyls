import { CtaButton } from '../ui'
import { VinylSpinnerIcon } from '../icons/vinyl-spinner-icon'
import { cx } from '@/lib/utils/cx'

type SubmitButtonProps = {
  isSubmitting: boolean
  label: string
  loadingLabel?: string
  className?: string
}

export function SubmitButton({
  isSubmitting,
  label,
  loadingLabel = 'Надсилаємо...',
  className,
}: SubmitButtonProps) {
  return (
    <CtaButton
      type="submit"
      disabled={isSubmitting}
      aria-busy={isSubmitting}
      className={cx(
        'flex min-h-12 items-center justify-center gap-2 rounded-md border border-border p-2 disabled:opacity-50',
        className,
      )}
    >
      {isSubmitting && <VinylSpinnerIcon />}
      {isSubmitting ? loadingLabel : label}
    </CtaButton>
  )
}
