import { PageContainer } from '@/components/layout'
import { ExploreSection } from '@/components/home/explore-section'
import { WhatYouGetSection } from '@/components/home/what-you-get-section'
import { HeroSection } from '@/components/hero/hero-section'

export default function Home() {
  return (
    <PageContainer>
      <HeroSection />
      <WhatYouGetSection />
      <ExploreSection />
    </PageContainer>
  )
}
