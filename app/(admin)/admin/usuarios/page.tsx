'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { getUsuarios, createUsuario, resetPassword, deleteUsuario } from '@/actions/usuarios'
import { Plus, RotateCcw, Trash2 } from 'lucide-react'
import type { NexoUsuario } from '@/types/nexo'

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<NexoUsuario[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [rol, setRol] = useState<'tecnico' | 'admin'>('tecnico')

  async function load() { setUsuarios(await getUsuarios()) }
  useEffect(() => { load() }, [])

  async function handleCreate(formData: FormData) {
    formData.set('rol', rol)
    setLoading(true)
    const result = await createUsuario(formData)
    setLoading(false)
    if (result.error) { toast.error(result.error); return }
    toast.success('Usuario creado. Contraseña inicial: 1234')
    setOpen(false)
    load()
  }

  async function handleReset(u: NexoUsuario) {
    if (!confirm(`¿Resetear contraseña de ${u.nombre} a 1234?`)) return
    const result = await resetPassword(u.id)
    if (result.error) { toast.error(result.error); return }
    toast.success('Contraseña reseteada a 1234')
  }

  async function handleDelete(u: NexoUsuario) {
    if (!confirm(`¿Eliminar usuario ${u.nombre}?`)) return
    const result = await deleteUsuario(u.id)
    if (result.error) { toast.error(result.error); return }
    toast.success('Usuario eliminado')
    load()
  }

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-extrabold text-white">Usuarios</h1>
          <p className="text-zinc-500 text-sm mt-1">{usuarios.length} usuarios en el sistema</p>
        </div>
        <Button onClick={() => setOpen(true)} className="bg-gradient-to-r from-teal-500 to-green-500 text-black font-bold">
          <Plus className="w-4 h-4 mr-1.5" />Nuevo
        </Button>
      </div>

      <div className="space-y-2">
        {usuarios.map(u => (
          <div key={u.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-teal-400 to-green-400 flex items-center justify-center font-black text-black text-sm flex-shrink-0">
              {u.nombre.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white truncate">{u.nombre}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${u.rol === 'admin' ? 'border-purple-500/30 text-purple-400 bg-purple-500/10' : 'border-teal-500/30 text-teal-400 bg-teal-500/10'}`}>
                  {u.rol}
                </span>
                {u.must_change_password && <span className="text-[10px] text-yellow-400">⚠ Debe cambiar contraseña</span>}
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button size="icon" variant="ghost" onClick={() => handleReset(u)} className="w-8 h-8 text-zinc-400 hover:text-yellow-400" title="Resetear contraseña">
                <RotateCcw className="w-3.5 h-3.5" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => handleDelete(u)} className="w-8 h-8 text-zinc-400 hover:text-red-400">
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader><DialogTitle>Nuevo usuario</DialogTitle></DialogHeader>
          <form action={handleCreate} className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs text-zinc-400 uppercase tracking-wide">Nombre completo</Label>
              <Input name="nombre" placeholder="Juan Pérez" className="bg-zinc-800 border-zinc-700 text-zinc-100" required />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-zinc-400 uppercase tracking-wide">Correo electrónico</Label>
              <Input name="email" type="email" placeholder="juan@nexo.com" className="bg-zinc-800 border-zinc-700 text-zinc-100" required />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-zinc-400 uppercase tracking-wide">Rol</Label>
              <Select value={rol} onValueChange={(v) => setRol(v as 'tecnico' | 'admin')}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-700">
                  <SelectItem value="tecnico">Técnico</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-zinc-500 bg-zinc-800 rounded-lg p-2.5">
              Contraseña inicial: <span className="text-teal-400 font-mono font-bold">1234</span> — el usuario deberá cambiarla al primer login.
            </p>
            <div className="flex gap-2 pt-1">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1 border-zinc-700 text-zinc-400">Cancelar</Button>
              <Button type="submit" disabled={loading} className="flex-1 bg-gradient-to-r from-teal-500 to-green-500 text-black font-bold">{loading ? 'Creando...' : 'Crear usuario'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
