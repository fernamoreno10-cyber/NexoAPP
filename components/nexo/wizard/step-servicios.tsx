'use client'

import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatCOP, cn } from '@/lib/utils'
import type { WizardData, Servicios } from '@/types/nexo'

interface Props {
  data: WizardData
  onChange: (partial: Partial<WizardData>) => void
  onNext: () => void
  onBack: () => void
}

function PriceInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-400 text-xs font-semibold pointer-events-none">$</span>
      <Input
        type="number"
        min={0}
        value={value || ''}
        onChange={e => onChange(Number(e.target.value) || 0)}
        className="pl-7 bg-zinc-900 border-zinc-700 text-zinc-100"
        placeholder="0"
      />
    </div>
  )
}

export function StepServicios({ data, onChange, onNext, onBack }: Props) {
  const s = data.servicios

  function updateSvc(partial: Partial<Servicios>) {
    onChange({ servicios: { ...s, ...partial } })
  }

  function validate() {
    const hasAny = s.mto.active || s.inst.active || s.gas.active
    if (!hasAny) return 'Activa al menos un servicio'
    return null
  }

  function updateGas(libras?: number, precioPorLibra?: number) {
    const l = libras ?? s.gas.libras
    const p = precioPorLibra ?? s.gas.precioPorLibra
    updateSvc({ gas: { ...s.gas, libras: l, precioPorLibra: p, total: l * p } })
  }

  return (
    <div className="space-y-4">
      {/* MTO */}
      <div
        onClick={() => updateSvc({ mto: { ...s.mto, active: !s.mto.active } })}
        className={cn(
          'rounded-xl border p-4 cursor-pointer transition-colors',
          s.mto.active ? 'border-teal-500/40 bg-teal-500/5' : 'border-zinc-800 bg-zinc-900/50'
        )}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">🔧</span>
            <span className="font-semibold text-sm">Mantenimiento</span>
          </div>
          <div className={cn('w-9 h-5 rounded-full relative transition-colors', s.mto.active ? 'bg-teal-500' : 'bg-zinc-700')}>
            <div className={cn('w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform', s.mto.active ? 'translate-x-4' : 'translate-x-0.5')} />
          </div>
        </div>
        {s.mto.active && (
          <div className="grid grid-cols-2 gap-3 mt-2" onClick={e => e.stopPropagation()}>
            <div className="space-y-1">
              <Label className="text-[10px] uppercase tracking-wide text-zinc-500">Cantidad equipos</Label>
              <Input type="number" min={1} value={s.mto.qty || ''} onChange={e => updateSvc({ mto: { ...s.mto, qty: Number(e.target.value) || 1 } })} className="bg-zinc-900 border-zinc-700 text-zinc-100" />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] uppercase tracking-wide text-zinc-500">Precio por equipo</Label>
              <PriceInput value={s.mto.price} onChange={v => updateSvc({ mto: { ...s.mto, price: v } })} />
            </div>
            <p className="col-span-2 text-right text-xs text-green-400 font-semibold">Subtotal: {formatCOP(s.mto.qty * s.mto.price)}</p>
          </div>
        )}
      </div>

      {/* Instalación */}
      <div
        onClick={() => updateSvc({ inst: { ...s.inst, active: !s.inst.active } })}
        className={cn('rounded-xl border p-4 cursor-pointer transition-colors', s.inst.active ? 'border-teal-500/40 bg-teal-500/5' : 'border-zinc-800 bg-zinc-900/50')}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">🏗️</span>
            <span className="font-semibold text-sm">Instalación</span>
          </div>
          <div className={cn('w-9 h-5 rounded-full relative transition-colors', s.inst.active ? 'bg-teal-500' : 'bg-zinc-700')}>
            <div className={cn('w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform', s.inst.active ? 'translate-x-4' : 'translate-x-0.5')} />
          </div>
        </div>
        {s.inst.active && (
          <div className="grid grid-cols-2 gap-3 mt-2" onClick={e => e.stopPropagation()}>
            <div className="space-y-1">
              <Label className="text-[10px] uppercase tracking-wide text-zinc-500">Cantidad</Label>
              <Input type="number" min={1} value={s.inst.qty || ''} onChange={e => updateSvc({ inst: { ...s.inst, qty: Number(e.target.value) || 1 } })} className="bg-zinc-900 border-zinc-700 text-zinc-100" />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] uppercase tracking-wide text-zinc-500">Precio unitario</Label>
              <PriceInput value={s.inst.price} onChange={v => updateSvc({ inst: { ...s.inst, price: v } })} />
            </div>
            <p className="col-span-2 text-right text-xs text-green-400 font-semibold">Subtotal: {formatCOP(s.inst.qty * s.inst.price)}</p>
          </div>
        )}
      </div>

      {/* Gas refrigerante */}
      <div
        onClick={() => updateSvc({ gas: { ...s.gas, active: !s.gas.active } })}
        className={cn('rounded-xl border p-4 cursor-pointer transition-colors', s.gas.active ? 'border-teal-500/40 bg-teal-500/5' : 'border-zinc-800 bg-zinc-900/50')}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">❄️</span>
            <span className="font-semibold text-sm">Gas refrigerante</span>
          </div>
          <div className={cn('w-9 h-5 rounded-full relative transition-colors', s.gas.active ? 'bg-teal-500' : 'bg-zinc-700')}>
            <div className={cn('w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform', s.gas.active ? 'translate-x-4' : 'translate-x-0.5')} />
          </div>
        </div>
        {s.gas.active && (
          <div className="grid grid-cols-2 gap-3 mt-2" onClick={e => e.stopPropagation()}>
            <div className="space-y-1">
              <Label className="text-[10px] uppercase tracking-wide text-zinc-500">Libras</Label>
              <Input type="number" min={0} step={0.5} value={s.gas.libras || ''} onChange={e => updateGas(Number(e.target.value) || 0)} className="bg-zinc-900 border-zinc-700 text-zinc-100" placeholder="0.0" />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] uppercase tracking-wide text-zinc-500">Precio / libra</Label>
              <PriceInput value={s.gas.precioPorLibra} onChange={v => updateGas(undefined, v)} />
            </div>
            <p className="col-span-2 text-right text-xs text-green-400 font-semibold">Total gas: {formatCOP(s.gas.total)}</p>
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <Button variant="outline" onClick={onBack} className="flex-1 border-zinc-700 text-zinc-400">← Atrás</Button>
        <Button onClick={() => { const err = validate(); if (err) { toast.error(err); return } onNext() }} className="flex-1 bg-gradient-to-r from-teal-500 to-green-500 text-black font-bold">Siguiente →</Button>
      </div>
    </div>
  )
}
