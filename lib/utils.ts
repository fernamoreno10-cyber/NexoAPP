import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Adicionales, Servicios } from '@/types/nexo'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCOP(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-')
  return `${d}/${m}/${y}`
}

export function calcTotalServicios(servicios: Servicios): number {
  let total = 0
  if (servicios.mto.active) total += servicios.mto.qty * servicios.mto.price
  if (servicios.inst.active) total += servicios.inst.qty * servicios.inst.price
  if (servicios.gas.active) total += servicios.gas.total
  return total
}

export function calcTotalAdicionales(adicionales: Adicionales): number {
  const rows = [
    ...adicionales.elec,
    ...adicionales.refri,
    ...adicionales.otros,
  ]
  return rows.reduce((sum, r) => sum + r.qty * r.precioUnitario, 0)
}
