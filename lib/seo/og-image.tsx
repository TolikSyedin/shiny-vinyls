import { readFile } from 'fs/promises'
import { join } from 'path'

export const OG_IMAGE_SIZE = { width: 1200, height: 630 }

export async function loadOgFonts() {
  const [bold, regular] = await Promise.all([
    readFile(join(process.cwd(), 'lib/seo/fonts/manrope-800.ttf')),
    readFile(join(process.cwd(), 'lib/seo/fonts/manrope-500.ttf')),
  ])

  return [
    { name: 'Manrope', data: bold, weight: 800 as const, style: 'normal' as const },
    { name: 'Manrope', data: regular, weight: 500 as const, style: 'normal' as const },
  ]
}

export function VinylDiscGraphic({ diameter }: { diameter: number }) {
  const ringRadii = [
    diameter / 2,
    diameter * 0.39,
    diameter * 0.32,
    diameter * 0.25,
    diameter * 0.19,
  ]
  const labelDiameter = diameter * 0.25

  return (
    <div
      style={{
        position: 'relative',
        width: diameter,
        height: diameter,
        display: 'flex',
        flexShrink: 0,
      }}
    >
      {ringRadii.map((r, i) => (
        <div
          key={r}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: r * 2,
            height: r * 2,
            marginTop: -r,
            marginLeft: -r,
            borderRadius: '50%',
            background: i === 0 ? '#2a2730' : 'transparent',
            border: i === 0 ? 'none' : '1.5px solid rgba(240,236,228,0.12)',
            display: 'flex',
          }}
        />
      ))}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: labelDiameter,
          height: labelDiameter,
          marginTop: -labelDiameter / 2,
          marginLeft: -labelDiameter / 2,
          borderRadius: '50%',
          background: '#f0ece4',
          border: '2px solid #6b6660',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: labelDiameter * 0.13,
            height: labelDiameter * 0.13,
            borderRadius: '50%',
            background: '#c9913f',
            display: 'flex',
          }}
        />
      </div>
    </div>
  )
}
