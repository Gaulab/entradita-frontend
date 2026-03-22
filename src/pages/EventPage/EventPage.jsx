"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import PropTypes from "prop-types"
import { motion } from "framer-motion"
import { MapPin, Calendar, Phone, ShieldCheck, QrCode, Zap } from "lucide-react"
import { getEventPage } from "../../api/eventApi"
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

function EventPage() {
  const { id } = useParams()
  const [eventData, setEventData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchEventPage = async () => {
      try {
        setLoading(true)
        const eventPage = await getEventPage(id)
        setEventData(eventPage)
        setError(null)
      } catch (err) {
        setError("No pudimos cargar la información del evento. Intentá de nuevo más tarde.")
        console.error("Error fetching event data:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchEventPage()
  }, [id])

  const handleBuyTicket = () => {
    const message = encodeURIComponent(
      "Hola! quiero un QR para el evento " + eventData.name + "!",
    )
    window.location.href = `https://wa.me/${eventData.organizer_contact}?text=${message}`
  }

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
          <p className="text-gray-400 text-sm tracking-wide">Cargando evento...</p>
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

  if (!eventData) return null

  const eventDate = parseEventDate(eventData.date)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1a] via-[#121a24] to-[#0d1520]" style={{ touchAction: 'pan-y' }}>
      {/* Hero */}
      <div className="relative h-[52vh] sm:h-[56vh] overflow-hidden">
        <img
          className="absolute inset-0 w-full h-full object-cover"
          src={eventData.image || "/placeholder.svg"}
          alt={eventData.name}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a] via-[#0a0f1a]/50 to-black/20" />

        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="absolute top-0 left-0 right-0 p-4 sm:p-6 z-10"
        >
          <Logo />
        </motion.header>

        {eventDate && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35, type: "spring", stiffness: 200 }}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10"
          >
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 text-center shadow-lg">
              <div className="text-2xl font-bold text-white leading-none">{eventDate.getDate()}</div>
              <div className="text-[10px] font-medium text-white/60 tracking-widest mt-1 uppercase">
                {MONTH_NAMES[eventDate.getMonth()]}
              </div>
            </div>
          </motion.div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 z-10">
          <div className="max-w-3xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight drop-shadow-lg"
            >
              {eventData.name}
            </motion.h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-2 relative z-20 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          {/* Info chips */}
          <div className="flex flex-wrap gap-2.5 mb-8">
            <InfoChip icon={Calendar} text={formatDate(eventData.date)} />
            <InfoChip icon={MapPin} text={eventData.place} />
            {eventData.organizer_contact && (
              <InfoChip icon={Phone} text={eventData.organizer_contact} />
            )}
          </div>

          {/* Purchase card */}
          <div className="bg-[#1a2433]/80 backdrop-blur-xl rounded-3xl border border-white/[0.06] p-6 sm:p-8 shadow-2xl shadow-black/20">
            <h2 className="text-lg font-semibold text-white mb-1">Conseguí tu entrada</h2>
            <p className="text-sm text-gray-400 mb-6">Elegí tu método de compra preferido</p>

            <div className="space-y-3">
              {eventData.organizer_contact && (
                <button
                  onClick={handleBuyTicket}
                  className="group w-full px-5 py-4 bg-[#25D366] text-white font-semibold rounded-2xl shadow-lg shadow-[#25D366]/20 hover:shadow-[#25D366]/30 hover:bg-[#22c55e] active:scale-[0.98] transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img src="/whatsapp.png" alt="WhatsApp" className="w-6 h-6" />
                    <span className="text-[15px]">Comprar por WhatsApp</span>
                  </div>
                  <ChevronArrow />
                </button>
              )}

              {eventData.web_sale && (
                <button
                  onClick={() => navigate(`/event-page/${id}/purchase`)}
                  className="group w-full px-5 py-4 bg-[#009ee3] text-white font-semibold rounded-2xl shadow-lg shadow-[#009ee3]/20 hover:shadow-[#009ee3]/30 hover:bg-[#00b4ff] active:scale-[0.98] transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img src="/mercadopago.png" alt="Mercado Pago" className="w-6 h-6" />
                    <span className="text-[15px]">Comprar con Mercado Pago</span>
                  </div>
                  <ChevronArrow />
                </button>
              )}
            </div>

            {/* Trust indicators */}
            <div className="mt-8 pt-6 border-t border-white/5">
              <div className="grid grid-cols-3 gap-3">
                <TrustBadge icon={QrCode} label="QR único y personal" color="blue" />
                <TrustBadge icon={ShieldCheck} label="Compra segura" color="green" />
                <TrustBadge icon={Zap} label="Entrega instantánea" color="purple" />
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-xs text-gray-600">
            <span>Powered by </span>
            <span className="font-semibold text-gray-500">entradita.com</span>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

function InfoChip({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-2 bg-[#1a2433]/90 backdrop-blur-md border border-white/5 rounded-full px-4 py-2.5">
      <Icon className="w-4 h-4 text-blue-400 shrink-0" />
      <span className="text-sm text-gray-200">{text}</span>
    </div>
  )
}

InfoChip.propTypes = {
  icon: PropTypes.elementType.isRequired,
  text: PropTypes.string.isRequired,
}

const TRUST_COLORS = {
  blue: { bg: "bg-blue-500/10", text: "text-blue-400" },
  green: { bg: "bg-green-500/10", text: "text-green-400" },
  purple: { bg: "bg-purple-500/10", text: "text-purple-400" },
}

function TrustBadge({ icon: Icon, label, color }) {
  const c = TRUST_COLORS[color]
  return (
    <div className="text-center">
      <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center mx-auto mb-2`}>
        <Icon className={`w-5 h-5 ${c.text}`} />
      </div>
      <p className="text-[11px] text-gray-400 leading-tight">{label}</p>
    </div>
  )
}

TrustBadge.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  color: PropTypes.oneOf(["blue", "green", "purple"]).isRequired,
}

function ChevronArrow() {
  return (
    <svg
      className="w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  )
}

function Logo() {
  return (
    <div className="flex items-center gap-1.5">
      <img src="/isotipoWhite.png" alt="Entradita" className="w-8 h-8" />
      <span className="font-bold text-white/90 text-sm tracking-wide">entradita.com</span>
    </div>
  )
}

export default EventPage
