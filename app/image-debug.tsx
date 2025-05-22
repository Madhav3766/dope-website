"use client"

import { useEffect } from "react"

export default function ImageDebug() {
  useEffect(() => {
    // Function to check if an image exists
    const checkImage = async (url: string) => {
      try {
        const response = await fetch(url, { method: "HEAD" })
        console.log(`Image check: ${url} - Status: ${response.status}`)
        return response.ok
      } catch (error) {
        console.error(`Error checking image ${url}:`, error)
        return false
      }
    }

    // Check various image paths to diagnose the issue
    const checkAllImagePaths = async () => {
      const imagePaths = [
        // Absolute URLs
        "https://www.dopelifestyle.in/images/logo.png",
        "https://www.dopelifestyle.in/images/mascot.png",
        "https://www.dopelifestyle.in/images/background.png",

        // Relative URLs
        "/images/logo.png",
        "/images/mascot.png",
        "/images/background.png",

        // Public URLs
        "/public/images/logo.png",
        "/public/images/mascot.png",
        "/public/images/background.png",

        // Root URLs
        "/logo.png",
        "/mascot.png",
        "/background.png",
      ]

      for (const path of imagePaths) {
        await checkImage(path)
      }
    }

    checkAllImagePaths()

    // Log deployment information
    console.log("Domain:", window.location.hostname)
    console.log("Protocol:", window.location.protocol)
    console.log("Path:", window.location.pathname)
    console.log("User Agent:", navigator.userAgent)
  }, [])

  return null
}
