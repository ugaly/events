'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Check, Clock, X } from 'lucide-react'
import { useState } from 'react'
import { MobileHeader } from '@/components/owner/mobile-header'
import { Avatar, Card, GroupBadge } from '@/components/ui/primitives'
import { toast } from '@/components/ui/toaster'
import { PERMISSION_REQUESTS } from '@/lib/data'
import type { PermissionRequest } from '@/lib/types'

export default function PermissionsPage() {
  const [requests, setRequests] = useState<PermissionRequest[]>(PERMISSION_REQUESTS)

  function resolve(id: string, status: 'Approved' | 'Rejected') {
    const req = requests.find((r) => r.id === id)
    setRequests((prev) => prev.filter((r) => r.id !== id))
    toast(status === 'Approved' ? 'Request approved' : 'Request rejected', {
      description: req?.name,
      variant: status === 'Approved' ? 'success' : 'error',
    })
  }

  return (
    <div>
      <MobileHeader subtitle="Guest requests" title="Permissions" />

      <div className="space-y-4 px-5">
        <Card className="flex items-center gap-3 bg-info/10">
          <span className="grid size-10 place-items-center rounded-full bg-info/20 text-info">
            <Clock className="size-5" />
          </span>
          <div>
            <p className="text-sm font-bold">{requests.length} pending requests</p>
            <p className="text-xs text-muted-foreground">Review and respond before the event</p>
          </div>
        </Card>

        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {requests.map((r) => (
              <motion.div
                key={r.id}
                layout
                initial={{ y: 12 }}
                animate={{ y: 0 }}
                exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.2 } }}
              >
                <Card className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Avatar src={r.avatar} name={r.name} size={46} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-bold">{r.name}</p>
                        <GroupBadge group={r.group} />
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        Submitted {r.submittedTime}
                      </p>
                    </div>
                  </div>
                  <p className="rounded-lg bg-elevated px-3 py-2.5 text-[13px] leading-relaxed text-foreground/90">
                    {r.reason}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => resolve(r.id, 'Rejected')}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-destructive/15 py-2.5 text-xs font-bold text-destructive transition-colors hover:bg-destructive/25"
                    >
                      <X className="size-4" /> Reject
                    </button>
                    <button
                      onClick={() => resolve(r.id, 'Approved')}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-primary py-2.5 text-xs font-bold text-primary-foreground transition-transform active:scale-[0.98]"
                    >
                      <Check className="size-4" /> Approve
                    </button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {requests.length === 0 ? (
            <motion.div initial={false} animate={{ opacity: 1 }}>
              <Card className="flex flex-col items-center gap-2 py-12 text-center">
                <span className="grid size-12 place-items-center rounded-full bg-primary/15 text-primary">
                  <Check className="size-6" />
                </span>
                <p className="text-sm font-bold">All caught up</p>
                <p className="text-xs text-muted-foreground">No pending permission requests.</p>
              </Card>
            </motion.div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
