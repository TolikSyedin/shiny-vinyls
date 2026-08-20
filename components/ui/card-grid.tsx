import type { ReactNode } from 'react'
import { cx } from '@/lib/utils/cx'

// Column count is a hint, not a fixed number: each value sets the narrowest a
// column may get before the grid reflows, matching .g2/.g3/.g4 in the brandbook.
type CardGridCols = 2 | 3 | 4

const COLS: Record<CardGridCols, string> = {
  2: 'grid-cols-[repeat(auto-fit,minmax(300px,1fr))]',
  3: 'grid-cols-[repeat(auto-fit,minmax(250px,1fr))]',
  4: 'grid-cols-[repeat(auto-fit,minmax(200px,1fr))]',
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
      className={cx('grid gap-[clamp(14px,2vw,22px)]', COLS[cols], className)}
    >
      {children}
    </div>
  )
}
