'use client'

import { AreaTrend, AttendanceHeatmap, BarTrend, DonutChart } from '@/components/charts'
import { AdminTopbar } from '@/components/admin/topbar'
import { Avatar, Card } from '@/components/ui/primitives'
import { ChartCard, MetricCard } from '@/components/ui/widgets'
import {
  ADMIN_STATS,
  EVENTS,
  EVENT_TYPE_BREAKDOWN,
  HEATMAP,
  MONTHLY_EVENTS,
  OWNERS,
  SCANNERS,
  TOP_EVENTS,
} from '@/lib/data'
import { motion } from 'framer-motion'
import { CalendarCheck, CircleDollarSign, ScanLine, TrendingUp, Users } from 'lucide-react'
import Link from 'next/link'

const statusTone: Record<string, string> = {
  Active: 'bg-primary/15 text-primary',
  Upcoming: 'bg-info/15 text-info',
  Completed: 'bg-muted-foreground/15 text-muted-foreground',
}

export default function AdminOverview() {
  return (
    <>
      <AdminTopbar title="Overview" subtitle="Platform-wide performance across all events" />
      <div className="space-y-6 p-4 sm:p-8">
        {/* Metrics */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard icon={CalendarCheck} label="Total Events" value={ADMIN_STATS.totalEvents} delta={ADMIN_STATS.growth} tone="primary" index={0} />
          <MetricCard icon={Users} label="Total Guests" value={ADMIN_STATS.guests} delta={12.2} tone="info" index={1} />
          <MetricCard icon={TrendingUp} label="Avg Attendance" value={ADMIN_STATS.attendance} suffix="%" delta={4.1} index={2} />
          <MetricCard icon={CircleDollarSign} label="Revenue" value={ADMIN_STATS.revenue / 1000} prefix="TZS " suffix="K" delta={9.8} tone="warning" index={3} />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <ChartCard title="Events & Attendance" subtitle="Monthly trend" className="lg:col-span-2" index={0}>
            <AreaTrend data={MONTHLY_EVENTS} x="month" y="events" height={240} />
          </ChartCard>
          <ChartCard title="Event Types" subtitle="Distribution" index={1}>
            <DonutChart data={EVENT_TYPE_BREAKDOWN} height={240} />
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <ChartCard title="Top Events by Guests" className="lg:col-span-2" index={0}>
            <BarTrend data={TOP_EVENTS} x="name" y="guests" height={240} horizontal />
          </ChartCard>

          {/* Live stat stack */}
          <div className="space-y-4">
            <MetricCard icon={ScanLine} label="Active Scanners" value={ADMIN_STATS.scanners} tone="primary" index={0} />
            <MetricCard icon={CalendarCheck} label="Events Today" value={ADMIN_STATS.todayEvents} tone="info" index={1} />
          </div>
        </div>

        <ChartCard title="Attendance heatmap" subtitle="Scans by weekday × hour" index={0}>
          <AttendanceHeatmap data={HEATMAP} />
        </ChartCard>

        {/* Recent events table */}
        <Card className="p-0">
          <div className="flex items-center justify-between border-b border-border p-5">
            <h3 className="text-[15px] font-bold text-foreground">Recent Events</h3>
            <Link href="/admin/events" className="text-[13px] font-bold text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="divide-y divide-border">
            {EVENTS.slice(0, 6).map((e, i) => (
              <motion.div
                key={e.id}
                initial={{ x: -8 }}
                animate={{ x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-accent"
              >
                <Avatar src={e.image} name={e.name} size={40} className="rounded-md" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{e.name}</p>
                  <p className="text-xs text-muted-foreground">{e.venue}</p>
                </div>
                <div className="hidden w-40 md:block">
                  <p className="text-xs text-muted-foreground">{e.owner}</p>
                </div>
                <div className="hidden w-24 text-xs text-muted-foreground sm:block">{e.date}</div>
                <div className="w-24 text-right text-sm font-bold text-foreground">
                  {e.guests.toLocaleString()}
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${statusTone[e.status]}`}>
                  {e.status}
                </span>
              </motion.div>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card className="p-0">
            <div className="flex items-center justify-between border-b border-border p-5">
              <h3 className="text-[15px] font-bold text-foreground">Latest owners</h3>
              <Link href="/admin/owners" className="text-[13px] font-bold text-primary hover:underline">
                View all
              </Link>
            </div>
            <div className="divide-y divide-border">
              {OWNERS.slice(0, 4).map((o) => (
                <div key={o.id} className="flex items-center gap-3 px-5 py-3.5">
                  <Avatar src={o.avatar} name={o.name} size={36} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{o.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{o.company}</p>
                  </div>
                  <span className="text-xs font-bold text-muted-foreground">{o.events} events</span>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-0">
            <div className="flex items-center justify-between border-b border-border p-5">
              <h3 className="text-[15px] font-bold text-foreground">Latest scans</h3>
              <Link href="/admin/scanners" className="text-[13px] font-bold text-primary hover:underline">
                View all
              </Link>
            </div>
            <div className="divide-y divide-border">
              {SCANNERS.slice(0, 4).map((s) => (
                <div key={s.id} className="flex items-center gap-3 px-5 py-3.5">
                  <Avatar src={s.avatar} name={s.name} size={36} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{s.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {s.gate} · {s.lastActive}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-primary">{s.scansToday}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}
