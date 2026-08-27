import { ImageResponse } from 'next/og'
import { SITE } from '@/lib/data/site/constants'
import { getBlogArticle } from '@/lib/utils/blog-utils'
import { OG_IMAGE_SIZE, loadOgFonts, VinylDiscGraphic } from '@/lib/seo/og-image'

export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'
export const alt = `${SITE.name} — стаття блогу`

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = getBlogArticle(slug)
  const fonts = await loadOgFonts()

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 56,
          padding: '0 80px',
          background: 'linear-gradient(135deg, #17151a 0%, #261f32 100%)',
        }}
      >
        <VinylDiscGraphic diameter={320} />
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 700 }}
        >
          <div
            style={{
              display: 'flex',
              fontFamily: 'Manrope',
              fontWeight: 500,
              fontSize: 28,
              letterSpacing: 2,
              textTransform: 'uppercase',
              color: '#c9913f',
            }}
          >
            {article?.category ?? SITE.name}
          </div>
          <div
            style={{
              display: 'flex',
              fontFamily: 'Manrope',
              fontWeight: 800,
              fontSize: 56,
              lineHeight: 1.2,
              color: '#f0ece4',
            }}
          >
            {article?.title ?? SITE.name}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  )
}
