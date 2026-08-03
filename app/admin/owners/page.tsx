'use client'

import { AdminTopbar } from '@/components/admin/topbar'
import { Avatar, Card, Pill } from '@/components/ui/primitives'
import { ConfirmDialog, Modal } from '@/components/ui/modal'
import { toast } from '@/components/ui/toaster'
import { MetricCard, SearchInput } from '@/components/ui/widgets'
import { OWNERS } from '@/lib/data'
import type { Owner } from '@/lib/types'
import { AnimatePresence, motion } from 'framer-motion'
import { Building2, MoreHorizontal, Plus, UserCheck, UserX, Users } from 'lucide-react'
import { useMemo, useState } from 'react'

const FILTERS = ['All', 'Active', 'Suspended'] as const

export default function AdminOwnersPage() {
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All')
  const [owners, setOwners] = useState<Owner[]>(OWNERS)
  const [createOpen, setCreateOpen] = useState(false)
  const [suspendTarget, setSuspendTarget] = useState<Owner | null>(null)
  const [form, setForm] = useState({ name: '', company: '', phone: '', email: '' })

  const rows = useMemo(
    () =>
      owners
        .filter((o) => (filter === 'All' ? true : o.status === filter))
        .filter((o) =>
          `${o.name} ${o.company} ${o.email} ${o.phone}`.toLowerCase().includes(q.toLowerCase()),
        ),
    [owners, q, filter],
  )

  const active = owners.filter((o) => o.status === 'Active').length

  function createOwner() {
    if (!form.name.trim() || !form.company.trim()) {
      toast('Name and company are required', { variant: 'error' })
      return
    }
    const next: Owner = {
      id: `own-${Date.now()}`,
      name: form.name.trim(),
      company: form.company.trim(),
      phone: form.phone.trim() || '+255700000000',
      email: form.email.trim() || 'owner@example.com',
      avatar: OWNERS[owners.length % OWNERS.length]?.avatar ?? OWNERS[0].avatar,
      events: 0,
      status: 'Active',
    }
    setOwners((prev) => [next, ...prev])
    setCreateOpen(false)
    setForm({ name: '', company: '', phone: '', email: '' })
    toast('Owner created', { description: next.name })
  }

  function toggleStatus(owner: Owner) {
    setOwners((prev) =>
      prev.map((o) =>
        o.id === owner.id
          ? { ...o, status: o.status === 'Active' ? 'Suspended' : 'Active' }
          : o,
      ),
    )
    toast(owner.status === 'Active' ? 'Owner suspended' : 'Owner reactivated', {
      description: owner.name,
      variant: owner.status === 'Active' ? 'warning' : 'success',
    })
    setSuspendTarget(null)
  }

  return (
    <>
      <AdminTopbar title="Event Owners" subtitle="Manage organizer accounts across the platform" />
      <div className="space-y-5 p-4 sm:p-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          <MetricCard icon={Users} label="Total Owners" value={owners.length} tone="primary" index={0} />
          <MetricCard icon={UserCheck} label="Active" value={active} tone="info" index={1} />
          <MetricCard
            icon={UserX}
            label="Suspended"
            value={owners.length - active}
            tone="destructive"
            index={2}
          />
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
            <SearchInput value={q} onChange={setQ} placeholder="Search owners…" className="w-full md:w-64" />
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-primary px-5 text-[13px] font-bold text-primary-foreground transition-transform hover:scale-[1.02]"
            >
              <Plus className="size-4" />
              Add Owner
            </button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {rows.map((o, i) => (
              <motion.div
                key={o.id}
                layout
                initial={{ y: 12 }}
                animate={{ y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ delay: Math.min(i * 0.03, 0.3) }}
              >
                <Card className="transition-colors hover:bg-accent">
                  <div className="flex items-start gap-3">
                    <Avatar src={o.avatar} name={o.name} size={48} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-foreground">{o.name}</p>
                          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Building2 className="size-3.5 shrink-0" />
                            <span className="truncate">{o.company}</span>
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSuspendTarget(o)}
                          className="grid size-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-elevated hover:text-foreground"
                          aria-label="Owner actions"
                        >
                          <MoreHorizontal className="size-4" />
                        </button>
                      </div>
                      <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                        <p className="truncate">{o.email}</p>
                        <p>{o.phone}</p>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs font-semibold text-muted-foreground">
                          <span className="font-bold text-foreground">{o.events}</span> events
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                            o.status === 'Active'
                              ? 'bg-primary/15 text-primary'
                              : 'bg-destructive/15 text-destructive'
                          }`}
                        >
                          {o.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {rows.length === 0 ? (
          <Card className="py-12 text-center text-sm text-muted-foreground">
            No owners match your search.
          </Card>
        ) : null}
      </div>

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Add event owner"
        subtitle="Dummy create — no backend call"
      >
        <div className="space-y-3">
          {(
            [
              ['name', 'Full name', 'Amina Sauti'],
              ['company', 'Company', 'Sauti Events Ltd'],
              ['phone', 'Phone', '+255712000000'],
              ['email', 'Email', 'owner@example.com'],
            ] as const
          ).map(([key, label, placeholder]) => (
            <div key={key}>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
                {label}
              </label>
              <input
                value={form[key]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                placeholder={placeholder}
                className="h-11 w-full rounded-full bg-elevated px-4 text-sm outline-none ring-inset placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-ring"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={createOwner}
            className="btn-uppercase mt-2 flex h-11 w-full items-center justify-center rounded-full bg-primary text-[12px] font-bold text-primary-foreground"
          >
            Create owner
          </button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!suspendTarget}
        onClose={() => setSuspendTarget(null)}
        onConfirm={() => suspendTarget && toggleStatus(suspendTarget)}
        title={suspendTarget?.status === 'Active' ? 'Suspend owner?' : 'Reactivate owner?'}
        description={
          suspendTarget
            ? `${suspendTarget.name} (${suspendTarget.company}) will be marked ${
                suspendTarget.status === 'Active' ? 'Suspended' : 'Active'
              }.`
            : ''
        }
        confirmLabel={suspendTarget?.status === 'Active' ? 'Suspend' : 'Reactivate'}
        destructive={suspendTarget?.status === 'Active'}
      />
    </>
  )
}
