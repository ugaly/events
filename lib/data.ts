import type {
  ActivityItem,
  Attendee,
  AttendanceStatus,
  EventItem,
  EventType,
  GuestGroup,
  NfcCard,
  Owner,
  PermissionRequest,
  Scanner,
} from './types'

export const AVATARS = [
  '/avatars/a1.png',
  '/avatars/a2.png',
  '/avatars/a3.png',
  '/avatars/a4.png',
  '/avatars/a5.png',
  '/avatars/a6.png',
]

export const avatarFor = (i: number) => AVATARS[i % AVATARS.length]

/* ---------- Featured Wedding Event ---------- */
export const FEATURED_EVENT = {
  id: 'evt-1001',
  name: 'Afdhal Mabrouk & Khadija Hussein Wedding',
  bride: 'Khadija Hussein',
  groom: 'Afdhal Mabrouk',
  type: 'Wedding' as EventType,
  /** Display label */
  date: '2026-08-15 16:00:00',
  /**
   * Absolute countdown target: 15 Aug 2026, 16:00 East Africa Time (UTC+3)
   * = 13:00 UTC. Same on every phone/PC — no timezone / Date.parse bugs.
   */
  targetMs: Date.UTC(2026, 7, 15, 13, 0, 0),
  venue: 'The Superdome, Masaki',
  address: '206/207 Haile Selassie Road, Masaki, Dar es Salaam, Tanzania',
  /** Approximate pin for The Superdome Masaki (Plus Code 67PG+HC9 area) */
  lat: -6.7465,
  lng: 39.279,
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=The+Superdome+Masaki+Dar+es+Salaam+Tanzania',
  image: '/wedding-hero.png',
  /** Royalty-free wedding clip (Pexels). Plays muted by default. */
  videoUrl:
    'https://videos.pexels.com/video-files/3129957/3129957-uhd_2560_1440_25fps.mp4',
  invited: 480,
  welcomeTitle: 'You are warmly invited',
  welcomeMessage:
    'With joyful hearts, Afdhal and Khadija invite you to celebrate their union. Your presence will make this day complete — come share in the love, laughter, and blessings as two families become one.',
  bibleVerse: {
    reference: '1 Corinthians 13:4–7',
    text: 'Love is patient, love is kind. It does not envy, it does not boast, it is not proud. It does not dishonor others, it is not self-seeking, it is not easily angered, it keeps no record of wrongs. Love does not delight in evil but rejoices with the truth. It always protects, always trusts, always hopes, always perseveres.',
  },
  schedule: [
    { time: '3:00 PM', title: 'Guest arrival', detail: 'Welcome drinks at the foyer' },
    { time: '4:00 PM', title: 'Ceremony', detail: 'Main hall — The Superdome' },
    { time: '5:30 PM', title: 'Photos & greetings', detail: 'Garden terrace' },
    { time: '7:00 PM', title: 'Reception & dinner', detail: 'Celebration begins' },
    { time: '10:00 PM', title: 'Send-off', detail: 'Dance & farewell' },
  ],
  dressCode: 'Formal / Traditional elegant',
  hashtag: '#AfdhalAndKhadija',
}

const FIRST = [
  'Amina', 'Yusuf', 'Fatuma', 'Hassan', 'Zainab', 'Omar', 'Halima', 'Ibrahim',
  'Mariam', 'Said', 'Nasra', 'Abdi', 'Ruweida', 'Khalid', 'Sumaya', 'Farah',
  'Layla', 'Musa', 'Salma', 'Rashid', 'Nadia', 'Bakari', 'Aisha', 'Juma',
  'Warda', 'Tariq', 'Hawa', 'Idris', 'Rehema', 'Suleiman',
]
const LAST = [
  'Mohamed', 'Hussein', 'Abdalla', 'Ali', 'Ahmed', 'Omar', 'Bakari', 'Salim',
  'Juma', 'Rashid', 'Yusuf', 'Kassim', 'Hamisi', 'Mwinyi', 'Athman', 'Farah',
]

const STATUSES: AttendanceStatus[] = [
  'Checked In', 'Checked In', 'Checked In', 'Pending', 'Absent', 'Permission Requested', 'Late',
]
const GROUPS: GuestGroup[] = ['VIP', 'Family', 'Friends', 'Corporate', 'General']
const GATES = ['Gate A', 'Gate B', 'VIP Gate', 'Main Entrance']

const pad = (n: number, len = 3) => String(n).padStart(len, '0')

function seededTime(i: number): string {
  const h = 15 + Math.floor((i * 7) % 5)
  const m = (i * 13) % 60
  return `${pad(h, 2)}:${pad(m, 2)}`
}

export const ATTENDEES: Attendee[] = Array.from({ length: 186 }, (_, i) => {
  const first = FIRST[i % FIRST.length]
  const last = LAST[(i * 3) % LAST.length]
  const status = STATUSES[i % STATUSES.length]
  const group = GROUPS[i % GROUPS.length]
  const checkedIn = status === 'Checked In' || status === 'Late'
  return {
    id: `att-${1000 + i}`,
    invitationId: `INV-${pad(1000 + i, 4)}`,
    name: `${first} ${last}`,
    avatar: avatarFor(i),
    status,
    group,
    seat: `${String.fromCharCode(65 + (i % 8))}${pad((i % 20) + 1, 2)}`,
    table: `T-${pad((i % 30) + 1, 2)}`,
    gate: GATES[i % GATES.length],
    arrivalTime: checkedIn ? seededTime(i) : null,
    phone: `+2557${pad(10000000 + i * 137, 8)}`,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@example.com`,
    invitationCode: `HB-${pad(i * 7 + 42, 5)}`,
  }
})

export const STATS = {
  invited: FEATURED_EVENT.invited,
  attended: ATTENDEES.filter((a) => a.status === 'Checked In' || a.status === 'Late').length,
  absent: ATTENDEES.filter((a) => a.status === 'Absent').length,
  pending: ATTENDEES.filter((a) => a.status === 'Pending').length,
  permissionRequests: ATTENDEES.filter((a) => a.status === 'Permission Requested').length,
  late: ATTENDEES.filter((a) => a.status === 'Late').length,
  checkedInToday: 128,
}

export const ATTENDANCE_RATE = Math.round((STATS.attended / STATS.invited) * 100)

/* ---------- Hourly attendance (area/line chart) ---------- */
export const HOURLY_ATTENDANCE = [
  { hour: '2 PM', scans: 8 },
  { hour: '3 PM', scans: 34 },
  { hour: '4 PM', scans: 96 },
  { hour: '5 PM', scans: 148 },
  { hour: '6 PM', scans: 41 },
  { hour: '7 PM', scans: 22 },
  { hour: '8 PM', scans: 11 },
]

export const GATE_DISTRIBUTION = [
  { name: 'Main Entrance', value: 96, fill: 'var(--color-chart-1)' },
  { name: 'Gate A', value: 74, fill: 'var(--color-chart-2)' },
  { name: 'VIP Gate', value: 38, fill: 'var(--color-chart-3)' },
  { name: 'Gate B', value: 22, fill: 'var(--color-chart-4)' },
]

export const GROUP_BREAKDOWN = [
  { group: 'Family', count: 142 },
  { group: 'Friends', count: 118 },
  { group: 'VIP', count: 46 },
  { group: 'Corporate', count: 88 },
  { group: 'General', count: 86 },
]

/* ---------- Permission requests ---------- */
export const PERMISSION_REQUESTS: PermissionRequest[] = ATTENDEES.filter(
  (a) => a.status === 'Permission Requested',
)
  .slice(0, 12)
  .map((a, i) => ({
    id: `perm-${i}`,
    attendeeId: a.id,
    name: a.name,
    avatar: a.avatar,
    reason: [
      'Requesting to bring +1 (spouse)',
      'Late arrival — flight delayed',
      'Wheelchair access at Gate A',
      'Early exit for medical reasons',
      'Requesting VIP table reassignment',
      'Bringing children under 5',
    ][i % 6],
    submittedTime: `${pad(10 + (i % 8), 2)}:${pad((i * 11) % 60, 2)} AM`,
    status: 'Pending',
    group: a.group,
  }))

/* ---------- Recent activity ---------- */
export const RECENT_ACTIVITY: ActivityItem[] = ATTENDEES.filter(
  (a) => a.arrivalTime,
)
  .slice(0, 10)
  .map((a, i) => ({
    id: `act-${i}`,
    attendeeId: a.id,
    name: a.name,
    avatar: a.avatar,
    action: i % 4 === 0 ? 'VIP checked in' : 'Checked in',
    gate: a.gate,
    time: a.arrivalTime!,
  }))

/* ---------- Super Admin data ---------- */
export const EVENTS: EventItem[] = [
  { id: 'evt-1001', name: 'Afdhal & Khadija Wedding', type: 'Wedding', date: '2026-08-15', venue: 'The Superdome, Masaki', owner: 'Sauti Events Ltd', status: 'Active', guests: 480, attended: 342, image: '/wedding-hero.png' },
  { id: 'evt-1002', name: 'East Africa Tech Summit', type: 'Conference', date: '2026-08-18', venue: 'Julius Nyerere Convention Centre', owner: 'BrightHub Group', status: 'Upcoming', guests: 1200, attended: 0, image: '/wedding-hero.png' },
  { id: 'evt-1003', name: 'Grace Chapel Anniversary', type: 'Church Event', date: '2026-08-10', venue: 'Grace Chapel, Mikocheni', owner: 'Faith Collective', status: 'Completed', guests: 640, attended: 588, image: '/wedding-hero.png' },
  { id: 'evt-1004', name: 'Regional Leadership Forum', type: 'Government Event', date: '2026-08-22', venue: 'State House Banquet Hall', owner: 'GovConnect', status: 'Upcoming', guests: 320, attended: 0, image: '/wedding-hero.png' },
  { id: 'evt-1005', name: 'Zawadi 21st Birthday', type: 'Birthday', date: '2026-08-09', venue: 'Hyatt Regency, Dar es Salaam', owner: 'Sauti Events Ltd', status: 'Completed', guests: 180, attended: 164, image: '/wedding-hero.png' },
  { id: 'evt-1006', name: 'UDSM Graduation Gala', type: 'Graduation', date: '2026-08-25', venue: 'University of Dar es Salaam', owner: 'Campus Events Co', status: 'Upcoming', guests: 2400, attended: 0, image: '/wedding-hero.png' },
  { id: 'evt-1007', name: 'Vodacom Corporate Retreat', type: 'Corporate Event', date: '2026-08-14', venue: 'Serena Hotel, Dar es Salaam', owner: 'BrightHub Group', status: 'Active', guests: 260, attended: 198, image: '/wedding-hero.png' },
  { id: 'evt-1008', name: 'Coastal Music Festival', type: 'Festival', date: '2026-08-30', venue: 'Coco Beach, Oyster Bay', owner: 'PulseLive', status: 'Upcoming', guests: 5000, attended: 0, image: '/wedding-hero.png' },
  { id: 'evt-1009', name: 'AGM — Sacco Union', type: 'Meeting', date: '2026-08-11', venue: 'Hyatt Regency Ballroom', owner: 'GovConnect', status: 'Completed', guests: 140, attended: 132, image: '/wedding-hero.png' },
  { id: 'evt-1010', name: 'Leadership Training Bootcamp', type: 'Training', date: '2026-08-27', venue: 'UDSM Business School', owner: 'Campus Events Co', status: 'Upcoming', guests: 90, attended: 0, image: '/wedding-hero.png' },
]

export const OWNERS: Owner[] = [
  { id: 'own-1', name: 'Amina Sauti', company: 'Sauti Events Ltd', avatar: avatarFor(0), phone: '+255712000111', email: 'amina@sautievents.co.tz', events: 12, status: 'Active' },
  { id: 'own-2', name: 'Brian Kimani', company: 'BrightHub Group', avatar: avatarFor(4), phone: '+255712000222', email: 'brian@brighthub.co.tz', events: 8, status: 'Active' },
  { id: 'own-3', name: 'Pastor Mwangi', company: 'Faith Collective', avatar: avatarFor(3), phone: '+255712000333', email: 'mwangi@faithco.org', events: 5, status: 'Active' },
  { id: 'own-4', name: 'Halima Yusuf', company: 'GovConnect', avatar: avatarFor(2), phone: '+255712000444', email: 'halima@govconnect.go.tz', events: 6, status: 'Suspended' },
  { id: 'own-5', name: 'David Otieno', company: 'Campus Events Co', avatar: avatarFor(1), phone: '+255712000555', email: 'david@campusevents.co.tz', events: 9, status: 'Active' },
  { id: 'own-6', name: 'Neema Wanjiru', company: 'PulseLive', avatar: avatarFor(5), phone: '+255712000666', email: 'neema@pulselive.co.tz', events: 14, status: 'Active' },
]

export const SCANNERS: Scanner[] = [
  { id: 'scn-1', name: 'Juma Bakari', avatar: avatarFor(1), gate: 'Main Entrance', event: 'Afdhal & Khadija Wedding', scansToday: 96, status: 'Online', lastActive: '2 min ago' },
  { id: 'scn-2', name: 'Rehema Ali', avatar: avatarFor(2), gate: 'Gate A', event: 'Afdhal & Khadija Wedding', scansToday: 74, status: 'Online', lastActive: 'Just now' },
  { id: 'scn-3', name: 'Idris Salim', avatar: avatarFor(4), gate: 'VIP Gate', event: 'Afdhal & Khadija Wedding', scansToday: 38, status: 'Online', lastActive: '5 min ago' },
  { id: 'scn-4', name: 'Warda Farah', avatar: avatarFor(3), gate: 'Gate B', event: 'Safaricom Corporate Retreat', scansToday: 22, status: 'Offline', lastActive: '1 hr ago' },
  { id: 'scn-5', name: 'Tariq Omar', avatar: avatarFor(0), gate: 'Main Entrance', event: 'Grace Chapel Anniversary', scansToday: 0, status: 'Offline', lastActive: 'Yesterday' },
]

export const NFC_CARDS: NfcCard[] = Array.from({ length: 24 }, (_, i) => ({
  id: `NFC-${pad(5000 + i, 4)}`,
  assignedTo: i % 5 === 0 ? '—' : ATTENDEES[i]?.name ?? 'Unassigned',
  event: i % 3 === 0 ? 'Afdhal & Khadija Wedding' : i % 3 === 1 ? 'Tech Summit' : 'Corporate Retreat',
  status: i % 7 === 0 ? 'Lost' : i % 11 === 0 ? 'Disabled' : 'Active',
  lastUsed: i % 5 === 0 ? '—' : `${pad(1 + (i % 12), 2)} Aug, ${pad(15 + (i % 8), 2)}:${pad((i * 9) % 60, 2)}`,
}))

/* ---------- Admin overview stats ---------- */
export const ADMIN_STATS = {
  totalEvents: 148,
  todayEvents: 6,
  activeEvents: 12,
  completedEvents: 118,
  guests: 42680,
  attendance: 88,
  revenue: 2840000,
  owners: 34,
  scanners: 96,
  growth: 18.4,
}

export const MONTHLY_EVENTS = [
  { month: 'Jan', events: 8, attendance: 72 },
  { month: 'Feb', events: 11, attendance: 76 },
  { month: 'Mar', events: 9, attendance: 74 },
  { month: 'Apr', events: 14, attendance: 81 },
  { month: 'May', events: 18, attendance: 79 },
  { month: 'Jun', events: 22, attendance: 85 },
  { month: 'Jul', events: 26, attendance: 88 },
  { month: 'Aug', events: 31, attendance: 91 },
]

export const EVENT_TYPE_BREAKDOWN = [
  { name: 'Wedding', value: 42, fill: 'var(--color-chart-1)' },
  { name: 'Corporate', value: 28, fill: 'var(--color-chart-2)' },
  { name: 'Conference', value: 18, fill: 'var(--color-chart-3)' },
  { name: 'Church', value: 14, fill: 'var(--color-chart-4)' },
  { name: 'Other', value: 46, fill: 'var(--color-chart-5)' },
]

export const TOP_EVENTS = EVENTS.slice(0, 5).map((e) => ({
  name: e.name.length > 22 ? e.name.slice(0, 22) + '…' : e.name,
  guests: e.guests,
}))

/* ---------- Attendance heatmap (7 days x 12 hours) ---------- */
export const HEATMAP: number[][] = Array.from({ length: 7 }, (_, d) =>
  Array.from({ length: 12 }, (_, h) => {
    const peak = Math.max(0, 10 - Math.abs(h - 7))
    return Math.round((peak * (d + 2) * 1.3 + ((d * h) % 5)) % 100)
  }),
)

export const OTP_DEMO = '123456'
export const OWNER_PHONE_DEMO = '0712345678'
export const ADMIN_USER_DEMO = 'admin'
export const ADMIN_PASS_DEMO = 'admin123'
