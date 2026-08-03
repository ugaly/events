'use client'

import { motion } from 'framer-motion'
import {
  Bell,
  ChevronRight,
  CircleHelp,
  LogOut,
  Settings,
  Shield,
  Sparkles,
  Ticket,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { MobileHeader } from '@/components/owner/mobile-header'
import { Avatar, Card, CountUp } from '@/components/ui/primitives'
import { toast } from '@/components/ui/toaster'
import { avatarFor, STATS } from '@/lib/data'

const MENU = [
  { icon: Settings, label: 'Account settings' },
  { icon: Bell, label: 'Notifications' },
  { icon: Shield, label: 'Privacy & security' },
  { icon: Ticket, label: 'My events' },
  { icon: CircleHelp, label: 'Help & support' },
]

export default function ProfilePage() {
  const router = useRouter()

  return (
    <div>
      <MobileHeader subtitle="Your account" title="Profile" showBell={false} />

      <div className="space-y-5 px-5">
        <motion.div
          initial={{ y: 12 }}
          animate={{ y: 0 }}
        >
          <Card className="flex flex-col items-center gap-3 py-6 text-center">
            <Avatar src={avatarFor(0)} name="Amina Sauti" size={88} ring />
            <div>
              <h2 className="text-xl font-bold">Amina Sauti</h2>
              <p className="text-sm text-muted-foreground">Sauti Events Ltd</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-bold text-primary">
              <Sparkles className="size-3.5" /> Event Owner
            </span>
          </Card>
        </motion.div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Events', value: 12 },
            { label: 'Guests', value: STATS.invited },
            { label: 'Attended', value: STATS.attended },
          ].map((s) => (
            <Card key={s.label} className="text-center">
              <CountUp value={s.value} className="block text-lg font-bold text-primary" />
              <p className="text-[11px] font-medium text-muted-foreground">{s.label}</p>
            </Card>
          ))}
        </div>

        <Card className="p-2">
          {MENU.map((m) => (
            <button
              key={m.label}
              onClick={() => toast(m.label, { description: 'Coming soon', variant: 'info' })}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors hover:bg-accent"
            >
              <span className="grid size-9 place-items-center rounded-lg bg-elevated text-foreground">
                <m.icon className="size-[18px]" />
              </span>
              <span className="flex-1 text-sm font-semibold">{m.label}</span>
              <ChevronRight className="size-4 text-muted-foreground" />
            </button>
          ))}
        </Card>

        <button
          onClick={() => {
            toast('Signed out')
            router.push('/')
          }}
          className="btn-uppercase flex w-full items-center justify-center gap-2 rounded-full bg-destructive/15 py-3.5 text-sm font-bold text-destructive transition-colors hover:bg-destructive/25"
        >
          <LogOut className="size-4" /> Sign out
        </button>

        <p className="pb-2 text-center text-xs text-muted-foreground/60">Habari Events · v1.0.0</p>
      </div>
    </div>
  )
}
