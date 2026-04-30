import Link from 'next/link'
import { getReportesAdmin } from '@/actions/cobros'
import { formatCOP, formatDate } from '@/lib/utils'
import { FlowDots } from '@/components/nexo/flow-dots'

function flowCompleted(status: string): 0 | 1 | 2 | 3 {
  if (status === 'pendiente') return 1
  if (status === 'revisado') return 2
  if (status === 'cobrado') return 3
  return 0
}

const STATUS_CLASS: Record<string, string> = {
  pendiente: 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10',
  revisado: 'border-teal-500/30 text-teal-400 bg-teal-500/10',
  cobrado: 'border-green-500/30 text-green-400 bg-green-500/10',
}

export default async function AdminReportesPage() {
  const reportes = await getReportesAdmin()
  const pendientes = reportes.filter(r => r.status === 'pendiente').length

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-xl font-extrabold text-white">Reportes técnicos</h1>
        <p className="text-zinc-500 text-sm mt-1">{reportes.length} reportes · {pendientes} pendientes de revisión</p>
      </div>
      <div className="space-y-3">
        {reportes.map(r => (
          <Link key={r.id} href={`/admin/reportes/${r.id}`}>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-colors cursor-pointer">
              <div className="flex justify-between items-start gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold text-teal-400 tracking-widest mb-0.5">#{String(r.numero).padStart(4, '0')}</p>
                  <p className="font-bold text-white truncate">{(r.nexo_clientes as any)?.nombre ?? '—'}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{formatDate(r.fecha)} · Técnico: {(r.nexo_usuarios as any)?.nombre ?? '—'}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-extrabold text-green-400">{formatCOP(r.total_tecnico)}</p>
                  <FlowDots completed={flowCompleted(r.status)} className="mt-1.5 ml-auto" />
                </div>
              </div>
              <div className="mt-3">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${STATUS_CLASS[r.status]}`}>
                  {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
