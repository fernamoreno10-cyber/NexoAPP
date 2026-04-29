import type { NexoUsuario } from '@/types/nexo'

interface AppLayoutProps {
  user: NexoUsuario
  children: React.ReactNode
}

export function AppLayout({ user, children }: AppLayoutProps) {
  return <div>{children}</div>
}
