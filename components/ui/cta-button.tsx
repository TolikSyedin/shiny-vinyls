import Link from 'next/link'
import type { ComponentProps } from 'react'
import { cx } from '@/lib/utils/cx'

type CtaSize = 'default' | 'sm'
type CtaVariant = 'default' | 'ghost'

const BASE =
  'relative inline-flex cursor-pointer items-center gap-2 overflow-hidden rounded-[0.3rem] text-left font-mono font-medium uppercase transition-[filter_0.2s_ease,transform_0.15s_ease,box-shadow_0.2s_ease]'

const SIZE: Record<CtaSize, string> = {
  default: 'cta px-6 py-4',
  sm: 'cta-sm px-4 py-2',
}

const VARIANT: Record<CtaVariant, string> = {
  // diagonal light sweep (before:) — overlay blend brightens existing tones
  // instead of flattening them, so it reads on both light and dark --btn-bg
  // gradients
  default:
    'border border-[var(--btn-edge)] bg-[image:var(--btn-bg)] text-[var(--ink)] shadow-[var(--btn-shadow)] ' +
    "before:pointer-events-none before:absolute before:inset-0 before:-translate-x-[140%] before:bg-[linear-gradient(115deg,transparent_25%,rgba(255,255,255,0.8)_45%,rgba(255,255,255,0.8)_50%,transparent_70%)] before:mix-blend-overlay before:transition-transform before:duration-[600ms] before:content-[''] " +
    'hover:brightness-[1.08] hover:shadow-[var(--btn-shadow),0_6px_16px_-6px_rgba(0,0,0,0.35)] hover:no-underline hover:before:translate-x-[140%] ' +
    'active:translate-y-px active:brightness-[0.96] active:shadow-[var(--btn-shadow)]',
  ghost:
    'border border-[var(--rule)] bg-transparent text-[var(--ink)] shadow-none before:content-none ' +
    'hover:border-[var(--stamp)] hover:text-[var(--stamp)] hover:no-underline',
}

function ctaClassName(size: CtaSize, variant: CtaVariant, className?: string) {
  return cx(BASE, SIZE[size], VARIANT[variant], className)
}

export function CtaLink({
  size = 'default',
  variant = 'default',
  className,
  ...props
}: { size?: CtaSize; variant?: CtaVariant } & ComponentProps<typeof Link>) {
  return <Link className={ctaClassName(size, variant, className)} {...props} />
}

export function CtaButton({
  size = 'default',
  variant = 'default',
  className,
  type = 'button',
  ...props
}: { size?: CtaSize; variant?: CtaVariant } & ComponentProps<'button'>) {
  return (
    <button
      type={type}
      className={ctaClassName(size, variant, className)}
      {...props}
    />
  )
}
