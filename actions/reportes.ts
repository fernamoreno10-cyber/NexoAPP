'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getCurrentNexoUser } from './auth'
import { calcTotalReporte } from '@/lib/utils'
import type { WizardData, NexoReporteTecnico } from '@/types/nexo'

export async function createReporte(data: WizardData): Promise<{ error?: string; id?: string }> {
  const supabase = await createClient()
  const user = await getCurrentNexoUser()
  if (!user) return { error: 'Sesión expirada.' }

  const total = calcTotalReporte(data.servicios, data.adicionales)

  const { data: reporte, error } = await supabase
    .from('nexo_reportes_tecnicos')
    .insert({
      cliente_id: data.clienteId,
      tecnico_id: user.id,
      fecha: data.fecha,
      hora: data.hora,
      tipo_visita: data.tipoVisita,
      tipo_mto: data.tipoMto,
      estado_equipo: data.estadoEquipo,
      seguimiento: data.seguimiento,
      fecha_seguimiento: data.seguimiento && data.fechaSeguimiento ? data.fechaSeguimiento : null,
      servicios: data.servicios,
      adicionales: data.adicionales,
      observaciones: data.observaciones || null,
      total_tecnico: total,
      status: 'pendiente',
    })
    .select('id')
    .single()

  if (error) return { error: error.message }

  revalidatePath('/tecnico/reportes')
  return { id: reporte.id }
}

export async function getReportesByTecnico(): Promise<NexoReporteTecnico[]> {
  const supabase = await createClient()
  const user = await getCurrentNexoUser()
  if (!user) return []

  const { data } = await supabase
    .from('nexo_reportes_tecnicos')
    .select('*, nexo_clientes(nombre)')
    .eq('tecnico_id', user.id)
    .order('created_at', { ascending: false })

  return (data as NexoReporteTecnico[]) ?? []
}
