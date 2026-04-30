import { notFound } from 'next/navigation'
import { getReporteClienteByToken } from '@/actions/reportes-cliente'
import { PdfDownloadButton } from '@/components/nexo/pdf-download-button'
import { formatCOP } from '@/lib/utils'

interface Props {
  params: Promise<{ token: string }>
}

export default async function PublicReportePage({ params }: Props) {
  const { token } = await params
  const reporte = await getReporteClienteByToken(token)
  if (!reporte) notFound()

  const cliente = reporte.nexo_clientes as any

  return (
    <div className="min-h-screen bg-zinc-950 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-green-400 flex items-center justify-center font-black text-black text-lg">N</div>
          <div>
            <p className="font-extrabold text-white text-lg tracking-tight">NEXO<span className="text-green-400">AI</span></p>
            <p className="text-zinc-500 text-xs">Reporte de servicio</p>
          </div>
          <div className="ml-auto">
            <PdfDownloadButton reporte={reporte} filename={`nexo-reporte-${reporte.numero_factura ?? reporte.id.slice(0, 8)}.pdf`} />
          </div>
        </div>

        <div className="bg-teal-500/5 border border-teal-500/20 rounded-xl p-5 mb-6">
          {reporte.numero_factura && <p className="text-[10px] font-bold text-teal-400 tracking-widest mb-1">{reporte.numero_factura}</p>}
          <p className="text-xl font-extrabold text-white">{cliente?.nombre ?? '—'}</p>
          {cliente?.nit && <p className="text-xs text-zinc-500 mt-1">NIT: {cliente.nit}</p>}
          {cliente?.contacto && <p className="text-xs text-zinc-500">Contacto: {cliente.contacto}</p>}
          <p className="text-xs text-zinc-500 mt-2">Emitido: {new Date(reporte.created_at).toLocaleDateString('es-CO')}</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden mb-4">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-2 px-4 py-2.5 bg-zinc-800/50 text-[10px] font-bold text-zinc-500 uppercase tracking-wide">
            <span>Descripción</span><span className="text-center">Cant.</span><span className="text-right">P. Unit.</span><span className="text-right">Subtotal</span>
          </div>
          {reporte.items.map((item, i) => (
            <div key={i} className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-2 px-4 py-3 border-t border-zinc-800 items-center">
              <span className="text-sm text-zinc-200">{item.descripcion}</span>
              <span className="text-sm text-zinc-400 text-center">{item.qty}</span>
              <span className="text-sm text-zinc-400 text-right">{formatCOP(item.precioUnitario)}</span>
              <span className="text-sm font-semibold text-green-400 text-right">{formatCOP(item.subtotal)}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4">
          <span className="text-sm font-bold text-zinc-400 uppercase tracking-wide">Total</span>
          <span className="text-2xl font-extrabold text-teal-400">{formatCOP(reporte.total)}</span>
        </div>

        {reporte.notas && (
          <div className="mt-4 bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-2">Notas</p>
            <p className="text-sm text-zinc-300">{reporte.notas}</p>
          </div>
        )}

        <p className="text-center text-xs text-zinc-700 mt-8">Generado por NEXO AI · nexo.app</p>
      </div>
    </div>
  )
}
