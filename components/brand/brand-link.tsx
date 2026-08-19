import Link from 'next/link'
import { DiscLogo } from './disc-logo'

export function BrandLink() {
  return (
    <Link
      href="/"
      className="group flex items-center gap-[10px] font-[family-name:var(--f-display)] text-[13px] font-black tracking-[-0.01em] text-[var(--ink)] uppercase hover:no-underline"
    >
      <DiscLogo />
      Shiny Vinyls
    </Link>
  )
}
