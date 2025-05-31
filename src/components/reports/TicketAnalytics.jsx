"use client"

import PropTypes from "prop-types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

export default function TicketAnalytics({ data, analytics, chartData, colors }) {
  if (!analytics) return null

  const getPopularityBadge = (percentage) => {
    if (percentage > 40) {
      return (
        <span className="inline-flex items-center rounded-full border border-transparent bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
          Muy Popular
        </span>
      )
    } else if (percentage > 20) {
      return (
        <span className="inline-flex items-center rounded-full border border-transparent bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
          Popular
        </span>
      )
    } else if (percentage > 10) {
      return (
        <span className="inline-flex items-center rounded-full border border-transparent bg-yellow-100 px-2.5 py-0.5 text-xs font-semibold text-yellow-800">
          Moderado
        </span>
      )
    }
    return (
      <span className="inline-flex items-center rounded-full border border-transparent bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800">
        Bajo
      </span>
    )
  }

  return (
    <Card className="bg-gray-800 border-gray-700 rounded-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Análisis Detallado por Tipo de Ticket</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
          {/* Gráfico de torta */}
          <div className="w-full lg:w-1/2">
            <h3 className="text-lg font-semibold mb-4 text-center">Distribución de Ingresos</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#374151",
                      border: "none",
                      borderRadius: "0.375rem",
                      color: "#F3F4F6",
                    }}
                    formatter={(value) => [`$${value.toFixed(2)}`, "Ingresos"]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tabla detallada */}
          <div className="w-full lg:w-1/2">
            <h3 className="text-lg font-semibold mb-4">Detalles por Tipo</h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-300 text-left">Tipo</TableHead>
                    <TableHead className="text-gray-300 text-left">Popularidad</TableHead>
                    <TableHead className="text-gray-300 text-left">Precio</TableHead>
                    <TableHead className="text-gray-300 text-left">Vendidos</TableHead>
                    <TableHead className="text-gray-300 text-left">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analytics.ticketStats
                    .sort((a, b) => b.revenue - a.revenue)
                    .map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell className="font-medium">{ticket.name}</TableCell>
                        <TableCell>{getPopularityBadge(ticket.percentage)}</TableCell>
                        <TableCell>${ticket.price.toFixed(2)}</TableCell>
                        <TableCell>
                          {ticket.quantitySold} ({ticket.percentage.toFixed(1)}%)
                        </TableCell>
                        <TableCell className="font-bold">${ticket.revenue.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* Insights adicionales */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-700 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-300 mb-2">Ticket Más Caro</h4>
            <p className="text-lg font-bold text-purple-400">
              {analytics.ticketStats.reduce((max, ticket) => (ticket.price > max.price ? ticket : max)).name}
            </p>
            <p className="text-sm text-gray-400">
              $
              {analytics.ticketStats
                .reduce((max, ticket) => (ticket.price > max.price ? ticket : max))
                .price.toFixed(2)}
            </p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-300 mb-2">Mayor Recaudación</h4>
            <p className="text-lg font-bold text-green-400">{analytics.highestRevenueTicket?.name || "N/A"}</p>
            <p className="text-sm text-gray-400">${analytics.highestRevenueTicket?.revenue.toFixed(2) || "0.00"}</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-300 mb-2">Más Vendido</h4>
            <p className="text-lg font-bold text-blue-400">{analytics.mostPopularTicket?.name || "N/A"}</p>
            <p className="text-sm text-gray-400">{analytics.mostPopularTicket?.quantitySold || 0} unidades</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-300 mb-2">Precio Promedio</h4>
            <p className="text-2xl font-bold text-yellow-400">${analytics.avgTicketPrice.toFixed(2)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

TicketAnalytics.propTypes = {
  data: PropTypes.object.isRequired,
  analytics: PropTypes.object,
  chartData: PropTypes.array.isRequired,
  colors: PropTypes.array.isRequired,
}
