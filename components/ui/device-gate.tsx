'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Monitor, Smartphone } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState, type ReactNode } from 'react'

type Mode = 'mobile-only' | 'desktop-only'

/**
 * Gates pages by viewport width.
 * - mobile-only: event invite + scanner (phones)
 * - desktop-only: super admin console
 */
export function DeviceGate({
  mode,
  children,
  title,
  description,
}: {
  mode: Mode
  children: ReactNode
  title: string
  description: string
}) {
  const [wide, setWide] = useState<boolean | null>(null)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const sync = () => setWide(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  // Avoid flash: wait one paint for media query
  if (wide === null) {
    return <div className="min-h-dvh bg-background" />
  }

  const blocked = mode === 'mobile-only' ? wide : !wide
  if (!blocked) return <>{children}</>

  const Icon = mode === 'mobile-only' ? Smartphone : Monitor

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-background px-6 py-12">
      <motion.div
        initial={{ y: 16 }}
        animate={{ y: 0 }}
        className="w-full max-w-md text-center"
      >
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-primary/15 text-primary">
          <Icon className="size-8" />
        </span>
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-balance">{title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground text-pretty">
          {description}
        </p>

        <div className="mt-8 rounded-xl bg-card p-4 text-left shadow-card">
          <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
            How to continue
          </p>
          <p className="mt-2 text-sm text-foreground">
            {mode === 'mobile-only'
              ? 'Open this link on your phone, or shrink the browser window below desktop width.'
              : 'Open this page on a laptop or desktop computer for the full admin console.'}
          </p>
        </div>

        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to home
        </Link>
      </motion.div>
    </main>
  )
}
