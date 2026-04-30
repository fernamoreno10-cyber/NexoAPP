'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { WIZARD_DATA_INITIAL, type WizardData } from '@/types/nexo'
import { createReporte } from '@/actions/reportes'
import { StepIdentificacion } from './step-identificacion'
import { StepServicios } from './step-servicios'
import { StepAdicionales } from './step-adicionales'
import { StepPreview } from './step-preview'
import type { NexoCliente } from '@/types/nexo'

const STEPS = ['Identificación', 'Servicios', 'Adicionales', 'Vista previa']

interface WizardContainerProps {
  clientes: NexoCliente[]
}

export function WizardContainer({ clientes }: WizardContainerProps) {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [data, setData] = useState<WizardData>(WIZARD_DATA_INITIAL)
  const [submitting, setSubmitting] = useState(false)

  function update(partial: Partial<WizardData>) {
    setData(prev => ({ ...prev, ...partial }))
  }

  async function handleSubmit() {
    setSubmitting(true)
    const result = await createReporte(data)
    setSubmitting(false)
    if (result.error) {
      toast.error(result.error)
      return
    }
    toast.success('Reporte enviado correctamente')
    router.push('/tecnico/reportes')
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="flex gap-1.5 mb-2">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-1 rounded-full transition-colors ${
              i < step ? 'bg-teal-400' :
              i === step ? 'bg-teal-400/60' :
              'bg-zinc-800'
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-zinc-500 mb-6 font-medium">
        Paso {step + 1} de {STEPS.length} — {STEPS[step]}
      </p>

      {step === 0 && (
        <StepIdentificacion
          data={data}
          clientes={clientes}
          onChange={update}
          onNext={() => setStep(1)}
        />
      )}
      {step === 1 && (
        <StepServicios
          data={data}
          onChange={update}
          onNext={() => setStep(2)}
          onBack={() => setStep(0)}
        />
      )}
      {step === 2 && (
        <StepAdicionales
          data={data}
          onChange={update}
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && (
        <StepPreview
          data={data}
          clientes={clientes}
          onBack={() => setStep(2)}
          onSubmit={handleSubmit}
          submitting={submitting}
          onObservacionesChange={v => update({ observaciones: v })}
        />
      )}
    </div>
  )
}
