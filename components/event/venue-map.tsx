'use client'

import { MapPin, Navigation } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Locked satellite map (Google Maps embed, t=k).
 * pointer-events-none → no pan/slide. Pin is Google's marker on the venue.
 * Works on mobile LAN as long as the phone can reach Google.
 */
export function VenueMapCard({
  lat,
  lng,
  venue,
  address,
  mapsUrl,
  mapsLabel,
  className,
}: {
  lat: number
  lng: number
  venue: string
  address: string
  mapsUrl: string
  mapsLabel: string
  className?: string
}) {
  const embedSrc = `https://maps.google.com/maps?q=${lat},${lng}&ll=${lat},${lng}&z=17&t=k&output=embed&iwloc=near`

  return (
    <div className={cn('overflow-hidden rounded-xl bg-card shadow-card', className)}>
      <div className="relative aspect-[16/10] w-full select-none overflow-hidden bg-elevated sm:aspect-[2/1]">
        <iframe
          title={`Satellite map — ${venue}`}
          src={embedSrc}
          className="pointer-events-none absolute inset-0 h-full w-full border-0"
          loading="eager"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
        {/* Capture gestures so the map never slides */}
        <div className="absolute inset-0 z-10 touch-none" aria-hidden />

        {/* Brand pin overlay centered on venue */}
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
          <div className="relative -translate-y-5">
            <span className="absolute bottom-0 left-1/2 h-2 w-3 -translate-x-1/2 rounded-full bg-black/50 blur-[2px]" />
            <span className="relative grid size-11 place-items-center rounded-full bg-primary text-primary-foreground shadow-dialog ring-[3px] ring-background">
              <MapPin className="size-5 fill-current" />
            </span>
          </div>
        </div>
      </div>

      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative z-20 flex items-center gap-3 p-4 transition-colors hover:bg-accent active:bg-accent"
      >
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
          <MapPin className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-foreground">{venue}</p>
          <p className="truncate text-xs text-muted-foreground">{address}</p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-elevated px-3 py-1.5 text-[11px] font-bold text-primary">
          <Navigation className="size-3.5" />
          {mapsLabel}
        </span>
      </a>
    </div>
  )
}
