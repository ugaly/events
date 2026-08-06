export type DrinkAlcohol = 'non-alcoholic' | 'alcoholic'

export type DrinkCategoryId =
  | 'sodas'
  | 'soft'
  | 'water'
  | 'malt'
  | 'beer'
  | 'dafu'
  | 'cocktails'
  | 'mocktails'

export type DrinkItem = {
  id: string
  name: string
  description: string
  price: number
  category: DrinkCategoryId
  alcohol: DrinkAlcohol
  image: string
  popular?: boolean
}

export type DrinkCategory = {
  id: DrinkCategoryId
  label: string
  short: string
  alcohol: DrinkAlcohol | 'both'
  /** Unsplash thumb for category tab */
  thumb: string
}

const img = (id: string, w = 640) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`

export const DRINK_CATEGORIES: DrinkCategory[] = [
  {
    id: 'sodas',
    label: 'Sodas',
    short: 'Sodas',
    alcohol: 'non-alcoholic',
    thumb: img('photo-1629203851122-3726ecdf080e', 200),
  },
  {
    id: 'soft',
    label: 'Soft drinks',
    short: 'Soft',
    alcohol: 'non-alcoholic',
    thumb: img('photo-1600271886742-f049cd451bba', 200),
  },
  {
    id: 'water',
    label: 'Water',
    short: 'Water',
    alcohol: 'non-alcoholic',
    thumb: img('photo-1523362628745-0c100150b504', 200),
  },
  {
    id: 'malt',
    label: 'Malt drinks',
    short: 'Malt',
    alcohol: 'non-alcoholic',
    thumb: img('photo-1572490122747-3968b75cc699', 200),
  },
  {
    id: 'dafu',
    label: 'Dafu',
    short: 'Dafu',
    alcohol: 'non-alcoholic',
    thumb: img('photo-1581006852262-e4307cf6283a', 200),
  },
  {
    id: 'mocktails',
    label: 'Mocktails',
    short: 'Mocktails',
    alcohol: 'non-alcoholic',
    thumb: img('photo-1513558161293-cdaf765ed2fd', 200),
  },
  {
    id: 'beer',
    label: 'Beer',
    short: 'Beer',
    alcohol: 'alcoholic',
    thumb: img('photo-1608270586620-248524c67de9', 200),
  },
  {
    id: 'cocktails',
    label: 'Cocktails',
    short: 'Cocktails',
    alcohol: 'alcoholic',
    thumb: img('photo-1514362545857-3bc16c4c7d1b', 200),
  },
]

/** Verified Unsplash drink photos only */
export const DRINKS_MENU: DrinkItem[] = [
  // Sodas
  {
    id: 'coca-cola',
    name: 'Coca-Cola',
    description: 'Classic chilled can · 330ml',
    price: 2500,
    category: 'sodas',
    alcohol: 'non-alcoholic',
    image: img('photo-1629203851122-3726ecdf080e'),
    popular: true,
  },
  {
    id: 'fanta-orange',
    name: 'Fanta Orange',
    description: 'Bright citrus soda · 330ml',
    price: 2500,
    category: 'sodas',
    alcohol: 'non-alcoholic',
    image: img('photo-1624517452488-04869289c4ca'),
    popular: true,
  },
  {
    id: 'pepsi',
    name: 'Pepsi',
    description: 'Ice-cold Pepsi · 330ml',
    price: 2500,
    category: 'sodas',
    alcohol: 'non-alcoholic',
    image: img('photo-1554866585-cd94860890b7'),
  },
  {
    id: 'sprite',
    name: 'Sprite',
    description: 'Lemon-lime sparkle · 330ml',
    price: 2500,
    category: 'sodas',
    alcohol: 'non-alcoholic',
    image: img('photo-1622597467836-f3285f2131b8'),
  },

  // Soft drinks
  {
    id: 'fresh-juice',
    name: 'Fresh Passion Juice',
    description: 'Seasonal passion fruit, lightly chilled',
    price: 4500,
    category: 'soft',
    alcohol: 'non-alcoholic',
    image: img('photo-1600271886742-f049cd451bba'),
    popular: true,
  },
  {
    id: 'lemonade',
    name: 'Citrus Lemonade',
    description: 'House lemonade with mint',
    price: 4000,
    category: 'soft',
    alcohol: 'non-alcoholic',
    image: img('photo-1546171753-97d7676e4602'),
  },
  {
    id: 'iced-tea',
    name: 'Iced Tea',
    description: 'Peach iced tea · tall glass',
    price: 3500,
    category: 'soft',
    alcohol: 'non-alcoholic',
    image: img('photo-1551024709-8f23befc6f87'),
  },

  // Water
  {
    id: 'kilimanjaro',
    name: 'Kilimanjaro Water',
    description: 'Still mineral water · 500ml',
    price: 1500,
    category: 'water',
    alcohol: 'non-alcoholic',
    image: img('photo-1523362628745-0c100150b504'),
    popular: true,
  },
  {
    id: 'afya',
    name: 'Afya Water',
    description: 'Purified drinking water · 500ml',
    price: 1200,
    category: 'water',
    alcohol: 'non-alcoholic',
    image: img('photo-1544145945-f90425340c7e'),
  },
  {
    id: 'sparkling-water',
    name: 'Sparkling Water',
    description: 'Light bubbles · 330ml',
    price: 2000,
    category: 'water',
    alcohol: 'non-alcoholic',
    image: img('photo-1625772299848-391b6a87d7b3'),
  },

  // Malt
  {
    id: 'grand-malta',
    name: 'Grand Malta',
    description: 'Non-alcoholic malt · chilled bottle',
    price: 3000,
    category: 'malt',
    alcohol: 'non-alcoholic',
    image: img('photo-1572490122747-3968b75cc699'),
    popular: true,
  },
  {
    id: 'malta-guinness',
    name: 'Malta Guinness',
    description: 'Classic malt energy · 330ml',
    price: 3000,
    category: 'malt',
    alcohol: 'non-alcoholic',
    image: img('photo-1595981267035-7b04ca84a82d'),
  },

  // Dafu
  {
    id: 'dafu-fresh',
    name: 'Fresh Dafu',
    description: 'Young coconut water, served in shell',
    price: 5000,
    category: 'dafu',
    alcohol: 'non-alcoholic',
    image: img('photo-1581006852262-e4307cf6283a'),
    popular: true,
  },
  {
    id: 'dafu-chilled',
    name: 'Chilled Dafu Cup',
    description: 'Iced coconut water with pulp',
    price: 4500,
    category: 'dafu',
    alcohol: 'non-alcoholic',
    image: img('photo-1600271886742-f049cd451bba'),
  },

  // Mocktails
  {
    id: 'virgin-mojito',
    name: 'Virgin Mojito',
    description: 'Mint, lime, soda — zero alcohol',
    price: 6000,
    category: 'mocktails',
    alcohol: 'non-alcoholic',
    image: img('photo-1513558161293-cdaf765ed2fd'),
    popular: true,
  },
  {
    id: 'sunset-cooler',
    name: 'Sunset Cooler',
    description: 'Orange, passion & grenadine',
    price: 6500,
    category: 'mocktails',
    alcohol: 'non-alcoholic',
    image: img('photo-1551538827-9c037cb4f32a'),
  },
  {
    id: 'berry-fizz',
    name: 'Berry Fizz',
    description: 'Mixed berries with sparkling water',
    price: 6000,
    category: 'mocktails',
    alcohol: 'non-alcoholic',
    image: img('photo-1536935338788-846bb9981813'),
  },

  // Beer
  {
    id: 'safari',
    name: 'Safari Lager',
    description: 'Tanzania’s classic lager · 500ml',
    price: 4500,
    category: 'beer',
    alcohol: 'alcoholic',
    image: img('photo-1608270586620-248524c67de9'),
    popular: true,
  },
  {
    id: 'heineken',
    name: 'Heineken',
    description: 'Premium lager · 330ml',
    price: 5500,
    category: 'beer',
    alcohol: 'alcoholic',
    image: img('photo-1436076863939-06870fe779c2'),
    popular: true,
  },
  {
    id: 'serengeti',
    name: 'Serengeti Lager',
    description: 'Smooth local lager · 500ml',
    price: 4500,
    category: 'beer',
    alcohol: 'alcoholic',
    image: img('photo-1571613316887-6f8d5cbf7ef7'),
  },

  // Cocktails
  {
    id: 'mojito',
    name: 'Classic Mojito',
    description: 'White rum, mint, lime & soda',
    price: 12000,
    category: 'cocktails',
    alcohol: 'alcoholic',
    image: img('photo-1514362545857-3bc16c4c7d1b'),
    popular: true,
  },
  {
    id: 'passion-martini',
    name: 'Passion Martini',
    description: 'Vodka & tropical passion foam',
    price: 14000,
    category: 'cocktails',
    alcohol: 'alcoholic',
    image: img('photo-1551024709-8f23befc6f87'),
  },
  {
    id: 'whisky-sour',
    name: 'Whisky Sour',
    description: 'Bourbon, lemon, sugar & bitters',
    price: 15000,
    category: 'cocktails',
    alcohol: 'alcoholic',
    image: img('photo-1551538827-9c037cb4f32a'),
  },
]

export function formatTzs(n: number) {
  return `TZS ${n.toLocaleString('en-TZ')}`
}

export function normalizeTableCode(raw: string | undefined) {
  if (!raw) return 'T-01'
  const cleaned = decodeURIComponent(raw).trim().toUpperCase()
  if (/^T-?\d+$/i.test(cleaned)) {
    const num = cleaned.replace(/\D/g, '')
    return `T-${num.padStart(2, '0')}`
  }
  return cleaned.slice(0, 12) || 'T-01'
}

/** Venue floor tables for QR / picker (demo) */
export const EVENT_TABLES = Array.from({ length: 40 }, (_, i) => {
  const code = `T-${String(i + 1).padStart(2, '0')}`
  const zone =
    i < 10 ? 'Main hall' : i < 20 ? 'Garden terrace' : i < 30 ? 'VIP lounge' : 'Family wing'
  return { code, zone, seats: 6 + (i % 4) * 2 }
})
