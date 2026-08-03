'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Check, Info, X, AlertTriangle } from 'lucide-react'
import { useSyncExternalStore } from 'react'

type ToastVariant = 'success' | 'error' | 'info' | 'warning'
type Toast = { id: number; title: string; description?: string; variant: ToastVariant }

let toasts: Toast[] = []
let listeners: Array<() => void> = []
let counter = 0

function emit() {
  listeners.forEach((l) => l())
}

export function toast(
  title: string,
  opts: { description?: string; variant?: ToastVariant } = {},
) {
  const id = ++counter
  toasts = [...toasts, { id, title, description: opts.description, variant: opts.variant ?? 'success' }]
  emit()
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id)
    emit()
  }, 3600)
}

function subscribe(cb: () => void) {
  listeners.push(cb)
  return () => {
    listeners = listeners.filter((l) => l !== cb)
  }
}

const ICONS = {
  success: Check,
  error: X,
  info: Info,
  warning: AlertTriangle,
}

const COLORS: Record<ToastVariant, string> = {
  success: 'text-primary',
  error: 'text-destructive',
  info: 'text-info',
  warning: 'text-warning',
}

export function Toaster() {
  const items = useSyncExternalStore(
    subscribe,
    () => toasts,
    () => toasts,
  )

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4 sm:bottom-6">
      <AnimatePresence>
        {items.map((t) => {
          const Icon = ICONS[t.variant]
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg bg-popover px-4 py-3 shadow-dialog"
            >
              <span className={`mt-0.5 ${COLORS[t.variant]}`}>
                <Icon className="size-[18px]" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold leading-tight text-popover-foreground">{t.title}</p>
                {t.description ? (
                  <p className="mt-0.5 text-[13px] leading-snug text-muted-foreground">
                    {t.description}
                  </p>
                ) : null}
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
