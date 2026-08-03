'use client'

import { motion } from 'framer-motion'
import { Search, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CountUp, Pill } from './primitives'

export { Pill }

/* ---------------- Metric Card ---------------- */
export function MetricCard({
  icon: Icon,
  label,
  value,
  suffix,
  prefix,
  decimals,
  delta,
  tone = 'default',
  index = 0,
}: {
  icon: LucideIcon
  label: string
  value: number
  suffix?: string
  prefix?: string
  decimals?: number
  delta?: number
  tone?: 'default' | 'primary' | 'info' | 'warning' | 'destructive'
  index?: number
}) {
  const toneMap = {
    default: 'text-foreground',
    primary: 'text-primary',
    info: 'text-info',
    warning: 'text-warning',
    destructive: 'text-destructive',
  }
  const bgMap = {
    default: 'bg-elevated text-muted-foreground',
    primary: 'bg-primary/15 text-primary',
    info: 'bg-info/15 text-info',
    warning: 'bg-warning/15 text-warning',
    destructive: 'bg-destructive/15 text-destructive',
  }
  return (
    <motion.div
      initial={{ y: 16 }}
      animate={{ y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -3 }}
      className="motion-safe-appear"
    >
      <Card className="transition-colors hover:bg-accent">
        <div className="flex items-start justify-between">
          <span className={cn('grid size-10 place-items-center rounded-lg', bgMap[tone])}>
            <Icon className="size-5" />
          </span>
          {typeof delta === 'number' ? (
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-[11px] font-bold',
                delta >= 0 ? 'bg-primary/15 text-primary' : 'bg-destructive/15 text-destructive',
              )}
            >
              {delta >= 0 ? '+' : ''}
              {delta}%
            </span>
          ) : null}
        </div>
        <div className="mt-4">
          <CountUp
            value={value}
            prefix={prefix}
            suffix={suffix}
            decimals={decimals}
            className={cn('text-2xl font-bold tracking-tight', toneMap[tone])}
          />
          <p className="mt-1 text-[13px] font-medium text-muted-foreground">{label}</p>
        </div>
      </Card>
    </motion.div>
  )
}

/* ---------------- Search Input ---------------- */
export function SearchInput({
  value,
  onChange,
  placeholder = 'Search',
  className,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  className?: string
}) {
  return (
    <div className={cn('relative', className)}>
      <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-full bg-elevated pl-11 pr-4 text-sm text-foreground outline-none ring-inset placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
      />
    </div>
  )
}

/* ---------------- Segmented Control ---------------- */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  className,
}: {
  options: { label: string; value: T }[]
  value: T
  onChange: (v: T) => void
  className?: string
}) {
  return (
    <div className={cn('inline-flex rounded-full bg-elevated p-1', className)}>
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className="relative rounded-full px-4 py-1.5 text-[13px] font-bold transition-colors"
        >
          {value === o.value && (
            <motion.span
              layoutId={`seg-${options.map((x) => x.value).join('')}`}
              className="absolute inset-0 rounded-full bg-primary"
              transition={{ type: 'spring', stiffness: 400, damping: 32 }}
            />
          )}
          <span className={cn('relative z-10', value === o.value ? 'text-primary-foreground' : 'text-muted-foreground')}>
            {o.label}
          </span>
        </button>
      ))}
    </div>
  )
}

/* ---------------- Chart Card ---------------- */
export function ChartCard({
  title,
  subtitle,
  action,
  children,
  className,
  index = 0,
}: {
  title: string
  subtitle?: string
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
  index?: number
}) {
  return (
    <motion.div
      initial={{ y: 16 }}
      animate={{ y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className={cn('motion-safe-appear rounded-lg bg-card p-5 shadow-card', className)}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[15px] font-bold text-foreground">{title}</h3>
          {subtitle ? <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </motion.div>
  )
}

/* ---------------- Section Header ---------------- */
export function SectionHeader({
  title,
  action,
  className,
}: {
  title: string
  action?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('mb-3 flex items-center justify-between', className)}>
      <h2 className="text-lg font-bold tracking-tight text-foreground">{title}</h2>
      {action}
    </div>
  )
}
