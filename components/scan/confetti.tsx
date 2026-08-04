'use client'

import { useMemo, type CSSProperties } from 'react'

const COLORS = ['#1ed760', '#539df5', '#ffa42b', '#f3727f', '#ffffff', '#c4b5fd']

/**
 * Pure CSS confetti — no Framer Motion (opacity animations were stuck on mobile).
 */
export function Confetti({ count = 56 }: { count?: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const left = 4 + ((i * 17) % 92)
        const delay = (i % 12) * 0.05
        const duration = 1.5 + (i % 7) * 0.18
        const drift = ((i % 9) - 4) * 28
        const size = 6 + (i % 5) * 2
        const rounded = i % 3 === 0
        return {
          id: i,
          left,
          delay,
          duration,
          drift,
          size,
          rounded,
          color: COLORS[i % COLORS.length],
          rotate: (i * 47) % 360,
        }
      }),
    [count],
  )

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
      aria-hidden
    >
      {pieces.map((p) => (
        <span
          key={p.id}
          className="scan-confetti-piece absolute top-[-12px]"
          style={
            {
              left: `${p.left}%`,
              width: p.size,
              height: p.rounded ? p.size : p.size * 1.55,
              backgroundColor: p.color,
              borderRadius: p.rounded ? '9999px' : '2px',
              '--confetti-x': `${p.drift}px`,
              '--confetti-rot': `${p.rotate + 540}deg`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}
