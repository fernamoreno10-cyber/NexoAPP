'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatCOP } from '@/lib/utils'
import { X } from 'lucide-react'
import type { WizardData, AdicionalRow, Adicionales } from '@/types/nexo'

interface Props {
  data: WizardData
  onChange: (partial: Partial<WizardData>) => void
  onNext: () => void
  onBack: () => void
}

type CatKey = keyof Adicionales

const CAT_CONFIG: { key: CatKey; label: string; emoji: string }[] = [
  { key: 'elec', label: 'Eléctrico', emoji: '⚡' },
  { key: 'refri', label: 'Refrigeración', emoji: '❄️' },
  { key: 'otros', label: 'Otros', emoji: '📦' },
]

function AdicionalSection({
  catKey, label, emoji, rows, onChange,
}: {
  catKey: CatKey; label: string; emoji: string; rows: AdicionalRow[]; onChange: (rows: AdicionalRow[]) => void
}) {
  function addRow() {
    onChange([...rows, { id: crypto.randomUUID(), descripcion: '', qty: 1, precioUnitario: 0 }])
  }

  function removeRow(id: string) {
    onChange(rows.filter(r => r.id !== id))
  }

  function updateRow(id: string, partial: Partial<AdicionalRow>) {
    onChange(rows.map(r => r.id === id ? { ...r, ...partial } : r))
  }

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <span>{emoji}</span>
        <span className="text-sm font-semibold text-zinc-300">{label}</span>
        {rows.length > 0 && (
          <span className="ml-auto text-xs text-teal-400 font-semibold">
            {formatCOP(rows.reduce((s, r) => s + r.qty * r.precioUnitario, 0))}
          </span>
        )}
      </div>
      {rows.map((row, i) => (
        <div key={row.id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 mb-2">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-zinc-500">{label} #{i + 1}</span>
            <button onClick={() => removeRow(row.id)} className="text-red-500 hover:text-red-400 p-0.5">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <Input placeholder="Descripción del material o trabajo..." value={row.descripcion} onChange={e => updateRow(row.id, { descripcion: e.target.value })} className="bg-zinc-800 border-zinc-700 text-zinc-100 mb-2 text-sm" />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-[10px] text-zinc-500 uppercase tracking-wide">Cantidad</Label>
              <Input type="number" min={0} step="any" value={row.qty || ''} onChange={e => updateRow(row.id, { qty: Number(e.target.value) || 0 })} className="bg-zinc-800 border-zinc-700 text-zinc-100" />
            </div>
            <div>
              <Label className="text-[10px] text-zinc-500 uppercase tracking-wide">Precio unitario</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-400 text-xs font-semibold pointer-events-none">$</span>
                <Input type="number" min={0} value={row.precioUnitario || ''} onChange={e => updateRow(row.id, { precioUnitario: Number(e.target.value) || 0 })} className="pl-7 bg-zinc-800 border-zinc-700 text-zinc-100" />
              </div>
            </div>
          </div>
          <p className="text-right text-xs text-green-400 font-semibold mt-1.5">Subtotal: {formatCOP(row.qty * row.precioUnitario)}</p>
        </div>
      ))}
      <button onClick={addRow} className="w-full border border-dashed border-zinc-700 rounded-lg py-2 text-xs text-zinc-500 hover:border-teal-500 hover:text-teal-400 transition-colors">
        + Agregar {label.toLowerCase()}
      </button>
    </div>
  )
}

export function StepAdicionales({ data, onChange, onNext, onBack }: Props) {
  function updateCat(key: CatKey, rows: AdicionalRow[]) {
    onChange({ adicionales: { ...data.adicionales, [key]: rows } })
  }

  return (
    <div className="space-y-4">
      {CAT_CONFIG.map(cat => (
        <AdicionalSection
          key={cat.key}
          catKey={cat.key}
          label={cat.label}
          emoji={cat.emoji}
          rows={data.adicionales[cat.key]}
          onChange={rows => updateCat(cat.key, rows)}
        />
      ))}
      <div className="flex gap-3 pt-2">
        <Button variant="outline" onClick={onBack} className="flex-1 border-zinc-700 text-zinc-400">← Atrás</Button>
        <Button onClick={onNext} className="flex-1 bg-gradient-to-r from-teal-500 to-green-500 text-black font-bold">Siguiente →</Button>
      </div>
    </div>
  )
}
