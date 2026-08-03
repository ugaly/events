'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

function diffParts(targetMs: number) {
  const gap = Math.max(0, targetMs - Date.now())
  return {
    days: Math.floor(gap / 86400000),
    hours: Math.floor((gap / 3600000) % 24),
    mins: Math.floor((gap / 60000) % 60),
    secs: Math.floor((gap / 1000) % 60),
  }
}

type Labels = { days: string; hours: string; mins: string; secs: string }

const DEFAULT_LABELS: Labels = {
  days: 'Days',
  hours: 'Hrs',
  mins: 'Min',
  secs: 'Sec',
}

/**
 * Countdown driven by an absolute UTC timestamp (targetMs).
 * Same numbers on every device — no Date.parse / timezone bugs on mobile Safari.
 */
export function Countdown({
  targetMs,
  labels = DEFAULT_LABELS,
  className,
  variant = 'hero',
}: {
  /** Absolute epoch ms, e.g. Date.UTC(2026, 7, 15, 13, 0, 0) for 16:00 EAT */
  targetMs: number
  labels?: Labels
  className?: string
  variant?: 'hero' | 'card'
}) {
  const [parts, setParts] = useState(() => diffParts(targetMs))

  useEffect(() => {
    const tick = () => setParts(diffParts(targetMs))
    tick()
    const id = window.setInterval(tick, 250)
    return () => window.clearInterval(id)
  }, [targetMs])

  const units = [
    { key: 'd', v: parts.days, l: labels.days },
    { key: 'h', v: parts.hours, l: labels.hours },
    { key: 'm', v: parts.mins, l: labels.mins },
    { key: 's', v: parts.secs, l: labels.secs },
  ]

  const isHero = variant === 'hero'

  return (
    <div
      className={cn('grid w-full grid-cols-4 gap-1.5 sm:gap-2', className)}
      role="timer"
      aria-live="polite"
      aria-atomic="true"
    >
      {units.map((u) => (
        <div
          key={u.key}
          className={cn(
            'flex flex-col items-center justify-center rounded-lg px-1 py-2 sm:rounded-xl sm:px-2 sm:py-2.5',
            isHero ? 'bg-black/55 backdrop-blur-sm' : 'bg-elevated',
          )}
        >
          <span
            className={cn(
              'font-mono font-bold leading-none tabular-nums',
              isHero ? 'text-base text-white sm:text-xl' : 'text-xl text-foreground sm:text-2xl',
            )}
          >
            {String(Math.max(0, u.v)).padStart(2, '0')}
          </span>
          <span
            className={cn(
              'mt-1 text-[9px] font-semibold uppercase tracking-wider sm:mt-1.5 sm:text-[10px]',
              isHero ? 'text-white/65' : 'text-muted-foreground',
            )}
          >
            {u.l}
          </span>
        </div>
      ))}
    </div>
  )
}
