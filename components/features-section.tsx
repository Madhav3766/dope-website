"use client"

import { useState, useEffect } from "react"
import { FlaskRoundIcon as Flask, Dumbbell, Award, Utensils, Check } from "lucide-react"

export default function FeaturesSection() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Check if the device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkIfMobile()

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  const features = [
    {
      icon: <Flask className="w-5 h-5" />,
      title: "Quality Ingredients",
      description:
        "Only the good stuff. FSSAI, ISO & GMP certified ingredients. Imported high-quality whey. No shortcuts. No BS. We play clean, we play hard — and you get full transparency, every scoop of the way.",
    },
    {
      icon: <Dumbbell className="w-5 h-5" />,
      title: "Transformation Journey",
      description:
        "More than a product shelf — this is your launchpad. Track progress. Crush goals. Join a tribe that doesn't believe in average. You bring the fire. We'll bring the formula.",
    },
    {
      icon: <Award className="w-5 h-5" />,
      title: "Advanced Performance",
      description:
        "Backed by science. Built for beasts. Our formulations are engineered to max out your recovery, gains, and drive — with no fluff. You won't just perform. You'll dominate.",
      bulletPoints: ["Scientifically formulated", "Premium ingredients", "Transparent labeling", "Enhanced recovery"],
      tall: true,
    },
    {
      icon: <Utensils className="w-5 h-5" />,
      title: "Taste-First Design",
      description:
        "Taste buds deserve biceps too. We never settle for chalky, bland, or boring. Delicious? Always. Compromised? Never.",
      wide: true,
    },
  ]

  return (
    <div className="w-full flex items-center justify-center px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto w-full">
        {/* Quality Ingredients card */}
        <div
          className={`relative bg-zinc-900/30 backdrop-blur-sm rounded-xl p-6 md:p-8 flex flex-col 
            ${!isMobile ? "transition-all duration-300 cursor-pointer" : ""} 
            overflow-hidden border border-zinc-800/30 
            ${!isMobile && hoveredCard === 0 ? "shadow-[0_0_15px_rgba(239,68,68,0.15)]" : ""}`}
          onMouseEnter={() => !isMobile && setHoveredCard(0)}
          onMouseLeave={() => !isMobile && setHoveredCard(null)}
          onTouchStart={() => !isMobile && setHoveredCard(0)}
          onTouchEnd={() => !isMobile && setHoveredCard(null)}
        >
          {/* Glow overlay - only on desktop/tablet */}
          {!isMobile && (
            <div
              className={`absolute inset-0 bg-gradient-to-br from-red-500/3 to-transparent transition-opacity duration-300 
              ${hoveredCard === 0 ? "opacity-100" : "opacity-0"}`}
            ></div>
          )}

          {/* Border glow - only on desktop/tablet */}
          {!isMobile && (
            <div
              className={`absolute inset-0 rounded-xl border transition-all duration-300
              ${hoveredCard === 0 ? "border-red-500/20" : "border-transparent"}`}
            ></div>
          )}

          <div
            className={`relative z-10 mb-4 md:mb-6 flex items-center justify-center w-full
            ${!isMobile && hoveredCard === 0 ? "transition-all duration-200 -translate-y-2" : ""}`}
          >
            <div className={!isMobile ? "transition-all duration-300" : ""}>
              <div
                className={`w-10 h-10 ${!isMobile ? "transition-all duration-300" : ""} bg-red-500 flex items-center justify-center rounded-full
                ${!isMobile ? (hoveredCard === 0 ? "opacity-100" : "opacity-30") : "opacity-100"}`}
              >
                {features[0].icon}
              </div>
            </div>
          </div>

          <h3
            className={`relative z-10 text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4 font-headline ${!isMobile ? "transition-all duration-300" : ""} text-center
            ${isMobile || hoveredCard === 0 ? "text-white" : "text-zinc-500"}`}
          >
            {features[0].title}
          </h3>

          <p
            className={`relative z-10 font-body text-sm md:text-base ${!isMobile ? "transition-all duration-300" : ""} text-center
            ${isMobile || hoveredCard === 0 ? "text-zinc-300" : "text-transparent"}`}
          >
            {features[0].description}
          </p>
        </div>

        {/* Transformation Journey card */}
        <div
          className={`relative bg-zinc-900/30 backdrop-blur-sm rounded-xl p-6 md:p-8 flex flex-col 
            ${!isMobile ? "transition-all duration-300 cursor-pointer" : ""} 
            overflow-hidden border border-zinc-800/30 
            ${!isMobile && hoveredCard === 1 ? "shadow-[0_0_15px_rgba(239,68,68,0.15)]" : ""}`}
          onMouseEnter={() => !isMobile && setHoveredCard(1)}
          onMouseLeave={() => !isMobile && setHoveredCard(null)}
          onTouchStart={() => !isMobile && setHoveredCard(1)}
          onTouchEnd={() => !isMobile && setHoveredCard(null)}
        >
          {/* Glow overlay - only on desktop/tablet */}
          {!isMobile && (
            <div
              className={`absolute inset-0 bg-gradient-to-br from-red-500/3 to-transparent transition-opacity duration-300 
              ${hoveredCard === 1 ? "opacity-100" : "opacity-0"}`}
            ></div>
          )}

          {/* Border glow - only on desktop/tablet */}
          {!isMobile && (
            <div
              className={`absolute inset-0 rounded-xl border transition-all duration-300
              ${hoveredCard === 1 ? "border-red-500/20" : "border-transparent"}`}
            ></div>
          )}

          <div
            className={`relative z-10 mb-4 md:mb-6 flex items-center justify-center w-full
            ${!isMobile && hoveredCard === 1 ? "transition-all duration-200 -translate-y-2" : ""}`}
          >
            <div className={!isMobile ? "transition-all duration-300" : ""}>
              <div
                className={`w-10 h-10 ${!isMobile ? "transition-all duration-300" : ""} bg-red-500 flex items-center justify-center rounded-full
                ${!isMobile ? (hoveredCard === 1 ? "opacity-100" : "opacity-30") : "opacity-100"}`}
              >
                {features[1].icon}
              </div>
            </div>
          </div>

          <h3
            className={`relative z-10 text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4 font-headline ${!isMobile ? "transition-all duration-300" : ""} text-center
            ${isMobile || hoveredCard === 1 ? "text-white" : "text-zinc-500"}`}
          >
            {features[1].title}
          </h3>

          <p
            className={`relative z-10 font-body text-sm md:text-base ${!isMobile ? "transition-all duration-300" : ""} text-center
            ${isMobile || hoveredCard === 1 ? "text-zinc-300" : "text-transparent"}`}
          >
            {features[1].description}
          </p>
        </div>

        {/* Advanced Performance card - tall on the right */}
        <div
          className={`relative bg-zinc-900/30 backdrop-blur-sm rounded-xl p-6 md:p-8 flex flex-col md:row-span-2 
            ${!isMobile ? "transition-all duration-300 cursor-pointer" : ""} 
            overflow-hidden border border-zinc-800/30 
            ${!isMobile && hoveredCard === 2 ? "shadow-[0_0_15px_rgba(239,68,68,0.15)]" : ""}`}
          onMouseEnter={() => !isMobile && setHoveredCard(2)}
          onMouseLeave={() => !isMobile && setHoveredCard(null)}
          onTouchStart={() => !isMobile && setHoveredCard(2)}
          onTouchEnd={() => !isMobile && setHoveredCard(null)}
        >
          {/* Glow overlay - only on desktop/tablet */}
          {!isMobile && (
            <div
              className={`absolute inset-0 bg-gradient-to-br from-red-500/3 to-transparent transition-opacity duration-300 
              ${hoveredCard === 2 ? "opacity-100" : "opacity-0"}`}
            ></div>
          )}

          {/* Border glow - only on desktop/tablet */}
          {!isMobile && (
            <div
              className={`absolute inset-0 rounded-xl border transition-all duration-300
              ${hoveredCard === 2 ? "border-red-500/20" : "border-transparent"}`}
            ></div>
          )}

          <div
            className={`relative z-10 mb-4 md:mb-6 flex items-center justify-center w-full
            ${!isMobile && hoveredCard === 2 ? "transition-all duration-200 -translate-y-2" : ""}`}
          >
            <div className={!isMobile ? "transition-all duration-300" : ""}>
              <div
                className={`w-10 h-10 ${!isMobile ? "transition-all duration-300" : ""} bg-red-500 flex items-center justify-center rounded-full
                ${!isMobile ? (hoveredCard === 2 ? "opacity-100" : "opacity-30") : "opacity-100"}`}
              >
                {features[2].icon}
              </div>
            </div>
          </div>

          <h3
            className={`relative z-10 text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4 font-headline ${!isMobile ? "transition-all duration-300" : ""} text-center
            ${isMobile || hoveredCard === 2 ? "text-white" : "text-zinc-500"}`}
          >
            {features[2].title}
          </h3>

          <p
            className={`relative z-10 font-body text-sm md:text-base mb-4 md:mb-6 ${!isMobile ? "transition-all duration-300" : ""} text-center
            ${isMobile || hoveredCard === 2 ? "text-zinc-300" : "text-transparent"}`}
          >
            {features[2].description}
          </p>

          {/* Bullet points */}
          <div
            className={`relative z-10 mt-auto bg-black/50 rounded-lg p-4 border ${!isMobile ? "transition-all duration-300" : ""}
            ${isMobile || hoveredCard === 2 ? "border-zinc-700 opacity-100" : "border-transparent opacity-0"}`}
          >
            {features[2].bulletPoints?.map((point, index) => (
              <div key={index} className="flex items-center space-x-3 mt-2 first:mt-0">
                <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center bg-red-500 rounded-full">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="text-white text-sm md:text-base">{point}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Taste-First Design card - wide at the bottom */}
        <div
          className={`relative bg-zinc-900/30 backdrop-blur-sm rounded-xl p-6 md:p-8 flex flex-col md:col-span-2 
            ${!isMobile ? "transition-all duration-300 cursor-pointer" : ""} 
            overflow-hidden border border-zinc-800/30 
            ${!isMobile && hoveredCard === 3 ? "shadow-[0_0_15px_rgba(239,68,68,0.15)]" : ""}`}
          onMouseEnter={() => !isMobile && setHoveredCard(3)}
          onMouseLeave={() => !isMobile && setHoveredCard(null)}
          onTouchStart={() => !isMobile && setHoveredCard(3)}
          onTouchEnd={() => !isMobile && setHoveredCard(null)}
        >
          {/* Glow overlay - only on desktop/tablet */}
          {!isMobile && (
            <div
              className={`absolute inset-0 bg-gradient-to-br from-red-500/3 to-transparent transition-opacity duration-300 
              ${hoveredCard === 3 ? "opacity-100" : "opacity-0"}`}
            ></div>
          )}

          {/* Border glow - only on desktop/tablet */}
          {!isMobile && (
            <div
              className={`absolute inset-0 rounded-xl border transition-all duration-300
              ${hoveredCard === 3 ? "border-red-500/20" : "border-transparent"}`}
            ></div>
          )}

          <div
            className={`relative z-10 mb-4 md:mb-6 flex items-center justify-center w-full
            ${!isMobile && hoveredCard === 3 ? "transition-all duration-200 -translate-y-2" : ""}`}
          >
            <div className={!isMobile ? "transition-all duration-300" : ""}>
              <div
                className={`w-10 h-10 ${!isMobile ? "transition-all duration-300" : ""} bg-red-500 flex items-center justify-center rounded-full
                ${!isMobile ? (hoveredCard === 3 ? "opacity-100" : "opacity-30") : "opacity-100"}`}
              >
                {features[3].icon}
              </div>
            </div>
          </div>

          <h3
            className={`relative z-10 text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4 font-headline ${!isMobile ? "transition-all duration-300" : ""} text-center
            ${isMobile || hoveredCard === 3 ? "text-white" : "text-zinc-500"}`}
          >
            {features[3].title}
          </h3>

          <p
            className={`relative z-10 font-body text-sm md:text-base ${!isMobile ? "transition-all duration-300" : ""} text-center
            ${isMobile || hoveredCard === 3 ? "text-zinc-300" : "text-transparent"}`}
          >
            {features[3].description}
          </p>
        </div>
      </div>
    </div>
  )
}
