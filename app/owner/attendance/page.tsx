'use client'

import { motion } from 'framer-motion'
import { Download, Nfc, QrCode } from 'lucide-react'
import { useMemo, useState } from 'react'
import { MobileHeader } from '@/components/owner/mobile-header'
import { Avatar, Card, GroupBadge, StatusBadge } from '@/components/ui/primitives'
import { toast } from '@/components/ui/toaster'
import { Pill, SearchInput } from '@/components/ui/widgets'
import { ATTENDEES, formalGuestName } from '@/lib/data'
import type { AttendanceStatus } from '@/lib/types'

const FILTERS: Array<{ label: string; value: 'all' | AttendanceStatus }> = [
  { label: 'All', value: 'all' },
  { label: 'Checked In', value: 'Checked In' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Late', value: 'Late' },
  { label: 'Absent', value: 'Absent' },
  { label: 'Permission', value: 'Permission Requested' },
]

export default function AttendancePage() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'all' | AttendanceStatus>('all')

  const results = useMemo(() => {
    return ATTENDEES.filter((a) => {
      const matchesFilter = filter === 'all' || a.status === filter
      const q = query.trim().toLowerCase()
      const matchesQuery =
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.invitationId.toLowerCase().includes(q) ||
        a.table.toLowerCase().includes(q)
      return matchesFilter && matchesQuery
    })
  }, [query, filter])

  return (
    <div>
      <MobileHeader subtitle="Live guest list" title="Attendance" />

      <div className="space-y-4 px-5">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search name, invitation ID or table"
        />

        <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 no-scrollbar">
          {FILTERS.map((f) => (
            <Pill key={f.value} active={filter === f.value} onClick={() => setFilter(f.value)}>
              {f.label}
            </Pill>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => toast('Export started', { description: 'CSV will download shortly' })}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-elevated py-2.5 text-xs font-bold text-foreground transition-colors hover:bg-accent"
          >
            <Download className="size-4" /> Export
          </button>
          <button
            onClick={() => toast('QR scanner', { description: 'Opening camera…', variant: 'info' })}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-elevated py-2.5 text-xs font-bold text-foreground transition-colors hover:bg-accent"
          >
            <QrCode className="size-4" /> QR
          </button>
          <button
            onClick={() => toast('NFC ready', { description: 'Tap a card to scan', variant: 'info' })}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-elevated py-2.5 text-xs font-bold text-foreground transition-colors hover:bg-accent"
          >
            <Nfc className="size-4" /> NFC
          </button>
        </div>

        <p className="text-xs font-semibold text-muted-foreground">
          {results.length} {results.length === 1 ? 'guest' : 'guests'}
        </p>

        <div className="space-y-2.5">
          {results.slice(0, 60).map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ y: 10 }}
              animate={{ y: 0 }}
              transition={{ delay: Math.min(i * 0.02, 0.4) }}
            >
              <Card className="flex items-center gap-3 p-3 transition-colors hover:bg-accent">
                <Avatar src={a.avatar} name={a.name} size={46} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-bold">{formalGuestName(a)}</p>
                    <GroupBadge group={a.group} />
                  </div>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {a.invitationId} · {a.cardType} · Seat {a.seat} · {a.table}
                  </p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <StatusBadge status={a.status} />
                    {a.arrivalTime ? (
                      <span className="text-[11px] text-muted-foreground">
                        {a.arrivalTime} · {a.gate}
                      </span>
                    ) : null}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
          {results.length === 0 ? (
            <Card className="py-10 text-center text-sm text-muted-foreground">
              No guests match your search.
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  )
}
