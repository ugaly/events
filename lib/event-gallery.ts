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

/** Wedding / celebration photos (Unsplash) */
const PHOTOS = [
  'photo-1519741497674-611481863552',
  'photo-1511285560929-80b456fea0bc',
  'photo-1465495976277-4387d4b0b4c6',
  'photo-1520854221256-17451cc331bf',
  'photo-1606800052052-a08af952794b',
  'photo-1583939003579-730e3918a45a',
  'photo-1591604466107-ec95ef4d0b38',
  'photo-1523438885200-e635ba2c39bd',
  'photo-1460978812857-470ed1c77af0',
  'photo-1522673607200-164a2e4e2060',
  'photo-1519225421980-715cb0215aed',
  'photo-1507504031003-b417219a0fdd',
  'photo-1515934751635-c81c6bc9a2d8',
  'photo-1464366400600-7168b8af9bc3',
  'photo-1544070078-a212eba266e1',
  'photo-1537633552985-df8429e8048b',
  'photo-1529636798458-92182e662485',
  'photo-1487412720507-e7ab37603c6f',
  'photo-1478144592103-25e218a04891',
  'photo-1520855615960-71a4a5ba3d0a',
  'photo-1513278973558-df86dae1e0ff',
  'photo-1445090155690-44423873d7c0',
  'photo-1511795409834-ef04bbd61622',
  'photo-1469371670807-013ccf25f16a',
]

const VIDEOS = [
  {
    src: 'https://videos.pexels.com/video-files/3129957/3129957-uhd_2560_1440_25fps.mp4',
    poster: unsplash('photo-1519741497674-611481863552', 600),
  },
  {
    src: 'https://videos.pexels.com/video-files/4496279/4496279-uhd_2560_1440_25fps.mp4',
    poster: unsplash('photo-1511285560929-80b456fea0bc', 600),
  },
  {
    src: 'https://videos.pexels.com/video-files/4057529/4057529-uhd_2560_1440_25fps.mp4',
    poster: unsplash('photo-1520854221256-17451cc331bf', 600),
  },
  {
    src: 'https://videos.pexels.com/video-files/3209298/3209298-uhd_2560_1440_25fps.mp4',
    poster: unsplash('photo-1465495976277-4387d4b0b4c6', 600),
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
      items.push({
        id: `img-${i}`,
        type: 'image',
        src: unsplash(PHOTOS[i % PHOTOS.length], 900),
        aspect: ASPECTS[i % ASPECTS.length],
        caption: 'Wedding moment',
      })
    }
  }
  return items
}

export const EVENT_GALLERY = buildEventGallery(72)
export const GALLERY_PAGE_SIZE = 14
