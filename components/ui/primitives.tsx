'use client'

import { motion, useInView, useMotionValue, useSpring } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import type { AttendanceStatus, GuestGroup } from '@/lib/types'

/* ---------------- Card ---------------- */
export function Card({ className, children, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('rounded-lg bg-card p-4 shadow-card', className)}
      {...props}
    >
      {children}
    </div>
  )
}

/* ---------------- Pill Button ---------------- */
export function Pill({
  className,
  active,
  children,
  ...props
}: React.ComponentProps<'button'> & { active?: boolean }) {
  return (
    <button
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-bold transition-colors',
        active
          ? 'bg-primary text-primary-foreground'
          : 'bg-elevated text-muted-foreground hover:text-foreground',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

/* ---------------- Status Badge ---------------- */
const STATUS_STYLES: Record<AttendanceStatus, string> = {
  'Checked In': 'bg-primary/15 text-primary',
  Pending: 'bg-muted-foreground/15 text-muted-foreground',
  Absent: 'bg-destructive/15 text-destructive',
  'Permission Requested': 'bg-info/15 text-info',
  Late: 'bg-warning/15 text-warning',
}

export function StatusBadge({ status }: { status: AttendanceStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold',
        STATUS_STYLES[status],
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </span>
  )
}

const GROUP_STYLES: Record<GuestGroup, string> = {
  VIP: 'bg-warning/15 text-warning',
  Family: 'bg-info/15 text-info',
  Friends: 'bg-primary/15 text-primary',
  Corporate: 'bg-popover text-muted-foreground',
  General: 'bg-elevated text-muted-foreground',
}

export function GroupBadge({ group }: { group: GuestGroup }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm px-2 py-0.5 text-[10.5px] font-semibold capitalize',
        GROUP_STYLES[group],
      )}
    >
      {group}
    </span>
  )
}

/* ---------------- Avatar ---------------- */
export function Avatar({
  src,
  name,
  size = 40,
  className,
  ring,
}: {
  src: string
  name: string
  size?: number
  className?: string
  ring?: boolean
}) {
  return (
    <span
      className={cn(
        'relative inline-block shrink-0 overflow-hidden rounded-full bg-elevated',
        ring && 'ring-2 ring-primary ring-offset-2 ring-offset-background',
        className,
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src={src || '/placeholder.svg'}
        alt={name}
        fill
        sizes={`${size}px`}
        className="object-cover"
      />
    </span>
  )
}

/* ---------------- Progress Ring ---------------- */
export function ProgressRing({
  value,
  size = 132,
  stroke = 10,
  label,
  sublabel,
}: {
  value: number
  size?: number
  stroke?: number
  label?: string
  sublabel?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (inView ? value / 100 : 0) * circumference

  return (
    <div ref={ref} className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--elevated)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--primary)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.3, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <CountUp value={value} className="text-2xl font-bold text-foreground" suffix="%" />
        {label ? <span className="text-[11px] font-semibold text-muted-foreground">{label}</span> : null}
        {sublabel ? <span className="text-[10px] text-muted-foreground/70">{sublabel}</span> : null}
      </div>
    </div>
  )
}

/* ---------------- Count Up ---------------- */
export function CountUp({
  value,
  className,
  suffix = '',
  prefix = '',
  decimals = 0,
}: {
  value: number
  className?: string
  suffix?: string
  prefix?: string
  decimals?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const mv = useMotionValue(0)
  const spring = useSpring(mv, { stiffness: 90, damping: 20 })
  const [display, setDisplay] = useState('0')

  useEffect(() => {
    if (inView) mv.set(value)
  }, [inView, value, mv])

  useEffect(() => {
    return spring.on('change', (v) => {
      setDisplay(
        v.toLocaleString('en-US', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }),
      )
    })
  }, [spring, decimals])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  )
}

/* ---------------- Skeleton ---------------- */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-md bg-elevated', className)} />
}
