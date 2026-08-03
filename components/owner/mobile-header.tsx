'use client'

import { motion } from 'framer-motion'
import { Bell } from 'lucide-react'
import { Avatar } from '@/components/ui/primitives'
import { avatarFor } from '@/lib/data'

export function MobileHeader({
  title,
  subtitle,
  showBell = true,
}: {
  title: string
  subtitle?: string
  showBell?: boolean
}) {
  return (
    <motion.header
      initial={{ y: -8 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.35 }}
      className="sticky top-0 z-40 flex items-center justify-between bg-background/85 px-5 py-4 backdrop-blur-xl"
    >
      <div className="flex items-center gap-3">
        <Avatar src={avatarFor(0)} name="Amina Sauti" size={40} ring />
        <div>
          {subtitle ? (
            <p className="text-[11px] font-semibold text-muted-foreground">{subtitle}</p>
          ) : null}
          <h1 className="text-lg font-bold leading-tight tracking-tight">{title}</h1>
        </div>
      </div>
      {showBell ? (
        <button className="relative grid size-10 place-items-center rounded-full bg-elevated text-foreground transition-colors hover:bg-accent">
          <Bell className="size-[18px]" />
          <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-primary ring-2 ring-background" />
        </button>
      ) : null}
    </motion.header>
  )
}
