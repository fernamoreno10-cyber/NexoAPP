import Link from 'next/link'
import { getCobros } from '@/actions/cobros'
import { formatCOP, formatDate } from '@/lib/utils'

export default async function AdminCobrosPage() {
  const cobros = await getCobros()
  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-xl font-extrabold text-white">Cobros ferretería</h1>
        <p className="text-zinc-500 text-sm mt-1">{cobros.length} cobros generados</p>
      </div>
      <div className="space-y-3">
        {cobros.map(c => (
          <Link key={c.id} href={`/admin/cobros/${c.id}`}>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-colors cursor-pointer">
              <div className="flex justify-between items-start gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-white truncate">{(c.nexo_clientes as any)?.nombre ?? '—'}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Reporte #{String((c.nexo_reportes_tecnicos as any)?.numero ?? 0).padStart(4, '0')} · {formatDate((c.nexo_reportes_tecnicos as any)?.fecha ?? '')}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-extrabold text-green-400">{formatCOP(c.total)}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border mt-1 inline-block ${c.status === 'enviado' ? 'border-green-500/30 text-green-400 bg-green-500/10' : 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10'}`}>
                    {c.status === 'enviado' ? 'Facturado' : 'Borrador'}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
