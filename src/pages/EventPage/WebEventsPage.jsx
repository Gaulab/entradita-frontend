import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, Calendar, Search, Ticket, ArrowRight } from "lucide-react"
import { getWebEvents } from "../../api/eventApi"
import { formatDate } from "../../utils/dateUtils"

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

function WebEventsPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
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

  const filtered = events.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.place.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0f1a] via-[#121a24] to-[#0d1520]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-2 border-blue-500/20" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500 animate-spin" />
          </div>
          <p className="text-gray-400 text-sm tracking-wide">Cargando eventos...</p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0f1a] via-[#121a24] to-[#0d1520] p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 max-w-sm w-full bg-[#1a2433]/80 backdrop-blur-xl rounded-2xl border border-white/5 shadow-2xl"
        >
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-red-400 text-2xl font-bold">!</span>
          </div>
          <h2 className="text-lg font-semibold text-white mb-2">Algo salió mal</h2>
          <p className="text-gray-400 text-sm mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-500 transition-all"
          >
            Reintentar
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1a] via-[#121a24] to-[#0d1520]">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 pt-10 pb-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <Logo />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-8"
          >
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-7 h-7 rounded-lg bg-blue-500/15 flex items-center justify-center">
                <Ticket className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <p className="text-xs font-medium text-blue-400 tracking-widest uppercase">Entradas disponibles</p>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-2">
              Eventos con venta online
            </h1>
            <p className="text-sm text-gray-400 mt-1.5">
              Comprá tu entrada de forma rápida y segura con Mercado Pago.
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mt-6 relative"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar por nombre o lugar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-[#1a2433]/80 backdrop-blur-md border border-white/[0.07] rounded-2xl text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all"
            />
          </motion.div>
        </div>
      </div>

      {/* Events list */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 pb-16">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#1a2433]/80 border border-white/5 flex items-center justify-center mx-auto mb-4">
                <Ticket className="w-6 h-6 text-gray-600" />
              </div>
              <p className="text-gray-400 text-sm">
                {search ? "No se encontraron eventos con ese criterio." : "No hay eventos disponibles por el momento."}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              className="grid gap-3 sm:gap-4"
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

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-10 text-center text-xs text-gray-600"
        >
          Powered by <span className="font-semibold text-gray-500">entradita.com</span>
        </motion.p>
      </div>
    </div>
  )
}

function EventCard({ event, index, onClick }) {
  const eventDate = parseEventDate(event.date)

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.06, type: "spring", stiffness: 260, damping: 24 }}
      onClick={onClick}
      className="group w-full text-left bg-[#1a2433]/70 backdrop-blur-md border border-white/[0.06] rounded-2xl overflow-hidden hover:border-blue-500/30 hover:bg-[#1e2a3d]/80 hover:shadow-xl hover:shadow-blue-500/5 active:scale-[0.99] transition-all duration-300"
    >
      <div className="flex gap-0">
        {/* Image */}
        <div className="relative w-28 sm:w-36 shrink-0 overflow-hidden">
          {event.image ? (
            <img
              src={event.image}
              alt={event.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-900/40 to-slate-800/40 flex items-center justify-center">
              <Ticket className="w-8 h-8 text-blue-500/30" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#1a2433]/30" />
        </div>

        {/* Info */}
        <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between min-h-[7rem]">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white leading-snug tracking-tight group-hover:text-blue-100 transition-colors line-clamp-2">
              {event.name}
            </h2>

            <div className="flex flex-col gap-1.5 mt-2.5">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="text-xs text-gray-400">{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="text-xs text-gray-400 line-clamp-1">{event.place}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-3">
            {eventDate && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-2.5 py-1 text-center">
                <span className="text-sm font-bold text-blue-300 leading-none">{eventDate.getDate()}</span>
                <span className="text-[10px] font-medium text-blue-400/70 tracking-wider ml-1 uppercase">
                  {MONTH_NAMES[eventDate.getMonth()]}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1 text-xs text-blue-400 font-medium ml-auto">
              <span>Ver evento</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </motion.button>
  )
}

import PropTypes from "prop-types"

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

function Logo() {
  return (
    <div className="flex items-center gap-1.5">
      <img src="/isotipoWhite.png" alt="Entradita" className="w-8 h-8" />
      <span className="font-bold text-white/90 text-sm tracking-wide">entradita.com</span>
    </div>
  )
}

export default WebEventsPage
