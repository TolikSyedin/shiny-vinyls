import Link from 'next/link'
import { Wordmark } from '@/components/ui'
import { DiscLogo } from './disc-logo'

export function BrandLink() {
  return (
    <Link
      href="/"
      className="group flex items-center gap-[10px] hover:no-underline"
    >
      <DiscLogo />
      <Wordmark>Shiny Vinyls</Wordmark>
    </Link>
  )
}
