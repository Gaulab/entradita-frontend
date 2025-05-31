"use client"

import { useEffect } from "react"
import PropTypes from "prop-types"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export default function ReportPrintView({ data, analytics, commissionAmount, totalCommission, netRevenue, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  const handlePrint = () => {
    window.print()
  }

  const currentDate = new Date().toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Botones de control - no se imprimen */}
      <div className="fixed top-4 right-4 z-50 flex gap-2 print:hidden">
        <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700 text-white">
          Imprimir
        </Button>
        <Button onClick={onClose} variant="outline" className="bg-gray-100 hover:bg-gray-200">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Contenido del reporte */}
      <div className="max-w-4xl mx-auto p-8 print:p-4">
        {/* Header */}
        <div className="text-center mb-8 border-b-2 border-gray-300 pb-6">
          <h1 className="text-3xl font-bold mb-2">Reporte Económico</h1>
          <div className="text-gray-600">
            <p className="text-lg">Generado por entradita.com</p>
            <p>{currentDate}</p>
          </div>
        </div>

        {/* Resumen ejecutivo */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 border-b border-gray-200 pb-2">Resumen Ejecutivo</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-600">Recaudación Total</h3>
              <p className="text-2xl font-bold text-green-600">${data.total_sales.toFixed(2)}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-600">Total Tickets</h3>
              <p className="text-2xl font-bold text-blue-600">{data.total_tickets}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-600">Comisión Total</h3>
              <p className="text-2xl font-bold text-orange-600">${totalCommission.toFixed(2)}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-600">Ingreso Neto</h3>
              <p className="text-2xl font-bold text-purple-600">${netRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Análisis de rendimiento */}
        {analytics && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 border-b border-gray-200 pb-2">Análisis de Rendimiento</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                <h3 className="font-semibold text-gray-700">Top Vendedor (Cantidad)</h3>
                <p className="text-lg font-bold">{analytics.topSeller?.assigned_name || "N/A"}</p>
                <p className="text-sm text-gray-600">{analytics.topSeller?.ticketsSold || 0} tickets vendidos</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                <h3 className="font-semibold text-gray-700">Top Vendedor (Ingresos)</h3>
                <p className="text-lg font-bold">{analytics.topRevenueSeller?.assigned_name || "N/A"}</p>
                <p className="text-sm text-gray-600">
                  ${analytics.topRevenueSeller?.totalRevenue.toFixed(2) || "0.00"}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                <h3 className="font-semibold text-gray-700">Ticket Más Popular</h3>
                <p className="text-lg font-bold">{analytics.mostPopularTicket?.name || "N/A"}</p>
                <p className="text-sm text-gray-600">
                  {analytics.mostPopularTicket?.quantitySold || 0} vendidos (
                  {analytics.mostPopularTicket?.percentage.toFixed(1) || 0}%)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Desglose por vendedor */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 border-b border-gray-200 pb-2">Desglose por Vendedor</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-3 text-left">Vendedor</th>
                  <th className="border border-gray-300 p-3 text-center">Tickets Vendidos</th>
                  <th className="border border-gray-300 p-3 text-center">Total Vendido</th>
                  <th className="border border-gray-300 p-3 text-center">Comisión</th>
                  <th className="border border-gray-300 p-3 text-center">Promedio/Ticket</th>
                </tr>
              </thead>
              <tbody>
                {analytics?.sellersWithStats.map((seller) => (
                  <tr key={seller.id}>
                    <td className="border border-gray-300 p-3 font-medium">{seller.assigned_name}</td>
                    <td className="border border-gray-300 p-3 text-center">{seller.ticketsSold}</td>
                    <td className="border border-gray-300 p-3 text-center">${seller.totalRevenue.toFixed(2)}</td>
                    <td className="border border-gray-300 p-3 text-center">${seller.commission.toFixed(2)}</td>
                    <td className="border border-gray-300 p-3 text-center">${seller.avgTicketPrice.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Desglose por tipo de ticket */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 border-b border-gray-200 pb-2">Desglose por Tipo de Ticket</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-3 text-left">Tipo de Ticket</th>
                  <th className="border border-gray-300 p-3 text-center">Precio</th>
                  <th className="border border-gray-300 p-3 text-center">Cantidad Vendida</th>
                  <th className="border border-gray-300 p-3 text-center">% del Total</th>
                  <th className="border border-gray-300 p-3 text-center">Total Recaudado</th>
                </tr>
              </thead>
              <tbody>
                {analytics?.ticketStats.map((ticket) => (
                  <tr key={ticket.id}>
                    <td className="border border-gray-300 p-3 font-medium">{ticket.name}</td>
                    <td className="border border-gray-300 p-3 text-center">${ticket.price.toFixed(2)}</td>
                    <td className="border border-gray-300 p-3 text-center">{ticket.quantitySold}</td>
                    <td className="border border-gray-300 p-3 text-center">{ticket.percentage.toFixed(1)}%</td>
                    <td className="border border-gray-300 p-3 text-center">${ticket.revenue.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t-2 border-gray-300 text-center text-gray-600">
          <p className="text-sm">
            Reporte generado automáticamente por entradita.com - Plataforma de gestión de eventos
          </p>
          <p className="text-xs mt-2">
            Comisión configurada: ${commissionAmount} por ticket | Total en comisiones: ${totalCommission.toFixed(2)}
          </p>
        </div>
      </div>

      <style jsx>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:p-4 {
            padding: 1rem !important;
          }
        }
      `}</style>
    </div>
  )
}

ReportPrintView.propTypes = {
  data: PropTypes.object.isRequired,
  analytics: PropTypes.object,
  commissionAmount: PropTypes.number.isRequired,
  totalCommission: PropTypes.number.isRequired,
  netRevenue: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
}
