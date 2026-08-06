import type { EventLang } from '@/lib/i18n/event'
import type { DrinkCategoryId } from '@/lib/drinks-menu'

export type { EventLang }

export const DRINKS_I18N = {
  en: {
    tableCard: 'Table card',
    askTitle: 'Did you scan or tap the card from this table?',
    askBody:
      'We detected a table QR / NFC card. Confirm so we serve drinks to the right place.',
    scannedTable: 'Scanned table',
    seats: 'seats',
    yesTable: 'Yes — this is my table',
    noTable: 'No — choose another table',
    back: '← Back',
    chooseTitle: 'Choose your table',
    chooseBody: 'Search by number or zone, then select where you are seated.',
    searchPlaceholder: 'Search T-05, garden, VIP…',
    tablesCount: (n: number) => `${n} ${n === 1 ? 'table' : 'tables'}`,
    fromScan: '· from your scan',
    noTables: (q: string) => `No tables match “${q}”`,
    complimentary: 'Complimentary drinks',
    heroBody: (table: string) =>
      `Included with your invitation — pick drinks for the table and confirm. Staff will serve ${table}.`,
    all: 'All',
    nonAlc: 'Non-alc',
    alcoholic: 'Alcoholic',
    nonAlcoholic: 'Non-alcoholic',
    included: 'included',
    popular: 'Popular',
    addedToOrder: 'Added to order',
    tapToAdd: 'Tap photo to add',
    add: 'Add',
    noDrinks: 'No drinks in this filter',
    tryCategory: 'Try another category',
    drink: 'drink',
    drinks: 'drinks',
    reviewOrder: 'Review order',
    confirm: 'Confirm',
    yourDrinks: 'Your drinks',
    orderConfirmed: 'Order confirmed',
    complimentaryShort: 'complimentary',
    onWay: (table: string) => `On its way to ${table}`,
    orderLabel: 'Order',
    noPayment: 'Included with the event — no payment.',
    qty: 'Qty',
    itemsTo: (qty: number, unit: string, table: string) =>
      `${qty} ${unit} · served to ${table}`,
    item: 'item',
    items: 'items',
    orderMore: 'Order more drinks',
    confirmOrder: 'Confirm order',
    close: 'Close',
    categories: {
      sodas: 'Sodas',
      soft: 'Soft drinks',
      water: 'Water',
      malt: 'Malt drinks',
      dafu: 'Dafu',
      mocktails: 'Mocktails',
      beer: 'Beer',
      cocktails: 'Cocktails',
    } satisfies Record<DrinkCategoryId, string>,
    zones: {
      'Main hall': 'Main hall',
      'Garden terrace': 'Garden terrace',
      'VIP lounge': 'VIP lounge',
      'Family wing': 'Family wing',
    } as Record<string, string>,
  },
  sw: {
    tableCard: 'Kadi ya meza',
    askTitle: 'Je, umeskani au kugusa kadi kutoka meza hii?',
    askBody:
      'Tumeona QR / NFC ya meza. Thibitisha ili tunywe vinywaji vipelekwe mahali sahihi.',
    scannedTable: 'Meza iliyoskaniwa',
    seats: 'viti',
    yesTable: 'Ndiyo — hii ni meza yangu',
    noTable: 'Hapana — chagua meza nyingine',
    back: '← Rudi',
    chooseTitle: 'Chagua meza yako',
    chooseBody: 'Tafuta kwa nambari au eneo, kisha chagua unakoketi.',
    searchPlaceholder: 'Tafuta T-05, bustani, VIP…',
    tablesCount: (n: number) => `${n} ${n === 1 ? 'meza' : 'meza'}`,
    fromScan: '· kutoka skani yako',
    noTables: (q: string) => `Hakuna meza inayolingana na “${q}”`,
    complimentary: 'Vinywaji bila malipo',
    heroBody: (table: string) =>
      `Vimejumuishwa kwenye mwaliko — chagua vinywaji vya meza na thibitisha. Wahudumu wataleta kwa ${table}.`,
    all: 'Zote',
    nonAlc: 'Bila pombe',
    alcoholic: 'Zenye pombe',
    nonAlcoholic: 'Bila pombe',
    included: 'zimejumuishwa',
    popular: 'Maarufu',
    addedToOrder: 'Imeongezwa kwenye oda',
    tapToAdd: 'Gusa picha kuongeza',
    add: 'Ongeza',
    noDrinks: 'Hakuna vinywaji kwenye chujio hili',
    tryCategory: 'Jaribu kategoria nyingine',
    drink: 'kinywaji',
    drinks: 'vinywaji',
    reviewOrder: 'Angalia oda',
    confirm: 'Thibitisha',
    yourDrinks: 'Vinywaji vyako',
    orderConfirmed: 'Oda imethibitishwa',
    complimentaryShort: 'bila malipo',
    onWay: (table: string) => `Inaelekea ${table}`,
    orderLabel: 'Oda',
    noPayment: 'Zimejumuishwa kwenye tukio — hakuna malipo.',
    qty: 'Idadi',
    itemsTo: (qty: number, unit: string, table: string) =>
      `${qty} ${unit} · kwa ${table}`,
    item: 'kipengee',
    items: 'vipengee',
    orderMore: 'Agiza vinywaji zaidi',
    confirmOrder: 'Thibitisha oda',
    close: 'Funga',
    categories: {
      sodas: 'Soda',
      soft: 'Vinywaji laini',
      water: 'Maji',
      malt: 'Malta',
      dafu: 'Dafu',
      mocktails: 'Mocktails',
      beer: 'Bia',
      cocktails: 'Cocktails',
    } satisfies Record<DrinkCategoryId, string>,
    zones: {
      'Main hall': 'Ukumbi mkuu',
      'Garden terrace': 'Uwanda wa bustani',
      'VIP lounge': 'VIP lounge',
      'Family wing': 'Eneo la familia',
    } as Record<string, string>,
  },
} as const

export type DrinksCopy = (typeof DRINKS_I18N)[EventLang]

export const DRINKS_LANG_KEY = 'habari-event-lang'

export function readDrinksLang(): EventLang {
  if (typeof window === 'undefined') return 'en'
  try {
    return localStorage.getItem(DRINKS_LANG_KEY) === 'sw' ? 'sw' : 'en'
  } catch {
    return 'en'
  }
}
