'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import type { NexoReporteCliente } from '@/types/nexo'

interface Props {
  reporte: NexoReporteCliente
  filename?: string
}

export function PdfDownloadButton({ reporte, filename = 'reporte-nexo.pdf' }: Props) {
  const [loading, setLoading] = useState(false)

  async function handleDownload() {
    setLoading(true)
    try {
      const { pdf } = await import('@react-pdf/renderer')
      const { ReporteClientePDF } = await import('@/lib/pdf/reporte-cliente')
      const blob = await pdf(<ReporteClientePDF reporte={reporte} />).toBlob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleDownload} disabled={loading} className="bg-gradient-to-r from-teal-500 to-green-500 text-black font-bold">
      <Download className="w-4 h-4 mr-2" />
      {loading ? 'Generando PDF...' : 'Descargar PDF'}
    </Button>
  )
}
