'use client'

import { AdminTopbar } from '@/components/admin/topbar'
import { Avatar, Card, Pill } from '@/components/ui/primitives'
import { Modal } from '@/components/ui/modal'
import { toast } from '@/components/ui/toaster'
import { MetricCard, SearchInput } from '@/components/ui/widgets'
import { EVENTS, SCANNERS, avatarFor } from '@/lib/data'
import type { Scanner } from '@/lib/types'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus, Radio, ScanLine, Wifi, WifiOff } from 'lucide-react'
import { useMemo, useState } from 'react'

const FILTERS = ['All', 'Online', 'Offline'] as const

export default function AdminScannersPage() {
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All')
  const [scanners, setScanners] = useState<Scanner[]>(SCANNERS)
  const [createOpen, setCreateOpen] = useState(false)
  const [form, setForm] = useState({ name: '', gate: 'Main Entrance', event: EVENTS[0]?.name ?? '' })

  const rows = useMemo(
    () =>
      scanners
        .filter((s) => (filter === 'All' ? true : s.status === filter))
        .filter((s) =>
          `${s.name} ${s.gate} ${s.event}`.toLowerCase().includes(q.toLowerCase()),
        ),
    [scanners, q, filter],
  )

  const online = scanners.filter((s) => s.status === 'Online').length
  const scansToday = scanners.reduce((sum, s) => sum + s.scansToday, 0)

  function addScanner() {
    if (!form.name.trim()) {
      toast('Scanner name is required', { variant: 'error' })
      return
    }
    const next: Scanner = {
      id: `scn-${Date.now()}`,
      name: form.name.trim(),
      avatar: avatarFor(scanners.length),
      gate: form.gate,
      event: form.event,
      scansToday: 0,
      status: 'Online',
      lastActive: 'Just now',
    }
    setScanners((prev) => [next, ...prev])
    setCreateOpen(false)
    setForm({ name: '', gate: 'Main Entrance', event: EVENTS[0]?.name ?? '' })
    toast('Scanner added', { description: next.name })
  }

  function toggleOnline(id: string) {
    setScanners((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              status: s.status === 'Online' ? 'Offline' : 'Online',
              lastActive: s.status === 'Online' ? 'Just now' : 'Just now',
            }
          : s,
      ),
    )
    toast('Scanner status updated', { variant: 'info' })
  }

  return (
    <>
      <AdminTopbar title="Scanners" subtitle="Gate devices and operator accounts" />
      <div className="space-y-5 p-4 sm:p-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          <MetricCard icon={ScanLine} label="Total Scanners" value={scanners.length} tone="primary" index={0} />
          <MetricCard icon={Wifi} label="Online now" value={online} tone="info" index={1} />
          <MetricCard icon={Radio} label="Scans today" value={scansToday} tone="warning" index={2} />
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <Pill key={f} active={filter === f} onClick={() => setFilter(f)}>
                {f}
              </Pill>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <SearchInput value={q} onChange={setQ} placeholder="Search scanners…" className="w-full md:w-64" />
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-primary px-5 text-[13px] font-bold text-primary-foreground transition-transform hover:scale-[1.02]"
            >
              <Plus className="size-4" />
              Add Scanner
            </button>
          </div>
        </div>

        <Card className="p-0 overflow-hidden">
          <div className="hidden grid-cols-12 gap-3 border-b border-border px-5 py-3 text-[11px] font-bold uppercase tracking-wide text-muted-foreground md:grid">
            <div className="col-span-3">Scanner</div>
            <div className="col-span-2">Gate</div>
            <div className="col-span-3">Event</div>
            <div className="col-span-1 text-right">Scans</div>
            <div className="col-span-2">Last active</div>
            <div className="col-span-1 text-right">Status</div>
          </div>
          <div className="divide-y divide-border">
            <AnimatePresence mode="popLayout">
              {rows.map((s, i) => (
                <motion.div
                  key={s.id}
                  layout
                  initial={{ y: 8 }}
                  animate={{ y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex flex-col gap-3 px-5 py-3.5 transition-colors hover:bg-accent md:grid md:grid-cols-12 md:items-center"
                >
                  <div className="flex items-center gap-3 md:col-span-3">
                    <Avatar src={s.avatar} name={s.name} size={40} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">{s.name}</p>
                      <p className="text-xs text-muted-foreground md:hidden">{s.gate}</p>
                    </div>
                  </div>
                  <div className="hidden truncate text-xs text-muted-foreground md:col-span-2 md:block">
                    {s.gate}
                  </div>
                  <div className="truncate text-xs text-muted-foreground md:col-span-3">{s.event}</div>
                  <div className="text-sm font-bold text-foreground md:col-span-1 md:text-right">
                    {s.scansToday}
                  </div>
                  <div className="text-xs text-muted-foreground md:col-span-2">{s.lastActive}</div>
                  <div className="flex items-center justify-between gap-2 md:col-span-1 md:justify-end">
                    <button
                      type="button"
                      onClick={() => toggleOnline(s.id)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold transition-colors ${
                        s.status === 'Online'
                          ? 'bg-primary/15 text-primary'
                          : 'bg-muted-foreground/15 text-muted-foreground'
                      }`}
                    >
                      {s.status === 'Online' ? (
                        <Wifi className="size-3" />
                      ) : (
                        <WifiOff className="size-3" />
                      )}
                      {s.status}
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {rows.length === 0 ? (
              <div className="px-5 py-12 text-center text-sm text-muted-foreground">
                No scanners match your search.
              </div>
            ) : null}
          </div>
        </Card>
      </div>

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Add scanner"
        subtitle="Assign an operator to a gate"
      >
        <div className="space-y-3">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Name
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Juma Bakari"
              className="h-11 w-full rounded-full bg-elevated px-4 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Gate
            </label>
            <select
              value={form.gate}
              onChange={(e) => setForm((f) => ({ ...f, gate: e.target.value }))}
              className="h-11 w-full rounded-full bg-elevated px-4 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              {['Main Entrance', 'Gate A', 'Gate B', 'VIP Gate'].map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Event
            </label>
            <select
              value={form.event}
              onChange={(e) => setForm((f) => ({ ...f, event: e.target.value }))}
              className="h-11 w-full rounded-full bg-elevated px-4 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              {EVENTS.map((e) => (
                <option key={e.id} value={e.name}>
                  {e.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={addScanner}
            className="btn-uppercase mt-2 flex h-11 w-full items-center justify-center rounded-full bg-primary text-[12px] font-bold text-primary-foreground"
          >
            Add scanner
          </button>
        </div>
      </Modal>
    </>
  )
}
