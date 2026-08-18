import { ExploreSection } from '@/components/home/explore-section'
import { WhatYouGetSection } from '@/components/home/what-you-get-section'
import { HeroSection } from '@/components/hero/hero-section'

export default function Home() {
  return (
    <main className="mx-auto max-w-[1120px] px-[clamp(16px,4vw,40px)]">
      <HeroSection />
      <WhatYouGetSection />
      <ExploreSection />
    </main>
  )
}
