import type { ReactNode } from 'react'
import { cx } from '@/lib/utils/cx'

type ReadoutSize = 'lg' | 'xl'

const SIZE: Record<ReadoutSize, string> = {
  lg: 'text-[2rem]',
  xl: 'text-[2.5rem]',
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
          <small className="mono font-normal tracking-[0.08em] text-[var(--muted)] uppercase">
            {unit}
          </small>
        </>
      ) : null}
    </div>
  )
}
