/// <reference types="react" />
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import type { NexoReporteTecnico } from '@/types/nexo'
import { formatDate } from '@/lib/utils'

const styles = StyleSheet.create({
  page: { padding: 40, backgroundColor: '#ffffff', fontFamily: 'Helvetica' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  logoBox: { width: 36, height: 36, backgroundColor: '#2dd4bf', borderRadius: 6, marginBottom: 4 },
  logoText: { fontSize: 18, fontFamily: 'Helvetica-Bold', color: '#18181b' },
  logoSub: { fontSize: 9, color: '#71717a', marginTop: 2 },
  badge: { backgroundColor: '#f4f4f5', borderRadius: 4, padding: '4 8' },
  badgeText: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#71717a', letterSpacing: 1 },
  divider: { borderBottomWidth: 1, borderBottomColor: '#e4e4e7', borderBottomStyle: 'solid', marginBottom: 16 },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#71717a', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  infoItem: { width: '47%', marginBottom: 6 },
  infoLabel: { fontSize: 8, color: '#71717a', marginBottom: 2 },
  infoValue: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#18181b' },
  tableHeader: { flexDirection: 'row', backgroundColor: '#f4f4f5', padding: '6 8', borderRadius: 3, marginBottom: 2 },
  tableRow: { flexDirection: 'row', padding: '7 8', borderBottomWidth: 1, borderBottomColor: '#f4f4f5', borderBottomStyle: 'solid' },
  colDesc: { flex: 3, fontSize: 9, color: '#18181b' },
  colQty: { flex: 1, fontSize: 9, textAlign: 'center', color: '#18181b' },
  colPrice: { flex: 1.5, fontSize: 9, textAlign: 'right', color: '#18181b' },
  colSubtotal: { flex: 1.5, fontSize: 9, textAlign: 'right', fontFamily: 'Helvetica-Bold', color: '#18181b' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#f0fdfa', padding: '10 12', borderRadius: 5, marginTop: 8 },
  totalLabel: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#18181b' },
  totalValue: { fontSize: 14, fontFamily: 'Helvetica-Bold', color: '#0d9488' },
  estadoBadge: { borderRadius: 4, padding: '4 10', alignSelf: 'flex-start' },
  footer: { position: 'absolute', bottom: 28, left: 40, right: 40, flexDirection: 'row', justifyContent: 'space-between' },
  footerText: { fontSize: 8, color: '#a1a1aa' },
  chip: { flexDirection: 'row', gap: 6 },
  chipItem: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#71717a', backgroundColor: '#f4f4f5', borderRadius: 3, padding: '2 6' },
})

function fmt(n: number) {
  return '$ ' + n.toLocaleString('es-CO')
}

interface TableItem { descripcion: string; qty: number; precioUnitario: number; subtotal: number }

function buildItems(r: NexoReporteTecnico): TableItem[] {
  const items: TableItem[] = []
  const s = r.servicios
  if (s.mto?.active) items.push({ descripcion: `Mantenimiento preventivo`, qty: s.mto.qty, precioUnitario: s.mto.price, subtotal: s.mto.qty * s.mto.price })
  if (s.inst?.active) items.push({ descripcion: `Instalación`, qty: s.inst.qty, precioUnitario: s.inst.price, subtotal: s.inst.qty * s.inst.price })
  if (s.gas?.active) items.push({ descripcion: `Gas refrigerante (${s.gas.libras} lb)`, qty: 1, precioUnitario: s.gas.total, subtotal: s.gas.total })
  const extras = [...(r.adicionales.elec ?? []), ...(r.adicionales.refri ?? []), ...(r.adicionales.otros ?? [])]
  extras.forEach(a => items.push({ descripcion: a.descripcion || 'Adicional', qty: a.qty, precioUnitario: a.precioUnitario, subtotal: a.qty * a.precioUnitario }))
  return items
}

export function ReporteTecnicoPDF({ reporte }: { reporte: NexoReporteTecnico }) {
  const cliente = (reporte.nexo_clientes as any)
  const tecnico = (reporte.nexo_usuarios as any)
  const items = buildItems(reporte)
  const estadoColor = reporte.estado_equipo === 'Óptimo' ? '#16a34a' : reporte.estado_equipo === 'Regular' ? '#d97706' : '#dc2626'

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <View style={styles.logoBox} />
            <Text style={styles.logoText}>NEXO AI</Text>
            <Text style={styles.logoSub}>Mantenimiento de Aires Acondicionados</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>REPORTE TÉCNICO INTERNO</Text>
            </View>
            <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#18181b', marginTop: 6 }}>
              RPT-{String(reporte.numero).padStart(4, '0')}
            </Text>
            <Text style={{ fontSize: 9, color: '#71717a', marginTop: 2 }}>
              {formatDate(reporte.fecha)} · {reporte.hora}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información de la visita</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Cliente</Text>
              <Text style={styles.infoValue}>{cliente?.nombre ?? '—'}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Técnico</Text>
              <Text style={styles.infoValue}>{tecnico?.nombre ?? '—'}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Tipo de visita</Text>
              <Text style={styles.infoValue}>{reporte.tipo_visita}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Tipo de mantenimiento</Text>
              <Text style={styles.infoValue}>{reporte.tipo_mto}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Estado del equipo</Text>
              <Text style={[styles.infoValue, { color: estadoColor }]}>{reporte.estado_equipo}</Text>
            </View>
            {reporte.fecha_seguimiento && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Seguimiento programado</Text>
                <Text style={styles.infoValue}>{formatDate(reporte.fecha_seguimiento)}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Servicios table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Servicios realizados</Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.colDesc, { fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#71717a' }]}>DESCRIPCIÓN</Text>
            <Text style={[styles.colQty, { fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#71717a' }]}>CANT.</Text>
            <Text style={[styles.colPrice, { fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#71717a' }]}>P. UNIT.</Text>
            <Text style={[styles.colSubtotal, { fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#71717a' }]}>SUBTOTAL</Text>
          </View>
          {items.map((item, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.colDesc}>{item.descripcion}</Text>
              <Text style={styles.colQty}>{item.qty}</Text>
              <Text style={styles.colPrice}>{fmt(item.precioUnitario)}</Text>
              <Text style={styles.colSubtotal}>{fmt(item.subtotal)}</Text>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TOTAL VISITA</Text>
            <Text style={styles.totalValue}>{fmt(reporte.total_tecnico)}</Text>
          </View>
        </View>

        {/* Observaciones */}
        {reporte.observaciones && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Observaciones</Text>
            <Text style={{ fontSize: 9, color: '#52525b' }}>{reporte.observaciones}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>NEXO AI — Documento interno · No compartir con el cliente final</Text>
          <Text style={styles.footerText}>Generado el {new Date().toLocaleDateString('es-CO')}</Text>
        </View>
      </Page>
    </Document>
  )
}
