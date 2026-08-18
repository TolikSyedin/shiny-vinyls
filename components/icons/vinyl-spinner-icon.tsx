import { DiscMark, type DiscMarkColors } from '@/components/common'

// Adaptive (foreground/background), not brand-fixed colors: this sits on a
// button with no background of its own, so it needs to read against both
// themes — DiscLogo's always-dark --disc would vanish on a dark button.
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
