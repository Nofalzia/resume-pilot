import { LandingNav } from '@/components/landing/LandingNav'
import { Hero } from '@/components/landing/Hero'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { FeatureGrid } from '@/components/landing/FeatureGrid'
import { CTABand, LandingFooter } from '@/components/landing/Footer'
import { ScrollReveal } from '@/components/landing/ScrollReveal'
import { LandingSplash } from '@/components/landing/LandingSplash'

/**
 * Landing page — server component at the top level.
 *
 * ScrollReveal (client component) wraps each below-fold section.
 * Hero is always above-fold — no reveal wrapper needed.
 * Server components (HowItWorks, FeatureGrid, etc.) are passed as
 * children to the client ScrollReveal — this is valid in Next.js App Router.
 */
export default function LandingPage() {
  return (
    <>
      <LandingSplash />
      {/* <LandingNav /> */}

      <main id="main-content">
        {/* Above fold — no reveal, just the CSS entry animation on the text column */}
        <Hero />

        {/* Below fold — each section reveals as it enters the viewport */}
        <ScrollReveal>
          <HowItWorks />
        </ScrollReveal>

        <ScrollReveal delay={40}>
          <FeatureGrid />
        </ScrollReveal>

        <ScrollReveal delay={40}>
          <CTABand />
        </ScrollReveal>
      </main>

      <LandingFooter />
    </>
  )
}
