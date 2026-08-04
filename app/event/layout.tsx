import { Cormorant_Garamond } from 'next/font/google'
import type { ReactNode } from 'react'

/**
 * Cormorant Garamond — italic serif for welcome + scripture.
 * Italianno (names) is loaded globally in the root layout.
 */
const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext'],
  weight: ['500', '600'],
  style: ['italic'],
  variable: '--font-event-serif',
  display: 'swap',
})

export default function EventLayout({ children }: { children: ReactNode }) {
  return <div className={`${cormorant.variable} event-invite antialiased`}>{children}</div>
}
