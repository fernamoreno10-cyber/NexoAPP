'use client'

import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import type { WizardData, NexoCliente, TipoVisita, TipoMto, EstadoEquipo } from '@/types/nexo'

interface Props {
  data: WizardData
  clientes: NexoCliente[]
  onChange: (partial: Partial<WizardData>) => void
  onNext: () => void
}

function ChipGroup<T extends string>({
  options,
  value,
  onChange,
  colorFn,
}: {
  options: T[]
  value: T
  onChange: (v: T) => void
  colorFn?: (v: T) => string
}) {
  return (
    <div className="flex gap-2 flex-wrap">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={cn(
            'px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors',
            value === opt
              ? colorFn?.(opt) ?? 'border-teal-500 text-teal-400 bg-teal-500/10'
              : 'border-zinc-700 text-zinc-500 bg-zinc-800/50 hover:border-zinc-500'
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

export function StepIdentificacion({ data, clientes, onChange, onNext }: Props) {
  function validate() {
    if (!data.clienteId) return 'Selecciona un cliente'
    if (!data.fecha) return 'Ingresa la fecha'
    if (!data.hora) return 'Ingresa la hora'
    return null
  }

  function handleNext() {
    const err = validate()
    if (err) { toast.error(err); return }
    onNext()
  }

  return (
    <div className="space-y-5">
      {/* Cliente */}
      <div className="space-y-1.5">
        <Label className="text-xs uppercase tracking-wide text-zinc-400">Cliente</Label>
        <Select value={data.clienteId} onValueChange={v => onChange({ clienteId: v })}>
          <SelectTrigger className="bg-zinc-900 border-zinc-700 text-zinc-100">
            <SelectValue placeholder="Selecciona cliente..." />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-700">
            {clientes.map(c => (
              <SelectItem key={c.id} value={c.id} className="text-zinc-100">
                {c.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Fecha + Hora */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs uppercase tracking-wide text-zinc-400">Fecha</Label>
          <Input
            type="date"
            value={data.fecha}
            onChange={e => onChange({ fecha: e.target.value })}
            className="bg-zinc-900 border-zinc-700 text-zinc-100"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs uppercase tracking-wide text-zinc-400">Hora</Label>
          <Input
            type="time"
            value={data.hora}
            onChange={e => onChange({ hora: e.target.value })}
            className="bg-zinc-900 border-zinc-700 text-zinc-100"
          />
        </div>
      </div>

      {/* Tipo visita */}
      <div className="space-y-1.5">
        <Label className="text-xs uppercase tracking-wide text-zinc-400">Tipo de visita</Label>
        <ChipGroup<TipoVisita>
          options={['Programada', 'Correctiva']}
          value={data.tipoVisita}
          onChange={v => onChange({ tipoVisita: v })}
        />
      </div>

      {/* Tipo MTO */}
      <div className="space-y-1.5">
        <Label className="text-xs uppercase tracking-wide text-zinc-400">Tipo de mantenimiento</Label>
        <ChipGroup<TipoMto>
          options={['Preventivo', 'Correctivo']}
          value={data.tipoMto}
          onChange={v => onChange({ tipoMto: v })}
        />
      </div>

      {/* Estado equipo */}
      <div className="space-y-1.5">
        <Label className="text-xs uppercase tracking-wide text-zinc-400">Estado del equipo</Label>
        <ChipGroup<EstadoEquipo>
          options={['Óptimo', 'Regular', 'Requiere revisión']}
          value={data.estadoEquipo}
          onChange={v => onChange({ estadoEquipo: v })}
          colorFn={v => ({
            'Óptimo': 'border-green-500 text-green-400 bg-green-500/10',
            'Regular': 'border-yellow-500 text-yellow-400 bg-yellow-500/10',
            'Requiere revisión': 'border-red-500 text-red-400 bg-red-500/10',
          }[v] ?? '')}
        />
      </div>

      {/* Seguimiento */}
      <div className="space-y-1.5">
        <Label className="text-xs uppercase tracking-wide text-zinc-400">¿Requiere seguimiento?</Label>
        <ChipGroup<'Sí' | 'No'>
          options={['No', 'Sí']}
          value={data.seguimiento ? 'Sí' : 'No'}
          onChange={v => onChange({ seguimiento: v === 'Sí' })}
        />
        {data.seguimiento && (
          <Input
            type="date"
            value={data.fechaSeguimiento}
            onChange={e => onChange({ fechaSeguimiento: e.target.value })}
            placeholder="Fecha de seguimiento"
            className="mt-2 bg-zinc-900 border-zinc-700 text-zinc-100"
          />
        )}
      </div>

      <Button
        onClick={handleNext}
        className="w-full bg-gradient-to-r from-teal-500 to-green-500 text-black font-bold"
      >
        Siguiente →
      </Button>
    </div>
  )
}
