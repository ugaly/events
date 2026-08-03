'use client'

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const AXIS = { fontSize: 11, fill: 'var(--muted-foreground)' }

function TooltipBox({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg bg-popover px-3 py-2 shadow-dialog">
      {label ? <p className="mb-1 text-[11px] font-bold text-popover-foreground">{label}</p> : null}
      {payload.map((p: any, i: number) => (
        <p key={i} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <span className="size-2 rounded-full" style={{ background: p.color || p.fill }} />
          <span className="font-semibold text-popover-foreground">{p.value?.toLocaleString?.() ?? p.value}</span>
          {p.name}
        </p>
      ))}
    </div>
  )
}

export function AreaTrend({
  data,
  x,
  y,
  height = 200,
}: {
  data: any[]
  x: string
  y: string
  height?: number
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 6, right: 6, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.5} />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey={x} tick={AXIS} tickLine={false} axisLine={false} />
        <YAxis tick={AXIS} tickLine={false} axisLine={false} width={40} />
        <Tooltip content={<TooltipBox />} cursor={{ stroke: 'var(--border)' }} />
        <Area
          type="monotone"
          dataKey={y}
          stroke="var(--primary)"
          strokeWidth={2.5}
          fill="url(#areaFill)"
          animationDuration={1200}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function LineTrend({
  data,
  x,
  y,
  height = 200,
}: {
  data: any[]
  x: string
  y: string
  height?: number
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 6, right: 6, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey={x} tick={AXIS} tickLine={false} axisLine={false} />
        <YAxis tick={AXIS} tickLine={false} axisLine={false} width={40} />
        <Tooltip content={<TooltipBox />} cursor={{ stroke: 'var(--border)' }} />
        <Line
          type="monotone"
          dataKey={y}
          stroke="var(--info)"
          strokeWidth={2.5}
          dot={{ r: 3, fill: 'var(--info)' }}
          activeDot={{ r: 5 }}
          animationDuration={1200}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function BarTrend({
  data,
  x,
  y,
  height = 200,
  color = 'var(--primary)',
  horizontal = false,
}: {
  data: any[]
  x: string
  y: string
  height?: number
  color?: string
  horizontal?: boolean
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        layout={horizontal ? 'vertical' : 'horizontal'}
        margin={{ top: 6, right: 6, left: horizontal ? 8 : -20, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={!horizontal} vertical={horizontal} />
        {horizontal ? (
          <>
            <XAxis type="number" tick={AXIS} tickLine={false} axisLine={false} />
            <YAxis type="category" dataKey={x} tick={AXIS} tickLine={false} axisLine={false} width={90} />
          </>
        ) : (
          <>
            <XAxis dataKey={x} tick={AXIS} tickLine={false} axisLine={false} />
            <YAxis tick={AXIS} tickLine={false} axisLine={false} width={40} />
          </>
        )}
        <Tooltip content={<TooltipBox />} cursor={{ fill: 'var(--elevated)' }} />
        <Bar dataKey={y} fill={color} radius={horizontal ? [0, 6, 6, 0] : [6, 6, 0, 0]} animationDuration={1000} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function DonutChart({
  data,
  height = 200,
}: {
  data: { name: string; value: number; fill: string }[]
  height?: number
}) {
  const total = data.reduce((s, d) => s + d.value, 0)
  return (
    <div className="flex items-center gap-4">
      <ResponsiveContainer width="55%" height={height}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="62%"
            outerRadius="100%"
            paddingAngle={3}
            stroke="none"
            animationDuration={900}
          >
            {data.map((d, i) => (
              <Cell key={i} fill={d.fill} />
            ))}
          </Pie>
          <Tooltip content={<TooltipBox />} />
        </PieChart>
      </ResponsiveContainer>
      <ul className="flex-1 space-y-2">
        {data.map((d) => (
          <li key={d.name} className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 text-muted-foreground">
              <span className="size-2.5 rounded-full" style={{ background: d.fill }} />
              {d.name}
            </span>
            <span className="font-bold text-foreground">{Math.round((d.value / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function RadialGauge({
  value,
  height = 200,
  label,
}: {
  value: number
  height?: number
  label?: string
}) {
  const data = [{ name: label ?? 'value', value, fill: 'var(--primary)' }]
  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={height}>
        <RadialBarChart
          data={data}
          innerRadius="70%"
          outerRadius="100%"
          startAngle={90}
          endAngle={-270}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          <RadialBar background={{ fill: 'var(--elevated)' }} dataKey="value" cornerRadius={999} animationDuration={1100} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold">{value}%</span>
        {label ? <span className="text-[11px] text-muted-foreground">{label}</span> : null}
      </div>
    </div>
  )
}

const HEAT_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const HEAT_HOURS = ['8a', '9a', '10a', '11a', '12p', '1p', '2p', '3p', '4p', '5p', '6p', '7p']

export function AttendanceHeatmap({ data }: { data: number[][] }) {
  return (
    <div className="overflow-x-auto scrollbar-spotify">
      <div className="min-w-[520px]">
        <div className="mb-2 grid grid-cols-[40px_repeat(12,minmax(0,1fr))] gap-1">
          <span />
          {HEAT_HOURS.map((h) => (
            <span key={h} className="text-center text-[10px] font-semibold text-muted-foreground">
              {h}
            </span>
          ))}
        </div>
        <div className="space-y-1">
          {data.map((row, d) => (
            <div key={HEAT_DAYS[d]} className="grid grid-cols-[40px_repeat(12,minmax(0,1fr))] gap-1">
              <span className="flex items-center text-[11px] font-bold text-muted-foreground">
                {HEAT_DAYS[d]}
              </span>
              {row.map((v, h) => {
                const intensity = Math.min(1, v / 100)
                return (
                  <div
                    key={`${d}-${h}`}
                    title={`${HEAT_DAYS[d]} ${HEAT_HOURS[h]}: ${v} scans`}
                    className="aspect-square rounded-sm transition-transform hover:scale-110"
                    style={{
                      backgroundColor: `rgba(30, 215, 96, ${0.08 + intensity * 0.85})`,
                    }}
                  />
                )
              })}
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-end gap-2 text-[10px] text-muted-foreground">
          <span>Less</span>
          {[0.1, 0.3, 0.5, 0.75, 1].map((i) => (
            <span
              key={i}
              className="size-3 rounded-sm"
              style={{ backgroundColor: `rgba(30, 215, 96, ${0.08 + i * 0.85})` }}
            />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  )
}
