import { Cormorant_Garamond, Italianno } from 'next/font/google'
import type { ReactNode } from 'react'

/**
 * Italianno — script for couple names only.
 * Cormorant Garamond — italic serif for welcome + scripture.
 */
const italianno = Italianno({
  subsets: ['latin', 'latin-ext'],
  weight: ['400'],
  variable: '--font-event-names',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext'],
  weight: ['500', '600'],
  style: ['italic'],
  variable: '--font-event-serif',
  display: 'swap',
})

export default function EventLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${italianno.variable} ${cormorant.variable} event-invite antialiased`}>
      {children}
    </div>
  )
}
