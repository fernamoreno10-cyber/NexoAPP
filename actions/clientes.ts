'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { NexoCliente } from '@/types/nexo'

export async function getClientes(): Promise<NexoCliente[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('nexo_clientes').select('*').order('nombre')
  return (data as NexoCliente[]) ?? []
}

export async function createCliente(formData: FormData): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado.' }

  const nombre = ((formData.get('nombre') ?? '') as string).trim()
  if (!nombre) return { error: 'El nombre es obligatorio.' }

  const { error } = await supabase.from('nexo_clientes').insert({
    id: crypto.randomUUID(),
    nombre,
    email: ((formData.get('email') ?? '') as string).trim() || null,
    contacto: ((formData.get('contacto') ?? '') as string).trim() || null,
    nit: ((formData.get('nit') ?? '') as string).trim() || null,
  })
  if (error) return { error: error.message }
  revalidatePath('/admin/clientes')
  return {}
}

export async function updateCliente(id: string, formData: FormData): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado.' }

  const nombre = ((formData.get('nombre') ?? '') as string).trim()
  if (!nombre) return { error: 'El nombre es obligatorio.' }

  const { error } = await supabase.from('nexo_clientes').update({
    nombre,
    email: ((formData.get('email') ?? '') as string).trim() || null,
    contacto: ((formData.get('contacto') ?? '') as string).trim() || null,
    nit: ((formData.get('nit') ?? '') as string).trim() || null,
  }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/clientes')
  return {}
}

export async function deleteCliente(id: string): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado.' }

  const { error } = await supabase.from('nexo_clientes').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/clientes')
  return {}
}
