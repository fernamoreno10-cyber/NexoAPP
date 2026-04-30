'use client'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { formatCOP, formatDate, calcTotalReporte } from '@/lib/utils'
import type { WizardData, NexoCliente } from '@/types/nexo'

interface Props {
  data: WizardData
  clientes: NexoCliente[]
  onBack: () => void
  onSubmit: () => void
  submitting: boolean
  onObservacionesChange: (v: string) => void
}

export function StepPreview({ data, clientes, onBack, onSubmit, submitting, onObservacionesChange }: Props) {
  const cliente = clientes.find(c => c.id === data.clienteId)
  const total = calcTotalReporte(data.servicios, data.adicionales)

  const allAdRows = [
    ...data.adicionales.elec,
    ...data.adicionales.refri,
    ...data.adicionales.otros,
  ]

  return (
    <div className="space-y-5">
      {/* Client + date card */}
      <div className="bg-teal-500/5 border border-teal-500/20 rounded-xl p-4 text-center">
        <p className="text-xs text-zinc-500 mb-1">{formatDate(data.fecha)} · {data.hora}</p>
        <p className="text-lg font-extrabold text-teal-400">{cliente?.nombre ?? '—'}</p>
        <div className="flex justify-center gap-2 mt-2 flex-wrap">
          <span className="text-[10px] bg-zinc-800 border border-zinc-700 text-zinc-400 px-2 py-0.5 rounded-full">{data.tipoVisita}</span>
          <span className="text-[10px] bg-zinc-800 border border-zinc-700 text-zinc-400 px-2 py-0.5 rounded-full">{data.tipoMto}</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
            data.estadoEquipo === 'Óptimo' ? 'bg-green-500/10 border-green-500/30 text-green-400'
            : data.estadoEquipo === 'Regular' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
            : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}>{data.estadoEquipo}</span>
        </div>
      </div>

      {/* Services summary */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl divide-y divide-zinc-800">
        {data.servicios.mto.active && (
          <div className="flex justify-between items-center px-4 py-3 text-sm">
            <span className="text-zinc-300">🔧 Mantenimiento × {data.servicios.mto.qty}</span>
            <span className="text-green-400 font-semibold">{formatCOP(data.servicios.mto.qty * data.servicios.mto.price)}</span>
          </div>
        )}
        {data.servicios.inst.active && (
          <div className="flex justify-between items-center px-4 py-3 text-sm">
            <span className="text-zinc-300">🏗️ Instalación × {data.servicios.inst.qty}</span>
            <span className="text-green-400 font-semibold">{formatCOP(data.servicios.inst.qty * data.servicios.inst.price)}</span>
          </div>
        )}
        {data.servicios.gas.active && (
          <div className="flex justify-between items-center px-4 py-3 text-sm">
            <span className="text-zinc-300">❄️ Gas refrigerante ({data.servicios.gas.libras} lb)</span>
            <span className="text-green-400 font-semibold">{formatCOP(data.servicios.gas.total)}</span>
          </div>
        )}
        {allAdRows.map(r => (
          <div key={r.id} className="flex justify-between items-center px-4 py-3 text-sm">
            <span className="text-zinc-300 truncate max-w-[60%]">{r.descripcion || 'Adicional'} × {r.qty}</span>
            <span className="text-green-400 font-semibold">{formatCOP(r.qty * r.precioUnitario)}</span>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="flex justify-between items-center bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3">
        <span className="text-xs uppercase tracking-wide text-zinc-500 font-semibold">Total</span>
        <span className="text-xl font-extrabold text-teal-400">{formatCOP(total)}</span>
      </div>

      {/* Observaciones */}
      <div className="space-y-1.5">
        <Label className="text-xs uppercase tracking-wide text-zinc-400">Observaciones (opcional)</Label>
        <Textarea
          value={data.observaciones}
          onChange={e => onObservacionesChange(e.target.value)}
          placeholder="Notas adicionales del técnico..."
          className="bg-zinc-900 border-zinc-700 text-zinc-100 resize-none"
          rows={3}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button variant="outline" onClick={onBack} disabled={submitting} className="flex-1 border-zinc-700 text-zinc-400">← Atrás</Button>
        <Button onClick={onSubmit} disabled={submitting} className="flex-1 bg-gradient-to-r from-teal-500 to-green-500 text-black font-bold">
          {submitting ? 'Enviando...' : 'Enviar reporte ✓'}
        </Button>
      </div>
    </div>
  )
}
