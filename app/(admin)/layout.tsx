import { redirect } from 'next/navigation'
import { getCurrentNexoUser } from '@/actions/auth'
import { AppLayout } from '@/components/nexo/app-layout'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentNexoUser()
  if (!user) redirect('/login')
  if (user.must_change_password) redirect('/cambiar-password')
  if (user.rol !== 'admin') redirect('/tecnico/reportes')

  return <AppLayout user={user}>{children}</AppLayout>
}
