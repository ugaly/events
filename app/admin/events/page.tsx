'use client'

import { AdminTopbar } from '@/components/admin/topbar'
import { ConfirmDialog, Modal } from '@/components/ui/modal'
import { Avatar, Card, Pill } from '@/components/ui/primitives'
import { toast } from '@/components/ui/toaster'
import { SearchInput } from '@/components/ui/widgets'
import { EVENTS } from '@/lib/data'
import type { EventItem, EventType } from '@/lib/types'
import { AnimatePresence, motion } from 'framer-motion'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'

const FILTERS = ['All', 'Active', 'Upcoming', 'Completed'] as const

const EVENT_TYPES: EventType[] = [
  'Wedding',
  'Conference',
  'Meeting',
  'Seminar',
  'Birthday',
  'Graduation',
  'Church Event',
  'Government Event',
  'Corporate Event',
  'Training',
  'Workshop',
  'Funeral',
  'Festival',
  'Sports Event',
  'School Event',
]

const statusTone: Record<string, string> = {
  Active: 'bg-primary/15 text-primary',
  Upcoming: 'bg-info/15 text-info',
  Completed: 'bg-muted-foreground/15 text-muted-foreground',
}

const emptyForm = {
  name: '',
  type: 'Wedding' as EventType,
  date: '',
  venue: '',
  owner: '',
  status: 'Upcoming' as EventItem['status'],
  guests: '100',
}

export default function AdminEvents() {
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All')
  const [events, setEvents] = useState<EventItem[]>(EVENTS)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<EventItem | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<EventItem | null>(null)
  const [form, setForm] = useState(emptyForm)

  const rows = useMemo(() => {
    return events
      .filter((e) => (filter === 'All' ? true : e.status === filter))
      .filter((e) =>
        `${e.name} ${e.owner} ${e.venue} ${e.type}`.toLowerCase().includes(q.toLowerCase()),
      )
  }, [events, q, filter])

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    setFormOpen(true)
  }

  function openEdit(e: EventItem) {
    setEditing(e)
    setForm({
      name: e.name,
      type: e.type,
      date: e.date,
      venue: e.venue,
      owner: e.owner,
      status: e.status,
      guests: String(e.guests),
    })
    setFormOpen(true)
  }

  function saveEvent() {
    if (!form.name.trim() || !form.venue.trim()) {
      toast('Name and venue are required', { variant: 'error' })
      return
    }
    const guests = Number.parseInt(form.guests, 10) || 0
    if (editing) {
      setEvents((prev) =>
        prev.map((e) =>
          e.id === editing.id
            ? {
                ...e,
                name: form.name.trim(),
                type: form.type,
                date: form.date || e.date,
                venue: form.venue.trim(),
                owner: form.owner.trim() || e.owner,
                status: form.status,
                guests,
              }
            : e,
        ),
      )
      toast('Event updated', { description: form.name })
    } else {
      const next: EventItem = {
        id: `evt-${Date.now()}`,
        name: form.name.trim(),
        type: form.type,
        date: form.date || '2026-09-01',
        venue: form.venue.trim(),
        owner: form.owner.trim() || 'Unassigned',
        status: form.status,
        guests,
        attended: 0,
        image: '/wedding-hero.png',
      }
      setEvents((prev) => [next, ...prev])
      toast('Event created', { description: next.name })
    }
    setFormOpen(false)
  }

  function confirmDelete() {
    if (!deleteTarget) return
    setEvents((prev) => prev.filter((e) => e.id !== deleteTarget.id))
    toast('Event deleted', { description: deleteTarget.name, variant: 'warning' })
    setDeleteTarget(null)
  }

  return (
    <>
      <AdminTopbar title="Events" subtitle={`${events.length} events across the platform`} />
      <div className="space-y-5 p-4 sm:p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <Pill key={f} active={filter === f} onClick={() => setFilter(f)}>
                {f}
              </Pill>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <SearchInput value={q} onChange={setQ} placeholder="Search events…" className="w-full md:w-64" />
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-primary px-5 text-[13px] font-bold text-primary-foreground transition-transform hover:scale-[1.02]"
            >
              <Plus className="size-4" />
              New Event
            </button>
          </div>
        </div>

        <Card className="overflow-hidden p-0">
          <div className="hidden grid-cols-12 gap-3 border-b border-border px-5 py-3 text-[11px] font-bold uppercase tracking-wide text-muted-foreground lg:grid">
            <div className="col-span-4">Event</div>
            <div className="col-span-2">Owner</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2 text-right">Attendance</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>
          <div className="divide-y divide-border">
            <AnimatePresence mode="popLayout">
              {rows.map((e, i) => {
                const rate = e.guests ? Math.round((e.attended / e.guests) * 100) : 0
                return (
                  <motion.div
                    key={e.id}
                    layout
                    initial={{ y: 8 }}
                    animate={{ y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="grid grid-cols-1 gap-3 px-5 py-3.5 transition-colors hover:bg-accent lg:grid-cols-12 lg:items-center"
                  >
                    <div className="flex items-center gap-3 lg:col-span-4">
                      <Avatar src={e.image} name={e.name} size={40} className="rounded-md" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">{e.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {e.type} · {e.venue}
                        </p>
                      </div>
                    </div>
                    <div className="truncate text-xs text-muted-foreground lg:col-span-2">{e.owner}</div>
                    <div className="text-xs text-muted-foreground lg:col-span-2">{e.date}</div>
                    <div className="lg:col-span-2 lg:text-right">
                      <p className="text-sm font-bold text-foreground">
                        {e.attended.toLocaleString()}/{e.guests.toLocaleString()}
                      </p>
                      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-elevated lg:ml-auto lg:w-24">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${rate}%` }} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-2 lg:col-span-2 lg:justify-end">
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${statusTone[e.status]}`}>
                        {e.status}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(e)}
                          className="grid size-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-elevated hover:text-foreground"
                          aria-label="Edit event"
                        >
                          <Pencil className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(e)}
                          className="grid size-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive"
                          aria-label="Delete event"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
            {rows.length === 0 && (
              <div className="px-5 py-12 text-center text-sm text-muted-foreground">
                No events match your search.
              </div>
            )}
          </div>
        </Card>
      </div>

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? 'Edit event' : 'Create event'}
        subtitle="Dummy form — ready for backend wiring"
        size="lg"
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Event name
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Afdhal & Khadija Wedding"
              className="h-11 w-full rounded-full bg-elevated px-4 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Type
            </label>
            <select
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as EventType }))}
              className="h-11 w-full rounded-full bg-elevated px-4 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              {EVENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) =>
                setForm((f) => ({ ...f, status: e.target.value as EventItem['status'] }))
              }
              className="h-11 w-full rounded-full bg-elevated px-4 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              {(['Upcoming', 'Active', 'Completed'] as const).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Date
            </label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              className="h-11 w-full rounded-full bg-elevated px-4 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Guests
            </label>
            <input
              value={form.guests}
              onChange={(e) => setForm((f) => ({ ...f, guests: e.target.value }))}
              inputMode="numeric"
              className="h-11 w-full rounded-full bg-elevated px-4 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Venue
            </label>
            <input
              value={form.venue}
              onChange={(e) => setForm((f) => ({ ...f, venue: e.target.value }))}
              placeholder="The Superdome, Masaki"
              className="h-11 w-full rounded-full bg-elevated px-4 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Owner
            </label>
            <input
              value={form.owner}
              onChange={(e) => setForm((f) => ({ ...f, owner: e.target.value }))}
              placeholder="Sauti Events Ltd"
              className="h-11 w-full rounded-full bg-elevated px-4 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={saveEvent}
          className="btn-uppercase mt-5 flex h-11 w-full items-center justify-center rounded-full bg-primary text-[12px] font-bold text-primary-foreground"
        >
          {editing ? 'Save changes' : 'Create event'}
        </button>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete event?"
        description={
          deleteTarget
            ? `"${deleteTarget.name}" will be removed from the demo list. This is frontend-only.`
            : ''
        }
        confirmLabel="Delete"
        destructive
      />
    </>
  )
}
