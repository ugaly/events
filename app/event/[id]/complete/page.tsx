'use client'

import { Heart, Loader2, Play, Sparkles, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { use, useCallback, useEffect, useRef, useState } from 'react'
import {
  EVENT_GALLERY,
  FALLBACK_IMAGE,
  GALLERY_PAGE_SIZE,
  type GalleryMediaItem,
} from '@/lib/event-gallery'
import { FEATURED_EVENT } from '@/lib/data'
import { EVENT_I18N, type EventLang } from '@/lib/i18n/event'

const LANG_KEY = 'habari-event-lang'

/*
 * COMPLETED EVENT — /event/:id/complete
 * -------------------------------------
 * Thank-you hero + Pinterest-style photo/video masonry with infinite scroll.
 */

export default function EventCompletePage({ params }: { params: Promise<{ id: string }> }) {
  use(params) // keep route param wired for future per-event galleries
  const event = FEATURED_EVENT

  const [lang, setLang] = useState<EventLang>(() => {
    if (typeof window === 'undefined') return 'en'
    try {
      return localStorage.getItem(LANG_KEY) === 'sw' ? 'sw' : 'en'
    } catch {
      return 'en'
    }
  })
  const t = EVENT_I18N[lang]

  const [visibleCount, setVisibleCount] = useState(GALLERY_PAGE_SIZE)
  const [loadingMore, setLoadingMore] = useState(false)
  const [lightbox, setLightbox] = useState<GalleryMediaItem | null>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const loadingLock = useRef(false)

  const visible = EVENT_GALLERY.slice(0, visibleCount)
  const hasMore = visibleCount < EVENT_GALLERY.length

  const loadMore = useCallback(() => {
    if (loadingLock.current || !hasMore) return
    loadingLock.current = true
    setLoadingMore(true)
    // Simulate network fetch for a natural infinite-scroll feel
    window.setTimeout(() => {
      setVisibleCount((n) => Math.min(n + GALLERY_PAGE_SIZE, EVENT_GALLERY.length))
      setLoadingMore(false)
      loadingLock.current = false
    }, 480)
  }, [hasMore])

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore()
      },
      { rootMargin: '280px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [loadMore, visibleCount])

  useEffect(() => {
    if (!lightbox) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [lightbox])

  function changeLang(next: EventLang) {
    setLang(next)
    try {
      localStorage.setItem(LANG_KEY, next)
    } catch {
      /* ignore */
    }
  }

  return (
    <main className="relative min-h-dvh overflow-x-hidden bg-background">
      {/* —— Full-bleed thank-you hero —— */}
      <section className="relative isolate min-h-[78dvh] w-full sm:min-h-[85dvh]">
        <Image
          src={event.image || '/wedding-hero.png'}
          alt=""
          fill
          priority
          className="object-cover object-center"
        />
        {/* Linear gradients — atmosphere + readable text */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(180deg, rgba(18,18,18,0.45) 0%, rgba(18,18,18,0.15) 28%, rgba(18,18,18,0.55) 62%, rgba(18,18,18,0.97) 100%),
              linear-gradient(115deg, rgba(30,215,96,0.18) 0%, transparent 42%, rgba(18,18,18,0.25) 100%)
            `,
          }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-40"
          style={{
            background: 'linear-gradient(180deg, transparent, var(--background))',
          }}
        />

        <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-3 px-4 py-3 sm:px-8">
          <Link href="/" className="flex min-w-0 items-center gap-2">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
              <Sparkles className="size-4" />
            </span>
            <span className="truncate text-sm font-bold tracking-tight text-white">Habari Events</span>
          </Link>
          <div className="inline-flex h-11 items-center rounded-full bg-black/45 p-1 backdrop-blur-md">
            <button
              type="button"
              onClick={() => changeLang('en')}
              className={`h-9 rounded-full px-4 text-[12px] font-bold transition-colors ${
                lang === 'en' ? 'bg-primary text-primary-foreground' : 'text-white/75'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => changeLang('sw')}
              className={`h-9 rounded-full px-4 text-[12px] font-bold transition-colors ${
                lang === 'sw' ? 'bg-primary text-primary-foreground' : 'text-white/75'
              }`}
            >
              SW
            </button>
          </div>
        </header>

        <div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-14 pt-24 sm:px-8 sm:pb-16">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/95 px-3 py-1 text-[10.5px] font-bold uppercase tracking-wide text-primary-foreground">
              <Heart className="size-3 fill-current" />
              {t.typeWedding}
            </span>
            <h1 className="event-names mt-4 text-balance text-5xl text-white sm:text-6xl lg:text-7xl">
              {event.groom} <span className="event-amp text-primary">&amp;</span> {event.bride}
            </h1>
            <h2 className="event-welcome mt-5 text-balance text-2xl text-white sm:text-3xl">
              {t.thanksTitle}
            </h2>
            <p className="event-welcome mx-auto mt-3 max-w-lg text-balance text-[17px] leading-relaxed text-white/85">
              {t.thanksMessage}
            </p>
            {event.hashtag ? (
              <p className="mt-4 text-sm font-bold text-primary">{event.hashtag}</p>
            ) : null}
          </div>
        </div>
      </section>

      {/* —— Pinterest masonry gallery —— */}
      <section className="relative z-10 mx-auto max-w-5xl px-3 pb-20 pt-2 sm:px-6">
        <div className="mb-5 px-2 text-center sm:mb-7">
          <h3 className="text-lg font-bold tracking-tight">{t.galleryTitle}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{t.galleryHint}</p>
        </div>

        <div className="columns-2 gap-2.5 sm:gap-3.5 md:columns-3">
          {visible.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setLightbox(item)}
              className="group mb-2.5 block w-full break-inside-avoid overflow-hidden rounded-xl bg-elevated text-left shadow-card outline-none transition-[transform,box-shadow] duration-300 hover:scale-[1.01] hover:shadow-dialog focus-visible:ring-2 focus-visible:ring-primary sm:mb-3.5"
            >
              <div className={`relative w-full overflow-hidden ${item.aspect}`}>
                {item.type === 'image' ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.src}
                    alt={item.caption || ''}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const el = e.currentTarget
                      if (el.src.endsWith(FALLBACK_IMAGE)) return
                      el.src = FALLBACK_IMAGE
                    }}
                    className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.poster || FALLBACK_IMAGE}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const el = e.currentTarget
                        if (el.src.endsWith(FALLBACK_IMAGE)) return
                        el.src = FALLBACK_IMAGE
                      }}
                      className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                    <span className="absolute inset-0 grid place-items-center">
                      <span className="grid size-11 place-items-center rounded-full bg-black/55 text-white shadow-lg backdrop-blur-sm ring-1 ring-white/25 transition group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                        <Play className="size-5 fill-current pl-0.5" />
                      </span>
                    </span>
                    <span className="absolute bottom-2 left-2 rounded bg-black/55 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white/90 backdrop-blur-sm">
                      Video
                    </span>
                  </>
                )}
              </div>
            </button>
          ))}
        </div>

        <div ref={sentinelRef} className="flex min-h-12 items-center justify-center pt-6">
          {loadingMore ? (
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="size-3.5 animate-spin" />
              {t.loadingMore}
            </p>
          ) : hasMore ? (
            <p className="text-[11px] text-muted-foreground/50">{t.galleryHint}</p>
          ) : (
            <p className="event-welcome text-center text-base text-muted-foreground">
              {t.endOfGallery}
            </p>
          )}
        </div>
      </section>

      {/* —— Lightbox —— */}
      {lightbox ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/92 p-3 backdrop-blur-sm sm:p-6"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            aria-label={t.closeLightbox}
            onClick={() => setLightbox(null)}
            className="absolute right-3 top-3 z-10 grid size-11 place-items-center rounded-full bg-white/10 text-white backdrop-blur-md hover:bg-white/20 sm:right-5 sm:top-5"
          >
            <X className="size-5" />
          </button>

          <div
            className="relative max-h-[88dvh] w-full max-w-4xl overflow-hidden rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {lightbox.type === 'image' ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={lightbox.src}
                alt={lightbox.caption || ''}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const el = e.currentTarget
                  if (el.src.endsWith(FALLBACK_IMAGE)) return
                  el.src = FALLBACK_IMAGE
                }}
                className="mx-auto max-h-[88dvh] w-auto max-w-full object-contain"
              />
            ) : (
              <video
                key={lightbox.id}
                src={lightbox.src}
                poster={lightbox.poster || FALLBACK_IMAGE}
                controls
                autoPlay
                playsInline
                className="mx-auto max-h-[88dvh] w-full bg-black"
              />
            )}
          </div>
        </div>
      ) : null}
    </main>
  )
}
