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
  badge: { backgroundColor: '#f0fdfa', borderRadius: 4, padding: '4 8' },
  badgeText: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#0d9488', letterSpacing: 1 },
  divider: { borderBottomWidth: 1, borderBottomColor: '#e4e4e7', borderBottomStyle: 'solid', marginBottom: 16 },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#71717a', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  infoItem: { width: '47%', marginBottom: 6 },
  infoLabel: { fontSize: 8, color: '#71717a', marginBottom: 2 },
  infoValue: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#18181b' },
  serviceRow: { flexDirection: 'row', alignItems: 'center', padding: '6 0', borderBottomWidth: 1, borderBottomColor: '#f4f4f5', borderBottomStyle: 'solid' },
  bullet: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#2dd4bf', marginRight: 8 },
  serviceText: { fontSize: 10, color: '#18181b', flex: 1 },
  serviceQty: { fontSize: 9, color: '#71717a' },
  obsBox: { backgroundColor: '#fafafa', borderRadius: 5, padding: 10 },
  obsText: { fontSize: 9, color: '#52525b', lineHeight: 1.5 },
  signature: { marginTop: 30, flexDirection: 'row', justifyContent: 'space-between' },
  signBox: { width: '45%', borderTopWidth: 1, borderTopColor: '#a1a1aa', borderTopStyle: 'solid', paddingTop: 6, alignItems: 'center' },
  signLabel: { fontSize: 8, color: '#71717a', textTransform: 'uppercase', letterSpacing: 1 },
  footer: { position: 'absolute', bottom: 28, left: 40, right: 40, flexDirection: 'row', justifyContent: 'space-between' },
  footerText: { fontSize: 8, color: '#a1a1aa' },
})

interface ServiceLine { descripcion: string; qty: number }

function buildLines(r: NexoReporteTecnico): ServiceLine[] {
  const lines: ServiceLine[] = []
  const s = r.servicios
  if (s.mto?.active) lines.push({ descripcion: 'Mantenimiento preventivo', qty: s.mto.qty })
  if (s.inst?.active) lines.push({ descripcion: 'Instalación', qty: s.inst.qty })
  if (s.gas?.active) lines.push({ descripcion: `Recarga gas refrigerante (${s.gas.libras} lb)`, qty: 1 })
  const extras = [...(r.adicionales.elec ?? []), ...(r.adicionales.refri ?? []), ...(r.adicionales.otros ?? [])]
  extras.forEach(a => lines.push({ descripcion: a.descripcion || 'Servicio adicional', qty: a.qty }))
  return lines
}

export function ReporteCampoPDF({ reporte }: { reporte: NexoReporteTecnico }) {
  const cliente = (reporte.nexo_clientes as any)
  const tecnico = (reporte.nexo_usuarios as any)
  const lines = buildLines(reporte)
  const estadoColor = reporte.estado_equipo === 'Óptimo' ? '#16a34a' : reporte.estado_equipo === 'Regular' ? '#d97706' : '#dc2626'

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <View style={styles.logoBox} />
            <Text style={styles.logoText}>NEXO AI</Text>
            <Text style={styles.logoSub}>Mantenimiento de Aires Acondicionados</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>SERVICIO REALIZADO</Text>
            </View>
            <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#18181b', marginTop: 6 }}>
              CAMPO-{String(reporte.numero).padStart(4, '0')}
            </Text>
            <Text style={{ fontSize: 9, color: '#71717a', marginTop: 2 }}>
              {formatDate(reporte.fecha)} · {reporte.hora}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Datos de la visita</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Cliente</Text>
              <Text style={styles.infoValue}>{cliente?.nombre ?? '—'}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Técnico responsable</Text>
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
                <Text style={styles.infoLabel}>Próximo seguimiento</Text>
                <Text style={styles.infoValue}>{formatDate(reporte.fecha_seguimiento)}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Servicios realizados</Text>
          {lines.map((l, i) => (
            <View key={i} style={styles.serviceRow}>
              <View style={styles.bullet} />
              <Text style={styles.serviceText}>{l.descripcion}</Text>
              <Text style={styles.serviceQty}>{l.qty > 1 ? `× ${l.qty}` : ''}</Text>
            </View>
          ))}
        </View>

        {reporte.observaciones && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Observaciones del técnico</Text>
            <View style={styles.obsBox}>
              <Text style={styles.obsText}>{reporte.observaciones}</Text>
            </View>
          </View>
        )}

        <View style={styles.signature}>
          <View style={styles.signBox}>
            <Text style={styles.signLabel}>Técnico NEXO AI</Text>
          </View>
          <View style={styles.signBox}>
            <Text style={styles.signLabel}>Recibido por el cliente</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>NEXO AI — Constancia de servicio</Text>
          <Text style={styles.footerText}>Generado el {new Date().toLocaleDateString('es-CO')}</Text>
        </View>
      </Page>
    </Document>
  )
}
