// Add middleware to handle image paths
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Log the requested URL for debugging
  console.log("Middleware processing:", request.nextUrl.pathname)

  // Check if the request is for an image
  if (
    request.nextUrl.pathname.includes(".png") ||
    request.nextUrl.pathname.includes(".jpg") ||
    request.nextUrl.pathname.includes(".jpeg") ||
    request.nextUrl.pathname.includes(".svg") ||
    request.nextUrl.pathname.includes(".ico")
  ) {
    // Log image request
    console.log("Image requested:", request.nextUrl.pathname)

    // If the image is in the /images/ directory but not found, try the fallback URLs
    if (request.nextUrl.pathname.startsWith("/images/")) {
      const imageName = request.nextUrl.pathname.split("/").pop()

      // Map of fallback URLs
      const fallbackMap: Record<string, string> = {
        "logo.png":
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/FinalDopeTM%20logo-0PU4p7hYokx1bFS0I1NX989g1LIg9b.png",
        "mascot.png":
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mascot-dope-7qK3bNLPkqYD6KETodBDLALiMSsdtR.png",
        "background.png":
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/anastase-maragos-HyvE5SiKMUs-unsplash.jpg-xgpe6xD2l7g0jV4cubuJ24O6NZgOwj.jpeg",
      }

      if (imageName && fallbackMap[imageName]) {
        console.log("Redirecting to fallback:", fallbackMap[imageName])
        return NextResponse.redirect(fallbackMap[imageName])
      }
    }
  }

  return NextResponse.next()
}

// Configure the middleware to run only for specific paths
export const config = {
  matcher: ["/images/:path*", "/:path*.png", "/:path*.jpg", "/:path*.jpeg", "/:path*.svg", "/:path*.ico"],
}
