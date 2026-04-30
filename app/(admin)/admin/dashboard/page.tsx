import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatCOP, formatDate } from '@/lib/utils'
import { FlowDots } from '@/components/nexo/flow-dots'
import { ArrowRight } from 'lucide-react'

function flowCompleted(status: string): 0 | 1 | 2 | 3 {
  if (status === 'pendiente') return 1
  if (status === 'revisado') return 2
  if (status === 'cobrado') return 3
  return 0
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const now = new Date()
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  const [
    { data: reportesMes },
    { data: pendientes },
    { data: cobros },
    { data: recientes },
  ] = await Promise.all([
    supabase.from('nexo_reportes_tecnicos').select('id').gte('created_at', firstOfMonth),
    supabase.from('nexo_reportes_tecnicos').select('id').eq('status', 'pendiente'),
    supabase.from('nexo_cobros_ferreteria').select('total').gte('created_at', firstOfMonth),
    supabase.from('nexo_reportes_tecnicos').select('*, nexo_clientes(nombre), nexo_usuarios(nombre)').order('created_at', { ascending: false }).limit(5),
  ])

  const totalCobrado = (cobros ?? []).reduce((s: number, c: any) => s + (c.total ?? 0), 0)
  const reportesEnviados = (recientes ?? []).filter((r: any) => r.status === 'cobrado').length

  const stats = [
    { label: 'Reportes este mes', value: reportesMes?.length ?? 0, color: 'text-teal-400' },
    { label: 'Pendientes revisión', value: pendientes?.length ?? 0, color: 'text-yellow-400' },
    { label: 'Cobrado ferretería', value: formatCOP(totalCobrado), color: 'text-green-400' },
    { label: 'Últimos facturados', value: reportesEnviados, color: 'text-teal-400' },
  ]

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-xl font-extrabold text-white">Dashboard</h1>
        <p className="text-zinc-500 text-sm mt-1">{now.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' })}</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {stats.map(s => (
          <div key={s.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <p className="text-[10px] uppercase tracking-wide text-zinc-500 mb-2">{s.label}</p>
            <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-white uppercase tracking-wide">Reportes recientes</h2>
        <Link href="/admin/reportes" className="text-xs text-teal-400 flex items-center gap-1 hover:underline">
          Ver todos <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        {(recientes ?? []).length === 0 ? (
          <p className="text-center text-zinc-500 text-sm py-10">Sin reportes aún</p>
        ) : (
          <div className="divide-y divide-zinc-800">
            {(recientes ?? []).map((r: any) => (
              <Link key={r.id} href={`/admin/reportes/${r.id}`}>
                <div className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-800/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm truncate">{r.nexo_clientes?.nombre ?? '—'}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{formatDate(r.fecha)} · {r.nexo_usuarios?.nombre ?? '—'}</p>
                  </div>
                  <FlowDots completed={flowCompleted(r.status)} />
                  <span className="text-sm font-bold text-green-400 flex-shrink-0">{formatCOP(r.total_tecnico)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
