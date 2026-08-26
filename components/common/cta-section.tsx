import type { ReactNode } from 'react'
import { cx } from '@/lib/utils/cx'
import { Row } from '@/components/ui'

export function CtaSection({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <Row className={cx('mt-8', className)}>{children}</Row>
}
