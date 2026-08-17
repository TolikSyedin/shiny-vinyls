import Link from 'next/link'
import { DiscLogo } from './disc-logo'
import './brand-link.css'

export function BrandLink() {
  return (
    <Link href="/" className="brand">
      <DiscLogo/>
      Shiny Vinyls
    </Link>
  )
}
