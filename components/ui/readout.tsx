import type { ReactNode } from 'react'
import { cx } from '@/lib/utils/cx'

type ReadoutSize = 'lg' | 'xl'

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
    <div className={cx('readout', size === 'xl' && 'readout-xl', className)}>
      {children}
      {unit ? (
        <>
          {' '}
          <small className="mono mono-label text-[var(--muted)]">{unit}</small>
        </>
      ) : null}
    </div>
  )
}
