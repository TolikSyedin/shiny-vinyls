import { ImageResponse } from 'next/og'
import { SITE } from '@/lib/data/site/constants'
import { OG_IMAGE_SIZE, loadOgFonts, VinylDiscGraphic } from '@/lib/seo/og-image'

export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'
export const alt = SITE.name

export default async function Image() {
  const fonts = await loadOgFonts()

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 64,
          padding: '0 80px',
          background: 'linear-gradient(135deg, #17151a 0%, #261f32 100%)',
        }}
      >
        <VinylDiscGraphic diameter={440} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div
            style={{
              display: 'flex',
              fontFamily: 'Manrope',
              fontWeight: 800,
              fontSize: 76,
              color: '#f0ece4',
            }}
          >
            {SITE.name}
          </div>
          <div
            style={{
              display: 'flex',
              fontFamily: 'Manrope',
              fontWeight: 500,
              fontSize: 34,
              color: '#a89fb3',
              maxWidth: 620,
            }}
          >
            {SITE.description}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  )
}
