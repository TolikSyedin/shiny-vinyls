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
        'inline-block -rotate-[1.5deg] rounded-[2px] bg-[var(--sticker)] px-[11px] py-[6px] font-mono text-[12px] font-medium whitespace-nowrap text-white',
        className,
      )}
    >
      {children}
    </span>
  )
}
