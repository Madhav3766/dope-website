"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useInView } from "framer-motion"

export default function AboutSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const [mascotSrc, setMascotSrc] = useState("/images/mascot.png")
  const [mascotError, setMascotError] = useState(false)

  // Try different paths for mascot
  useEffect(() => {
    const checkImage = async (path: string): Promise<boolean> => {
      try {
        const response = await fetch(path, { method: "HEAD" })
        return response.ok
      } catch {
        return false
      }
    }

    const tryMascotPaths = async () => {
      // Only try alternative paths if the initial one failed
      if (mascotError) {
        // List of possible paths to try
        const paths = [
          "/mascot.png",
          "/public/images/mascot.png",
          "/public/mascot.png",
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mascot-dope-7qK3bNLPkqYD6KETodBDLALiMSsdtR.png", // Direct blob URL as last resort
        ]

        for (const path of paths) {
          const exists = await checkImage(path)
          if (exists) {
            setMascotSrc(path)
            setMascotError(false)
            break
          }
        }
      }
    }

    tryMascotPaths()
  }, [mascotError])

  return (
    <div ref={ref} className="w-full flex items-center justify-center px-4 md:px-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center max-w-6xl mx-auto">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: isInView ? 0 : -50, opacity: isInView ? 1 : 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-4 md:space-y-6 px-4 md:px-0"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-headline">Who are we?</h2>

          <p className="text-lg md:text-xl lg:text-2xl font-bold uppercase tracking-wide font-headline">
            <span className="text-white">BUILT BY</span> <span className="text-red-500">HUSTLERS.</span>
            <br />
            <span className="text-white">FOR THE ONES WHO</span> <span className="text-red-500">DON'T QUIT.</span>
          </p>

          <div className="space-y-3 md:space-y-4">
            <p className="text-base md:text-lg lg:text-xl font-light leading-relaxed tracking-wide">
              Dope Lifestyle is a consumer-first brand — a movement made for performance-obsessed athletes, gym
              warriors, and transformation junkies who demand more from their nutrition. We're here to disrupt the
              ordinary, fuel your grind with premium products, and back your journey with tools, knowledge, and a tribe
              that pushes limits.
            </p>

            <p className="text-base md:text-lg lg:text-xl font-bold text-red-500">DOPE FUEL FOR A DOPE LIFE.</p>

            <p className="text-base md:text-lg lg:text-xl italic">The rest? You'll have to experience it.</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: isInView ? 0 : 50, opacity: isInView ? 1 : 0 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center mt-6 md:mt-0"
        >
          <div className="relative w-40 h-40 md:w-56 md:h-56 lg:w-64 lg:h-64">
            {/* Red glow effect behind the mascot */}
            <div className="absolute inset-0 bg-red-500 bg-opacity-20 rounded-full filter blur-3xl mix-blend-overlay -z-10"></div>

            <motion.div
              animate={{
                y: [0, -15, 0],
                rotate: [0, 3, 0, -3, 0],
              }}
              transition={{
                y: {
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  ease: "easeInOut",
                },
                rotate: {
                  duration: 5,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  ease: "easeInOut",
                },
              }}
              className="relative w-full h-full z-10"
            >
              {mascotError ? (
                // Fallback to a simple circle if all image attempts fail
                <div className="h-full w-full rounded-full bg-red-500 flex items-center justify-center">
                  <span className="text-3xl md:text-5xl font-bold text-white font-headline">D</span>
                </div>
              ) : (
                <img
                  src={mascotSrc || "/placeholder.svg"}
                  alt="DOPE Mascot"
                  className="w-full h-full object-contain drop-shadow-lg"
                  onError={() => {
                    console.log("Mascot failed to load, trying alternatives")
                    setMascotError(true)
                  }}
                />
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
