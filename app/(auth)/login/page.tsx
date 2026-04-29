'use client'

import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { login } from '@/actions/auth'
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
      {pending ? 'Ingresando...' : 'Ingresar'}
    </Button>
  )
}

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setError(null)
    const result = await login(formData)
    if (result?.error) setError(result.error)
  }

  return (
    <Card className="w-full max-w-sm bg-zinc-900 border-zinc-800">
      <CardHeader className="items-center pb-2">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-400 to-green-400 flex items-center justify-center text-2xl font-black text-white mb-2 shadow-lg shadow-teal-500/20">
          N
        </div>
        <h1 className="text-xl font-extrabold text-white font-sans tracking-tight">
          NEXO<span className="text-green-400">AI</span>
        </h1>
        <p className="text-zinc-500 text-xs">App de mantenimientos</p>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-zinc-300 text-xs uppercase tracking-wide">
              Correo
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="usuario@nexo.com"
              required
              className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-teal-500"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-zinc-300 text-xs uppercase tracking-wide">
              Contrase&ntilde;a
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
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
