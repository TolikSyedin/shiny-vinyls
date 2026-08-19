import { DiscMark } from '@/components/common'

const colors = {
  body: 'var(--disc)',
  ring: 'var(--surface)',
  ringStroke: 'var(--muted)',
  glyph: 'var(--stamp)',
}

export function DiscLogo({ size = 48 }: { size?: number }) {
  return (
    <DiscMark
      size={size}
      colors={colors}
      className="flex-none group-hover:animate-disc-spin"
    />
  )
}
