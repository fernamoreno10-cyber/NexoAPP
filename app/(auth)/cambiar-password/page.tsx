'use client'

import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { cambiarPassword } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full bg-gradient-to-r from-teal-500 to-green-500 text-black font-bold hover:opacity-90"
    >
      {pending ? 'Guardando...' : 'Cambiar contraseña'}
    </Button>
  )
}

export default function CambiarPasswordPage() {
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setError(null)
    const result = await cambiarPassword(formData)
    if (result?.error) setError(result.error)
  }

  return (
    <Card className="w-full max-w-sm bg-zinc-900 border-zinc-800">
      <CardHeader className="pb-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-green-400 flex items-center justify-center text-lg font-black text-white mb-2">
          N
        </div>
        <h1 className="text-lg font-bold text-white">Cambiar contraseña</h1>
        <p className="text-zinc-500 text-xs">
          Es tu primer inicio de sesión. Elige una nueva contraseña para continuar.
        </p>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-zinc-300 text-xs uppercase tracking-wide">
              Nueva contraseña
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              required
              className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-teal-500"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirm" className="text-zinc-300 text-xs uppercase tracking-wide">
              Confirmar contraseña
            </Label>
            <Input
              id="confirm"
              name="confirm"
              type="password"
              placeholder="Repite la contraseña"
              required
              className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-teal-500"
            />
          </div>
          {error && (
            <p className="text-red-400 text-sm bg-red-950/40 border border-red-900 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  )
}
