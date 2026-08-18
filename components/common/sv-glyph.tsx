// The "SV" monogram shared by DiscMark and VinylDisc — same shape at every
// size, so it takes no props. Color comes from the `stroke` set on whatever
// <g> wraps it (SVG inherits stroke down the tree).
export function SvGlyph() {
  return (
    <>
      <line x1="12" y1="2" x2="12" y2="22" />
      <path d="M 7.2 7 L 7.2 10 L 12 10" strokeLinecap="square" />
      <path d="M 2.2 14 L 7.2 14 L 7.2 17" />
      <line x1="17" y1="3.34" x2="17" y2="17" />
    </>
  )
}
