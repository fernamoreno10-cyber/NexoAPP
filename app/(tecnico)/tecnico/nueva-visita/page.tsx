import { createClient } from '@/lib/supabase/server'
import { WizardContainer } from '@/components/nexo/wizard/wizard-container'
import type { NexoCliente } from '@/types/nexo'

export default async function NuevaVisitaPage() {
  const supabase = await createClient()
  const { data: clientes } = await supabase
    .from('nexo_clientes')
    .select('*')
    .order('nombre')

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-xl font-extrabold text-white">Nueva visita</h1>
        <p className="text-zinc-500 text-sm mt-1">Registra el trabajo realizado</p>
      </div>
      <WizardContainer clientes={(clientes as NexoCliente[]) ?? []} />
    </div>
  )
}
