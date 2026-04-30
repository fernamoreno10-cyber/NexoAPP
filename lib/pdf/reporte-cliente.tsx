/// <reference types="react" />
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import type { NexoReporteCliente } from '@/types/nexo'

const styles = StyleSheet.create({
  page: { padding: 40, backgroundColor: '#ffffff', fontFamily: 'Helvetica' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 },
  logo: { width: 40, height: 40, backgroundColor: '#2dd4bf', borderRadius: 8 },
  logoText: { fontSize: 20, fontFamily: 'Helvetica-Bold', color: '#18181b' },
  logoSub: { fontSize: 10, color: '#71717a', marginTop: 2 },
  headerRight: { alignItems: 'flex-end' },
  docTitle: { fontSize: 14, fontFamily: 'Helvetica-Bold', color: '#18181b' },
  docNum: { fontSize: 11, color: '#71717a', marginTop: 2 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#71717a', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  infoLabel: { fontSize: 10, color: '#71717a' },
  infoValue: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#18181b' },
  tableHeader: { flexDirection: 'row', backgroundColor: '#f4f4f5', padding: '8 10', borderRadius: 4, marginBottom: 2 },
  tableRow: { flexDirection: 'row', padding: '8 10', borderBottomWidth: 1, borderBottomColor: '#f4f4f5' },
  colDesc: { flex: 3, fontSize: 10, color: '#18181b' },
  colQty: { flex: 1, fontSize: 10, textAlign: 'center', color: '#18181b' },
  colPrice: { flex: 1.5, fontSize: 10, textAlign: 'right', color: '#18181b' },
  colTotal: { flex: 1.5, fontSize: 10, textAlign: 'right', fontFamily: 'Helvetica-Bold', color: '#18181b' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#f0fdfa', padding: '10 12', borderRadius: 6, marginTop: 8 },
  totalLabel: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#18181b' },
  totalValue: { fontSize: 14, fontFamily: 'Helvetica-Bold', color: '#0d9488' },
  footer: { position: 'absolute', bottom: 30, left: 40, right: 40, flexDirection: 'row', justifyContent: 'space-between' },
  footerText: { fontSize: 8, color: '#a1a1aa' },
  notasBox: { backgroundColor: '#fafafa', borderWidth: 1, borderColor: '#e4e4e7', borderRadius: 6, padding: 10, marginTop: 8 },
  notasText: { fontSize: 10, color: '#52525b' },
})

function formatCOPPdf(n: number) { return '$ ' + n.toLocaleString('es-CO') }

interface Props { reporte: NexoReporteCliente }

export function ReporteClientePDF({ reporte }: Props) {
  const cliente = reporte.nexo_clientes as any
  const cobro = reporte.nexo_cobros_ferreteria as any
  const reporteTec = cobro?.nexo_reportes_tecnicos as any

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <View style={styles.logo} />
            <Text style={styles.logoText}>NEXO AI</Text>
            <Text style={styles.logoSub}>Mantenimiento de Aires Acondicionados</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.docTitle}>REPORTE DE SERVICIO</Text>
            {reporte.numero_factura && <Text style={styles.docNum}>{reporte.numero_factura}</Text>}
            <Text style={styles.docNum}>{new Date(reporte.created_at).toLocaleDateString('es-CO')}</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información del cliente</Text>
          <View style={styles.infoRow}><Text style={styles.infoLabel}>Cliente:</Text><Text style={styles.infoValue}>{cliente?.nombre ?? '—'}</Text></View>
          {cliente?.nit && <View style={styles.infoRow}><Text style={styles.infoLabel}>NIT:</Text><Text style={styles.infoValue}>{cliente.nit}</Text></View>}
          {cliente?.contacto && <View style={styles.infoRow}><Text style={styles.infoLabel}>Contacto:</Text><Text style={styles.infoValue}>{cliente.contacto}</Text></View>}
          {reporteTec?.fecha && <View style={styles.infoRow}><Text style={styles.infoLabel}>Fecha de servicio:</Text><Text style={styles.infoValue}>{new Date(reporteTec.fecha + 'T12:00:00').toLocaleDateString('es-CO')}</Text></View>}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalle de servicios</Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.colDesc, { fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#71717a' }]}>DESCRIPCIÓN</Text>
            <Text style={[styles.colQty, { fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#71717a' }]}>CANT.</Text>
            <Text style={[styles.colPrice, { fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#71717a' }]}>P. UNIT.</Text>
            <Text style={[styles.colTotal, { fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#71717a' }]}>SUBTOTAL</Text>
          </View>
          {reporte.items.map((item, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.colDesc}>{item.descripcion}</Text>
              <Text style={styles.colQty}>{item.qty}</Text>
              <Text style={styles.colPrice}>{formatCOPPdf(item.precioUnitario)}</Text>
              <Text style={styles.colTotal}>{formatCOPPdf(item.subtotal)}</Text>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TOTAL</Text>
            <Text style={styles.totalValue}>{formatCOPPdf(reporte.total)}</Text>
          </View>
        </View>
        {reporte.notas && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notas</Text>
            <View style={styles.notasBox}><Text style={styles.notasText}>{reporte.notas}</Text></View>
          </View>
        )}
        <View style={styles.footer}>
          <Text style={styles.footerText}>NEXO AI — App de mantenimientos</Text>
          <Text style={styles.footerText}>Generado el {new Date().toLocaleDateString('es-CO')}</Text>
        </View>
      </Page>
    </Document>
  )
}
