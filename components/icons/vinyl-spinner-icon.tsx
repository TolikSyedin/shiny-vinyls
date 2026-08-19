import { DiscMark, type DiscMarkColors } from '@/components/common'

const colors: DiscMarkColors = {
  body: 'var(--foreground)',
  ring: 'var(--background)',
  ringStroke: 'var(--muted-foreground)',
  glyph: 'var(--foreground)',
}

export function VinylSpinnerIcon() {
  return (
    <DiscMark
      size={28}
      colors={colors}
      className="animate-spin [animation-duration:2s]"
    />
  )
}
