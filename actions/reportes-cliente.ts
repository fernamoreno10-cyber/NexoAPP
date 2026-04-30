'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { NexoReporteCliente, CobrosItem } from '@/types/nexo'

export async function generarReporteCliente(
  cobroId: string, clienteId: string, items: CobrosItem[], notas: string, numeroFactura: string
): Promise<{ error?: string; id?: string }> {
  const supabase = await createClient()
  const total = items.reduce((s, i) => s + i.subtotal, 0)
  const { data: reporte, error } = await supabase
    .from('nexo_reportes_cliente')
    .insert({ id: crypto.randomUUID(), cobro_id: cobroId, cliente_id: clienteId, numero_factura: numeroFactura || null, items, total, notas: notas || null, share_token: crypto.randomUUID(), status: 'borrador' })
    .select('id')
    .single()
  if (error) return { error: error.message }

  await supabase.from('nexo_cobros_ferreteria').update({ status: 'enviado' }).eq('id', cobroId)

  const { data: cobro } = await supabase.from('nexo_cobros_ferreteria').select('reporte_id').eq('id', cobroId).single()
  if (cobro?.reporte_id) {
    await supabase.from('nexo_reportes_tecnicos').update({ status: 'cobrado' }).eq('id', cobro.reporte_id)
  }
  revalidatePath('/admin/cobros')
  revalidatePath('/admin/reportes')
  return { id: reporte.id }
}

export async function getReporteClienteById(id: string): Promise<NexoReporteCliente | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('nexo_reportes_cliente')
    .select('*, nexo_clientes(*), nexo_cobros_ferreteria(*, nexo_reportes_tecnicos(numero, fecha))')
    .eq('id', id)
    .single()
  return data as NexoReporteCliente | null
}

export async function getReporteClienteByToken(token: string): Promise<NexoReporteCliente | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('nexo_reportes_cliente')
    .select('*, nexo_clientes(*)')
    .eq('share_token', token)
    .single()
  return data as NexoReporteCliente | null
}
