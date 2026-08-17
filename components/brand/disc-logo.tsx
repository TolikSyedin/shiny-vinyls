import { DiscMark } from '@/components/common'
import './disc-logo.css'

const colors = {
  body: 'var(--disc)',
  ring: 'var(--surface)',
  ringStroke: 'var(--muted)',
  glyph: 'var(--stamp)',
}

export function DiscLogo({ size = 48 }: { size?: number }) {
  return <DiscMark size={size} colors={colors} className="disc-logo-mark" />
}
