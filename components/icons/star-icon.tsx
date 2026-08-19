// No fixed width/height (unlike every other icon here) — this one renders at two
// different sizes (large/interactive in the form, small/read-only in review cards),
// so every call site must set its own h-*/w-* class.
export function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <polygon points="12,2 14.29,8.84 21.51,8.91 15.71,13.21 17.88,20.09 12,15.9 6.12,20.09 8.29,13.21 2.49,8.91 9.71,8.84" />
    </svg>
  )
}
