'use client'

import { useMemo, type CSSProperties } from 'react'

const CONFETTI_COLORS = [
  '#1ed760',
  '#539df5',
  '#ffa42b',
  '#f3727f',
  '#ffffff',
  '#c4b5fd',
  '#fbbf24',
  '#34d399',
]

const BALLOON_COLORS = [
  '#1ed760',
  '#539df5',
  '#f472b6',
  '#ffa42b',
  '#a78bfa',
  '#fb7185',
  '#38bdf8',
]

type ConfettiPiece = {
  id: number
  kind: 'rect' | 'circle' | 'ribbon'
  color: string
  size: number
  angle: number
  distance: number
  spin: number
  delay: number
  duration: number
  fall: number
}

type Balloon = {
  id: number
  color: string
  left: number
  size: number
  delay: number
  duration: number
  sway: number
}

/**
 * Center-burst confetti explosion + floating balloons.
 * Pure CSS (no Framer) for reliable mobile playback.
 */
export function Confetti({
  count = 72,
  balloons = 10,
}: {
  count?: number
  balloons?: number
}) {
  const pieces = useMemo<ConfettiPiece[]>(
    () =>
      Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * 360 + (i % 5) * 7
        const distance = 90 + (i % 11) * 28 + (i % 3) * 40
        const kinds: ConfettiPiece['kind'][] = ['rect', 'circle', 'ribbon']
        return {
          id: i,
          kind: kinds[i % 3],
          color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
          size: 5 + (i % 6) * 1.6,
          angle,
          distance,
          spin: 280 + (i % 8) * 90,
          delay: (i % 10) * 0.012,
          duration: 1.55 + (i % 6) * 0.18,
          fall: 180 + (i % 9) * 55,
        }
      }),
    [count],
  )

  const balloonList = useMemo<Balloon[]>(
    () =>
      Array.from({ length: balloons }, (_, i) => ({
        id: i,
        color: BALLOON_COLORS[i % BALLOON_COLORS.length],
        left: 6 + ((i * 11) % 86),
        size: 34 + (i % 4) * 8,
        delay: 0.08 + i * 0.09,
        duration: 3.4 + (i % 4) * 0.45,
        sway: (i % 2 === 0 ? 1 : -1) * (18 + (i % 5) * 6),
      })),
    [balloons],
  )

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden>
      {/* Soft center flash */}
      <span className="scan-burst-flash absolute left-1/2 top-[42%] size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary" />
      <span className="scan-burst-ring absolute left-1/2 top-[42%] size-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary/80" />

      {/* Exploding confetti */}
      {pieces.map((p) => {
        const rad = (p.angle * Math.PI) / 180
        const x = Math.cos(rad) * p.distance
        const y = Math.sin(rad) * p.distance * 0.72 - 20
        const style = {
          '--cx': `${x}px`,
          '--cy': `${y}px`,
          '--fall': `${p.fall}px`,
          '--spin': `${p.spin}deg`,
          animationDelay: `${p.delay}s`,
          animationDuration: `${p.duration}s`,
          width: p.kind === 'ribbon' ? p.size * 0.45 : p.size,
          height: p.kind === 'ribbon' ? p.size * 2.4 : p.kind === 'circle' ? p.size : p.size * 1.45,
          backgroundColor: p.color,
          borderRadius: p.kind === 'circle' ? '9999px' : p.kind === 'ribbon' ? '2px' : '2px',
        } as CSSProperties

        return (
          <span key={p.id} className="scan-confetti-burst absolute left-1/2 top-[42%]" style={style} />
        )
      })}

      {/* Balloons rising */}
      {balloonList.map((b) => (
        <span
          key={`balloon-${b.id}`}
          className="scan-balloon absolute bottom-[-80px]"
          style={
            {
              left: `${b.left}%`,
              width: b.size,
              height: b.size * 1.25,
              animationDelay: `${b.delay}s`,
              animationDuration: `${b.duration}s`,
              '--balloon-sway': `${b.sway}px`,
              '--balloon-color': b.color,
            } as CSSProperties
          }
        >
          <span
            className="absolute inset-0 rounded-[50%_50%_48%_48%] shadow-[inset_-6px_-8px_14px_rgba(0,0,0,0.18)]"
            style={{ background: `radial-gradient(circle at 32% 28%, #fff8 0%, transparent 42%), ${b.color}` }}
          />
          {/* Highlight */}
          <span className="absolute left-[22%] top-[18%] h-[28%] w-[22%] rounded-full bg-white/45 blur-[0.5px]" />
          {/* Knot */}
          <span
            className="absolute bottom-[-6px] left-1/2 size-2.5 -translate-x-1/2 rotate-45"
            style={{ backgroundColor: b.color }}
          />
          {/* String */}
          <span className="absolute left-1/2 top-full h-14 w-px origin-top -translate-x-1/2 bg-white/35" />
        </span>
      ))}
    </div>
  )
}
