'use client'

import { AdminTopbar } from '@/components/admin/topbar'
import { ConfirmDialog, Modal } from '@/components/ui/modal'
import { Card, Pill } from '@/components/ui/primitives'
import { toast } from '@/components/ui/toaster'
import { MetricCard, SearchInput } from '@/components/ui/widgets'
import { ATTENDEES, EVENTS, NFC_CARDS } from '@/lib/data'
import type { NfcCard } from '@/lib/types'
import { AnimatePresence, motion } from 'framer-motion'
import { Nfc, Plus, ShieldCheck, ShieldX, TriangleAlert, UserPlus } from 'lucide-react'
import { useMemo, useState } from 'react'

const FILTERS = ['All', 'Active', 'Lost', 'Disabled'] as const

const statusTone: Record<string, string> = {
  Active: 'bg-primary/15 text-primary',
  Lost: 'bg-warning/15 text-warning',
  Disabled: 'bg-destructive/15 text-destructive',
}

export default function AdminNfc() {
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All')
  const [cards, setCards] = useState<NfcCard[]>(NFC_CARDS)
  const [issueOpen, setIssueOpen] = useState(false)
  const [assignTarget, setAssignTarget] = useState<NfcCard | null>(null)
  const [deactivateTarget, setDeactivateTarget] = useState<NfcCard | null>(null)
  const [assignUser, setAssignUser] = useState(ATTENDEES[0]?.name ?? '')
  const [issueForm, setIssueForm] = useState({
    assignedTo: ATTENDEES[0]?.name ?? '',
    event: EVENTS[0]?.name ?? '',
  })

  const counts = {
    active: cards.filter((c) => c.status === 'Active').length,
    lost: cards.filter((c) => c.status === 'Lost').length,
    disabled: cards.filter((c) => c.status === 'Disabled').length,
  }

  const rows = useMemo(
    () =>
      cards
        .filter((c) => (filter === 'All' ? true : c.status === filter))
        .filter((c) =>
          `${c.id} ${c.assignedTo} ${c.event}`.toLowerCase().includes(q.toLowerCase()),
        ),
    [cards, q, filter],
  )

  function issueCard() {
    const id = `NFC-${String(6000 + cards.length).padStart(4, '0')}`
    const next: NfcCard = {
      id,
      assignedTo: issueForm.assignedTo || '—',
      event: issueForm.event,
      status: 'Active',
      lastUsed: '—',
    }
    setCards((prev) => [next, ...prev])
    setIssueOpen(false)
    toast('Card issued', { description: id })
  }

  function assignCard() {
    if (!assignTarget) return
    setCards((prev) =>
      prev.map((c) =>
        c.id === assignTarget.id
          ? { ...c, assignedTo: assignUser, status: 'Active', lastUsed: 'Just now' }
          : c,
      ),
    )
    toast('Card assigned', { description: `${assignTarget.id} → ${assignUser}` })
    setAssignTarget(null)
  }

  function deactivateCard() {
    if (!deactivateTarget) return
    setCards((prev) =>
      prev.map((c) =>
        c.id === deactivateTarget.id ? { ...c, status: 'Disabled' } : c,
      ),
    )
    toast('Card deactivated', { description: deactivateTarget.id, variant: 'warning' })
    setDeactivateTarget(null)
  }

  return (
    <>
      <AdminTopbar title="NFC Cards" subtitle="Manage and monitor tap-to-check-in cards" />
      <div className="space-y-5 p-4 sm:p-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard icon={Nfc} label="Total Cards" value={cards.length} tone="primary" index={0} />
          <MetricCard icon={ShieldCheck} label="Active" value={counts.active} tone="info" index={1} />
          <MetricCard icon={TriangleAlert} label="Lost" value={counts.lost} tone="warning" index={2} />
          <MetricCard icon={ShieldX} label="Disabled" value={counts.disabled} tone="destructive" index={3} />
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
            <SearchInput value={q} onChange={setQ} placeholder="Search cards…" className="w-full md:w-64" />
            <button
              type="button"
              onClick={() => setIssueOpen(true)}
              className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-primary px-5 text-[13px] font-bold text-primary-foreground transition-transform hover:scale-[1.02]"
            >
              <Plus className="size-4" />
              Issue Card
            </button>
          </div>
        </div>

        <Card className="overflow-hidden p-0">
          <div className="hidden grid-cols-12 gap-3 border-b border-border px-5 py-3 text-[11px] font-bold uppercase tracking-wide text-muted-foreground lg:grid">
            <div className="col-span-3">Card ID</div>
            <div className="col-span-3">Assigned To</div>
            <div className="col-span-2">Event</div>
            <div className="col-span-2">Last Used</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>
          <div className="divide-y divide-border">
            <AnimatePresence mode="popLayout">
              {rows.map((c, i) => (
                <motion.div
                  key={c.id}
                  layout
                  initial={{ y: 8 }}
                  animate={{ y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className="grid grid-cols-1 gap-3 px-5 py-3.5 transition-colors hover:bg-accent lg:grid-cols-12 lg:items-center"
                >
                  <div className="flex items-center gap-2.5 lg:col-span-3">
                    <span className="grid size-8 place-items-center rounded-md bg-elevated text-primary">
                      <Nfc className="size-4" />
                    </span>
                    <div>
                      <span className="font-mono text-xs font-semibold text-foreground">{c.id}</span>
                      <span
                        className={`ml-2 rounded-full px-2 py-0.5 text-[10px] font-bold lg:hidden ${statusTone[c.status]}`}
                      >
                        {c.status}
                      </span>
                    </div>
                  </div>
                  <div className="truncate text-sm text-foreground lg:col-span-3">{c.assignedTo}</div>
                  <div className="truncate text-xs text-muted-foreground lg:col-span-2">{c.event}</div>
                  <div className="text-xs text-muted-foreground lg:col-span-2">{c.lastUsed}</div>
                  <div className="flex flex-wrap items-center gap-2 lg:col-span-2 lg:justify-end">
                    <span className={`hidden rounded-full px-2.5 py-1 text-[11px] font-bold lg:inline ${statusTone[c.status]}`}>
                      {c.status}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setAssignUser(c.assignedTo === '—' ? ATTENDEES[0]?.name ?? '' : c.assignedTo)
                        setAssignTarget(c)
                      }}
                      className="inline-flex items-center gap-1 rounded-full bg-elevated px-2.5 py-1 text-[11px] font-bold text-foreground transition-colors hover:bg-accent"
                    >
                      <UserPlus className="size-3" /> Assign
                    </button>
                    {c.status !== 'Disabled' ? (
                      <button
                        type="button"
                        onClick={() => setDeactivateTarget(c)}
                        className="rounded-full bg-destructive/15 px-2.5 py-1 text-[11px] font-bold text-destructive transition-colors hover:bg-destructive/25"
                      >
                        Deactivate
                      </button>
                    ) : null}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </Card>
      </div>

      <Modal open={issueOpen} onClose={() => setIssueOpen(false)} title="Issue NFC card">
        <div className="space-y-3">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Assign to
            </label>
            <select
              value={issueForm.assignedTo}
              onChange={(e) => setIssueForm((f) => ({ ...f, assignedTo: e.target.value }))}
              className="h-11 w-full rounded-full bg-elevated px-4 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              {ATTENDEES.slice(0, 40).map((a) => (
                <option key={a.id} value={a.name}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Event
            </label>
            <select
              value={issueForm.event}
              onChange={(e) => setIssueForm((f) => ({ ...f, event: e.target.value }))}
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
            onClick={issueCard}
            className="btn-uppercase mt-2 flex h-11 w-full items-center justify-center rounded-full bg-primary text-[12px] font-bold text-primary-foreground"
          >
            Issue card
          </button>
        </div>
      </Modal>

      <Modal
        open={!!assignTarget}
        onClose={() => setAssignTarget(null)}
        title="Assign card"
        subtitle={assignTarget?.id}
      >
        <div className="space-y-3">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Guest
            </label>
            <select
              value={assignUser}
              onChange={(e) => setAssignUser(e.target.value)}
              className="h-11 w-full rounded-full bg-elevated px-4 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              {ATTENDEES.slice(0, 60).map((a) => (
                <option key={a.id} value={a.name}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={assignCard}
            className="btn-uppercase flex h-11 w-full items-center justify-center rounded-full bg-primary text-[12px] font-bold text-primary-foreground"
          >
            Save assignment
          </button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deactivateTarget}
        onClose={() => setDeactivateTarget(null)}
        onConfirm={deactivateCard}
        title="Deactivate card?"
        description={
          deactivateTarget
            ? `${deactivateTarget.id} will be marked Disabled and can no longer check guests in.`
            : ''
        }
        confirmLabel="Deactivate"
        destructive
      />
    </>
  )
}
