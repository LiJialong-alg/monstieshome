"use client"

import { HeroSection } from "@/components/shared/hero"
import { FeatureCards } from "@/components/shared/feature-cards"
import { TodayHighlight } from "@/components/shared/highlight"
import { HorizontalScroll } from "@/components/shared/horizontal-scroll"
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeatureCards />
      <TodayHighlight />
      <HorizontalScroll />
    </>
  )
}

