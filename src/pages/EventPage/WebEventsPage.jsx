import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, Calendar, Search, Ticket, ChevronRight, Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { getWebEvents } from "../../api/eventApi"
import { formatDate } from "../../utils/dateUtils"
import PropTypes from "prop-types"

const MONTH_NAMES = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"]

function parseEventDate(raw) {
  if (!raw) return null
  const trimmed = typeof raw === "string" ? raw.trim() : ""
  const match = /^\d{4}-\d{2}-\d{2}$/.exec(trimmed)
  if (match) {
    const [year, month, day] = trimmed.split("-").map(Number)
    return new Date(year, month - 1, day)
  }
  const d = new Date(trimmed)
  return isNaN(d) ? null : d
}

function isPast(raw) {
  const d = parseEventDate(raw)
  if (!d) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return d < today
}

export default function WebEventsPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    document.title = "Eventos | entradita.com"
    const fetchEvents = async () => {
      try {
        setLoading(true)
        const data = await getWebEvents()
        setEvents(data)
        setError(null)
      } catch (err) {
        setError("No pudimos cargar los eventos. Intentá de nuevo más tarde.")
        console.error("Error fetching web events:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  const filtered = events.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.place.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="relative w-14 h-14 mx-auto mb-5">
            <div className="absolute inset-0 rounded-full border-2 border-blue-500/20" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500 animate-spin" />
          </div>
          <p className="text-slate-400 text-sm">Cargando eventos...</p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 max-w-sm w-full backdrop-blur-md bg-slate-800/40 border border-slate-700/50 rounded-2xl shadow-2xl"
        >
          <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
            <span className="text-red-400 text-xl font-bold">!</span>
          </div>
          <h2 className="text-lg font-semibold text-white mb-2">Algo salió mal</h2>
          <p className="text-slate-400 text-sm mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-xl hover:from-blue-500 hover:to-blue-600 transition-all"
          >
            Reintentar
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">

      {/* Header */}
      <header className="backdrop-blur-md bg-slate-900/80 border-b border-slate-700/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <img src="/isotipoWhite.png" alt="Entradita" className="h-8 w-auto sm:h-9" />
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              entradita.com
            </span>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 sm:py-12">

        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-5 sm:mb-6">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
            <span className="text-xs sm:text-sm text-blue-200">Entradas disponibles online</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-3 sm:mb-4">
            <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              Eventos con venta online
            </span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-md mx-auto">
            Comprá tu entrada de forma rápida y segura con Mercado Pago.
          </p>
        </motion.section>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="max-w-lg mx-auto mb-8 sm:mb-10 relative"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar evento o lugar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 backdrop-blur-md bg-slate-800/40 border border-slate-700/50 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-all"
          />
        </motion.div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <div className="w-14 h-14 rounded-2xl backdrop-blur-md bg-slate-800/40 border border-slate-700/50 flex items-center justify-center mx-auto mb-4">
                <Ticket className="w-6 h-6 text-slate-600" />
              </div>
              <p className="text-slate-400 text-sm">
                {search
                  ? "No se encontraron eventos con ese criterio."
                  : "No hay eventos disponibles por el momento."}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filtered.map((event, index) => (
                <EventCard
                  key={event.id}
                  event={event}
                  index={index}
                  onClick={() => navigate(`/event-page/${event.id}`)}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="backdrop-blur-md bg-slate-900/80 border-t border-slate-700/50 py-6">
        <p className="text-center text-slate-500 text-sm">
          © {new Date().getFullYear()}{" "}
          <span className="text-slate-400 font-medium">entradita.com</span>
        </p>
      </footer>
    </div>
  )
}

function EventCard({ event, index, onClick }) {
  const eventDate = parseEventDate(event.date)
  const past = isPast(event.date)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 + index * 0.07, type: "spring", stiffness: 260, damping: 22 }}
    >
      <Card
        onClick={onClick}
        className={`
          group cursor-pointer overflow-hidden
          backdrop-blur-md bg-slate-800/40 border-slate-700/50
          hover:bg-slate-800/60 hover:border-blue-500/40
          hover:shadow-2xl hover:shadow-blue-500/10
          hover:-translate-y-1
          transition-all duration-300
          ${past ? "opacity-70" : ""}
        `}
      >
        {/* Image */}
        <div className="relative h-44 sm:h-48 overflow-hidden bg-gradient-to-br from-slate-800 to-blue-950">
          {event.image ? (
            <img
              src={event.image}
              alt={event.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Ticket className="w-12 h-12 text-slate-700" />
            </div>
          )}

          {/* Date badge */}
          {eventDate && (
            <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md border border-white/10 rounded-xl px-3 py-2 text-center">
              <div className="text-xl font-black text-white leading-none">{eventDate.getDate()}</div>
              <div className="text-[10px] font-semibold text-white/60 tracking-widest uppercase mt-0.5">
                {MONTH_NAMES[eventDate.getMonth()]}
              </div>
            </div>
          )}

          {/* Past badge */}
          {past && (
            <div className="absolute top-3 left-3 bg-slate-900/70 backdrop-blur-md border border-slate-600/50 rounded-lg px-2.5 py-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Pasado</span>
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
        </div>

        <CardContent className="p-4 sm:p-5">
          <h2 className="text-base sm:text-lg font-bold text-white leading-snug tracking-tight line-clamp-2 mb-3 group-hover:text-blue-100 transition-colors">
            {event.name}
          </h2>

          <div className="space-y-1.5 mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="text-xs text-slate-400">{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="text-xs text-slate-400 line-clamp-1">{event.place}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
            <span className="text-xs font-medium text-blue-400 uppercase tracking-wider">Comprá online</span>
            <div className="flex items-center gap-1 text-blue-400">
              <span className="text-xs font-semibold">Ver evento</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

EventCard.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    place: PropTypes.string.isRequired,
    image: PropTypes.string,
  }).isRequired,
  index: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
}
