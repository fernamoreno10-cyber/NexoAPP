'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ClipboardList, Plus, FileText, DollarSign } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { NexoUsuario } from '@/types/nexo'

interface BottomNavItem {
  href: string
  label: string
  icon: React.ElementType
  roles: Array<'tecnico' | 'admin'>
}

const BOTTOM_NAV: BottomNavItem[] = [
  { href: '/admin/dashboard', label: 'Inicio', icon: LayoutDashboard, roles: ['admin'] },
  { href: '/admin/reportes', label: 'Reportes', icon: ClipboardList, roles: ['admin'] },
  { href: '/tecnico/nueva-visita', label: 'Nueva', icon: Plus, roles: ['tecnico', 'admin'] },
  { href: '/admin/cobros', label: 'Cobros', icon: DollarSign, roles: ['admin'] },
  { href: '/tecnico/reportes', label: 'Mis reportes', icon: FileText, roles: ['tecnico'] },
]

interface BottomNavProps {
  user: NexoUsuario
}

export function BottomNav({ user }: BottomNavProps) {
  const pathname = usePathname()
  const items = BOTTOM_NAV.filter(item => item.roles.includes(user.rol))

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 flex items-center md:hidden z-50">
      {items.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
        const isNew = item.href.includes('nueva-visita')
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex-1 flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors',
              isActive ? 'text-teal-400' : 'text-zinc-500'
            )}
          >
            {isNew ? (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-green-400 flex items-center justify-center shadow-lg shadow-teal-500/30 -mt-4">
                <Icon className="w-4 h-4 text-black" />
              </div>
            ) : (
              <Icon className="w-5 h-5" />
            )}
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
