'use client'

import { motion } from 'framer-motion'
import {
  CalendarDays,
  Clock,
  MapPin,
  ScanLine,
  TrendingUp,
  UserCheck,
  UserPlus,
  UserX,
} from 'lucide-react'
import Image from 'next/image'
import { AreaTrend, BarTrend, DonutChart } from '@/components/charts'
import { Countdown } from '@/components/owner/countdown'
import { MobileHeader } from '@/components/owner/mobile-header'
import { Avatar, Card, CountUp, ProgressRing } from '@/components/ui/primitives'
import { ChartCard, SectionHeader } from '@/components/ui/widgets'
import {
  ATTENDANCE_RATE,
  FEATURED_EVENT,
  GATE_DISTRIBUTION,
  GROUP_BREAKDOWN,
  HOURLY_ATTENDANCE,
  RECENT_ACTIVITY,
  STATS,
} from '@/lib/data'

const SUMMARY = [
  { icon: UserPlus, label: 'Invited', value: STATS.invited, tone: 'text-info' },
  { icon: UserCheck, label: 'Attended', value: STATS.attended, tone: 'text-primary' },
  { icon: UserX, label: 'Absent', value: STATS.absent, tone: 'text-destructive' },
  { icon: Clock, label: 'Late', value: STATS.late, tone: 'text-warning' },
  { icon: ScanLine, label: 'Checked In Today', value: STATS.checkedInToday, tone: 'text-primary' },
  { icon: TrendingUp, label: 'Permission Reqs', value: STATS.permissionRequests, tone: 'text-info' },
]

const dateLabel = new Date(FEATURED_EVENT.date).toLocaleDateString('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
})

export default function OwnerHomePage() {
  return (
    <div>
      <MobileHeader subtitle="Welcome back" title="Amina Sauti" />

      <div className="space-y-6 px-5">
        {/* Hero event card */}
        <motion.div
          initial={{ scale: 0.97 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative overflow-hidden rounded-2xl shadow-dialog"
        >
          <Image
            src={FEATURED_EVENT.image || '/placeholder.svg'}
            alt={FEATURED_EVENT.name}
            width={480}
            height={560}
            className="h-64 w-full object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />
          <div className="absolute inset-x-0 bottom-0 p-5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wide text-primary-foreground">
              {FEATURED_EVENT.type}
            </span>
            <h2 className="event-names mt-2.5 text-balance text-3xl leading-tight text-white sm:text-4xl">
              {FEATURED_EVENT.groom} <span className="event-amp text-primary">&amp;</span>{' '}
              {FEATURED_EVENT.bride}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/80">
              <span className="flex items-center gap-1.5">
                <CalendarDays className="size-3.5" /> {dateLabel}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="size-3.5" /> {FEATURED_EVENT.venue}
              </span>
            </div>
            <div className="mt-4">
              <Countdown targetMs={FEATURED_EVENT.targetMs} variant="hero" />
            </div>
          </div>
        </motion.div>

        {/* Attendance ring + rate */}
        <Card className="flex items-center gap-5">
          <ProgressRing value={ATTENDANCE_RATE} label="Attendance" sublabel="of invited" />
          <div className="flex-1 space-y-3">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Current attendance</p>
              <p className="text-2xl font-bold">
                <CountUp value={STATS.attended} /> / {STATS.invited}
              </p>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-elevated">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${ATTENDANCE_RATE}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="h-full rounded-full bg-primary"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="font-bold text-primary">{STATS.checkedInToday}</span> guests checked
              in today
            </p>
          </div>
        </Card>

        {/* Summary grid */}
        <div className="grid grid-cols-2 gap-3">
          {SUMMARY.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ y: 14 }}
              animate={{ y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
            >
              <Card className="transition-colors hover:bg-accent">
                <s.icon className={`size-5 ${s.tone}`} />
                <CountUp value={s.value} className="mt-3 block text-xl font-bold" />
                <p className="text-[12px] font-medium text-muted-foreground">{s.label}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Hourly attendance area chart */}
        <ChartCard title="Hourly arrivals" subtitle="Scans throughout the day">
          <AreaTrend data={HOURLY_ATTENDANCE} x="hour" y="scans" />
        </ChartCard>

        {/* Gate distribution donut */}
        <ChartCard title="Arrivals by gate" subtitle="Where guests are checking in">
          <DonutChart data={GATE_DISTRIBUTION} />
        </ChartCard>

        <ChartCard title="Guest groups" subtitle="Invited by category">
          <BarTrend data={GROUP_BREAKDOWN} x="group" y="count" height={200} />
        </ChartCard>

        {/* Recent activity */}
        <div>
          <SectionHeader title="Recent activity" />
          <Card className="space-y-1 p-2">
            {RECENT_ACTIVITY.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ x: -10 }}
                animate={{ x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-accent"
              >
                <Avatar src={a.avatar} name={a.name} size={38} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{a.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {a.action} · {a.gate}
                  </p>
                </div>
                <span className="text-xs font-semibold text-muted-foreground">{a.time}</span>
              </motion.div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  )
}
