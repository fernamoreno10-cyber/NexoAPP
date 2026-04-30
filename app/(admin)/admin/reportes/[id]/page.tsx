'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ItemsEditor } from '@/components/nexo/items-editor'
import { getReporteById, generarCobro } from '@/actions/cobros'
import { formatCOP, formatDate, calcTotalReporte } from '@/lib/utils'
import { ArrowLeft, Download } from 'lucide-react'
import Link from 'next/link'
import type { NexoReporteTecnico, CobrosItem } from '@/types/nexo'

function buildItemsFromReporte(r: NexoReporteTecnico): CobrosItem[] {
  const items: CobrosItem[] = []
  const s = r.servicios
  if (s.mto?.active) items.push({ id: crypto.randomUUID(), descripcion: `Mantenimiento × ${s.mto.qty} equipo(s)`, qty: s.mto.qty, precioUnitario: s.mto.price, subtotal: s.mto.qty * s.mto.price })
  if (s.inst?.active) items.push({ id: crypto.randomUUID(), descripcion: `Instalación × ${s.inst.qty}`, qty: s.inst.qty, precioUnitario: s.inst.price, subtotal: s.inst.qty * s.inst.price })
  if (s.gas?.active) items.push({ id: crypto.randomUUID(), descripcion: `Gas refrigerante (${s.gas.libras} lb)`, qty: 1, precioUnitario: s.gas.total, subtotal: s.gas.total })
  const allAd = [...(r.adicionales.elec ?? []), ...(r.adicionales.refri ?? []), ...(r.adicionales.otros ?? [])]
  allAd.forEach(a => items.push({ id: crypto.randomUUID(), descripcion: a.descripcion || 'Adicional', qty: a.qty, precioUnitario: a.precioUnitario, subtotal: a.qty * a.precioUnitario }))
  return items
}

export default function ReporteDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [reporte, setReporte] = useState<NexoReporteTecnico | null>(null)
  const [items, setItems] = useState<CobrosItem[]>([])
  const [notas, setNotas] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [campoLoading, setCampoLoading] = useState(false)

  useEffect(() => {
    getReporteById(id).then(r => {
      if (!r) return
      setReporte(r)
      setItems(buildItemsFromReporte(r))
    })
  }, [id])

  async function handleDescargarCampo() {
    if (!reporte) return
    setCampoLoading(true)
    try {
      const { pdf } = await import('@react-pdf/renderer')
      const { ReporteCampoPDF } = await import('@/lib/pdf/reporte-campo')
      const blob = await pdf(<ReporteCampoPDF reporte={reporte} />).toBlob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `CAMPO-${String(reporte.numero).padStart(4, '0')}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
      toast.error('Error al generar el PDF')
    } finally {
      setCampoLoading(false)
    }
  }

  async function handleDescargarPDF() {
    if (!reporte) return
    setPdfLoading(true)
    try {
      const { pdf } = await import('@react-pdf/renderer')
      const { ReporteTecnicoPDF } = await import('@/lib/pdf/reporte-tecnico')
      const blob = await pdf(<ReporteTecnicoPDF reporte={reporte} />).toBlob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `RPT-${String(reporte.numero).padStart(4, '0')}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
      toast.error('Error al generar el PDF')
    } finally {
      setPdfLoading(false)
    }
  }

  async function handleGenerar() {
    if (!reporte || items.length === 0) { toast.error('Agrega al menos un ítem'); return }
    setSubmitting(true)
    const result = await generarCobro(reporte.id, reporte.cliente_id, items, notas)
    setSubmitting(false)
    if (result.error) { toast.error(result.error); return }
    toast.success('Cobro generado')
    router.push(`/admin/cobros/${result.id}`)
  }

  if (!reporte) return <div className="p-8 text-zinc-500">Cargando...</div>
  const totalTecnico = calcTotalReporte(reporte.servicios, reporte.adicionales)
  const totalCobro = items.reduce((s, i) => s + i.subtotal, 0)

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <Link href="/admin/reportes" className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-200 text-sm mb-6">
        <ArrowLeft className="w-4 h-4" />Reportes
      </Link>
      <div className="bg-teal-500/5 border border-teal-500/20 rounded-xl p-4 mb-6">
        <p className="text-[10px] font-bold text-teal-400 tracking-widest mb-1">REPORTE #{String(reporte.numero).padStart(4, '0')}</p>
        <p className="text-lg font-extrabold text-white">{(reporte.nexo_clientes as any)?.nombre ?? '—'}</p>
        <p className="text-xs text-zinc-500 mt-1">{formatDate(reporte.fecha)} · {reporte.hora} · Técnico: {(reporte.nexo_usuarios as any)?.nombre ?? '—'}</p>
        <div className="flex justify-between mt-3">
          <span className="text-xs text-zinc-500">Total técnico:</span>
          <span className="text-sm font-bold text-zinc-300">{formatCOP(totalTecnico)}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
          <Button onClick={handleDescargarCampo} disabled={campoLoading} variant="outline" size="sm" className="border-zinc-700 text-zinc-200 hover:bg-zinc-800">
            <Download className="w-3.5 h-3.5 mr-1.5" />
            {campoLoading ? 'Generando...' : 'PDF para cliente final (sin precios)'}
          </Button>
          <Button onClick={handleDescargarPDF} disabled={pdfLoading} variant="outline" size="sm" className="border-teal-500/30 text-teal-400 hover:bg-teal-500/10">
            <Download className="w-3.5 h-3.5 mr-1.5" />
            {pdfLoading ? 'Generando...' : 'PDF reporte técnico (con precios)'}
          </Button>
        </div>
      </div>
      <h2 className="text-sm font-bold text-white uppercase tracking-wide mb-3">Ítems cobro ferretería</h2>
      <p className="text-xs text-zinc-500 mb-4">Ajusta precios y cantidades. Estos son los valores que le cobrarás a la ferretería.</p>
      <ItemsEditor items={items} onChange={setItems} />
      {totalCobro > 0 && totalTecnico > 0 && (
        <div className="mt-4 bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex justify-between text-xs text-zinc-500">
          <span>Margen sobre técnico:</span>
          <span className={totalCobro >= totalTecnico ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'}>
            {`${(((totalCobro - totalTecnico) / totalTecnico) * 100).toFixed(1)}%`}
          </span>
        </div>
      )}
      <div className="mt-4 space-y-1.5">
        <Label className="text-xs uppercase tracking-wide text-zinc-400">Notas (opcional)</Label>
        <Textarea value={notas} onChange={e => setNotas(e.target.value)} placeholder="Notas para el cobro..." className="bg-zinc-900 border-zinc-700 text-zinc-100 resize-none" rows={2} />
      </div>
      <Button onClick={handleGenerar} disabled={submitting || reporte.status !== 'pendiente'} className="w-full mt-5 bg-gradient-to-r from-teal-500 to-green-500 text-black font-bold">
        {submitting ? 'Generando...' : reporte.status !== 'pendiente' ? 'Cobro ya generado' : 'Generar cobro ferretería →'}
      </Button>
    </div>
  )
}
