/// <reference types="react" />
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import type { NexoCobroFerreteria } from '@/types/nexo'
import { formatDate } from '@/lib/utils'

const styles = StyleSheet.create({
  page: { padding: 40, backgroundColor: '#ffffff', fontFamily: 'Helvetica' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  logoBox: { width: 36, height: 36, backgroundColor: '#2dd4bf', borderRadius: 6, marginBottom: 4 },
  logoText: { fontSize: 18, fontFamily: 'Helvetica-Bold', color: '#18181b' },
  logoSub: { fontSize: 9, color: '#71717a', marginTop: 2 },
  badge: { backgroundColor: '#fef3c7', borderRadius: 4, padding: '4 8' },
  badgeText: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#92400e', letterSpacing: 1 },
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
  notasBox: { backgroundColor: '#fafafa', borderRadius: 5, padding: 10 },
  notasText: { fontSize: 9, color: '#52525b' },
  footer: { position: 'absolute', bottom: 28, left: 40, right: 40, flexDirection: 'row', justifyContent: 'space-between' },
  footerText: { fontSize: 8, color: '#a1a1aa' },
})

function fmt(n: number) {
  return '$ ' + n.toLocaleString('es-CO')
}

export function CobroFerreteriaPDF({ cobro }: { cobro: NexoCobroFerreteria }) {
  const cliente = (cobro.nexo_clientes as any)
  const reporteTec = (cobro.nexo_reportes_tecnicos as any)
  const numeroCobro = String((reporteTec?.numero ?? 0)).padStart(4, '0')

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
              <Text style={styles.badgeText}>COBRO FERRETERÍA</Text>
            </View>
            <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#18181b', marginTop: 6 }}>
              COB-{numeroCobro}
            </Text>
            <Text style={{ fontSize: 9, color: '#71717a', marginTop: 2 }}>
              {new Date(cobro.created_at).toLocaleDateString('es-CO')}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información del cobro</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Cliente final</Text>
              <Text style={styles.infoValue}>{cliente?.nombre ?? '—'}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Reporte técnico</Text>
              <Text style={styles.infoValue}>RPT-{numeroCobro}</Text>
            </View>
            {reporteTec?.fecha && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Fecha de servicio</Text>
                <Text style={styles.infoValue}>{formatDate(reporteTec.fecha)}</Text>
              </View>
            )}
            {cliente?.nit && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>NIT cliente</Text>
                <Text style={styles.infoValue}>{cliente.nit}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Servicios prestados</Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.colDesc, { fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#71717a' }]}>DESCRIPCIÓN</Text>
            <Text style={[styles.colQty, { fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#71717a' }]}>CANT.</Text>
            <Text style={[styles.colPrice, { fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#71717a' }]}>P. UNIT.</Text>
            <Text style={[styles.colSubtotal, { fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#71717a' }]}>SUBTOTAL</Text>
          </View>
          {cobro.items.map((item, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.colDesc}>{item.descripcion}</Text>
              <Text style={styles.colQty}>{item.qty}</Text>
              <Text style={styles.colPrice}>{fmt(item.precioUnitario)}</Text>
              <Text style={styles.colSubtotal}>{fmt(item.subtotal)}</Text>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TOTAL A PAGAR A NEXO AI</Text>
            <Text style={styles.totalValue}>{fmt(cobro.total)}</Text>
          </View>
        </View>

        {cobro.notas && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notas</Text>
            <View style={styles.notasBox}>
              <Text style={styles.notasText}>{cobro.notas}</Text>
            </View>
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>NEXO AI — Cobro a ferretería · Documento privado</Text>
          <Text style={styles.footerText}>Generado el {new Date().toLocaleDateString('es-CO')}</Text>
        </View>
      </Page>
    </Document>
  )
}
