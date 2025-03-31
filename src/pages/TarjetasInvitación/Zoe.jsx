import { MapPin, Gift, Calendar, Phone, Mail, Heart, Shirt, PhoneIcon, Ticket as WhatsApp, Ticket, PiggyBankIcon } from "lucide-react"
import CountdownTimer from "@/components/invitations/countdowntimer"
import GiftInfo from "@/components/invitations/giftinfo"
import LocationMap from "@/components/invitations/locationmap"
import "../../index.css"
import { FaMoneyBill, FaMoneyCheck } from "react-icons/fa"

function Zoe() {
  // Event details - modify as needed
  const eventDate = new Date("2025-06-02T20:00:00")
  const eventLocation = ""
  const eventAddress = "Finca Don Roque, RN11, Malabrigo, Santa Fe"

  return (
      <main className="flex min-h-screen flex-col items-center">
          
      {/* Header Section */}
        <section
          className="w-full bg-gradient-to-r from-purple-100 to-purple-200 py-10 text-center"
          style={{
            backgroundImage: 'url("/mariposas.jpg")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundColor: "rgba(255, 255, 255, 0.8)", // Add a semi-transparent overlay
            backgroundBlendMode: "overlay", // Blend the overlay with the image
            }}
          >
            <div className="container px-4 md:px-6">
            <h1 className="font-bold text-6xl tracking-tight text-purple-800 md:text-6xl" style={{ fontFamily: "'Dancing Script', cursive" }}>
              15's de Zoe
            </h1>
            <p className="font-normal mt-4 text-xl text-purple-700">¡Te invito a celebrar mis quince años!</p>
            </div>
          </section>

          {/* Hero Image Section */}
      <section className="w-full py-2 md:py-16 bg-white">
        <div className="container flex flex-col items-center px-2 md:px-0">
          <div className="relative h-[300px] w-full max-w-3xl overflow-hidden rounded-xl md:h-[400px]">
            <img
              src="Principal.jpeg?text=Zoe's+15th+Birthday"
              alt="Zoe's 15th Birthday Celebration"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Countdown Section */}
      <section className="w-full bg-purple-50 py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold tracking-tight text-purple-800">Cuenta Regresiva</h2>
            <p className="mt-2 text-purple-600">¡Faltan solo unos días para la gran celebración!</p>
            <div className="mt-8">
              <CountdownTimer targetDate={eventDate} />
            </div>
          </div>
        </div>
      </section>

      {/* Event Details Section */}
      <section className="w-full py-4 md:py-16 bg-white">
        <div className="container px-4 md:px-6">
          <div className="mx-auto grid max-w-3xl gap-8">
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
              <div className="p-6 md:p-8">
                <h2 className="mb-6 text-center text-3xl font-bold text-purple-800">Detalles del Evento</h2>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                      <Calendar className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-purple-800">Fecha y Hora</h3>
                      <p className="text-sm text-gray-600">
                        {eventDate.toLocaleDateString("es-AR", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-sm text-gray-600">
                        {eventDate.toLocaleTimeString("es-AR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                      <MapPin className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-purple-800">Lugar</h3>
                      <p className="text-sm text-gray-600">{eventLocation}</p>
                      <p className="text-sm text-gray-600">{eventAddress}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                      <Shirt className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-purple-800">Dress Code</h3>
                      <p className="text-sm text-gray-600">Elegante</p>
                      <p className="text-sm text-gray-600">Formal</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ticket Price Section */}
      <section className="w-full py-4 md:py-16 bg-purple-50">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl">
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
              <div className="p-6 md:p-8">
                <h2 className="mb-6 text-center text-3xl font-bold text-purple-800">Valor de la Tarjeta</h2>
                <div className="flex flex-col items-center justify-center">
                
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                      <Ticket className="h-6 w-6 text-purple-600" />
                    </div>
                  <div className="flex flex-col gap-2 md:flex-row md:gap-8">
                    <div className="text-center">
                      <p className="text-lg font-medium text-purple-700">Mayores</p>
                      <p className="text-2xl font-bold text-purple-800">$25.000</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-medium text-purple-700">Menores</p>
                      <p className="text-2xl font-bold text-purple-800">$15.000</p>
                    </div>
                  </div>
                  <p className="mt-4 text-center text-gray-600">
                    Puedes abonar el valor de la tarjeta mediante transferencia bancaria utilizando los datos de la
                    sección "Información bancaria" o en efectivo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Attendance Confirmation Section */}
      <section className="w-full bg-white py-6 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-center text-3xl font-bold text-purple-800">Confirma tu Asistencia</h2>
            <p className="mb-8 text-center text-purple-600">Por favor, confirma tu asistencia antes del 28 de Abril</p>
            <a
              href="https://wa.me/5491112345678?text=Hola%20Zoe!%20Confirmo%20mi%20asistencia%20a%20tu%20fiesta%20de%2015%20años.%20Mi%20nombre%20es%3A%20"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md bg-green-600 px-6 py-3 text-lg font-medium text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              <WhatsApp className="mr-2 h-5 w-5" />
              Confirmar por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Gift Information Section */}
      <section className="w-full bg-purple-50 py-6 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-center text-3xl font-bold text-purple-800">
              <FaMoneyBill className="mr-2 inline-block h-8 w-8" />
              Información Bancaria
            </h2>
            <GiftInfo />
          </div>
        </div>
      </section>

      {/* Location Map Section */}
      <section className="w-full py-6 md:py-10 bg-white">
        <div className="container px-4 md:px-6 ">
          <h2 className="mb-6 text-center text-3xl font-bold text-purple-800">Ubicación</h2>
          <div className=" max-w-3xl overflow-hidden rounded-xl bg-purple-50">
            <LocationMap address={eventAddress} />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="w-full bg-purple-50 py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold text-purple-800">Contacto</h2>
            <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-purple-600" />
                <span className="text-purple-800">+54 11 1234-5678</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-purple-600" />
                <span className="text-purple-800">zoe@example.com</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-purple-800 py-6 text-center text-white">
        <div className="container px-4 md:px-6">
          <p className="flex items-center justify-center">
            Con amor, Zoe <Heart className="ml-2 h-4 w-4 text-purple-300" />
          </p>
        </div>
      </footer>
    </main>
  )
}

export default Zoe

