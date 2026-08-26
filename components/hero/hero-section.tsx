'use client'

import { useState } from 'react'
import { CtaSection } from '@/components/common'
import { CtaLink, Eyebrow, PriceTag, Row } from '@/components/ui'
import { basePricePerVinyl } from '@/lib/pricing'
import { VinylDisc } from './vinyl-disc'

export function HeroSection() {
  const [touchCount, setTouchCount] = useState(0)
  const isTouched = touchCount > 0

  return (
    <section className="flex flex-wrap items-center gap-4 pt-8">
      <div className="contents lg:flex lg:min-w-0 lg:grow lg:basis-[20rem] lg:flex-col lg:items-start lg:gap-4">
        <div className="order-1 flex min-w-0 grow basis-[20rem] flex-col items-start gap-4">
          <h1>
            Ваша платівка знову
            <br />
            звучить як вперше
          </h1>
          <p>
            Пил у звуковій доріжці стирає голку швидше за саму музику. Одне
            ультразвукове чищення повертає платівці динаміку і первинну глибину
            звуку.
          </p>
        </div>

        <div className="order-3 basis-full lg:basis-auto">
          <CtaSection>
            <CtaLink href="/request">Здати платівки</CtaLink>
            <Row>
              <CtaLink href="/how-it-works" variant="ghost">
                Як це працює
              </CtaLink>
              <PriceTag>{basePricePerVinyl()} ₴ / шт</PriceTag>
            </Row>
          </CtaSection>
        </div>
      </div>

      <div className="order-2 flex min-w-0 grow basis-[20rem] flex-col items-center justify-center gap-4">
        <div className="flex aspect-square w-[min(72vw,23.75rem)] overflow-hidden">
          <VinylDisc onInteractionStart={() => setTouchCount((n) => n + 1)} />
        </div>
        <Eyebrow
          key={touchCount}
          className="text-center motion-safe:animate-fade-in"
        >
          Любиш скретчити?{isTouched ? ' Люби і платівки чистити' : ''}
        </Eyebrow>
      </div>
    </section>
  )
}
