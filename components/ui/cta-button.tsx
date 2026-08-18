import Link from 'next/link'
import type { ComponentProps } from 'react'
import './cta-button.css'

type CtaSize = 'default' | 'sm'

function ctaClassName(size: CtaSize, className?: string) {
  return ['cta', size === 'sm' ? 'cta-sm' : '', className]
    .filter(Boolean)
    .join(' ')
}

export function CtaLink({
  size = 'default',
  className,
  ...props
}: { size?: CtaSize } & ComponentProps<typeof Link>) {
  return <Link className={ctaClassName(size, className)} {...props} />
}

export function CtaButton({
  size = 'default',
  className,
  type = 'button',
  ...props
}: { size?: CtaSize } & ComponentProps<'button'>) {
  return (
    <button type={type} className={ctaClassName(size, className)} {...props} />
  )
}
