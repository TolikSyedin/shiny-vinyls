'use client'

import { useState } from 'react'
import { CtaLink, Eyebrow, Lead, PriceTag, Row } from '@/components/ui'
import { VinylDisc } from './vinyl-disc'

export function HeroSection() {
  const [touchCount, setTouchCount] = useState(0)
  const isTouched = touchCount > 0

  return (
    <section className="flex flex-wrap items-center gap-[clamp(1.75rem,5vw,3.5rem)] pt-[clamp(2.75rem,7vw,5.5rem)]">
      <div className="contents lg:flex lg:min-w-0 lg:grow lg:basis-[20rem] lg:flex-col lg:items-start lg:gap-[1.5rem]">
        <div className="order-1 flex min-w-0 grow basis-[20rem] flex-col items-start gap-[1.5rem]">
          <h1>
            Ваша платівка знову
            <br />
            звучить як вперше
          </h1>
          <Lead>
            Пил у звуковій доріжці стирає голку швидше за саму музику. Одне
            ультразвукове чищення повертає платівці динаміку і первинну глибину
            звуку.
          </Lead>
        </div>

        <div className="order-3 basis-full lg:basis-auto">
          <Row>
            <CtaLink href="/request">Здати платівки</CtaLink>
            <Row>
              <CtaLink href="/how-it-works" variant="ghost">
                Як це працює
              </CtaLink>
              <PriceTag>130 ₴ / шт</PriceTag>
            </Row>
          </Row>
        </div>
      </div>

      <div className="order-2 flex min-w-0 grow basis-[20rem] flex-col items-center justify-center">
        <div className="flex aspect-square w-[min(72vw,23.75rem)] overflow-hidden">
          <VinylDisc onInteractionStart={() => setTouchCount((n) => n + 1)} />
        </div>
        <Eyebrow
          key={touchCount}
          className="mt-[0.75rem] text-center motion-safe:animate-fade-in"
        >
          Любиш скретчити?{isTouched ? ' Люби і платівки чистити' : ''}
        </Eyebrow>
      </div>
    </section>
  )
}
