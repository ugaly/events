'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Heart, Images, ScanLine, ShieldCheck, Smartphone, Sparkles } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useSafeEntrance } from '@/components/ui/motion-provider'

const ROLES = [
  {
    href: '/event/1001',
    icon: Heart,
    title: 'Public Event',
    desc: 'Guest invitation page — countdown, map, video and wedding details.',
    tag: 'Open event page',
  },
  {
    href: '/event/1001/complete',
    icon: Images,
    title: 'Wedding Recap',
    desc: 'Thank-you hero and Pinterest-style photo & video gallery after the day.',
    tag: 'Completed event',
  },
  {
    href: '/login/owner',
    icon: Smartphone,
    title: 'Event Owner',
    desc: 'Track attendance, guests and permissions from your phone.',
    tag: 'Phone + OTP',
  },
  {
    href: '/login/admin',
    icon: ShieldCheck,
    title: 'Super Admin',
    desc: 'Manage events, owners, scanners, NFC cards and analytics.',
    tag: 'Username + Password',
  },
  {
    href: '/scan/1001',
    icon: ScanLine,
    title: 'Gate Scanner',
    desc: 'Fast one-hand NFC check-in built for the gate.',
    tag: 'Open demo scan',
  },
]

export default function LandingPage() {
  const hero = useSafeEntrance(0, 20)

  return (
    <main className="relative min-h-dvh overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0">
        <Image src="/wedding-hero.png" alt="" fill priority className="object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background to-background" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-dvh max-w-5xl flex-col px-5 py-8 sm:px-8">
        <header className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-full bg-primary text-primary-foreground">
            <Sparkles className="size-5" />
          </span>
          <span className="text-lg font-bold tracking-tight">Habari Events</span>
        </header>

        <div className="flex flex-1 flex-col justify-center py-12">
          <motion.div {...hero} className="motion-safe-appear max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-elevated px-3 py-1 text-xs font-semibold text-muted-foreground">
              <span className="size-1.5 rounded-full bg-primary" />
              Real-time attendance for every gathering
            </span>
            <h1 className="mt-5 text-balance text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
              The premium way to run
              <span className="text-primary"> events &amp; attendance</span>
            </h1>
            <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground">
              From weddings to conferences — NFC check-in, live dashboards, guest
              management and analytics in one immersive platform. Choose how you want to
              sign in.
            </p>
          </motion.div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ROLES.map((role, i) => (
              <RoleCard key={role.title} role={role} index={i} />
            ))}
          </div>
        </div>

        <footer className="text-xs text-muted-foreground/70">
          Demo build — frontend only. Owner OTP <span className="text-muted-foreground">123456</span>,
          Admin <span className="text-muted-foreground">admin / admin123</span>.
        </footer>
      </div>
    </main>
  )
}

function RoleCard({
  role,
  index,
}: {
  role: (typeof ROLES)[number]
  index: number
}) {
  const anim = useSafeEntrance(0.12 + index * 0.06, 16)
  return (
    <motion.div {...anim} className="motion-safe-appear">
      <Link
        href={role.href}
        className="group flex h-full flex-col rounded-xl bg-card p-5 shadow-card ring-1 ring-transparent transition-all hover:-translate-y-1 hover:bg-accent hover:ring-primary/30"
      >
        <span className="grid size-11 place-items-center rounded-full bg-elevated text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <role.icon className="size-5" />
        </span>
        <h3 className="mt-4 text-base font-bold">{role.title}</h3>
        <p className="mt-1 flex-1 text-[13px] leading-relaxed text-muted-foreground">{role.desc}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-primary">
          {role.tag}
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </Link>
    </motion.div>
  )
}
