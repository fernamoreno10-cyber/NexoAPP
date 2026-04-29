// types/nexo.ts

export type Rol = 'tecnico' | 'admin'
export type StatusReporte = 'pendiente' | 'revisado' | 'cobrado'
export type StatusCobro = 'borrador' | 'enviado'
export type TipoVisita = 'Programada' | 'Correctiva'
export type TipoMto = 'Preventivo' | 'Correctivo'
export type EstadoEquipo = 'Óptimo' | 'Regular' | 'Requiere revisión'

export interface NexoUsuario {
  id: string
  auth_user_id: string
  nombre: string
  rol: Rol
  must_change_password: boolean
  created_at: string
}

export interface NexoCliente {
  id: string
  nombre: string
  email: string | null
  contacto: string | null
  nit: string | null
  created_at: string
}

export interface ServicioItem {
  active: boolean
  qty: number
  price: number
}

export interface ServicioGas {
  active: boolean
  libras: number
  precioPorLibra: number
  total: number
}

export interface Servicios {
  mto: ServicioItem
  inst: ServicioItem
  gas: ServicioGas
}

export interface AdicionalRow {
  id: string
  descripcion: string
  qty: number
  precioUnitario: number
}

export interface Adicionales {
  elec: AdicionalRow[]
  refri: AdicionalRow[]
  otros: AdicionalRow[]
}

export interface NexoReporteTecnico {
  id: string
  numero: number
  cliente_id: string
  tecnico_id: string
  fecha: string
  hora: string
  tipo_visita: TipoVisita
  tipo_mto: TipoMto
  estado_equipo: EstadoEquipo
  seguimiento: boolean
  fecha_seguimiento: string | null
  servicios: Servicios
  adicionales: Adicionales
  observaciones: string | null
  total_tecnico: number
  status: StatusReporte
  created_at: string
  nexo_clientes?: NexoCliente
  nexo_usuarios?: NexoUsuario
}

export interface CobrosItem {
  id: string
  descripcion: string
  qty: number
  precioUnitario: number
  subtotal: number
}

export interface NexoCobroFerreteria {
  id: string
  reporte_id: string
  cliente_id: string
  items: CobrosItem[]
  subtotal: number
  total: number
  notas: string | null
  status: StatusCobro
  created_at: string
  nexo_reportes_tecnicos?: NexoReporteTecnico
  nexo_clientes?: NexoCliente
}

export interface NexoReporteCliente {
  id: string
  cobro_id: string
  cliente_id: string
  numero_factura: string | null
  items: CobrosItem[]
  total: number
  notas: string | null
  share_token: string
  status: StatusCobro
  created_at: string
  nexo_cobros_ferreteria?: NexoCobroFerreteria
  nexo_clientes?: NexoCliente
}

export interface WizardData {
  clienteId: string
  fecha: string
  hora: string
  tipoVisita: TipoVisita
  tipoMto: TipoMto
  estadoEquipo: EstadoEquipo
  seguimiento: boolean
  fechaSeguimiento: string
  servicios: Servicios
  adicionales: Adicionales
  observaciones: string
}

export const WIZARD_DATA_INITIAL: WizardData = {
  clienteId: '',
  fecha: '',
  hora: '',
  tipoVisita: 'Programada',
  tipoMto: 'Preventivo',
  estadoEquipo: 'Óptimo',
  seguimiento: false,
  fechaSeguimiento: '',
  servicios: {
    mto: { active: false, qty: 1, price: 0 },
    inst: { active: false, qty: 1, price: 0 },
    gas: { active: false, libras: 0, precioPorLibra: 0, total: 0 },
  },
  adicionales: { elec: [], refri: [], otros: [] },
  observaciones: '',
}
