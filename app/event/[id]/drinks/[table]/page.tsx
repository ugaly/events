'use client'

import {
  Check,
  ChevronRight,
  GlassWater,
  Minus,
  Nfc,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  UtensilsCrossed,
  Wine,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { FEATURED_EVENT } from '@/lib/data'
import {
  DRINKS_I18N,
  DRINKS_LANG_KEY,
  readDrinksLang,
  type EventLang,
} from '@/lib/i18n/drinks'
import {
  DRINK_CATEGORIES,
  DRINKS_MENU,
  EVENT_TABLES,
  normalizeTableCode,
  type DrinkAlcohol,
  type DrinkCategoryId,
  type DrinkItem,
} from '@/lib/drinks-menu'

type CartLine = { item: DrinkItem; qty: number }
type AlcoholFilter = 'all' | DrinkAlcohol
type Gate = 'ask' | 'pick' | 'menu'

const FALLBACK_IMG = '/wedding-hero.png'

function LangToggle({
  lang,
  onChange,
  light,
}: {
  lang: EventLang
  onChange: (l: EventLang) => void
  light?: boolean
}) {
  return (
    <div
      className={`inline-flex h-11 items-center rounded-full p-1 ${
        light ? 'bg-black/45 backdrop-blur-md' : 'bg-elevated shadow-card'
      }`}
    >
      <button
        type="button"
        onClick={() => onChange('en')}
        className={`h-9 rounded-full px-3.5 text-[12px] font-bold transition-colors ${
          lang === 'en'
            ? 'bg-primary text-primary-foreground'
            : light
              ? 'text-white/75'
              : 'text-muted-foreground'
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => onChange('sw')}
        className={`h-9 rounded-full px-3.5 text-[12px] font-bold transition-colors ${
          lang === 'sw'
            ? 'bg-primary text-primary-foreground'
            : light
              ? 'text-white/75'
              : 'text-muted-foreground'
        }`}
      >
        SW
      </button>
    </div>
  )
}

/*
 * EVENT DRINKS ORDER — /event/:id/drinks/:table
 * Gate: confirm scanned table QR / card, or pick another table.
 */

export default function EventDrinksPage() {
  const params = useParams<{ id: string; table: string }>()
  const router = useRouter()
  const eventId = String(params?.id ?? '1001')
  const scannedTable = normalizeTableCode(params?.table)
  const event = FEATURED_EVENT

  const [lang, setLang] = useState<EventLang>(readDrinksLang)
  const t = DRINKS_I18N[lang]

  function changeLang(next: EventLang) {
    setLang(next)
    try {
      localStorage.setItem(DRINKS_LANG_KEY, next)
    } catch {
      /* ignore */
    }
  }

  function zoneLabel(zone: string) {
    return t.zones[zone] ?? zone
  }

  const [gate, setGate] = useState<Gate>('ask')
  const [table, setTable] = useState(scannedTable)
  const [tableQuery, setTableQuery] = useState('')
  const skipGateReset = useRef(false)

  const [alcohol, setAlcohol] = useState<AlcoholFilter>('all')
  const [activeCat, setActiveCat] = useState<DrinkCategoryId | 'all'>('all')
  const [cart, setCart] = useState<Record<string, number>>({})
  const [sheetOpen, setSheetOpen] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [orderNo, setOrderNo] = useState('')

  // Re-ask only when the QR URL table changes from outside (not after picker select)
  useEffect(() => {
    if (skipGateReset.current) {
      skipGateReset.current = false
      setTable(scannedTable)
      return
    }
    setTable(scannedTable)
    setGate('ask')
    setTableQuery('')
  }, [scannedTable])

  const filteredTables = useMemo(() => {
    const q = tableQuery.trim().toLowerCase()
    if (!q) return EVENT_TABLES
    return EVENT_TABLES.filter(
      (t) =>
        t.code.toLowerCase().includes(q) ||
        t.zone.toLowerCase().includes(q) ||
        t.code.replace('-', '').toLowerCase().includes(q.replace(/^t-?/, '')),
    )
  }, [tableQuery])

  function confirmScannedTable() {
    setTable(scannedTable)
    setGate('menu')
  }

  function selectTable(code: string) {
    const next = normalizeTableCode(code)
    skipGateReset.current = true
    setTable(next)
    setGate('menu')
    setCart({})
    setConfirmed(false)
    setSheetOpen(false)
    router.replace(`/event/${eventId}/drinks/${next}`)
  }

  const categories = useMemo(() => {
    if (alcohol === 'all') return DRINK_CATEGORIES
    return DRINK_CATEGORIES.filter((c) => c.alcohol === alcohol || c.alcohol === 'both')
  }, [alcohol])

  const items = useMemo(() => {
    return DRINKS_MENU.filter((d) => {
      if (alcohol !== 'all' && d.alcohol !== alcohol) return false
      if (activeCat !== 'all' && d.category !== activeCat) return false
      return true
    })
  }, [alcohol, activeCat])

  const grouped = useMemo(() => {
    const map = new Map<DrinkCategoryId, DrinkItem[]>()
    for (const d of items) {
      const list = map.get(d.category) ?? []
      list.push(d)
      map.set(d.category, list)
    }
    return DRINK_CATEGORIES.filter((c) => map.has(c.id)).map((c) => ({
      ...c,
      items: map.get(c.id)!,
    }))
  }, [items])

  const lines: CartLine[] = useMemo(
    () =>
      Object.entries(cart)
        .filter(([, qty]) => qty > 0)
        .map(([id, qty]) => {
          const item = DRINKS_MENU.find((d) => d.id === id)!
          return { item, qty }
        }),
    [cart],
  )

  const totalQty = lines.reduce((s, l) => s + l.qty, 0)

  useEffect(() => {
    if (!sheetOpen) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [sheetOpen])

  function setQty(id: string, next: number) {
    setCart((prev) => {
      const copy = { ...prev }
      if (next <= 0) delete copy[id]
      else copy[id] = next
      return copy
    })
    setConfirmed(false)
  }

  function toggleItem(id: string) {
    setQty(id, (cart[id] ?? 0) > 0 ? 0 : 1)
  }

  function confirmOrder() {
    if (!lines.length) return
    setOrderNo(`DRK-${Date.now().toString().slice(-6)}`)
    setConfirmed(true)
  }

  function clearOrder() {
    setCart({})
    setConfirmed(false)
    setSheetOpen(false)
    setOrderNo('')
  }

  /* —— Table confirmation / picker gate —— */
  if (gate !== 'menu') {
    const scannedMeta = EVENT_TABLES.find((t) => t.code === scannedTable)

    return (
      <main className="relative flex min-h-dvh flex-col overflow-x-hidden bg-background lg:px-6">
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: `url(${event.image})` }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/70 via-background to-background" />

        <header className="relative z-10 mx-auto flex w-full max-w-lg items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:max-w-2xl">
          <Link href="/" className="flex min-w-0 items-center gap-2">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
              <Sparkles className="size-4" />
            </span>
            <span className="truncate text-sm font-bold">Habari Events</span>
          </Link>
          <LangToggle lang={lang} onChange={changeLang} />
        </header>

        <div className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col px-4 pb-8 sm:px-6 lg:max-w-xl">
          {gate === 'ask' ? (
            <div className="flex flex-1 flex-col justify-center">
              <div className="rounded-3xl bg-card p-6 shadow-dialog ring-1 ring-border/50">
                <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-primary/15 text-primary">
                  <Nfc className="size-8" />
                </span>
                <p className="mt-5 text-center text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
                  {t.tableCard}
                </p>
                <h1 className="mt-2 text-center text-2xl font-bold leading-tight">{t.askTitle}</h1>
                <p className="mt-2 text-center text-sm leading-relaxed text-muted-foreground">
                  {t.askBody}
                </p>

                <div className="mt-6 rounded-2xl bg-elevated/80 px-4 py-5 text-center ring-1 ring-border/40">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {t.scannedTable}
                  </p>
                  <p className="mt-1 text-4xl font-bold tracking-tight text-primary">{scannedTable}</p>
                  {scannedMeta ? (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {zoneLabel(scannedMeta.zone)} · {scannedMeta.seats} {t.seats}
                    </p>
                  ) : null}
                  <p className="event-names mt-3 text-xl text-foreground">
                    {event.groom} <span className="event-amp text-primary">&amp;</span> {event.bride}
                  </p>
                </div>

                <div className="mt-6 space-y-2.5">
                  <button
                    type="button"
                    onClick={confirmScannedTable}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-dialog"
                  >
                    <Check className="size-4" /> {t.yesTable}
                  </button>
                  <button
                    type="button"
                    onClick={() => setGate('pick')}
                    className="flex h-12 w-full items-center justify-center rounded-full bg-elevated text-sm font-bold text-foreground hover:bg-accent"
                  >
                    {t.noTable}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex min-h-0 flex-1 flex-col pt-2">
              <button
                type="button"
                onClick={() => setGate('ask')}
                className="mb-3 self-start text-xs font-bold text-muted-foreground hover:text-foreground"
              >
                {t.back}
              </button>
              <h1 className="text-2xl font-bold tracking-tight">{t.chooseTitle}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{t.chooseBody}</p>

              <div className="relative mt-4">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  value={tableQuery}
                  onChange={(e) => setTableQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  autoFocus
                  className="h-12 w-full rounded-full border border-border bg-elevated pl-10 pr-4 text-sm font-medium outline-none ring-primary/40 placeholder:text-muted-foreground focus:ring-2"
                />
              </div>

              <p className="mt-3 text-xs font-semibold text-muted-foreground">
                {t.tablesCount(filteredTables.length)}
              </p>

              <ul className="mt-2 min-h-0 flex-1 space-y-2 overflow-y-auto pb-4 lg:grid lg:grid-cols-2 lg:gap-3 lg:space-y-0">
                {filteredTables.map((row) => {
                  const isScanned = row.code === scannedTable
                  return (
                    <li key={row.code}>
                      <button
                        type="button"
                        onClick={() => selectTable(row.code)}
                        className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left shadow-card transition active:scale-[0.99] ${
                          isScanned
                            ? 'bg-primary/12 ring-2 ring-primary/50'
                            : 'bg-card ring-1 ring-border/40 hover:bg-accent'
                        }`}
                      >
                        <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-elevated font-mono text-sm font-bold text-primary">
                          {row.code.replace('T-', '')}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-bold">{row.code}</span>
                          <span className="block text-xs text-muted-foreground">
                            {zoneLabel(row.zone)} · {row.seats} {t.seats}
                            {isScanned ? ` ${t.fromScan}` : ''}
                          </span>
                        </span>
                        <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                      </button>
                    </li>
                  )
                })}
                {filteredTables.length === 0 ? (
                  <li className="rounded-2xl bg-card py-12 text-center text-sm text-muted-foreground">
                    {t.noTables(tableQuery)}
                  </li>
                ) : null}
              </ul>
            </div>
          )}
        </div>
      </main>
    )
  }

  return (
    <main className="relative min-h-dvh bg-background pb-28 lg:pb-32">
      <div className="mx-auto w-full max-w-3xl lg:max-w-[840px]">
      <section className="relative isolate overflow-hidden lg:rounded-b-3xl">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${event.image})` }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(180deg, rgba(18,18,18,0.55) 0%, rgba(18,18,18,0.35) 40%, rgba(18,18,18,0.96) 100%),
              linear-gradient(120deg, rgba(30,215,96,0.2) 0%, transparent 50%)
            `,
          }}
        />
        <div className="relative z-10 px-4 pb-6 pt-4 sm:px-6 lg:px-8 lg:pb-8 lg:pt-6">
          <div className="flex items-center justify-between gap-3 lg:mx-auto lg:max-w-2xl">
            <Link href="/" className="flex min-w-0 items-center gap-2">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                <Sparkles className="size-4" />
              </span>
              <span className="truncate text-sm font-bold text-white">Habari Events</span>
            </Link>
            <div className="flex items-center gap-2">
              <LangToggle lang={lang} onChange={changeLang} light />
              <span
                role="button"
                tabIndex={0}
                onClick={() => setGate('ask')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') setGate('ask')
                }}
                className="cursor-pointer rounded-full bg-black/45 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white backdrop-blur-md hover:bg-black/60"
              >
                {table}
              </span>
            </div>
          </div>

          <div className="mt-8 lg:mx-auto lg:max-w-2xl lg:text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
              {t.complimentary}
            </p>
            <h1 className="event-names mt-2 text-4xl text-white sm:text-5xl lg:text-6xl">
              {event.groom} <span className="event-amp text-primary">&amp;</span> {event.bride}
            </h1>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/80 lg:mx-auto lg:max-w-lg lg:text-base">
              {t.heroBody(table)}
            </p>
          </div>
        </div>
      </section>

      {/* Sticky filters */}
      <div className="sticky top-0 z-30 border-b border-border/50 bg-background/95 shadow-[0_8px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl lg:rounded-b-2xl">
        {/* Alcohol segmented control */}
        <div className="px-4 pt-3 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-2xl rounded-2xl bg-elevated p-1.5 shadow-inner">
            {(
              [
                { id: 'all' as const, label: t.all, icon: GlassWater },
                { id: 'non-alcoholic' as const, label: t.nonAlc, icon: GlassWater },
                { id: 'alcoholic' as const, label: t.alcoholic, icon: Wine },
              ]
            ).map((f) => {
              const Icon = f.icon
              const active = alcohol === f.id
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    setAlcohol(f.id)
                    setActiveCat('all')
                  }}
                  className={`relative flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-[12px] font-bold transition-all duration-200 ${
                    active
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className={`size-3.5 ${active ? 'opacity-100' : 'opacity-70'}`} />
                  {f.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Category image tabs */}
        <div className="mx-auto mt-3 flex max-w-2xl gap-3 overflow-x-auto px-4 pb-3.5 pt-1 no-scrollbar sm:px-6 lg:flex-wrap lg:justify-center lg:overflow-visible lg:px-8">
          <button
            type="button"
            onClick={() => setActiveCat('all')}
            className="group flex w-[72px] shrink-0 flex-col items-center gap-1.5"
          >
            <span
              className={`grid size-[64px] place-items-center overflow-hidden rounded-2xl transition-all duration-200 ${
                activeCat === 'all'
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30 ring-2 ring-primary ring-offset-2 ring-offset-background'
                  : 'bg-elevated text-muted-foreground ring-1 ring-border/60 group-hover:ring-primary/40'
              }`}
            >
              <Sparkles className="size-6" />
            </span>
            <span
              className={`text-[11px] font-bold ${
                activeCat === 'all' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {t.all}
            </span>
          </button>

          {categories.map((c) => {
            const active = activeCat === c.id
            const catLabel = t.categories[c.id]
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveCat(c.id)}
                className="group flex w-[72px] shrink-0 flex-col items-center gap-1.5"
              >
                <span
                  className={`relative size-[64px] overflow-hidden rounded-2xl transition-all duration-200 ${
                    active
                      ? 'shadow-lg shadow-primary/25 ring-2 ring-primary ring-offset-2 ring-offset-background'
                      : 'ring-1 ring-border/50 group-hover:ring-primary/40'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.thumb}
                    alt=""
                    className="size-full object-cover transition duration-300 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const el = e.currentTarget
                      if (!el.src.endsWith(FALLBACK_IMG)) el.src = FALLBACK_IMG
                    }}
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                  {active ? (
                    <span className="absolute inset-0 grid place-items-center bg-primary/25">
                      <Check className="size-5 text-white drop-shadow" strokeWidth={3} />
                    </span>
                  ) : null}
                </span>
                <span
                  className={`truncate text-[11px] font-bold ${
                    active ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {catLabel}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Menu — large images, no prices */}
      <div className="space-y-8 px-4 py-5 sm:px-6 lg:px-8">
        {grouped.map((section) => (
          <section key={section.id} id={`cat-${section.id}`}>
            <div className="relative mb-3.5 flex items-end justify-between gap-3">
              <div className="flex-1 lg:text-center">
                <h2 className="text-lg font-bold tracking-tight lg:text-xl">{t.categories[section.id]}</h2>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {section.alcohol === 'alcoholic' ? t.alcoholic : t.nonAlcoholic} · {t.included}
                  <span className="lg:hidden"> · {section.items.length}</span>
                </p>
              </div>
              <span className="hidden text-xs text-muted-foreground lg:inline">{section.items.length}</span>
            </div>

            <ul className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
              {section.items.map((drink) => {
                const qty = cart[drink.id] ?? 0
                const selected = qty > 0
                return (
                  <li key={drink.id}>
                    <article
                      className={`overflow-hidden rounded-2xl bg-card shadow-card transition-[box-shadow,ring,transform] ${
                        selected
                          ? 'ring-2 ring-primary/80 shadow-dialog'
                          : 'ring-1 ring-border/40'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleItem(drink.id)}
                        className="relative block w-full"
                        aria-label={selected ? `Remove ${drink.name}` : `Add ${drink.name}`}
                      >
                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-elevated sm:aspect-[2/1]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={drink.image}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              const el = e.currentTarget
                              if (!el.src.endsWith(FALLBACK_IMG)) el.src = FALLBACK_IMG
                            }}
                            className="size-full object-cover transition duration-500 hover:scale-[1.03]"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                          {drink.popular ? (
                            <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary-foreground shadow-md">
                              {t.popular}
                            </span>
                          ) : null}
                          <span
                            className={`absolute bottom-3 right-3 grid size-11 place-items-center rounded-full shadow-lg transition ${
                              selected
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-white/90 text-background'
                            }`}
                          >
                            {selected ? (
                              <Check className="size-5" strokeWidth={3} />
                            ) : (
                              <Plus className="size-5" />
                            )}
                          </span>
                          <div className="absolute inset-x-0 bottom-0 p-4 pr-16 text-left">
                            <h3 className="text-lg font-bold text-white drop-shadow sm:text-xl">
                              {drink.name}
                            </h3>
                            <p className="mt-0.5 line-clamp-2 text-xs text-white/80 sm:text-sm">
                              {drink.description}
                            </p>
                          </div>
                        </div>
                      </button>

                      <div className="flex items-center justify-between gap-3 px-4 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                          {selected ? t.addedToOrder : t.tapToAdd}
                        </p>
                        {selected ? (
                          <div className="inline-flex items-center gap-1 rounded-full bg-elevated p-0.5">
                            <button
                              type="button"
                              aria-label="Decrease"
                              onClick={() => setQty(drink.id, qty - 1)}
                              className="grid size-9 place-items-center rounded-full text-foreground hover:bg-accent"
                            >
                              <Minus className="size-3.5" />
                            </button>
                            <span className="min-w-7 text-center text-sm font-bold">{qty}</span>
                            <button
                              type="button"
                              aria-label="Increase"
                              onClick={() => setQty(drink.id, qty + 1)}
                              className="grid size-9 place-items-center rounded-full bg-primary text-primary-foreground"
                            >
                              <Plus className="size-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setQty(drink.id, 1)}
                            className="h-9 rounded-full bg-elevated px-4 text-[12px] font-bold text-foreground hover:bg-accent"
                          >
                            {t.add}
                          </button>
                        )}
                      </div>
                    </article>
                  </li>
                )
              })}
            </ul>
          </section>
        ))}

        {grouped.length === 0 ? (
          <div className="rounded-2xl bg-card py-16 text-center shadow-card">
            <UtensilsCrossed className="mx-auto size-8 text-muted-foreground" />
            <p className="mt-3 text-sm font-bold">{t.noDrinks}</p>
            <p className="mt-1 text-xs text-muted-foreground">{t.tryCategory}</p>
          </div>
        ) : null}
      </div>
      </div>

      {totalQty > 0 && !sheetOpen ? (
        <div className="fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2 lg:px-8">
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between gap-3 rounded-full bg-primary px-5 text-primary-foreground shadow-dialog transition active:scale-[0.99] lg:max-w-[840px]"
          >
            <span className="flex items-center gap-2.5">
              <span className="grid size-8 place-items-center rounded-full bg-primary-foreground/15">
                <ShoppingBag className="size-4" />
              </span>
              <span className="text-left">
                <span className="block text-[11px] font-semibold opacity-90">
                  {totalQty} {totalQty === 1 ? t.drink : t.drinks} · {table}
                </span>
                <span className="block text-sm font-bold">{t.reviewOrder}</span>
              </span>
            </span>
            <span className="flex items-center gap-1 text-sm font-bold">
              {t.confirm}
              <ChevronRight className="size-4" />
            </span>
          </button>
        </div>
      ) : null}

      {sheetOpen ? (
        <div className="fixed inset-0 z-50 flex flex-col justify-end lg:items-center lg:justify-center lg:p-8">
          <button
            type="button"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            aria-label={t.close}
            onClick={() => setSheetOpen(false)}
          />
          <div className="relative z-10 mx-auto max-h-[88dvh] w-full max-w-3xl overflow-hidden rounded-t-3xl bg-popover shadow-dialog lg:max-h-[min(720px,85dvh)] lg:max-w-[840px] lg:rounded-3xl">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                  {table} · {t.complimentaryShort}
                </p>
                <h2 className="text-lg font-bold">
                  {confirmed ? t.orderConfirmed : t.yourDrinks}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                className="grid size-9 place-items-center rounded-full bg-elevated text-muted-foreground hover:text-foreground"
                aria-label={t.close}
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="max-h-[50dvh] overflow-y-auto px-5 py-4">
              {confirmed ? (
                <div className="rounded-2xl bg-primary/12 p-5 text-center ring-1 ring-primary/25">
                  <span className="mx-auto grid size-12 place-items-center rounded-full bg-primary text-primary-foreground">
                    <Check className="size-6" strokeWidth={3} />
                  </span>
                  <p className="mt-3 text-base font-bold text-primary">{t.onWay(table)}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t.orderLabel}{' '}
                    <span className="font-mono font-bold text-foreground">{orderNo}</span>
                  </p>
                  <p className="mt-3 text-xs text-muted-foreground">{t.noPayment}</p>
                </div>
              ) : null}

              <ul className={`space-y-3 ${confirmed ? 'mt-4' : ''}`}>
                {lines.map(({ item, qty }) => (
                  <li key={item.id} className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt=""
                      className="size-16 rounded-xl object-cover sm:size-[4.5rem]"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const el = e.currentTarget
                        if (!el.src.endsWith(FALLBACK_IMG)) el.src = FALLBACK_IMG
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {t.qty} {qty}
                      </p>
                    </div>
                    {!confirmed ? (
                      <div className="inline-flex items-center gap-1 rounded-full bg-elevated p-0.5">
                        <button
                          type="button"
                          onClick={() => setQty(item.id, qty - 1)}
                          className="grid size-8 place-items-center rounded-full"
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span className="min-w-5 text-center text-sm font-bold">{qty}</span>
                        <button
                          type="button"
                          onClick={() => setQty(item.id, qty + 1)}
                          className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground"
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span className="rounded-full bg-primary/15 px-2.5 py-1 text-xs font-bold text-primary">
                        ×{qty}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-border px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <p className="mb-3 text-center text-xs text-muted-foreground">
                {t.itemsTo(totalQty, totalQty === 1 ? t.item : t.items, table)}
              </p>
              {confirmed ? (
                <button
                  type="button"
                  onClick={clearOrder}
                  className="flex h-12 w-full items-center justify-center rounded-full bg-elevated text-sm font-bold"
                >
                  {t.orderMore}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={confirmOrder}
                  disabled={!lines.length}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-dialog disabled:opacity-50"
                >
                  <Check className="size-4" /> {t.confirmOrder}
                </button>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </main>
  )
}
