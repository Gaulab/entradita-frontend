"use client"

import PropTypes from "prop-types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

export default function SellerAnalytics({ data, analytics, commissionAmount }) {
  if (!analytics || analytics.realSellersCount === 0) return null

  const getPerformanceIcon = (seller) => {
    const avgTickets =
      analytics.sellersWithStats.reduce((sum, s) => sum + s.ticketsSold, 0) / analytics.realSellersCount
    if (seller.ticketsSold > avgTickets * 1.2) {
      return <TrendingUp className="h-4 w-4 text-green-500" />
    } else if (seller.ticketsSold < avgTickets * 0.8) {
      return <TrendingDown className="h-4 w-4 text-red-500" />
    }
    return <Minus className="h-4 w-4 text-yellow-500" />
  }

  const getPerformanceBadge = (seller) => {
    const avgTickets =
      analytics.sellersWithStats.reduce((sum, s) => sum + s.ticketsSold, 0) / analytics.realSellersCount
    if (seller.ticketsSold > avgTickets * 1.2) {
      return (
        <span className="inline-flex items-center rounded-full border border-transparent bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
          Excelente
        </span>
      )
    } else if (seller.ticketsSold < avgTickets * 0.8) {
      return (
        <span className="inline-flex items-center rounded-full border border-transparent bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800">
          Bajo rendimiento
        </span>
      )
    }
    return (
      <span className="inline-flex items-center rounded-full border border-transparent bg-yellow-100 px-2.5 py-0.5 text-xs font-semibold text-yellow-800">
        Promedio
      </span>
    )
  }

  return (
    <Card className="bg-gray-800 border-gray-700 rounded-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Análisis Detallado de Vendedores</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="text-center">
                <TableHead className="text-gray-300">Vendedor</TableHead>
                <TableHead className="text-gray-300">Rendimiento</TableHead>
                <TableHead className="text-gray-300">Tickets Vendidos</TableHead>
                <TableHead className="text-gray-300 max-sm:hidden">Desglose de Ventas</TableHead>
                <TableHead className="text-gray-300">Total Vendido</TableHead>
                <TableHead className="text-gray-300">Promedio/Ticket</TableHead>
                <TableHead className="text-gray-300">Comisión a Pagar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-center">
              {analytics.sellersWithStats
                .sort((a, b) => b.ticketsSold - a.ticketsSold)
                .map((seller) => (
                  <TableRow key={seller.id}>
                    <TableCell className="font-medium">{seller.assigned_name}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        {getPerformanceIcon(seller)}
                        {getPerformanceBadge(seller)}
                      </div>
                    </TableCell>
                    <TableCell>{seller.ticketsSold}</TableCell>
                    <TableCell className="max-sm:hidden">
                      {Object.entries(seller.ticket_tag_sales)
                        .map(([tagId, quantity]) => {
                          const tag = data.ticket_tags.find((t) => t.id === Number.parseInt(tagId))
                          return tag ? `${tag.name}: ${quantity}` : null
                        })
                        .filter(Boolean)
                        .join(", ")}
                    </TableCell>
                    <TableCell>${seller.totalRevenue.toFixed(2)}</TableCell>
                    <TableCell>${seller.avgTicketPrice.toFixed(2)}</TableCell>
                    <TableCell className="font-bold">${seller.commission.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        {/* Estadísticas adicionales */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-700 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-300 mb-2">Promedio de Tickets por Vendedor</h4>
            <p className="text-2xl font-bold text-blue-400">
              {analytics.realSellersCount > 0
                ? (
                    analytics.sellersWithStats.reduce((sum, s) => sum + s.ticketsSold, 0) / analytics.realSellersCount
                  ).toFixed(1)
                : "0.0"}
            </p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-300 mb-2">Vendedor Más Eficiente</h4>
            <p className="text-lg font-bold text-green-400">{analytics.topSeller?.assigned_name || "N/A"}</p>
            <p className="text-sm text-gray-400">
              ${analytics.topSeller?.avgTicketPrice.toFixed(2) || "0.00"} promedio/ticket
            </p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-300 mb-2">Total en Comisiones</h4>
            <p className="text-2xl font-bold text-orange-400">
              ${analytics.sellersWithStats.reduce((total, seller) => total + seller.commission, 0).toFixed(2)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

SellerAnalytics.propTypes = {
  data: PropTypes.object.isRequired,
  analytics: PropTypes.object,
  commissionAmount: PropTypes.number.isRequired,
}
