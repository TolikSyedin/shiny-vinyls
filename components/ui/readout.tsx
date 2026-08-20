import type { ReactNode } from 'react'
import { cx } from '@/lib/cx'

type ReadoutSize = 'lg' | 'xl'

const SIZE: Record<ReadoutSize, string> = {
  lg: 'text-[clamp(1.6rem,4vw,2.2rem)]',
  xl: 'text-[clamp(1.8rem,9vw,2.6rem)]',
}

export function Readout({
  size = 'lg',
  unit,
  children,
  className,
}: {
  size?: ReadoutSize
  unit?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cx(
        'font-display font-black tracking-[-0.03em] tabular-nums',
        'leading-none',
        SIZE[size],
        className,
      )}
    >
      {children}
      {unit ? (
        <>
          {' '}
          <small className="font-mono text-[0.8rem] font-normal tracking-[0.08em] text-[var(--muted)] uppercase">
            {unit}
          </small>
        </>
      ) : null}
    </div>
  )
}
