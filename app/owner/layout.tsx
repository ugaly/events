import type { ReactNode } from 'react'
import { OwnerBottomNav } from '@/components/owner/bottom-nav'

export default function OwnerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto min-h-dvh max-w-md bg-background pb-24">
      {children}
      <OwnerBottomNav />
    </div>
  )
}
