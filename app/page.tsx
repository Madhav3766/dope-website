"use client"

import { useRef } from "react"
import { useScroll } from "framer-motion"
import HeroSection from "@/components/hero-section"
import TextCarousel from "@/components/text-carousel"
import AboutSection from "@/components/about-section"
import FeaturesSection from "@/components/features-section"
import WaitlistSection from "@/components/waitlist-section"
import ScrollIndicator from "@/components/scroll-indicator"

export default function Home() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    container: containerRef,
  })

  return (
    <main className="relative bg-black text-white">
      <div className="w-full flex flex-col">
        {/* Hero Section - Full height */}
        <section id="hero" className="min-h-screen w-full flex items-center justify-center">
          <HeroSection />
        </section>

        {/* About Section - Auto height */}
        <section id="about" className="w-full py-16 md:py-24" data-animate-once="true">
          <AboutSection />
        </section>

        {/* Text Carousel Section */}
        <section id="carousel" className="w-full">
          <TextCarousel
            text="NO FLUFF. JUST RESULTS. WHERE GAINS MEET GOALS. THE DOPE WAY TO TRAIN."
            color="text-red-500"
          />
        </section>

        {/* Features Section - Auto height with consistent spacing */}
        <section id="features" className="w-full py-16 md:py-24" data-animation-disabled="true">
          <FeaturesSection />
        </section>

        {/* Waitlist Section - Auto height with consistent spacing */}
        <section id="waitlist" className="w-full py-16 md:py-24">
          <WaitlistSection />
        </section>
      </div>

      <ScrollIndicator progress={scrollYProgress} />
    </main>
  )
}
