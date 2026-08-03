'use client'

import { AnimatePresence, motion } from 'framer-motion'
import {
  BookOpen,
  CalendarDays,
  Clock,
  Heart,
  MapPin,
  Maximize2,
  Shirt,
  Sparkles,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { use, useEffect, useRef, useState } from 'react'
import { Countdown } from '@/components/owner/countdown'
import { VenueMapCard } from '@/components/event/venue-map'
import { Card } from '@/components/ui/primitives'
import { EVENTS, FEATURED_EVENT } from '@/lib/data'
import { EVENT_I18N, type EventLang } from '@/lib/i18n/event'

/*
 * PUBLIC EVENT PAGE — /event/:id
 * ------------------------------
 * Guest-facing invitation / event details. No auth required.
 * Supports English (default) and Swahili via the header language switch.
 */

const LANG_KEY = 'habari-event-lang'

function resolveEvent(id: string) {
  const fromList = EVENTS.find((e) => e.id === id || e.id === `evt-${id}` || e.id.endsWith(id))
  const isFeatured =
    id === FEATURED_EVENT.id ||
    id === '1001' ||
    id === 'evt-1001' ||
    fromList?.id === FEATURED_EVENT.id

  return {
    ...FEATURED_EVENT,
    ...(fromList && !isFeatured
      ? {
          id: fromList.id,
          name: fromList.name,
          type: fromList.type,
          date: `${fromList.date}T16:00:00`,
          venue: fromList.venue,
          address: `${fromList.venue}, Dar es Salaam, Tanzania`,
          mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fromList.venue + ' Dar es Salaam Tanzania')}`,
          image: fromList.image,
        }
      : {}),
  }
}

export default function PublicEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const event = resolveEvent(id)
  const inlineRef = useRef<HTMLVideoElement>(null)
  const fsRef = useRef<HTMLVideoElement>(null)
  const [fullscreen, setFullscreen] = useState(false)
  const [muted, setMuted] = useState(true)
  const [lang, setLang] = useState<EventLang>(() => {
    if (typeof window === 'undefined') return 'en'
    try {
      const saved = localStorage.getItem(LANG_KEY)
      return saved === 'sw' ? 'sw' : 'en'
    } catch {
      return 'en'
    }
  })

  const t = EVENT_I18N[lang]

  function changeLang(next: EventLang) {
    setLang(next)
    try {
      localStorage.setItem(LANG_KEY, next)
    } catch {
      /* ignore */
    }
  }

  useEffect(() => {
    const v = inlineRef.current
    if (!v) return
    v.muted = true
    v.play().catch(() => {})
  }, [])

  useEffect(() => {
    if (!fullscreen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeFullscreen()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [fullscreen])

  function openFullscreen() {
    inlineRef.current?.pause()
    setFullscreen(true)
    setMuted(false)
  }

  function closeFullscreen() {
    setFullscreen(false)
    setMuted(true)
    requestAnimationFrame(() => {
      const v = inlineRef.current
      if (!v) return
      v.muted = true
      v.play().catch(() => {})
    })
  }

  function toggleMute(e: React.MouseEvent) {
    e.stopPropagation()
    setMuted((m) => {
      const next = !m
      if (fsRef.current) {
        fsRef.current.muted = next
        if (!next) fsRef.current.play().catch(() => {})
      }
      return next
    })
  }

  const dateLabel = new Date(FEATURED_EVENT.targetMs).toLocaleDateString(t.locale, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'Africa/Dar_es_Salaam',
  })

  const eventType =
    event.type === 'Wedding' ? t.typeWedding : event.type

  const countdownLabels = {
    days: t.countdownDays,
    hours: t.countdownHours,
    mins: t.countdownMins,
    secs: t.countdownSecs,
  }

  return (
    <main className="relative min-h-dvh overflow-x-hidden bg-background">
      <div className="pointer-events-none absolute inset-0">
        <Image
          src={event.image || '/placeholder.svg'}
          alt=""
          fill
          priority
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/75 via-background to-background" />
      </div>

      {/* Header flush to top (top: 0) */}
      <header className="sticky top-0 z-50 flex w-full items-center justify-between gap-3 border-b border-border/60 bg-background/95 px-4 py-3 backdrop-blur-xl sm:px-8">
        <Link href="/" className="relative z-50 flex min-w-0 items-center gap-2">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
            <Sparkles className="size-4" />
          </span>
          <span className="truncate text-sm font-bold tracking-tight">Habari Events</span>
        </Link>

        {/* Single large toggle — more reliable on mobile than two tiny pills */}
        <div className="relative z-50 inline-flex h-11 items-center rounded-full bg-elevated p-1 shadow-card">
          <button
            type="button"
            onClick={() => changeLang('en')}
            className={`h-9 rounded-full px-4 text-[12px] font-bold transition-colors ${
              lang === 'en' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => changeLang('sw')}
            className={`h-9 rounded-full px-4 text-[12px] font-bold transition-colors ${
              lang === 'sw' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
            }`}
          >
            SW
          </button>
        </div>
      </header>

      <div className="relative z-10 mx-auto max-w-lg px-5 pb-16 pt-4 sm:max-w-2xl sm:px-8 lg:max-w-3xl">
        <motion.div
          initial={{ scale: 0.97 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="relative overflow-hidden rounded-2xl shadow-dialog"
        >
          <Image
            src={event.image || '/placeholder.svg'}
            alt={event.name}
            width={800}
            height={900}
            className="h-80 w-full object-cover sm:h-96 lg:h-[28rem]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/15" />
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wide text-primary-foreground">
              <Heart className="size-3 fill-current" />
              {eventType}
            </span>
            <h1 className="event-names mt-2.5 text-balance text-4xl text-white sm:text-5xl lg:text-6xl">
              {event.groom} <span className="event-amp text-primary">&amp;</span> {event.bride}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/80">
              <span className="flex items-center gap-1.5">
                <CalendarDays className="size-3.5 shrink-0" /> {dateLabel}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="size-3.5 shrink-0" /> {event.venue}
              </span>
            </div>
            <div className="mt-4 w-full max-w-md">
              <Countdown
                targetMs={FEATURED_EVENT.targetMs}
                variant="hero"
                labels={countdownLabels}
              />
            </div>
          </div>
        </motion.div>

        <motion.section
          initial={{ y: 14 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-4"
        >
          <h2 className="mb-3 text-lg font-bold tracking-tight">{t.locationTitle}</h2>
          <VenueMapCard
            lat={event.lat}
            lng={event.lng}
            venue={event.venue}
            address={event.address}
            mapsUrl={event.mapsUrl}
            mapsLabel={t.openMaps}
          />
        </motion.section>

        <motion.section
          initial={{ y: 14 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.18 }}
          className="mt-6"
        >
          <div className="mb-3">
            <h2 className="text-lg font-bold tracking-tight">{t.videoTitle}</h2>
            <p className="text-xs text-muted-foreground">{t.videoHint}</p>
          </div>

          <button
            type="button"
            onClick={openFullscreen}
            className="group relative block w-full overflow-hidden rounded-2xl bg-card shadow-dialog focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={t.openVideo}
          >
            <video
              ref={inlineRef}
              src={event.videoUrl}
              className={`aspect-video w-full object-cover transition-opacity ${fullscreen ? 'opacity-0' : 'opacity-100'}`}
              muted
              loop
              playsInline
              autoPlay
              preload="auto"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
                <VolumeX className="size-3.5" /> {t.muted}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-primary-foreground opacity-90 transition-opacity group-hover:opacity-100">
                <Maximize2 className="size-3.5" /> {t.watch}
              </span>
            </div>
          </button>
        </motion.section>

        <motion.div
          key={`welcome-${lang}`}
          initial={{ y: 14 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.24 }}
          className="mt-6"
        >
          <Card className="space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <Heart className="size-4 fill-current" />
              <h2 className="text-[15px] font-bold text-foreground">{t.welcomeTitle}</h2>
            </div>
            <p className="event-welcome text-[19px] leading-relaxed text-foreground/90">
              {t.welcomeMessage}
            </p>
            {event.hashtag ? (
              <p className="text-xs font-bold text-primary">{event.hashtag}</p>
            ) : null}
          </Card>
        </motion.div>

        <motion.div
          key={`verse-${lang}`}
          initial={{ y: 14 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4"
        >
          <Card className="relative overflow-hidden border border-primary/10 bg-gradient-to-br from-card to-elevated">
            <BookOpen className="absolute -right-2 -top-2 size-24 text-primary/10" />
            <p className="relative text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
              {t.scripture}
            </p>
            <p className="event-verse relative mt-3 text-balance text-[19px] leading-relaxed text-foreground">
              &ldquo;{t.bibleText}&rdquo;
            </p>
            <p className="relative mt-3 text-xs font-bold text-muted-foreground">
              — {t.bibleReference}
            </p>
          </Card>
        </motion.div>

        <motion.section
          key={`schedule-${lang}`}
          initial={{ y: 14 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.36 }}
          className="mt-6"
        >
          <h2 className="mb-3 text-lg font-bold tracking-tight">{t.scheduleTitle}</h2>
          <Card className="space-y-0 p-2">
            {t.schedule.map((item, i) => (
              <div
                key={item.time}
                className="flex gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-accent"
              >
                <div className="flex w-[4.5rem] shrink-0 flex-col items-start sm:w-20">
                  <span className="flex items-center gap-1 text-[11px] font-bold text-primary">
                    <Clock className="size-3 shrink-0" />
                    {item.time}
                  </span>
                </div>
                <div className="relative min-w-0 flex-1 border-l border-border pl-3">
                  {i < t.schedule.length - 1 ? (
                    <span className="absolute -left-px top-5 bottom-[-12px] w-px bg-border" />
                  ) : null}
                  <p className="text-sm font-bold text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.detail}</p>
                </div>
              </div>
            ))}
          </Card>
        </motion.section>

        <motion.div
          key={`meta-${lang}`}
          initial={{ y: 14 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.42 }}
          className="mt-4 grid grid-cols-2 gap-3"
        >
          <Card>
            <Shirt className="size-5 text-primary" />
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              {t.dressCode}
            </p>
            <p className="mt-1 text-sm font-bold leading-snug">{t.dressCodeValue}</p>
          </Card>
          <Card>
            <CalendarDays className="size-5 text-primary" />
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              {t.date}
            </p>
            <p className="mt-1 text-sm font-bold leading-snug">{dateLabel}</p>
          </Card>
        </motion.div>

        <p className="mt-10 text-center text-xs text-muted-foreground/60">{t.footer}</p>
      </div>

      <AnimatePresence>
        {fullscreen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col bg-black"
          >
            <div className="flex items-center justify-between px-4 py-3 sm:px-6">
              <div>
                <p className="event-names text-lg text-white">
                  {event.groom} <span className="event-amp text-primary"> &amp; </span> {event.bride}
                </p>
                <p className="text-[11px] text-white/60">{t.videoCloseHint}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleMute}
                  className="grid size-10 place-items-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                  aria-label={muted ? t.unmute : t.mute}
                >
                  {muted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
                </button>
                <button
                  type="button"
                  onClick={closeFullscreen}
                  className="grid size-10 place-items-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                  aria-label={t.closeVideo}
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>
            <div className="relative flex flex-1 items-center justify-center px-2 pb-6">
              <video
                ref={fsRef}
                src={event.videoUrl}
                className="max-h-full w-full max-w-5xl object-contain"
                autoPlay
                loop
                playsInline
                muted={muted}
                controls
                onLoadedData={(e) => {
                  const el = e.currentTarget
                  el.muted = muted
                  el.play().catch(() => {})
                }}
              />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  )
}
