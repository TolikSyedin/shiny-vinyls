import Link from 'next/link'
import type { Ref } from 'react'
import { Wordmark } from '@/components/ui'
import { DiscLogo } from './disc-logo'

export function BrandLink({ ref }: { ref?: Ref<HTMLAnchorElement> }) {
  return (
    <Link
      ref={ref}
      href="/"
      className="group flex items-center gap-[0.6rem] hover:no-underline"
    >
      <DiscLogo />
      <Wordmark>Shiny Vinyls</Wordmark>
    </Link>
  )
}
