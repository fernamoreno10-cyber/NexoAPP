'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatCOP } from '@/lib/utils'
import { X, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { CobrosItem } from '@/types/nexo'

interface Props {
  items: CobrosItem[]
  onChange: (items: CobrosItem[]) => void
}

export function ItemsEditor({ items, onChange }: Props) {
  function addItem() {
    onChange([...items, { id: crypto.randomUUID(), descripcion: '', qty: 1, precioUnitario: 0, subtotal: 0 }])
  }
  function removeItem(id: string) { onChange(items.filter(i => i.id !== id)) }
  function updateItem(id: string, partial: Partial<CobrosItem>) {
    onChange(items.map(item => {
      if (item.id !== id) return item
      const updated = { ...item, ...partial }
      updated.subtotal = updated.qty * updated.precioUnitario
      return updated
    }))
  }
  const total = items.reduce((s, i) => s + i.subtotal, 0)

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-3">
          <div className="flex justify-between mb-2">
            <span className="text-xs text-zinc-500">Ítem #{i + 1}</span>
            <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-400"><X className="w-3.5 h-3.5" /></button>
          </div>
          <Input placeholder="Descripción..." value={item.descripcion} onChange={e => updateItem(item.id, { descripcion: e.target.value })} className="bg-zinc-800 border-zinc-700 text-zinc-100 mb-2" />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-[10px] text-zinc-500 uppercase">Cantidad</Label>
              <Input type="number" min={0} step="any" value={item.qty || ''} onChange={e => updateItem(item.id, { qty: Number(e.target.value) || 0 })} className="bg-zinc-800 border-zinc-700 text-zinc-100" />
            </div>
            <div>
              <Label className="text-[10px] text-zinc-500 uppercase">Precio unitario</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-400 text-xs font-semibold pointer-events-none">$</span>
                <Input type="number" min={0} value={item.precioUnitario || ''} onChange={e => updateItem(item.id, { precioUnitario: Number(e.target.value) || 0 })} className="pl-7 bg-zinc-800 border-zinc-700 text-zinc-100" />
              </div>
            </div>
          </div>
          <p className="text-right text-xs text-green-400 font-semibold mt-1.5">{formatCOP(item.subtotal)}</p>
        </div>
      ))}
      <Button type="button" onClick={addItem} variant="outline" className="w-full border-dashed border-zinc-700 text-zinc-500 hover:border-teal-500 hover:text-teal-400">
        <Plus className="w-3.5 h-3.5 mr-1.5" />Agregar ítem
      </Button>
      {items.length > 0 && (
        <div className="flex justify-between items-center bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3">
          <span className="text-xs uppercase tracking-wide text-zinc-500 font-semibold">Total</span>
          <span className="text-xl font-extrabold text-teal-400">{formatCOP(total)}</span>
        </div>
      )}
    </div>
  )
}
