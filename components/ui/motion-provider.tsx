'use client'

import { MotionConfig, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

/**
 * Ensures reduced-motion (common on iOS) jumps to the final state
 * instead of leaving elements stuck on their `initial` styles.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}

/**
 * Mobile-safe entrance: never animates opacity (opacity:0 can stick on
 * some mobile browsers / SSR). Only a short slide — content stays visible.
 */
export function useSafeEntrance(delay = 0, y = 14) {
  const reduce = useReducedMotion()

  if (reduce) {
    return {
      initial: false as const,
      animate: { y: 0 },
      transition: { duration: 0 },
    }
  }

  return {
    initial: { y },
    animate: { y: 0 },
    transition: { duration: 0.45, delay, ease: 'easeOut' as const },
  }
}
