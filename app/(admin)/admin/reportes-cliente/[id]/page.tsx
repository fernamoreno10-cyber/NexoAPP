'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { getReporteClienteById } from '@/actions/reportes-cliente'
import { PdfDownloadButton } from '@/components/nexo/pdf-download-button'
import { formatCOP } from '@/lib/utils'
import { ArrowLeft, Copy, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import type { NexoReporteCliente } from '@/types/nexo'

export default function ReporteClienteAdminPage() {
  const { id } = useParams<{ id: string }>()
  const [reporte, setReporte] = useState<NexoReporteCliente | null>(null)
  const [origin, setOrigin] = useState('')

  useEffect(() => {
    setOrigin(window.location.origin)
    getReporteClienteById(id).then(r => setReporte(r))
  }, [id])

  if (!reporte) return <div className="p-8 text-zinc-500">Cargando...</div>
  const cliente = reporte.nexo_clientes as any
  const shareUrl = `${origin}/r/${reporte.share_token}`

  function copyLink() {
    navigator.clipboard.writeText(shareUrl)
    toast.success('Enlace copiado')
  }

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <Link href="/admin/cobros" className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-200 text-sm mb-6">
        <ArrowLeft className="w-4 h-4" />Cobros
      </Link>

      <div className="bg-teal-500/5 border border-teal-500/20 rounded-xl p-4 mb-6">
        <p className="text-[10px] font-bold text-teal-400 tracking-widest mb-1">REPORTE CLIENTE FINAL</p>
        <p className="text-lg font-extrabold text-white">{cliente?.nombre ?? '—'}</p>
        {reporte.numero_factura && <p className="text-xs text-zinc-500 mt-1">Factura: {reporte.numero_factura}</p>}
        <div className="flex justify-between mt-3">
          <span className="text-xs text-zinc-500">Total cliente:</span>
          <span className="text-sm font-bold text-zinc-300">{formatCOP(reporte.total)}</span>
        </div>
        <div className="mt-4">
          <PdfDownloadButton reporte={reporte} filename={`nexo-reporte-${reporte.numero_factura ?? reporte.id.slice(0, 8)}.pdf`} />
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-6">
        <p className="text-xs font-bold text-zinc-400 uppercase tracking-wide mb-2">Enlace público para el cliente</p>
        <p className="text-xs text-zinc-500 break-all mb-3">{shareUrl}</p>
        <div className="flex gap-2">
          <Button onClick={copyLink} variant="outline" size="sm" className="border-zinc-700 text-zinc-200 hover:bg-zinc-800">
            <Copy className="w-3.5 h-3.5 mr-1.5" />Copiar enlace
          </Button>
          <a href={shareUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="border-zinc-700 text-zinc-200 hover:bg-zinc-800">
              <ExternalLink className="w-3.5 h-3.5 mr-1.5" />Abrir vista cliente
            </Button>
          </a>
        </div>
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

      {reporte.notas && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-2">Notas</p>
          <p className="text-sm text-zinc-300">{reporte.notas}</p>
        </div>
      )}
    </div>
  )
}
