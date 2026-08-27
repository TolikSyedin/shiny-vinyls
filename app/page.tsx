import { PageContainer } from '@/components/layout'
import { ExploreSection } from '@/components/home/explore-section'
import { WhatYouGetSection } from '@/components/home/what-you-get-section'
import { HeroSection } from '@/components/hero/hero-section'

export const metadata = {
  description:
    'Пил у звуковій доріжці стирає голку швидше за саму музику. Ультразвукова мийка вінілових платівок у Києві повертає платівці динаміку і первинну глибину звуку.',
  alternates: { canonical: '/' },
}

export default function Home() {
  return (
    <PageContainer>
      <HeroSection />
      <WhatYouGetSection />
      <ExploreSection />
    </PageContainer>
  )
}
