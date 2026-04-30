'use server'

import { revalidatePath } from 'next/cache'
import { createServiceClient } from '@/lib/supabase/server'
import type { NexoUsuario } from '@/types/nexo'

export async function getUsuarios(): Promise<NexoUsuario[]> {
  const supabase = await createServiceClient()
  const { data } = await supabase.from('nexo_usuarios').select('*').order('created_at', { ascending: false })
  return (data as NexoUsuario[]) ?? []
}

export async function createUsuario(formData: FormData): Promise<{ error?: string }> {
  const email = (formData.get('email') as string).trim()
  const nombre = (formData.get('nombre') as string).trim()
  const rol = formData.get('rol') as 'tecnico' | 'admin'
  if (!email || !nombre || !rol) return { error: 'Todos los campos son obligatorios.' }

  const supabase = await createServiceClient()
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email, password: '1234', email_confirm: true,
  })
  if (authError) return { error: authError.message }

  const { error: nexoError } = await supabase.from('nexo_usuarios').insert({
    id: crypto.randomUUID(), auth_user_id: authData.user.id, nombre, rol, must_change_password: true,
  })
  if (nexoError) {
    await supabase.auth.admin.deleteUser(authData.user.id)
    return { error: nexoError.message }
  }
  revalidatePath('/admin/usuarios')
  return {}
}

export async function resetPassword(id: string): Promise<{ error?: string }> {
  const supabase = await createServiceClient()
  const { data: nexoUser } = await supabase.from('nexo_usuarios').select('auth_user_id').eq('id', id).single()
  if (!nexoUser) return { error: 'Usuario no encontrado.' }
  const { error: authError } = await supabase.auth.admin.updateUserById(nexoUser.auth_user_id, { password: '1234' })
  if (authError) return { error: authError.message }
  const { error } = await supabase.from('nexo_usuarios').update({ must_change_password: true }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/usuarios')
  return {}
}

export async function deleteUsuario(id: string): Promise<{ error?: string }> {
  const supabase = await createServiceClient()
  const { data: nexoUser } = await supabase.from('nexo_usuarios').select('auth_user_id').eq('id', id).single()
  if (!nexoUser) return { error: 'Usuario no encontrado.' }
  await supabase.from('nexo_usuarios').delete().eq('id', id)
  await supabase.auth.admin.deleteUser(nexoUser.auth_user_id)
  revalidatePath('/admin/usuarios')
  return {}
}
