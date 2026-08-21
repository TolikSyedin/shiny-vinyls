import type { ReactNode } from 'react'
import { cx } from '@/lib/utils/cx'

type CardGridCols = 2 | 3 | 4

const COLS: Record<CardGridCols, string> = {
  2: 'grid-cols-[repeat(auto-fit,minmax(18.75rem,1fr))]',
  3: 'grid-cols-[repeat(auto-fit,minmax(15.75rem,1fr))]',
  4: 'grid-cols-[repeat(auto-fit,minmax(12.5rem,1fr))]',
}

export function CardGrid({
  cols = 3,
  children,
  className,
}: {
  cols?: CardGridCols
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cx(
        'grid gap-[clamp(0.75rem,2vw,1.5rem)]',
        COLS[cols],
        className,
      )}
    >
      {children}
    </div>
  )
}
