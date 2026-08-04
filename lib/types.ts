export type Role = 'admin' | 'owner' | 'scanner'

export type EventType =
  | 'Wedding'
  | 'Conference'
  | 'Meeting'
  | 'Seminar'
  | 'Birthday'
  | 'Graduation'
  | 'Church Event'
  | 'Government Event'
  | 'Corporate Event'
  | 'Training'
  | 'Workshop'
  | 'Funeral'
  | 'Festival'
  | 'Sports Event'
  | 'School Event'

export type AttendanceStatus =
  | 'Checked In'
  | 'Pending'
  | 'Absent'
  | 'Permission Requested'
  | 'Late'

export type GuestGroup = 'VIP' | 'Family' | 'Friends' | 'Corporate' | 'General'

/** Honorific shown on scan / attendance (e.g. MR Yusuf Ali) */
export type GuestTitle = 'Mr' | 'Mrs' | 'Ms' | 'Miss'

/** Invitation card type */
export type CardType = 'Single' | 'Couple' | 'Family'

export interface Attendee {
  id: string
  invitationId: string
  name: string
  title: GuestTitle
  cardType: CardType
  avatar: string
  status: AttendanceStatus
  group: GuestGroup
  seat: string
  table: string
  gate: string
  arrivalTime: string | null
  phone: string
  email: string
  invitationCode: string
}

export interface PermissionRequest {
  id: string
  attendeeId: string
  name: string
  avatar: string
  reason: string
  submittedTime: string
  status: 'Pending' | 'Approved' | 'Rejected'
  group: GuestGroup
}

export interface EventItem {
  id: string
  name: string
  type: EventType
  date: string
  venue: string
  owner: string
  status: 'Active' | 'Upcoming' | 'Completed'
  guests: number
  attended: number
  image: string
}

export interface Owner {
  id: string
  name: string
  company: string
  avatar: string
  phone: string
  email: string
  events: number
  status: 'Active' | 'Suspended'
}

export interface Scanner {
  id: string
  name: string
  avatar: string
  gate: string
  event: string
  scansToday: number
  status: 'Online' | 'Offline'
  lastActive: string
}

export interface NfcCard {
  id: string
  assignedTo: string
  event: string
  status: 'Active' | 'Lost' | 'Disabled'
  lastUsed: string
}

export interface ActivityItem {
  id: string
  attendeeId: string
  name: string
  avatar: string
  action: string
  gate: string
  time: string
}
