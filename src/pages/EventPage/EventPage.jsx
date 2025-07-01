"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { getEventPage } from "../../api/eventPageApi"

function EventPage() {
  const { id } = useParams()
  const [eventData, setEventData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchEventPage = async () => {
      try {
        setLoading(true)
        const eventPage = await getEventPage(id)
        setEventData(eventPage)
        setError(null)
      } catch (err) {
        setError("Failed to load event information. Please try again later.")
        console.error("Error fetching event data:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchEventPage()
  }, [id])

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return ""
    const options = { year: "numeric", month: "long", day: "numeric" }
    const date = new Date(dateString)
    const utcDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
    return utcDate.toLocaleDateString(undefined, options)
  }

  // Handle buy button click
  const handleBuyTicket = () => {
    // Redirect to a WhatsApp chat link
    const message = encodeURIComponent(
      "Hola! quiero un QR para el evento " + eventData.name + "!",
    )
    window.location.href = `https://wa.me/${eventData.organizer_contact}?text=${message}`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121a24]">
        <div className="text-center">
          <div className="flex flex-col items-center">
            <div className="mb-4">
              <Logo />
            </div>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
            <p className="mt-4 text-gray-200">Cargando información del evento...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121a24]">
        <div className="text-center p-6 max-w-md bg-[#1a2433] rounded-lg shadow-xl border border-gray-700">
          <div className="mb-4">
            <Logo />
          </div>
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error</h2>
          <p className="text-gray-300">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Intentar nuevamente
          </button>
        </div>
      </div>
    )
  }

  if (!eventData) return null

  return (
    <div className="min-h-screen bg-[#121a24] py-8 px-4 sm:px-6 lg:px-8">
      {/* Header with logo */}
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-8">
        <div className="flex items-center">
          <Logo />
        </div>
      </header>

      {/* Event Card */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#1a2433] rounded-xl shadow-2xl overflow-hidden border border-gray-800">
          {/* Ticket top edge with dots */}

          <div className="md:flex">
            <div className="md:shrink-0 relative">
              <img
                className="h-56 w-full object-cover md:h-full md:w-96"
                src={eventData.image_address || "/placeholder.svg"}
                alt={eventData.name}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121a24]/80 to-transparent"></div>

              {/* Event date badge */}
              <div className="absolute top-4 left-4 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
                {formatDate(eventData.date)}
              </div>
            </div>

            <div className="p-8 w-full relative">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h1 className="text-3xl font-bold text-white leading-tight">{eventData.name}</h1>
                  </div>

                  <div className="space-y-4 mt-6">
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-[#243044] flex items-center justify-center mr-3 mt-0.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-blue-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400">Ubicación</div>
                        <div className="font-medium text-gray-200">{eventData.place}</div>
                      </div>
                    </div>

                    {eventData.organizer_contact && (
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-[#243044] flex items-center justify-center mr-3 mt-0.5">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-blue-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400">Contacto</div>
                          <div className="font-medium text-gray-200">{eventData.organizer_contact}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    onClick={handleBuyTicket}
                    className="w-full px-6 py-3 bg-blue-500 text-white font-medium rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all transform hover:-translate-y-0.5"
                  >
                    Comprar Tickets
                  </button>
                  <div className="text-center mt-2 text-xs text-gray-400">
                    Tickets QR seguros y verificación instantánea
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ticket bottom edge with dots */}

        </div>

        {/* Footer with branding */}
        <div className="mt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} entradita.com - Revoluciona tus Eventos
        </div>
      </div>
    </div>
  )
}

// Logo component
function Logo({ small = false }) {
  return (
    <div className={`flex items-center ${small ? "text-lg" : "text-xl"}`}>
      <div className="mr-1">
        <img
          src="/isotipoWhite.png" // Replace with the path to your logo image
          alt="Entradita Logo"
          className={`${small ? "w-10 h-10" : "w-10 h-10"}`}
        />
      </div>
      <span className={`font-bold text-white ${small ? "text-sm" : "text-lg"}`}>entradita.com</span>
    </div>
  )
}

export default EventPage
