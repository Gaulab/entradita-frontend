"use client"

import { useState } from "react"
import PropTypes from "prop-types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, Users, Grid3X3, ChevronDown, ChevronUp } from "lucide-react"

export default function SellerPerformanceChart({ data, analytics }) {
  const [viewMode, setViewMode] = useState("cards") // 'cards', 'ranking', 'comparison'
  const [showAll, setShowAll] = useState(false)

  if (!analytics || analytics.realSellersCount === 0) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Rendimiento por Vendedor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No hay vendedores registrados en este evento</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const sortedSellers = analytics.sellersWithStats.sort((a, b) => b.ticketsSold - a.ticketsSold)

  // Limitar a los primeros 6 vendedores por defecto
  const displayLimit = 6
  const sellersToShow = showAll ? sortedSellers : sortedSellers.slice(0, displayLimit)
  const hasMoreSellers = sortedSellers.length > displayLimit

  const getPerformanceColor = (seller, index) => {
    if (index === 0) return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20"
    if (index === 1) return "text-muted-foreground bg-gray-300/10 border-gray-300/20"
    if (index === 2) return "text-orange-400 bg-orange-400/10 border-orange-400/20"
    return "text-primary bg-primary/10 border-primary/40/20"
  }

  const getRankingIcon = (index) => {
    if (index === 0) return "🥇"
    if (index === 1) return "🥈"
    if (index === 2) return "🥉"
    return `#${index + 1}`
  }

  const renderCardsView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {sellersToShow.map((seller, index) => (
        <div
          key={seller.id}
          className={`p-4 rounded-lg border ${getPerformanceColor(seller, index)} transition-all hover:scale-105`}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm truncate">{seller.assigned_name}</h3>
            <span className="text-2xl">{getRankingIcon(index)}</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Tickets:</span>
              <span className="font-bold">{seller.ticketsSold}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Ingresos:</span>
              <span className="font-bold">${seller.totalRevenue.toFixed(0)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Promedio:</span>
              <span className="font-bold">${seller.avgTicketPrice.toFixed(0)}</span>
            </div>
          </div>
          {/* Barra de progreso */}
          <div className="mt-3">
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="h-2 rounded-full bg-current opacity-60"
                style={{
                  width: `${Math.min((seller.ticketsSold / (sortedSellers[0]?.ticketsSold || 1)) * 100, 100)}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const renderRankingView = () => (
    <div className="space-y-3">
      {sellersToShow.map((seller, index) => (
        <div
          key={seller.id}
          className={`flex items-center justify-between p-4 rounded-lg border ${getPerformanceColor(seller, index)}`}
        >
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold w-12 text-center">{getRankingIcon(index)}</span>
            <div>
              <h3 className="font-semibold">{seller.assigned_name}</h3>
              <p className="text-xs text-muted-foreground">
                {seller.ticketsSold} tickets • ${seller.totalRevenue.toFixed(2)} ingresos
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold">{seller.ticketsSold}</div>
            <div className="text-xs text-muted-foreground">tickets</div>
          </div>
        </div>
      ))}
    </div>
  )

  const renderComparisonView = () => {
    const maxTickets = Math.max(...sortedSellers.map((s) => s.ticketsSold))
    const maxRevenue = Math.max(...sortedSellers.map((s) => s.totalRevenue))

    return (
      <div className="space-y-4">
        {sellersToShow.map((seller, index) => (
          <div key={seller.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium text-sm">{seller.assigned_name}</span>
              <span className="text-xs text-muted-foreground">
                {seller.ticketsSold} tickets • ${seller.totalRevenue.toFixed(0)}
              </span>
            </div>

            {/* Barra de tickets */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Tickets vendidos</span>
                <span>{seller.ticketsSold}</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-primary"
                  style={{ width: `${(seller.ticketsSold / maxTickets) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Barra de ingresos */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Ingresos generados</span>
                <span>${seller.totalRevenue.toFixed(0)}</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-green-400"
                  style={{ width: `${(seller.totalRevenue / maxRevenue) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="text-xl font-bold">
            Rendimiento por Vendedor ({analytics.realSellersCount} vendedores)
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "cards" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("cards")}
              className="flex items-center gap-2"
            >
              <Grid3X3 className="h-4 w-4" />
              <span className="hidden sm:inline">Cards</span>
            </Button>
            <Button
              variant={viewMode === "ranking" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("ranking")}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Ranking</span>
            </Button>
            <Button
              variant={viewMode === "comparison" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("comparison")}
              className="flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Comparar</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {viewMode === "cards" && renderCardsView()}
        {viewMode === "ranking" && renderRankingView()}
        {viewMode === "comparison" && renderComparisonView()}

        {/* Botón para mostrar más/menos vendedores */}
        {hasMoreSellers && (
          <div className="mt-6 text-center">
            <Button variant="outline" onClick={() => setShowAll(!showAll)} className="flex items-center gap-2 mx-auto">
              {showAll ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Mostrar menos
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  Mostrar todos ({sortedSellers.length - displayLimit} más)
                </>
              )}
            </Button>
          </div>
        )}

        {/* Estadísticas resumidas */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{analytics.realSellersCount}</div>
              <div className="text-xs text-muted-foreground">Vendedores</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">
                {analytics.realSellersCount > 0
                  ? (
                      analytics.sellersWithStats.reduce((sum, s) => sum + s.ticketsSold, 0) / analytics.realSellersCount
                    ).toFixed(1)
                  : "0.0"}
              </div>
              <div className="text-xs text-muted-foreground">Promedio tickets</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">{sortedSellers[0]?.ticketsSold || 0}</div>
              <div className="text-xs text-muted-foreground">Máximo vendido</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">
                $
                {analytics.realSellersCount > 0
                  ? (
                      analytics.sellersWithStats.reduce((sum, s) => sum + s.totalRevenue, 0) /
                      analytics.realSellersCount
                    ).toFixed(0)
                  : "0"}
              </div>
              <div className="text-xs text-muted-foreground">Promedio ingresos</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

SellerPerformanceChart.propTypes = {
  data: PropTypes.object.isRequired,
  analytics: PropTypes.object,
}
