import { Sidebar } from './sidebar'
import { BottomNav } from './bottom-nav'
import type { NexoUsuario } from '@/types/nexo'

interface AppLayoutProps {
  user: NexoUsuario
  children: React.ReactNode
}

export function AppLayout({ user, children }: AppLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950">
      {/* Sidebar — hidden on mobile */}
      <div className="hidden md:flex">
        <Sidebar user={user} />
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
        {children}
      </main>

      {/* Bottom nav — only on mobile */}
      <BottomNav user={user} />
    </div>
  )
}
