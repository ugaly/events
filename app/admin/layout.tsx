import { AdminSidebar } from '@/components/admin/sidebar'
import { DeviceGate } from '@/components/ui/device-gate'
import type { ReactNode } from 'react'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <DeviceGate
      mode="desktop-only"
      title="Use a computer"
      description="The Super Admin dashboard needs a large screen. Please open Habari Admin on a laptop or desktop PC."
    >
      <div className="min-h-screen bg-background">
        <AdminSidebar />
        <div className="lg:pl-64">{children}</div>
      </div>
    </DeviceGate>
  )
}
