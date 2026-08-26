import type { ReactNode } from 'react'
import { cx } from '@/lib/utils/cx'

export function PriceTag({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={cx(
        'price-tag inline-block -rotate-[1.5deg] rounded-[var(--radius)] bg-[var(--sticker)] px-3 py-1 whitespace-nowrap text-white',
        className,
      )}
    >
      {children}
    </span>
  )
}
