'use client'

import { useState } from 'react'
import { CtaLink, Eyebrow, Lead, PriceTag, Row } from '@/components/ui'
import { basePricePerVinyl } from '@/lib/pricing'
import { VinylDisc } from './vinyl-disc'

export function HeroSection() {
  const [touchCount, setTouchCount] = useState(0)
  const isTouched = touchCount > 0

  return (
    <section className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] items-center gap-[clamp(28px,5vw,56px)] pt-[clamp(44px,7vw,88px)]">
      <div className="grid justify-items-start gap-[22px]">
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
        <Row>
          <CtaLink href="/request">Здати платівки</CtaLink>
          <CtaLink href="/how-it-works" variant="ghost">
            Як це працює
          </CtaLink>
          <PriceTag>{basePricePerVinyl()} ₴ / шт</PriceTag>
        </Row>
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className="flex aspect-square w-[min(72vw,380px)] overflow-hidden">
          <VinylDisc onInteractionStart={() => setTouchCount((n) => n + 1)} />
        </div>
        <Eyebrow
          key={touchCount}
          className="mt-[12px] text-center motion-safe:animate-fade-in"
        >
          Любиш скретчити?{isTouched ? ' Люби і платівки чистити' : ''}
        </Eyebrow>
      </div>
    </section>
  )
}
