"use client"

import React, { useState, useEffect, useMemo, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DollarSign, Tag, Percent, ArrowLeft, Printer, TrendingUp, Users, Award, BarChart3 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import AuthContext from "../context/AuthContext"
import { Alert, AlertDescription } from "@/components/ui/alert"
import LoadingSpinner from "@/components/ui/loadingspinner"
import ReportPrintView from "@/components/reports/ReportPrintView"
import SellerAnalytics from "@/components/reports/SellerAnalytics"
import TicketAnalytics from "@/components/reports/TicketAnalytics"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#FFC658", "#FF9F40", "#FF6633", "#FF5500"]

const EconomicReport = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [commissionAmount, setCommissionAmount] = useState(null)
  const [showPrintView, setShowPrintView] = useState(false)
  const apiUrl = import.meta.env.VITE_API_URL
  const { authToken } = useContext(AuthContext)
  const [showAlert, setShowAlert] = useState(true)
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    const fetchEconomicReport = async () => {
      try {
        const token = typeof authToken === "string" ? authToken.trim() : authToken.access.trim()
        const response = await fetch(`${apiUrl}/api/v1/main/event/${id}/economic-report/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Error al obtener los datos.")
        }

        const result = await response.json()
        setData(result)
        setCommissionAmount(result.commission_per_ticket || 0)
        setHasMounted(true)
        console.log(result)
      } catch (error) {
        console.error(error.message)
      }
    }

    fetchEconomicReport()
  }, [id, apiUrl, authToken])

  useEffect(() => {
    if (!hasMounted) return
    const updateCommissionAmount = async () => {
      try {
        const token = typeof authToken === "string" ? authToken.trim() : authToken.access.trim()
        const response = await fetch(`${apiUrl}/api/v1/main/event/${id}/economic-report/`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ commission_per_ticket: commissionAmount }),
        })

        if (!response.ok) {
          throw new Error("Error al actualizar la comisión.")
        }

        const result = await response.json()
        console.log("Comisión actualizada", result)
      } catch (error) {
        console.error(error.message)
      }
    }

    if (data) {
      updateCommissionAmount()
    }
  }, [commissionAmount])

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAlert(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  const analytics = useMemo(() => {
    if (!data) return null

    // Análisis de vendedores
    const sellersWithStats = data.sellers.map((seller) => {
      const ticketsSold = seller.ticket_counter || 0
      const totalRevenue = Object.entries(seller.ticket_tag_sales).reduce((total, [tagId, quantity]) => {
        const tag = data.ticket_tags.find((t) => t.id === parseInt(tagId))
        return total + (tag ? tag.price * quantity : 0)
      }, 0)
      const commission = ticketsSold * commissionAmount
      const avgTicketPrice = ticketsSold > 0 ? totalRevenue / ticketsSold : 0

      return {
        ...seller,
        totalRevenue,
        commission,
        avgTicketPrice,
        ticketsSold,
      }
    })

    // Top vendedor
    const topSeller = sellersWithStats.reduce((top, seller) => {
      return seller.ticketsSold > (top?.ticketsSold || 0) ? seller : top
    }, null)

    // Vendedor con mayor recaudación
    const topRevenueSeller = sellersWithStats.reduce((top, seller) => {
      return seller.totalRevenue > (top?.totalRevenue || 0) ? seller : top
    }, null)

    // Análisis de tickets
    const ticketStats = data.ticket_tags.map((tag) => {
      const quantitySold = data.sellers.reduce((total, seller) => total + (seller.ticket_tag_sales[tag.id] || 0), 0)
      const revenue = quantitySold * tag.price
      const percentage = data.total_tickets > 0 ? (quantitySold / data.total_tickets) * 100 : 0

      return {
        ...tag,
        quantitySold,
        revenue,
        percentage,
      }
    })

    // Ticket más vendido
    const mostPopularTicket = ticketStats.reduce((top, ticket) => {
      return ticket.quantitySold > (top?.quantitySold || 0) ? ticket : top
    }, null)

    // Ticket con mayor recaudación
    const highestRevenueTicket = ticketStats.reduce((top, ticket) => {
      return ticket.revenue > (top?.revenue || 0) ? ticket : top
    }, null)

    return {
      sellersWithStats,
      topSeller,
      topRevenueSeller,
      ticketStats,
      mostPopularTicket,
      highestRevenueTicket,
      avgTicketPrice: data.total_tickets > 0 ? data.total_sales / data.total_tickets : 0,
    }
  }, [data, commissionAmount])

  const totalCommission = useMemo(() => {
    if (!data) return 0
    return data.sellers.reduce((total, seller) => {
      const ticketsSold = seller.ticket_counter || 0
      return total + ticketsSold * commissionAmount
    }, 0)
  }, [data, commissionAmount])

  const netRevenue = useMemo(() => {
    if (!data || typeof data.total_sales !== "number") return 0
    return data.total_sales - totalCommission
  }, [data, totalCommission])

  const chartData = useMemo(() => {
    if (!data) return []
    return data.ticket_tags.map((tag) => {
      const quantitySold = data.sellers.reduce((total, seller) => total + (seller.ticket_tag_sales[tag.id] || 0), 0)
      return {
        name: tag.name,
        value: quantitySold * tag.price,
        quantity: quantitySold,
      }
    })
  }, [data])

  const sellerChartData = useMemo(() => {
    if (!analytics) return []
    return analytics.sellersWithStats.map((seller) => ({
      name: seller.assigned_name,
      tickets: seller.ticketsSold,
      revenue: seller.totalRevenue,
    }))
  }, [analytics])

  const handlePrint = () => {
    setShowPrintView(true)
  }

  if (!data) {
    return <LoadingSpinner />
  }

  if (showPrintView) {
    return (
      <ReportPrintView
        data={data}
        analytics={analytics}
        commissionAmount={commissionAmount}
        totalCommission={totalCommission}
        netRevenue={netRevenue}
        onClose={() => setShowPrintView(false)}
      />
    )
  }

  return (
    <div className="p-4 bg-gray-900 text-gray-100 min-h-screen justify-center w-screen">
      <div className="max-w-6xl space-y-4 mx-auto w-full">
        {showAlert && (
          <Alert className="mb-4 bg-yellow-900 border-yellow-700">
            <AlertDescription>
              Para que este reporte funcione correctamente, asegúrese de haber configurado los precios adecuados para los
              ticket tags en el evento.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col-reverse sm:flex-row justify-between items-center mb-4 gap-4">
          <Button
            variant="entraditaTertiary"
            onClick={() => navigate(-1)}
            className="mb-0 flex items-center max-md:w-full w-72"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-0">Reporte Económico</h1>
          <Button onClick={handlePrint} className="mb-0 flex items-center max-md:w-full w-72 bg-blue-600 hover:bg-blue-700">
            <Printer className="mr-2 h-4 w-4" /> Imprimir Reporte
          </Button>
        </div>

        {/* Métricas principales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recaudación Total</CardTitle>
              <DollarSign className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">${data.total_sales.toFixed(2)}</div>
              <p className="text-xs text-gray-400 mt-1">
                Promedio por ticket: ${analytics?.avgTicketPrice.toFixed(2) || "0.00"}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Tickets</CardTitle>
              <Tag className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">{data.total_tickets}</div>
              <p className="text-xs text-gray-400 mt-1">
                {data.sellers.length} vendedor{data.sellers.length !== 1 ? "es" : ""} activo{data.sellers.length !== 1 ? "s" : ""}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Comisión Total</CardTitle>
              <Percent className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-400">
                ${isNaN(totalCommission) ? "0.00" : totalCommission.toFixed(2)}
              </div>
              <p className="text-xs text-gray-400 mt-1">${commissionAmount} por ticket</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingreso Neto</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">
                ${isNaN(netRevenue) ? "0.00" : netRevenue.toFixed(2)}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {((netRevenue / data.total_sales) * 100).toFixed(1)}% del total
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Análisis de rendimiento */}
        {analytics && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Top Vendedor (Cantidad)</CardTitle>
                <Award className="h-4 w-4 text-yellow-400" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-yellow-400">{analytics.topSeller?.assigned_name || "N/A"}</div>
                <p className="text-xs text-gray-400 mt-1">
                  {analytics.topSeller?.ticketsSold || 0} tickets vendidos
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Top Vendedor (Ingresos)</CardTitle>
                <DollarSign className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-green-400">
                  {analytics.topRevenueSeller?.assigned_name || "N/A"}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  ${analytics.topRevenueSeller?.totalRevenue.toFixed(2) || "0.00"} generados
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ticket Más Popular</CardTitle>
                <BarChart3 className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-blue-400">{analytics.mostPopularTicket?.name || "N/A"}</div>
                <p className="text-xs text-gray-400 mt-1">
                  {analytics.mostPopularTicket?.quantitySold || 0} vendidos (
                  {analytics.mostPopularTicket?.percentage.toFixed(1) || 0}%)
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Gráfico de comparación de vendedores */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Rendimiento por Vendedor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sellerChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#374151",
                      border: "none",
                      borderRadius: "0.375rem",
                      color: "#F3F4F6",
                    }}
                  />
                  <Bar dataKey="tickets" fill="#3B82F6" name="Tickets Vendidos" />
                  <Bar dataKey="revenue" fill="#10B981" name="Ingresos ($)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Componentes de análisis detallado */}
        <SellerAnalytics data={data} analytics={analytics} commissionAmount={commissionAmount} />

        <TicketAnalytics data={data} analytics={analytics} chartData={chartData} colors={COLORS} />

        {/* Configuración de comisión */}
        <Card className="bg-gray-800 border-gray-700 rounded-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Configuración de Comisiones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <Label htmlFor="commissionAmount" className="whitespace-nowrap">
                Comisión por Ticket ($)
              </Label>
              <Input
                id="commissionAmount"
                type="number"
                value={commissionAmount}
                onChange={(e) => setCommissionAmount(Number(e.target.value))}
                className="max-w-xs bg-gray-700 border-gray-600 text-white"
              />
              <div className="text-sm text-gray-400">
                Total a pagar en comisiones: ${totalCommission.toFixed(2)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default EconomicReport
