'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, ClipboardList, Plus, FileText,
  DollarSign, Users, UserCog, LogOut
} from 'lucide-react'
import { logout } from '@/actions/auth'
import { cn } from '@/lib/utils'
import type { NexoUsuario } from '@/types/nexo'

interface NavItem {
  href: string
  label: string
  icon: React.ElementType
  badge?: number
  roles: Array<'tecnico' | 'admin'>
}

const NAV_ITEMS: NavItem[] = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin'] },
  { href: '/admin/reportes', label: 'Reportes técnicos', icon: ClipboardList, roles: ['admin'] },
  { href: '/admin/cobros', label: 'Cobros ferretería', icon: DollarSign, roles: ['admin'] },
  { href: '/admin/clientes', label: 'Clientes', icon: Users, roles: ['admin'] },
  { href: '/admin/usuarios', label: 'Usuarios', icon: UserCog, roles: ['admin'] },
  { href: '/tecnico/nueva-visita', label: 'Nueva visita', icon: Plus, roles: ['tecnico', 'admin'] },
  { href: '/tecnico/reportes', label: 'Mis reportes', icon: FileText, roles: ['tecnico'] },
]

interface SidebarProps {
  user: NexoUsuario
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const items = NAV_ITEMS.filter(item => item.roles.includes(user.rol))

  return (
    <aside className="w-56 bg-zinc-900 border-r border-zinc-800 flex flex-col h-full flex-shrink-0">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-green-400 flex items-center justify-center font-black text-black text-sm shadow-lg shadow-teal-500/20">
            N
          </div>
          <span className="font-extrabold text-white text-sm tracking-tight">
            NEXO<span className="text-green-400">AI</span>
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                  : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800'
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.badge ? (
                <span className="bg-teal-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              ) : null}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-zinc-800">
        <div className="flex items-center gap-2 px-2 py-1.5 mb-2">
          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-teal-400 to-green-400 flex items-center justify-center text-[11px] font-black text-black flex-shrink-0">
            {user.nombre.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-zinc-200 truncate">{user.nombre}</p>
            <p className="text-[10px] text-zinc-500 capitalize">{user.rol}</p>
          </div>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Cerrar sesión
          </button>
        </form>
      </div>
    </aside>
  )
}
