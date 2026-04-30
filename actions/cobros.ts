'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { NexoCobroFerreteria, NexoReporteTecnico, CobrosItem } from '@/types/nexo'

export async function getReportesAdmin(): Promise<NexoReporteTecnico[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('nexo_reportes_tecnicos')
    .select('*, nexo_clientes(nombre), nexo_usuarios(nombre)')
    .order('created_at', { ascending: false })
  return (data as NexoReporteTecnico[]) ?? []
}

export async function getReporteById(id: string): Promise<NexoReporteTecnico | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('nexo_reportes_tecnicos')
    .select('*, nexo_clientes(*), nexo_usuarios(nombre)')
    .eq('id', id)
    .single()
  return data as NexoReporteTecnico | null
}

export async function generarCobro(
  reporteId: string, clienteId: string, items: CobrosItem[], notas: string
): Promise<{ error?: string; id?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado.' }

  const total = items.reduce((s, i) => s + i.subtotal, 0)
  const { data: cobro, error } = await supabase
    .from('nexo_cobros_ferreteria')
    .insert({ id: crypto.randomUUID(), reporte_id: reporteId, cliente_id: clienteId, items, subtotal: total, total, notas: notas || null, status: 'borrador' })
    .select('id')
    .single()
  if (error) return { error: error.message }

  const { error: updateErr } = await supabase
    .from('nexo_reportes_tecnicos')
    .update({ status: 'revisado' })
    .eq('id', reporteId)
  if (updateErr) return { error: updateErr.message }

  revalidatePath('/admin/reportes')
  revalidatePath('/admin/cobros')
  return { id: cobro.id }
}

export async function getCobros(): Promise<NexoCobroFerreteria[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('nexo_cobros_ferreteria')
    .select('*, nexo_clientes(nombre), nexo_reportes_tecnicos(numero, fecha)')
    .order('created_at', { ascending: false })
  return (data as NexoCobroFerreteria[]) ?? []
}

export async function getCobroById(id: string): Promise<NexoCobroFerreteria | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('nexo_cobros_ferreteria')
    .select('*, nexo_clientes(*), nexo_reportes_tecnicos(*, nexo_usuarios(nombre))')
    .eq('id', id)
    .single()
  return data as NexoCobroFerreteria | null
}
