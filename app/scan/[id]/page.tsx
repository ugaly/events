'use client'

import {
  ArmchairIcon,
  BadgeCheck,
  CheckCircle2,
  Clock,
  Loader2,
  MapPin,
  Nfc,
  Sofa,
  Star,
} from 'lucide-react'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Confetti } from '@/components/scan/confetti'
import { ATTENDEES, FEATURED_EVENT } from '@/lib/data'
import type { Attendee } from '@/lib/types'

type Phase = 'loading' | 'ready' | 'checking' | 'done'

function resolveGuest(id: string): Attendee {
  const byId = ATTENDEES.find(
    (a) => a.id === `att-${id}` || a.id === id || a.invitationId === id || a.invitationId === `INV-${id}`,
  )
  if (byId) return byId
  // Demo: /scan/1001 → attendee index from numeric id
  const n = Number.parseInt(String(id).replace(/\D/g, ''), 10)
  if (!Number.isNaN(n)) {
    const exact = ATTENDEES.find((a) => a.id === `att-${n}`)
    if (exact) return exact
    return ATTENDEES[n % ATTENDEES.length]
  }
  return ATTENDEES[0]
}

export default function ScanPage() {
  const params = useParams<{ id: string }>()
  const id = String(params?.id ?? '1001')

  const [phase, setPhase] = useState<Phase>('loading')
  const [guest, setGuest] = useState<Attendee | null>(null)
  const [arrivalTime, setArrivalTime] = useState('')

  // Resolve guest + leave loading — no Framer, no use(params) Promise
  useEffect(() => {
    let alive = true
    const g = resolveGuest(id)

    // Paint loading briefly, then show guest (works even if images are slow)
    const show = window.setTimeout(() => {
      if (!alive) return
      setGuest(g)
      setPhase('ready')
    }, 600)

    const failsafe = window.setTimeout(() => {
      if (!alive) return
      setGuest((prev) => prev ?? g)
      setPhase((p) => (p === 'loading' ? 'ready' : p))
    }, 1500)

    return () => {
      alive = false
      window.clearTimeout(show)
      window.clearTimeout(failsafe)
    }
  }, [id])

  function checkIn() {
    if (phase !== 'ready') return
    setPhase('checking')
    window.setTimeout(() => {
      setArrivalTime(
        new Date().toLocaleTimeString(undefined, {
          hour: '2-digit',
          minute: '2-digit',
        }),
      )
      setPhase('done')
    }, 700)
  }

  const isVip = guest?.group === 'VIP'

  return (
    <main className="relative min-h-dvh overflow-x-hidden bg-background">
      {phase === 'done' ? <Confetti count={80} balloons={12} /> : null}

      {/* Simple CSS backdrop — no next/image fill (can hang mobile) */}
      <div
        className="pointer-events-none fixed inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${FEATURED_EVENT.image})` }}
      />
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-background/80 via-background to-background" />

      <div className="relative z-10 mx-auto flex min-h-dvh max-w-md flex-col px-5 pb-8 pt-0 lg:max-w-lg">
        <header className="flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-full bg-primary/15 text-primary">
              <Nfc className="size-5" />
            </span>
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground">Gate Scanner</p>
              <p className="text-sm font-bold leading-tight">Main Entrance</p>
            </div>
          </div>
          <span className="rounded-full bg-elevated px-2.5 py-1 font-mono text-[11px] font-bold text-muted-foreground">
            #{id}
          </span>
        </header>

        {phase === 'loading' || !guest ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5">
            <div className="relative grid size-28 place-items-center">
              <span className="absolute inset-0 animate-ping rounded-full bg-primary/25" />
              <span className="relative grid size-20 place-items-center rounded-full bg-primary/15 text-primary">
                <Nfc className="size-10" />
              </span>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold">Reading NFC card…</p>
              <p className="mt-1 text-sm text-muted-foreground">Fetching guest details</p>
            </div>
            <Loader2 className="size-5 animate-spin text-primary" />
          </div>
        ) : (
          <div className="flex flex-1 flex-col">
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <div className="relative">
                {/* Plain img — lighter than next/image for big avatar PNGs on mobile */}
                <img
                  src={guest.avatar || '/placeholder-user.jpg'}
                  alt={guest.name}
                  width={140}
                  height={140}
                  decoding="async"
                  className={`size-[140px] rounded-full object-cover bg-elevated ${
                    isVip ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''
                  }`}
                />
                {phase === 'done' ? (
                  <span className="absolute -bottom-1 -right-1 grid size-12 place-items-center rounded-full bg-primary text-primary-foreground shadow-dialog ring-4 ring-background">
                    <CheckCircle2 className="size-7" />
                  </span>
                ) : null}
              </div>

              {isVip ? (
                <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-warning/15 px-3 py-1 text-xs font-bold text-warning">
                  <Star className="size-3.5 fill-current" /> VIP Guest
                </span>
              ) : null}

              <h1 className="mt-3 text-balance text-3xl font-bold leading-tight">{guest.name}</h1>
              <p className="mt-1 font-mono text-sm text-muted-foreground">{guest.invitationId}</p>

              <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-primary">
                {FEATURED_EVENT.type}
              </p>
              <p className="event-names mt-1 text-2xl text-foreground sm:text-3xl">
                {FEATURED_EVENT.groom}{' '}
                <span className="event-amp text-primary">&amp;</span>{' '}
                {FEATURED_EVENT.bride}
              </p>
              <p className="mt-0.5 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="size-3.5" /> {FEATURED_EVENT.venue}
              </p>

              <div className="mt-6 grid w-full grid-cols-3 gap-2">
                <InfoTile icon={ArmchairIcon} label="Seat" value={guest.seat} />
                <InfoTile icon={Sofa} label="Table" value={guest.table} />
                <InfoTile icon={BadgeCheck} label="Group" value={guest.group} />
              </div>

              {phase !== 'done' ? (
                <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="size-3.5" />
                  Previous status:{' '}
                  <span className="font-semibold text-foreground">First arrival</span>
                </p>
              ) : null}
            </div>

            <div className="pt-6">
              {phase === 'done' ? (
                <div className="relative z-10 rounded-2xl bg-primary/12 p-5 text-center ring-1 ring-primary/25">
                  <p className="text-lg font-bold text-primary">Attendance recorded</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Welcome, {guest.name.split(' ')[0]}! Enjoy the celebration.
                  </p>
                  <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-background/60 px-3 py-1.5">
                    <Clock className="size-4 text-primary" />
                    <span className="text-sm font-bold">Checked in at {arrivalTime}</span>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={checkIn}
                  disabled={phase === 'checking'}
                  className="btn-uppercase relative z-20 flex h-16 w-full items-center justify-center gap-2 rounded-full bg-primary text-base font-bold text-primary-foreground shadow-dialog active:scale-[0.98] disabled:opacity-90"
                >
                  {phase === 'checking' ? (
                    <>
                      <Loader2 className="size-5 animate-spin" /> Recording…
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="size-6" /> Check in
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

function InfoTile({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl bg-card/80 px-2 py-3 shadow-card backdrop-blur-sm">
      <Icon className="mx-auto size-4 text-primary" />
      <p className="mt-1.5 text-sm font-bold">{value}</p>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
    </div>
  )
}
