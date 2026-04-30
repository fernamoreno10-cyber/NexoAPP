'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ItemsEditor } from '@/components/nexo/items-editor'
import { getCobroById } from '@/actions/cobros'
import { generarReporteCliente, getReporteClienteByCobro } from '@/actions/reportes-cliente'
import { formatCOP } from '@/lib/utils'
import { ArrowLeft, Download } from 'lucide-react'
import Link from 'next/link'
import type { NexoCobroFerreteria, CobrosItem } from '@/types/nexo'

export default function CobroDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [cobro, setCobro] = useState<NexoCobroFerreteria | null>(null)
  const [items, setItems] = useState<CobrosItem[]>([])
  const [notas, setNotas] = useState('')
  const [numeroFactura, setNumeroFactura] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [reporteClienteId, setReporteClienteId] = useState<string | null>(null)

  useEffect(() => {
    getCobroById(id).then(c => {
      if (!c) return
      setCobro(c)
      setItems(c.items.map(i => ({ ...i, id: crypto.randomUUID() })))
      if (c.status === 'enviado') {
        getReporteClienteByCobro(c.id).then(r => setReporteClienteId(r?.id ?? null))
      }
    })
  }, [id])

  async function handleDescargarPDF() {
    if (!cobro) return
    setPdfLoading(true)
    try {
      const { pdf } = await import('@react-pdf/renderer')
      const { CobroFerreteriaPDF } = await import('@/lib/pdf/cobro-ferreteria')
      const blob = await pdf(<CobroFerreteriaPDF cobro={cobro} />).toBlob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const num = String((cobro.nexo_reportes_tecnicos as any)?.numero ?? 0).padStart(4, '0')
      a.download = `COB-${num}.pdf`
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
    if (!cobro || items.length === 0) { toast.error('Agrega al menos un ítem'); return }
    setSubmitting(true)
    const result = await generarReporteCliente(cobro.id, cobro.cliente_id, items, notas, numeroFactura)
    setSubmitting(false)
    if (result.error) { toast.error(result.error); return }
    toast.success('Reporte cliente generado')
    router.push(`/admin/reportes-cliente/${result.id}`)
  }

  if (!cobro) return <div className="p-8 text-zinc-500">Cargando...</div>
  const totalCobro = cobro.total
  const totalCliente = items.reduce((s, i) => s + i.subtotal, 0)

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <Link href="/admin/cobros" className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-200 text-sm mb-6">
        <ArrowLeft className="w-4 h-4" />Cobros
      </Link>
      <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-4 mb-6">
        <p className="text-[10px] font-bold text-purple-400 tracking-widest mb-1">COBRO FERRETERÍA</p>
        <p className="text-lg font-extrabold text-white">{(cobro.nexo_clientes as any)?.nombre ?? '—'}</p>
        <div className="flex justify-between mt-3">
          <span className="text-xs text-zinc-500">Total cobro ferretería:</span>
          <span className="text-sm font-bold text-zinc-300">{formatCOP(totalCobro)}</span>
        </div>
        <Button onClick={handleDescargarPDF} disabled={pdfLoading} variant="outline" size="sm" className="mt-3 w-full border-purple-500/30 text-purple-300 hover:bg-purple-500/10">
          <Download className="w-3.5 h-3.5 mr-1.5" />
          {pdfLoading ? 'Generando...' : 'Descargar cobro ferretería (PDF)'}
        </Button>
      </div>
      <h2 className="text-sm font-bold text-white uppercase tracking-wide mb-1">Ítems reporte cliente final</h2>
      <p className="text-xs text-zinc-500 mb-4">Ajusta precios. Estos son los valores que verá el cliente final.</p>
      <ItemsEditor items={items} onChange={setItems} />
      {totalCliente > 0 && totalCobro > 0 && (
        <div className="mt-4 bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex justify-between text-xs text-zinc-500">
          <span>Margen sobre cobro ferretería:</span>
          <span className={totalCliente >= totalCobro ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'}>
            {`${(((totalCliente - totalCobro) / totalCobro) * 100).toFixed(1)}%`}
          </span>
        </div>
      )}
      <div className="mt-4 space-y-3">
        <div className="space-y-1.5">
          <Label className="text-xs uppercase tracking-wide text-zinc-400">N° Factura (opcional)</Label>
          <Input value={numeroFactura} onChange={e => setNumeroFactura(e.target.value)} placeholder="Ej: FAC-2026-001" className="bg-zinc-900 border-zinc-700 text-zinc-100" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs uppercase tracking-wide text-zinc-400">Notas (opcional)</Label>
          <Textarea value={notas} onChange={e => setNotas(e.target.value)} placeholder="Notas para el cliente..." className="bg-zinc-900 border-zinc-700 text-zinc-100 resize-none" rows={2} />
        </div>
      </div>
      <Button onClick={handleGenerar} disabled={submitting || cobro.status === 'enviado'} className="w-full mt-5 bg-gradient-to-r from-teal-500 to-green-500 text-black font-bold">
        {submitting ? 'Generando...' : cobro.status === 'enviado' ? 'Reporte ya generado' : 'Generar reporte cliente final →'}
      </Button>
      {cobro.status === 'enviado' && reporteClienteId && (
        <Link href={`/admin/reportes-cliente/${reporteClienteId}`}>
          <Button variant="outline" className="w-full mt-3 border-teal-500/30 text-teal-400 hover:bg-teal-500/10">
            Ver reporte cliente generado →
          </Button>
        </Link>
      )}
    </div>
  )
}
