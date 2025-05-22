"use client"

import type { MotionValue } from "framer-motion"

interface ScrollIndicatorProps {
  progress: MotionValue<number>
}

export default function ScrollIndicator({ progress }: ScrollIndicatorProps) {
  // Component no longer renders the scroll indicator as requested
  return null
}
