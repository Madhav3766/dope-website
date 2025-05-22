"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function Navbar() {
  const [logoSrc, setLogoSrc] = useState("/images/logo.png")
  const [logoError, setLogoError] = useState(false)

  // Try different paths for the logo
  useEffect(() => {
    const checkLogo = async (path: string): Promise<boolean> => {
      try {
        const response = await fetch(path, { method: "HEAD" })
        return response.ok
      } catch {
        return false
      }
    }

    const tryLogoPaths = async () => {
      // Only try alternative paths if the initial one failed
      if (logoError) {
        // List of possible paths to try
        const paths = [
          "/logo.png",
          "/public/images/logo.png",
          "/public/logo.png",
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/FinalDopeTM%20logo-0PU4p7hYokx1bFS0I1NX989g1LIg9b.png", // Direct blob URL as last resort
        ]

        for (const path of paths) {
          const exists = await checkLogo(path)
          if (exists) {
            setLogoSrc(path)
            setLogoError(false)
            break
          }
        }
      }
    }

    tryLogoPaths()
  }, [logoError])

  return (
    <motion.nav
      className="absolute top-0 left-0 right-0 z-50 flex justify-between items-center p-4 md:p-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Link href="/" className="z-50">
        <div className="relative h-10 w-24 md:h-12 md:w-32">
          {logoError ? (
            // Fallback to text if all image attempts fail
            <div className="h-full w-full flex items-center justify-center">
              <span className="text-xl md:text-2xl font-bold text-white font-headline">DOPE</span>
            </div>
          ) : (
            <img
              src={logoSrc || "/placeholder.svg"}
              alt="DOPE Logo"
              className="h-full w-auto object-contain"
              onError={() => {
                console.log("Logo failed to load, trying alternatives")
                setLogoError(true)
              }}
            />
          )}
        </div>
      </Link>
    </motion.nav>
  )
}
