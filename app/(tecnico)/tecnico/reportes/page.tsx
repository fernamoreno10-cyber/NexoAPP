import Link from 'next/link'
import { getReportesByTecnico } from '@/actions/reportes'
import { formatCOP, formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FlowDots } from '@/components/nexo/flow-dots'
import { Plus } from 'lucide-react'

const STATUS_LABEL: Record<string, string> = {
  pendiente: 'Pendiente',
  revisado: 'Revisado',
  cobrado: 'Facturado',
}

const STATUS_CLASS: Record<string, string> = {
  pendiente: 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10',
  revisado: 'border-teal-500/30 text-teal-400 bg-teal-500/10',
  cobrado: 'border-green-500/30 text-green-400 bg-green-500/10',
}

function flowCompleted(status: string): 0 | 1 | 2 | 3 {
  if (status === 'pendiente') return 1
  if (status === 'revisado') return 2
  if (status === 'cobrado') return 3
  return 0
}

export default async function TecnicoReportesPage() {
  const reportes = await getReportesByTecnico()

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-extrabold text-white">Mis reportes</h1>
          <p className="text-zinc-500 text-sm mt-1">{reportes.length} visitas registradas</p>
        </div>
        <Link href="/tecnico/nueva-visita">
          <Button className="bg-gradient-to-r from-teal-500 to-green-500 text-black font-bold">
            <Plus className="w-4 h-4 mr-1.5" />
            Nueva
          </Button>
        </Link>
      </div>

      {reportes.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-3">📋</p>
          <p className="text-zinc-400 font-medium">Aún no tienes reportes</p>
          <p className="text-zinc-600 text-sm mt-1">Crea tu primera visita</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reportes.map(r => (
            <div key={r.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-colors">
              <div className="flex justify-between items-start gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold text-teal-400 tracking-widest mb-0.5">
                    #{String(r.numero).padStart(4, '0')}
                  </p>
                  <p className="font-bold text-white truncate">
                    {(r.nexo_clientes as any)?.nombre ?? r.cliente_id}
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {formatDate(r.fecha)} · {r.hora} · {r.tipo_visita}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-extrabold text-green-400">{formatCOP(r.total_tecnico)}</p>
                  <FlowDots completed={flowCompleted(r.status)} className="mt-1.5 ml-auto" />
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${STATUS_CLASS[r.status]}`}>
                  {STATUS_LABEL[r.status]}
                </span>
                <span className="text-xs text-zinc-600">{r.tipo_mto} · {r.estado_equipo}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
