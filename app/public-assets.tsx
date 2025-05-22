// Create a new component to preload critical assets
"use client"

import { useEffect } from "react"

export default function PublicAssets() {
  useEffect(() => {
    // Preload critical images
    const imagesToPreload = [
      "/images/logo.png",
      "/images/mascot.png",
      "/images/background.png",
      "/favicon.png",
      "/favicon.ico",
      "/apple-icon.png",
    ]

    // Create a fallback map for direct URLs if public path fails
    const fallbackUrls: Record<string, string> = {
      "/images/logo.png":
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/FinalDopeTM%20logo-0PU4p7hYokx1bFS0I1NX989g1LIg9b.png",
      "/images/mascot.png":
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mascot-dope-7qK3bNLPkqYD6KETodBDLALiMSsdtR.png",
      "/images/background.png":
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/anastase-maragos-HyvE5SiKMUs-unsplash.jpg-xgpe6xD2l7g0jV4cubuJ24O6NZgOwj.jpeg",
      "/favicon.png":
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mascot-dope-7qK3bNLPkqYD6KETodBDLALiMSsdtR.png",
      "/favicon.ico":
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mascot-dope-7qK3bNLPkqYD6KETodBDLALiMSsdtR.png",
      "/apple-icon.png":
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mascot-dope-7qK3bNLPkqYD6KETodBDLALiMSsdtR.png",
    }

    // Function to preload images with fallback
    const preloadImage = (src: string) => {
      const img = new Image()
      img.src = src
      img.onerror = () => {
        console.warn(`Failed to load ${src}, trying fallback`)
        if (fallbackUrls[src]) {
          const fallbackImg = new Image()
          fallbackImg.src = fallbackUrls[src]
        }
      }
    }

    // Preload all images
    imagesToPreload.forEach(preloadImage)

    // Log deployment environment
    console.log("Environment:", process.env.NODE_ENV)
    console.log("Base path:", process.env.NEXT_PUBLIC_BASE_PATH || "/")
  }, [])

  return null
}
