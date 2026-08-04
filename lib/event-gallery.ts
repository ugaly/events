export type GalleryMediaType = 'image' | 'video'

export type GalleryMediaItem = {
  id: string
  type: GalleryMediaType
  src: string
  poster?: string
  /** Tailwind aspect class — varied heights for Pinterest masonry */
  aspect: string
  caption?: string
}

const FALLBACK_IMAGE = '/wedding-hero.png'

const unsplash = (id: string, w = 800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`

const ASPECTS = [
  'aspect-[3/4]',
  'aspect-square',
  'aspect-[4/5]',
  'aspect-[2/3]',
  'aspect-[5/6]',
  'aspect-[9/14]',
  'aspect-[3/5]',
  'aspect-[4/3]',
] as const

/**
 * Verified Unsplash IDs only (HTTP 200 checked).
 * Do not add IDs without verifying — broken URLs leave empty tiles.
 */
const PHOTOS = [
  'photo-1519741497674-611481863552',
  'photo-1511285560929-80b456fea0bc',
  'photo-1465495976277-4387d4b0b4c6',
  'photo-1520854221256-17451cc331bf',
  'photo-1583939003579-730e3918a45a',
  'photo-1460978812857-470ed1c77af0',
  'photo-1519225421980-715cb0215aed',
  'photo-1515934751635-c81c6bc9a2d8',
  'photo-1464366400600-7168b8af9bc3',
  'photo-1537633552985-df8429e8048b',
  'photo-1529636798458-92182e662485',
  'photo-1487412720507-e7ab37603c6f',
  'photo-1478144592103-25e218a04891',
  'photo-1511795409834-ef04bbd61622',
  'photo-1469371670807-013ccf25f16a',
  'photo-1606216794074-735e91aa2c92',
  'photo-1587271636175-90d58cdad458',
  'photo-1532712938310-34cb3982ef74',
  'photo-1504196606672-aef5c9cefc92',
  'photo-1542038784456-1ea8e935640e',
  'photo-1492691527719-9d1e07e534b4',
]

/** Verified Pexels video URLs only (HTTP 200). */
const VIDEOS = [
  {
    src: 'https://videos.pexels.com/video-files/3129957/3129957-uhd_2560_1440_25fps.mp4',
    poster: unsplash('photo-1519741497674-611481863552', 600),
  },
  {
    src: 'https://videos.pexels.com/video-files/3209298/3209298-uhd_2560_1440_25fps.mp4',
    poster: unsplash('photo-1511285560929-80b456fea0bc', 600),
  },
  {
    src: 'https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4',
    poster: unsplash('photo-1520854221256-17451cc331bf', 600),
  },
]

/** Long deterministic gallery — photos + videos interleaved. */
export function buildEventGallery(count = 72): GalleryMediaItem[] {
  const items: GalleryMediaItem[] = []
  for (let i = 0; i < count; i++) {
    const isVideo = i % 7 === 3 || i % 11 === 5
    if (isVideo) {
      const v = VIDEOS[i % VIDEOS.length]
      items.push({
        id: `vid-${i}`,
        type: 'video',
        src: v.src,
        poster: v.poster,
        aspect: i % 2 === 0 ? 'aspect-video' : 'aspect-[9/14]',
        caption: 'Highlight reel',
      })
    } else {
      // Mix local hero every 12th photo so something always paints offline
      const useLocal = i % 12 === 0
      items.push({
        id: `img-${i}`,
        type: 'image',
        src: useLocal ? FALLBACK_IMAGE : unsplash(PHOTOS[i % PHOTOS.length], 900),
        aspect: ASPECTS[i % ASPECTS.length],
        caption: 'Wedding moment',
      })
    }
  }
  return items
}

export const EVENT_GALLERY = buildEventGallery(72)
export const GALLERY_PAGE_SIZE = 14
export { FALLBACK_IMAGE }
