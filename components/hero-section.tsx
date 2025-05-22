"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import { ChevronDown } from "lucide-react"
import Navbar from "@/components/navbar"

export default function HeroSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, margin: "-10% 0px 0px 0px" })
  const [logoSrc, setLogoSrc] = useState("/images/logo.png")
  const [logoError, setLogoError] = useState(false)
  const [bgSrc, setBgSrc] = useState("/images/background.png")
  const [bgError, setBgError] = useState(false)

  // Try different paths for images
  useEffect(() => {
    const checkImage = async (path: string): Promise<boolean> => {
      try {
        const response = await fetch(path, { method: "HEAD" })
        return response.ok
      } catch {
        return false
      }
    }

    const tryImagePaths = async () => {
      // Only try alternative paths if the initial ones failed
      if (logoError) {
        // List of possible paths to try for logo
        const logoPaths = [
          "/logo.png",
          "/public/images/logo.png",
          "/public/logo.png",
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/FinalDopeTM%20logo-0PU4p7hYokx1bFS0I1NX989g1LIg9b.png", // Direct blob URL as last resort
        ]

        for (const path of logoPaths) {
          const exists = await checkImage(path)
          if (exists) {
            setLogoSrc(path)
            setLogoError(false)
            break
          }
        }
      }

      if (bgError) {
        // List of possible paths to try for background
        const bgPaths = [
          "/background.png",
          "/public/images/background.png",
          "/public/background.png",
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/anastase-maragos-HyvE5SiKMUs-unsplash.jpg-xgpe6xD2l7g0jV4cubuJ24O6NZgOwj.jpeg", // Direct blob URL as last resort
        ]

        for (const path of bgPaths) {
          const exists = await checkImage(path)
          if (exists) {
            setBgSrc(path)
            setBgError(false)
            break
          }
        }
      }
    }

    tryImagePaths()
  }, [logoError, bgError])

  return (
    <motion.div
      ref={ref}
      className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: isInView ? 1 : 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background image with darker overlay */}
      <div className="absolute inset-0 z-0">
        <div className="relative w-full h-full">
          {/* Fallback background color */}
          <div className="absolute inset-0 bg-zinc-900"></div>

          {/* Use regular img tag for better compatibility */}
          <img
            src={bgSrc || "/placeholder.svg"}
            alt="Fitness background"
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              objectFit: "cover",
              objectPosition: "center",
              minHeight: "100vh",
            }}
            onError={() => {
              console.log("Background failed to load, trying alternatives")
              setBgError(true)
            }}
          />
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-50 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Left side vertical text - hidden on mobile */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : -20 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="absolute left-6 top-[43%] -translate-y-1/2 z-10 hidden lg:block"
      >
        <div className="flex flex-col items-center">
          <p className="vertical-text text-base md:text-lg tracking-widest uppercase text-red-500 font-semibold font-headline">
            Fuel the hustle
          </p>
        </div>
      </motion.div>

      {/* Right side vertical text - hidden on mobile */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : 20 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="absolute right-6 top-[43%] -translate-y-1/2 z-10 hidden lg:block"
      >
        <div className="flex flex-col items-center">
          <p className="vertical-text text-base md:text-lg tracking-widest uppercase text-red-500 font-semibold font-headline">
            Own the grind
          </p>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="z-10 flex flex-col items-center text-center px-4 md:px-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: isInView ? 1 : 0.8, opacity: isInView ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-sm md:max-w-xl lg:max-w-2xl mb-6 md:mb-8 relative"
        >
          <div className="relative w-full h-40 md:h-60 lg:h-72">
            {logoError ? (
              // Fallback to text if all image attempts fail
              <div className="h-full w-full flex items-center justify-center">
                <span className="text-5xl md:text-7xl lg:text-8xl font-bold text-white font-headline">DOPE</span>
              </div>
            ) : (
              <img
                src={logoSrc || "/placeholder.svg"}
                alt="DOPE Logo"
                className="w-full h-full object-contain"
                onError={() => {
                  console.log("Logo failed to load, trying alternatives")
                  setLogoError(true)
                }}
              />
            )}
          </div>
        </motion.div>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: isInView ? 0 : 20, opacity: isInView ? 1 : 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-xl md:text-3xl lg:text-4xl max-w-2xl text-center uppercase tracking-wider font-headline mt-2 md:mt-4"
        >
          BUILT BY GRIT. BACKED BY SCIENCE.
        </motion.p>
      </div>

      <motion.a
        href="#about"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: isInView ? 0 : 20, opacity: isInView ? 1 : 0 }}
        transition={{
          duration: 0.6,
          delay: 0.6,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          repeatDelay: 0.5,
        }}
        className="absolute bottom-10 z-10 cursor-pointer"
        aria-label="Scroll down"
      >
        <ChevronDown size={32} className="text-red-500" />
      </motion.a>
    </motion.div>
  )
}
