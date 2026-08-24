import { LandingNav } from '@/components/landing/LandingNav'
import { Hero } from '@/components/landing/Hero'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { FeatureGrid } from '@/components/landing/FeatureGrid'
import { CTABand, LandingFooter } from '@/components/landing/Footer'

/**
 * Landing page — server component, SSR, fully SEO-optimised.
 * No 'use client' at this level — client interactivity is scoped
 * to HeroCSSScene (pointer tilt) and LandingNav (hover events).
 */
export default function LandingPage() {
  return (
    <>
      <LandingNav />

      <main id="main-content">
        <Hero />
        <HowItWorks />
        <FeatureGrid />
        <CTABand />
      </main>

      <LandingFooter />
    </>
  )
}
