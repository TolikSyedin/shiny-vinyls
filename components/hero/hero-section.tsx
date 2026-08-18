'use client'

import { useState } from 'react'
import { CtaLink } from '@/components/ui'
import { VinylDisc } from './vinyl-disc'

export function HeroSection() {
  const [isTouched, setIsTouched] = useState(false)

  return (
    <section className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] items-center gap-[clamp(28px,5vw,56px)] pt-[clamp(44px,7vw,88px)]">
      <div className="grid justify-items-start gap-[22px]">
        <h1>
          Ваша платівка знову
          <br />
          звучить як вперше
        </h1>
        <p className="m-0 max-w-[52ch] text-[clamp(1rem,1.5vw,1.12rem)] leading-[1.6]">
          Пил у звуковій доріжці стирає голку швидше за саму музику. Одне
          ультразвукове чищення повертає платівці динаміку і первинну глибину
          звуку.
        </p>
        <div className="flex flex-wrap items-center gap-[14px]">
          <CtaLink href="/request">Здати платівки</CtaLink>
          <CtaLink href="/how-it-works" variant="ghost">
            Як це працює
          </CtaLink>
          <span className="inline-block -rotate-[1.5deg] rounded-[2px] bg-[var(--sticker)] px-[11px] py-[6px] font-[family-name:var(--f-mono)] text-[12px] font-medium whitespace-nowrap text-white">
            130 ₴ / шт
          </span>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className="flex aspect-square w-[min(72vw,380px)] overflow-hidden">
          <VinylDisc onInteractionStart={() => setIsTouched(true)} />
        </div>
        <p
          key={isTouched ? 'touched' : 'default'}
          className="mt-[12px] text-center font-[family-name:var(--f-mono)] text-[10px] tracking-[0.14em] text-[var(--muted)] uppercase motion-safe:animate-fade-in"
        >
          Любиш скретчити? {isTouched ? 'Люби і платівки чистити' : ''}
        </p>
      </div>
    </section>
  )
}
