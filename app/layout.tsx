import type React from "react"
import type { Metadata } from "next"
import { Inter, Oswald, Poppins } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

// Load Inter font (keeping as fallback)
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

// Load Oswald font for headlines
const oswald = Oswald({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-oswald",
})

// Load Poppins font for body text
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "DOPE - Premium Fitness Supplements",
  description: "Premium fitness supplements for your transformation journey",
  icons: [
    // Updated all icon references to use the mascot image
    { rel: "icon", url: "/images/mascot.png" },
    { rel: "apple-touch-icon", url: "/images/mascot.png" },
    { rel: "shortcut icon", url: "/images/mascot.png" },
  ],
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${oswald.variable} ${poppins.variable}`}>
      <head>
        {/* Explicitly add favicon links in the head for better browser compatibility */}
        <link rel="icon" href="/images/mascot.png" />
        <link rel="apple-touch-icon" href="/images/mascot.png" />
        <link rel="shortcut icon" href="/images/mascot.png" />
      </head>
      <body className="font-sans">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
