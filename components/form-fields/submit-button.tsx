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
    <button
      type="submit"
      disabled={isSubmitting}
      className="rounded-md border border-border p-2 disabled:opacity-50"
    >
      {isSubmitting ? loadingLabel : label}
    </button>
  )
}
