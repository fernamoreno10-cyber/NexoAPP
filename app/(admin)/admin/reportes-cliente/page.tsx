import Link from 'next/link'
import { getReportesCliente } from '@/actions/reportes-cliente'
import { formatCOP, formatDate } from '@/lib/utils'

export default async function AdminReportesClientePage() {
  const reportes = await getReportesCliente()
  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-xl font-extrabold text-white">Reportes cliente final</h1>
        <p className="text-zinc-500 text-sm mt-1">{reportes.length} reportes generados</p>
      </div>
      <div className="space-y-3">
        {reportes.map(r => {
          const cobro = r.nexo_cobros_ferreteria as any
          const reporteTec = cobro?.nexo_reportes_tecnicos
          return (
            <Link key={r.id} href={`/admin/reportes-cliente/${r.id}`}>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-colors cursor-pointer">
                <div className="flex justify-between items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-white truncate">{(r.nexo_clientes as any)?.nombre ?? '—'}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {r.numero_factura ? `${r.numero_factura} · ` : ''}
                      {reporteTec?.numero ? `RPT-${String(reporteTec.numero).padStart(4, '0')} · ` : ''}
                      {reporteTec?.fecha ? formatDate(reporteTec.fecha) : new Date(r.created_at).toLocaleDateString('es-CO')}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-extrabold text-teal-400">{formatCOP(r.total)}</p>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border mt-1 inline-block border-teal-500/30 text-teal-400 bg-teal-500/10">
                      Reporte cliente
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
        {reportes.length === 0 && (
          <p className="text-zinc-500 text-sm text-center py-12">Aún no hay reportes generados</p>
        )}
      </div>
    </div>
  )
}
