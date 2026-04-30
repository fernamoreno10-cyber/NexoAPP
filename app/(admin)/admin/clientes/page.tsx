'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { getClientes, createCliente, updateCliente, deleteCliente } from '@/actions/clientes'
import { Pencil, Trash2, Plus, Users } from 'lucide-react'
import type { NexoCliente } from '@/types/nexo'

export default function ClientesPage() {
  const [clientes, setClientes] = useState<NexoCliente[]>([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<NexoCliente | null>(null)
  const [loading, setLoading] = useState(false)

  async function load() { setClientes(await getClientes()) }
  useEffect(() => { load() }, [])

  function openNew() { setEditing(null); setOpen(true) }
  function openEdit(c: NexoCliente) { setEditing(c); setOpen(true) }

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    const result = editing ? await updateCliente(editing.id, formData) : await createCliente(formData)
    setLoading(false)
    if (result.error) { toast.error(result.error); return }
    toast.success(editing ? 'Cliente actualizado' : 'Cliente creado')
    setOpen(false)
    load()
  }

  async function handleDelete(c: NexoCliente) {
    if (!confirm(`¿Eliminar a ${c.nombre}?`)) return
    const result = await deleteCliente(c.id)
    if (result.error) { toast.error(result.error); return }
    toast.success('Cliente eliminado')
    load()
  }

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-extrabold text-white">Clientes</h1>
          <p className="text-zinc-500 text-sm mt-1">{clientes.length} clientes registrados</p>
        </div>
        <Button onClick={openNew} className="bg-gradient-to-r from-teal-500 to-green-500 text-black font-bold">
          <Plus className="w-4 h-4 mr-1.5" />Nuevo
        </Button>
      </div>

      {clientes.length === 0 ? (
        <div className="text-center py-20">
          <Users className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
          <p className="text-zinc-400">Sin clientes registrados</p>
        </div>
      ) : (
        <div className="space-y-2">
          {clientes.map(c => (
            <div key={c.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white truncate">{c.nombre}</p>
                <p className="text-xs text-teal-400 mt-0.5">{c.email ?? 'Sin email'}</p>
                {c.contacto && <p className="text-xs text-zinc-500 mt-0.5">👤 {c.contacto}</p>}
                {c.nit && <p className="text-xs text-zinc-500">NIT: {c.nit}</p>}
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button size="icon" variant="ghost" onClick={() => openEdit(c)} className="w-8 h-8 text-zinc-400 hover:text-teal-400">
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => handleDelete(c)} className="w-8 h-8 text-zinc-400 hover:text-red-400">
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar cliente' : 'Nuevo cliente'}</DialogTitle>
          </DialogHeader>
          <form action={handleSubmit} className="space-y-3">
            {[
              { name: 'nombre', label: 'Nombre *', placeholder: 'Empresa o persona' },
              { name: 'email', label: 'Correo', placeholder: 'correo@empresa.com' },
              { name: 'contacto', label: 'Contacto', placeholder: 'Nombre del contacto' },
              { name: 'nit', label: 'NIT', placeholder: '000000000-0' },
            ].map(f => (
              <div key={f.name} className="space-y-1">
                <Label className="text-xs text-zinc-400 uppercase tracking-wide">{f.label}</Label>
                <Input name={f.name} defaultValue={(editing as any)?.[f.name] ?? ''} placeholder={f.placeholder} className="bg-zinc-800 border-zinc-700 text-zinc-100" />
              </div>
            ))}
            <div className="flex gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1 border-zinc-700 text-zinc-400">Cancelar</Button>
              <Button type="submit" disabled={loading} className="flex-1 bg-gradient-to-r from-teal-500 to-green-500 text-black font-bold">{loading ? 'Guardando...' : 'Guardar'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
