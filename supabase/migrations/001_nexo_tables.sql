-- nexo-app/supabase/migrations/001_nexo_tables.sql

-- Usuarios del sistema NEXO
CREATE TABLE nexo_usuarios (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  rol TEXT NOT NULL CHECK (rol IN ('tecnico', 'admin')),
  must_change_password BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Clientes finales
CREATE TABLE nexo_clientes (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  nombre TEXT NOT NULL,
  email TEXT,
  contacto TEXT,
  nit TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Reportes técnicos (lo que llena el técnico)
CREATE TABLE nexo_reportes_tecnicos (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  numero SERIAL,
  cliente_id TEXT NOT NULL REFERENCES nexo_clientes(id),
  tecnico_id TEXT NOT NULL REFERENCES nexo_usuarios(id),
  fecha DATE NOT NULL,
  hora TEXT NOT NULL,
  tipo_visita TEXT NOT NULL CHECK (tipo_visita IN ('Programada', 'Correctiva')),
  tipo_mto TEXT NOT NULL CHECK (tipo_mto IN ('Preventivo', 'Correctivo')),
  estado_equipo TEXT NOT NULL CHECK (estado_equipo IN ('Óptimo', 'Regular', 'Requiere revisión')),
  seguimiento BOOLEAN NOT NULL DEFAULT false,
  fecha_seguimiento DATE,
  servicios JSONB NOT NULL DEFAULT '{}',
  adicionales JSONB NOT NULL DEFAULT '{}',
  observaciones TEXT,
  total_tecnico NUMERIC(12,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'revisado', 'cobrado')),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Cobros a la ferretería (generados por admin)
CREATE TABLE nexo_cobros_ferreteria (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  reporte_id TEXT NOT NULL REFERENCES nexo_reportes_tecnicos(id),
  cliente_id TEXT NOT NULL REFERENCES nexo_clientes(id),
  items JSONB NOT NULL DEFAULT '[]',
  subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
  total NUMERIC(12,2) NOT NULL DEFAULT 0,
  notas TEXT,
  status TEXT NOT NULL DEFAULT 'borrador' CHECK (status IN ('borrador', 'enviado')),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Reportes para el cliente final
CREATE TABLE nexo_reportes_cliente (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  cobro_id TEXT NOT NULL REFERENCES nexo_cobros_ferreteria(id),
  cliente_id TEXT NOT NULL REFERENCES nexo_clientes(id),
  numero_factura TEXT,
  items JSONB NOT NULL DEFAULT '[]',
  total NUMERIC(12,2) NOT NULL DEFAULT 0,
  notas TEXT,
  share_token UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  status TEXT NOT NULL DEFAULT 'borrador' CHECK (status IN ('borrador', 'enviado')),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Índices útiles
CREATE INDEX idx_reportes_tecnicos_tecnico ON nexo_reportes_tecnicos(tecnico_id);
CREATE INDEX idx_reportes_tecnicos_status ON nexo_reportes_tecnicos(status);
CREATE INDEX idx_cobros_reporte ON nexo_cobros_ferreteria(reporte_id);
CREATE INDEX idx_reportes_cliente_token ON nexo_reportes_cliente(share_token);
