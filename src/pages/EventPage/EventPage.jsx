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
    return new Date(dateString).toLocaleDateString(undefined, options)
  }
  // Handle buy button click
  const handleBuyTicket = () => {
    // Redirect to a WhatsApp chat link
    const phoneNumber = "+543482586525"; // Replace with the organizer's phone number
    const message = encodeURIComponent("Hola, quiero un ticket para el evento " + eventData.name + "con id " + eventData.id);
    window.location.href = `https://wa.me/${phoneNumber}?text=${message}`;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-200 mx-auto"></div>
          <p className="mt-4 text-gray-200">Loading event information...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-6 max-w-md bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!eventData) return null

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-gray-300 rounded-xl shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:shrink-0">
            <img
              className="h-48 w-full object-cover md:h-full md:w-80"
              src={eventData.image_address || "/placeholder.svg"}
              alt={eventData.name}
            />
          </div>
          <div className="p-8 w-full">
            <div className="uppercase tracking-wide text-sm text-green-600 font-semibold">
              {formatDate(eventData.date)}
            </div>
            <h1 className="mt-2 text-3xl font-bold text-gray-900 leading-tight">{eventData.name}</h1>
            <p className="mt-2 text-gray-600">
              <span className="font-medium">Location:</span> {eventData.place}
            </p>
            {eventData.organizer_contact && (
              <p className="mt-2 text-gray-600">
                <span className="font-medium">Contact:</span> {eventData.organizer_contact}
              </p>
            )}
            <div className="mt-8">
              <button
                onClick={handleBuyTicket}
                className="w-full md:w-auto px-6 py-3 bg-green-500 text-white font-medium rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 transition-colors"
              >
                Buy Tickets
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventPage
