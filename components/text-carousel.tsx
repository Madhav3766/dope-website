"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

interface TextCarouselProps {
  text: string
  speed?: number
  color?: string
}

export default function TextCarousel({
  text = "FUEL THE HUSTLE. OWN THE GRIND. PUSH LIMITS. BREAK BARRIERS.",
  speed = 40,
  color = "text-red-500",
}: TextCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: false, amount: 0.2 })

  // Duplicate the text to create a seamless loop
  const repeatedText = `${text} ${text} ${text}`

  return (
    <div ref={containerRef} className="w-full overflow-hidden py-6 md:py-8 bg-zinc-900 border-y border-zinc-800">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isInView ? 1 : 0 }}
        transition={{ duration: 0.8 }}
        className="relative whitespace-nowrap"
      >
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: "-33.333%" }}
          transition={{
            duration: speed,
            ease: "linear",
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
          }}
          className={`inline-block ${color} text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold font-headline tracking-tight`}
        >
          {repeatedText}
        </motion.div>
      </motion.div>
    </div>
  )
}
