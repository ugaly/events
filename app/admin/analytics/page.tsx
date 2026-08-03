'use client'

import { AttendanceHeatmap, AreaTrend, BarTrend, DonutChart, LineTrend, RadialGauge } from '@/components/charts'
import { AdminTopbar } from '@/components/admin/topbar'
import { Card } from '@/components/ui/primitives'
import { ChartCard, MetricCard } from '@/components/ui/widgets'
import {
  ADMIN_STATS,
  EVENT_TYPE_BREAKDOWN,
  GROUP_BREAKDOWN,
  HEATMAP,
  HOURLY_ATTENDANCE,
  MONTHLY_EVENTS,
  TOP_EVENTS,
} from '@/lib/data'
import { CalendarDays, Percent, TrendingUp, Users } from 'lucide-react'

export default function AdminAnalyticsPage() {
  return (
    <>
      <AdminTopbar
        title="Analytics"
        subtitle="Platform-wide attendance, growth and event insights"
      />
      <div className="space-y-6 p-4 sm:p-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard
            icon={CalendarDays}
            label="Active Events"
            value={ADMIN_STATS.activeEvents}
            delta={8.2}
            tone="primary"
            index={0}
          />
          <MetricCard
            icon={Users}
            label="Guests tracked"
            value={ADMIN_STATS.guests}
            delta={12.4}
            tone="info"
            index={1}
          />
          <MetricCard
            icon={Percent}
            label="Avg attendance"
            value={ADMIN_STATS.attendance}
            suffix="%"
            delta={4.1}
            index={2}
          />
          <MetricCard
            icon={TrendingUp}
            label="MoM growth"
            value={ADMIN_STATS.growth}
            suffix="%"
            decimals={1}
            tone="warning"
            index={3}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <ChartCard
            title="Monthly events"
            subtitle="Volume over the last 8 months"
            className="lg:col-span-2"
            index={0}
          >
            <AreaTrend data={MONTHLY_EVENTS} x="month" y="events" height={260} />
          </ChartCard>
          <ChartCard title="Attendance rate" subtitle="Platform average" index={1}>
            <RadialGauge value={ADMIN_STATS.attendance} height={240} label="Checked in" />
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ChartCard title="Attendance growth" subtitle="Average check-in %" index={0}>
            <LineTrend data={MONTHLY_EVENTS} x="month" y="attendance" height={240} />
          </ChartCard>
          <ChartCard title="Event types" subtitle="Share of catalog" index={1}>
            <DonutChart data={EVENT_TYPE_BREAKDOWN} height={240} />
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <ChartCard title="Top events by guests" className="lg:col-span-2" index={0}>
            <BarTrend data={TOP_EVENTS} x="name" y="guests" height={240} horizontal />
          </ChartCard>
          <ChartCard title="Guest groups" subtitle="Featured wedding" index={1}>
            <BarTrend data={GROUP_BREAKDOWN} x="group" y="count" height={240} color="var(--info)" />
          </ChartCard>
        </div>

        <ChartCard
          title="Attendance heatmap"
          subtitle="Scans by weekday × hour (last 7 days)"
          index={0}
        >
          <AttendanceHeatmap data={HEATMAP} />
        </ChartCard>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ChartCard title="Hourly arrivals" subtitle="Today across active events" index={0}>
            <AreaTrend data={HOURLY_ATTENDANCE} x="hour" y="scans" height={220} />
          </ChartCard>
          <Card className="flex flex-col justify-center gap-4 p-6">
            <h3 className="text-[15px] font-bold text-foreground">Snapshot</h3>
            <ul className="space-y-3 text-sm">
              {[
                ['Events today', ADMIN_STATS.todayEvents],
                ['Completed events', ADMIN_STATS.completedEvents],
                ['Owners', ADMIN_STATS.owners],
                ['Scanners', ADMIN_STATS.scanners],
                ['Revenue (TZS)', `TZS ${(ADMIN_STATS.revenue / 1000).toFixed(0)}K`],
              ].map(([label, value]) => (
                <li key={String(label)} className="flex items-center justify-between border-b border-border pb-2 last:border-0">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-bold text-foreground">{value}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </>
  )
}
