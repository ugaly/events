'use client'

import { motion } from 'framer-motion'
import { useMemo } from 'react'

const COLORS = ['#1ed760', '#539df5', '#ffa42b', '#f3727f', '#ffffff']

export function Confetti({ count = 80 }: { count?: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 420,
        y: 320 + Math.random() * 360,
        rotate: Math.random() * 720 - 360,
        delay: Math.random() * 0.25,
        duration: 1.6 + Math.random() * 1.1,
        color: COLORS[i % COLORS.length],
        size: 6 + Math.random() * 7,
        rounded: Math.random() > 0.5,
      })),
    [count],
  )

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-start justify-center overflow-hidden">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          initial={{ opacity: 1, x: 0, y: -20, rotate: 0 }}
          animate={{ opacity: [1, 1, 0], x: p.x, y: p.y, rotate: p.rotate }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            top: '30%',
            width: p.size,
            height: p.size * (p.rounded ? 1 : 1.6),
            backgroundColor: p.color,
            borderRadius: p.rounded ? '9999px' : '2px',
          }}
        />
      ))}
    </div>
  )
}
