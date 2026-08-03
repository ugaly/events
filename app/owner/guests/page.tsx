'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Mail, Phone, Ticket, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { MobileHeader } from '@/components/owner/mobile-header'
import { Avatar, Card, GroupBadge } from '@/components/ui/primitives'
import { Pill, SearchInput } from '@/components/ui/widgets'
import { ATTENDEES } from '@/lib/data'
import type { Attendee, GuestGroup } from '@/lib/types'

const GROUP_FILTERS: Array<{ label: string; value: 'all' | GuestGroup }> = [
  { label: 'All', value: 'all' },
  { label: 'VIP', value: 'VIP' },
  { label: 'Family', value: 'Family' },
  { label: 'Friends', value: 'Friends' },
  { label: 'Corporate', value: 'Corporate' },
  { label: 'General', value: 'General' },
]

export default function GuestsPage() {
  const [query, setQuery] = useState('')
  const [group, setGroup] = useState<'all' | GuestGroup>('all')
  const [selected, setSelected] = useState<Attendee | null>(null)

  const results = useMemo(() => {
    return ATTENDEES.filter((a) => {
      const matchesGroup = group === 'all' || a.group === group
      const q = query.trim().toLowerCase()
      const matchesQuery =
        !q || a.name.toLowerCase().includes(q) || a.invitationCode.toLowerCase().includes(q)
      return matchesGroup && matchesQuery
    })
  }, [query, group])

  return (
    <div>
      <MobileHeader subtitle="Directory" title="Guests" />

      <div className="space-y-4 px-5">
        <SearchInput value={query} onChange={setQuery} placeholder="Search guests or invite code" />

        <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 no-scrollbar">
          {GROUP_FILTERS.map((g) => (
            <Pill key={g.value} active={group === g.value} onClick={() => setGroup(g.value)}>
              {g.label}
            </Pill>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {results.slice(0, 40).map((a, i) => (
            <motion.button
              key={a.id}
              initial={{ y: 10 }}
              animate={{ y: 0 }}
              transition={{ delay: Math.min(i * 0.02, 0.4) }}
              onClick={() => setSelected(a)}
              className="text-left"
            >
              <Card className="flex flex-col items-center gap-2 p-4 text-center transition-colors hover:bg-accent">
                <Avatar src={a.avatar} name={a.name} size={56} />
                <div>
                  <p className="line-clamp-1 text-sm font-bold">{a.name}</p>
                  <p className="text-[11px] text-muted-foreground">{a.invitationCode}</p>
                </div>
                <GroupBadge group={a.group} />
              </Card>
            </motion.button>
          ))}
        </div>
        {results.length === 0 ? (
          <Card className="py-10 text-center text-sm text-muted-foreground">No guests found.</Card>
        ) : null}
      </div>

      {/* Guest detail bottom sheet */}
      <AnimatePresence>
        {selected ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-md rounded-t-2xl bg-popover p-5 shadow-dialog"
            >
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" />
              <button
                onClick={() => setSelected(null)}
                className="absolute right-4 top-4 grid size-8 place-items-center rounded-full bg-elevated text-muted-foreground hover:text-foreground"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>

              <div className="flex flex-col items-center text-center">
                <Avatar src={selected.avatar} name={selected.name} size={80} ring />
                <h3 className="mt-3 text-lg font-bold">{selected.name}</h3>
                <div className="mt-1.5">
                  <GroupBadge group={selected.group} />
                </div>
              </div>

              <div className="mt-5 space-y-2.5">
                <DetailRow icon={Phone} label="Phone" value={selected.phone} />
                <DetailRow icon={Mail} label="Email" value={selected.email} />
                <DetailRow icon={Ticket} label="Invitation code" value={selected.invitationCode} />
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <MiniStat label="Seat" value={selected.seat} />
                  <MiniStat label="Table" value={selected.table} />
                  <MiniStat label="Gate" value={selected.gate} />
                </div>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Phone
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-elevated px-3 py-2.5">
      <Icon className="size-4 text-primary" />
      <div className="min-w-0">
        <p className="text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="truncate text-sm font-semibold">{value}</p>
      </div>
    </div>
  )
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-elevated px-2 py-2.5 text-center">
      <p className="text-sm font-bold">{value}</p>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
    </div>
  )
}
