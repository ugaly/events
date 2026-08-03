'use client'

import { motion } from 'framer-motion'
import { CalendarCheck, Home, ScrollText, User, Users } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const TABS = [
  { href: '/owner', label: 'Home', icon: Home },
  { href: '/owner/attendance', label: 'Attendance', icon: CalendarCheck },
  { href: '/owner/permissions', label: 'Permissions', icon: ScrollText },
  { href: '/owner/guests', label: 'Guests', icon: Users },
  { href: '/owner/profile', label: 'Profile', icon: User },
]

export function OwnerBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-md border-t border-border bg-background/90 backdrop-blur-xl">
      <div className="flex items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)] pt-2">
        {TABS.map((tab) => {
          const active = pathname === tab.href
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="relative flex flex-1 flex-col items-center gap-1 py-1.5"
            >
              <span className="relative grid place-items-center">
                {active && (
                  <motion.span
                    layoutId="owner-nav-dot"
                    className="absolute -inset-x-3 -inset-y-1.5 rounded-full bg-primary/15"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <tab.icon
                  className={cn(
                    'relative size-[22px] transition-colors',
                    active ? 'text-primary' : 'text-muted-foreground',
                  )}
                />
              </span>
              <span
                className={cn(
                  'text-[10px] font-semibold transition-colors',
                  active ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
