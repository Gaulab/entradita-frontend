"use client"

import { useState, useEffect, useMemo, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx"
import { Input } from "@/components/ui/input.jsx"
import { Label } from "@/components/ui/label.jsx"
import { DollarSign, Tag, Percent, ArrowLeft, Printer, TrendingUp, Award, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button.jsx"
import AuthContext from "../../context/AuthContext.jsx"
import { Alert, AlertDescription } from "@/components/ui/alert.jsx"
import LoadingSpinner from "@/components/ui/loadingspinner.jsx"
import ReportPrintView from "@/components/reports/ReportPrintView.jsx"
import SellerAnalytics from "@/components/reports/SellerAnalytics.jsx"
import TicketAnalytics from "@/components/reports/TicketAnalytics.jsx"
import SellerPerformanceChart from "@/components/reports/SellerPerformanceChart.jsx"

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
  "#FFC658",
  "#FF9F40",
  "#FF6633",
  "#FF5500",
]

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

    // Separar vendedores reales del admin
    const realSellers = data.sellers.filter((seller) => seller.is_seller === true)
    const adminSellers = data.sellers.filter((seller) => seller.is_seller !== true)

    // Análisis de vendedores reales
    const sellersWithStats = realSellers.map((seller) => {
      const ticketsSold = seller.ticket_counter || 0
      const totalRevenue = Object.entries(seller.ticket_tag_sales).reduce((total, [tagId, quantity]) => {
        const tag = data.ticket_tags.find((t) => t.id === Number.parseInt(tagId))
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

    // Análisis de ventas del admin
    const adminStats = adminSellers.map((admin) => {
      const ticketsSold = Object.values(admin.ticket_tag_sales).reduce((total, quantity) => total + quantity, 0)
      const totalRevenue = Object.entries(admin.ticket_tag_sales).reduce((total, [tagId, quantity]) => {
        const tag = data.ticket_tags.find((t) => t.id === Number.parseInt(tagId))
        return total + (tag ? tag.price * quantity : 0)
      }, 0)

      return {
        ...admin,
        totalRevenue,
        ticketsSold,
        avgTicketPrice: ticketsSold > 0 ? totalRevenue / ticketsSold : 0,
      }
    })

    // Top vendedor (solo vendedores reales)
    const topSeller = sellersWithStats.reduce((top, seller) => {
      return seller.ticketsSold > (top?.ticketsSold || 0) ? seller : top
    }, null)

    // Vendedor con mayor recaudación (solo vendedores reales)
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
      adminStats,
      topSeller,
      topRevenueSeller,
      ticketStats,
      mostPopularTicket,
      highestRevenueTicket,
      avgTicketPrice: data.total_tickets > 0 ? data.total_sales / data.total_tickets : 0,
      realSellersCount: realSellers.length,
    }
  }, [data, commissionAmount])

  const totalCommission = useMemo(() => {
    if (!data) return 0
    return data.sellers
      .filter((seller) => seller.is_seller === true)
      .reduce((total, seller) => {
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
              Para que este reporte funcione correctamente, asegúrese de haber configurado los precios adecuados para
              los ticket tags en el evento.
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
          <Button
            onClick={handlePrint}
            className="mb-0 flex items-center max-md:w-full w-72 bg-blue-600 hover:bg-blue-700"
          >
            <Printer className="mr-2 h-4 w-4" /> Imprimir Reporte
          </Button>
        </div>

        {/* Métricas principales */}
        {/* Métricas principales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Recaudación Total */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recaudación Total</CardTitle>
              <DollarSign className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">
                $
                {data.total_sales.toLocaleString('es-AR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Promedio por ticket: $
                {(analytics?.avgTicketPrice || 0).toLocaleString('es-AR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </CardContent>
          </Card>

          {/* Total de Tickets */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Tickets</CardTitle>
              <Tag className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">
                {data.total_tickets.toLocaleString('es-AR')}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {analytics?.realSellersCount || 0} vendedor
                {analytics?.realSellersCount !== 1 ? "es" : ""} activo
                {analytics?.realSellersCount !== 1 ? "s" : ""}
              </p>
            </CardContent>
          </Card>

          {/* Comisión Total */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Comisión Total</CardTitle>
              <Percent className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-400">
                $
                {isNaN(totalCommission)
                  ? "0,00"
                  : totalCommission.toLocaleString('es-AR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                $
                {commissionAmount.toLocaleString('es-AR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                por ticket
              </p>
            </CardContent>
          </Card>

          {/* Ingreso Neto */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingreso Neto</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">
                $
                {isNaN(netRevenue)
                  ? "0,00"
                  : netRevenue.toLocaleString('es-AR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {((netRevenue / data.total_sales) * 100).toFixed(1)}% del total
              </p>
            </CardContent>
          </Card>
        </div>


        {/* Análisis de rendimiento - solo vendedores reales */}
        {analytics && analytics.realSellersCount > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Top Vendedor (Cantidad)</CardTitle>
                <Award className="h-4 w-4 text-yellow-400" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-yellow-400">{analytics.topSeller?.assigned_name || "N/A"}</div>
                <p className="text-xs text-gray-400 mt-1">{analytics.topSeller?.ticketsSold || 0} tickets vendidos</p>
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

        {/* Mostrar información del admin si existe */}
        {analytics && analytics.adminStats.length > 0 && (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Ventas Administrativas</CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.adminStats.map((admin) => (
                <div key={admin.id} className="bg-gray-700 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-blue-400">{admin.assigned_name}</h3>
                    <span className="text-sm text-gray-400 bg-blue-900/30 px-3 py-1 rounded-full">Administrador</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">{admin.ticketsSold}</div>
                      <div className="text-sm text-gray-400">Tickets vendidos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">${admin.totalRevenue.toFixed(2)}</div>
                      <div className="text-sm text-gray-400">Total recaudado</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">${admin.avgTicketPrice.toFixed(2)}</div>
                      <div className="text-sm text-gray-400">Promedio por ticket</div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-600">
                    <p className="text-xs text-gray-400 text-center">
                      Las ventas administrativas no generan comisiones
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Componente de rendimiento de vendedores mejorado - solo vendedores reales */}
        {analytics && analytics.realSellersCount > 0 && <SellerPerformanceChart data={data} analytics={analytics} />}

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
              <div className="text-sm text-gray-400">Total a pagar en comisiones: ${totalCommission.toFixed(2)}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default EconomicReport
