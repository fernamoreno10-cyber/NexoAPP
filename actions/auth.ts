'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { NexoUsuario } from '@/types/nexo'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: 'Credenciales incorrectas. Verifica tu usuario y contraseña.' }
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Error al obtener usuario.' }

  const { data: nexoUser } = await supabase
    .from('nexo_usuarios')
    .select('*')
    .eq('auth_user_id', user.id)
    .single()

  if (!nexoUser) return { error: 'Usuario no registrado en NEXO.' }

  if (nexoUser.must_change_password) {
    redirect('/cambiar-password')
  }

  if (nexoUser.rol === 'admin') {
    redirect('/admin/dashboard')
  } else {
    redirect('/tecnico/reportes')
  }
}

export async function cambiarPassword(formData: FormData) {
  const password = formData.get('password') as string
  const confirm = formData.get('confirm') as string

  if (password !== confirm) {
    return { error: 'Las contraseñas no coinciden.' }
  }
  if (password.length < 6) {
    return { error: 'La contraseña debe tener al menos 6 caracteres.' }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Sesión expirada. Inicia sesión de nuevo.' }

  const { error: updateAuthError } = await supabase.auth.updateUser({ password })
  if (updateAuthError) return { error: updateAuthError.message }

  const { error: updateNexoError } = await supabase
    .from('nexo_usuarios')
    .update({ must_change_password: false })
    .eq('auth_user_id', user.id)

  if (updateNexoError) return { error: updateNexoError.message }

  const { data: nexoUser } = await supabase
    .from('nexo_usuarios')
    .select('rol')
    .eq('auth_user_id', user.id)
    .single()

  if (nexoUser?.rol === 'admin') {
    redirect('/admin/dashboard')
  } else {
    redirect('/tecnico/reportes')
  }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function getCurrentNexoUser(): Promise<NexoUsuario | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('nexo_usuarios')
    .select('*')
    .eq('auth_user_id', user.id)
    .single()

  return data
}
