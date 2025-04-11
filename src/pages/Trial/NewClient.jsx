"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  CheckCircle,
  ChevronRight,
  BookOpen,
  Tag,
  Copy,
  Check,
  HelpCircle,
  ArrowRight,
  FileText,
  Info,
} from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"

function NewClient() {
  // Estado para los datos del cliente
  const [clientData, setClientData] = useState({
    nombre: "",
    usuario: "",
    contrasenia: "",
    evento: "",
  })

  // Estado para el botón de copiado
  const [copied, setCopied] = useState(false)

  // Efecto para extraer los parámetros de la URL
  useEffect(() => {
    // Obtener la ruta completa
    const path = window.location.pathname

    // Extraer los parámetros de la ruta
    const segments = path.split("/")
    const newClientData = { ...clientData }

    segments.forEach((segment) => {
      if (segment.includes("=")) {
        const [key, value] = segment.split("=")
        if (key && value) {
          newClientData[key] = decodeURIComponent(value)
        }
      }
    })

    // También verificar los parámetros de consulta
    const params = new URLSearchParams(window.location.search)
    if (params.get("nombre")) newClientData.nombre = params.get("nombre")
    if (params.get("usuario")) newClientData.usuario = params.get("usuario")
    if (params.get("contrasenia")) newClientData.contrasenia = params.get("contrasenia")
    if (params.get("evento")) newClientData.evento = params.get("evento")

    setClientData(newClientData)
  }, [])

  // Función para copiar credenciales
  const copyCredentials = () => {
    const text = `Usuario: ${clientData.usuario}\nContraseña: ${clientData.contrasenia}`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Verificar si tenemos al menos el nombre y usuario
  const hasMinimumData = clientData.nombre && clientData.usuario

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Header con logo */}
      <header className="bg-gray-800 p-4 px-8 border-b border-gray-700">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">entradita.com</h1>
          {clientData.nombre && (
            <div className="bg-gray-700 px-3 py-1 rounded-full text-sm">Hola, {clientData.nombre}</div>
          )}
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {hasMinimumData ? (
          <div className="space-y-6">
            {/* Tarjeta de bienvenida con credenciales */}
            <section className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-3">¡Bienvenido a entradita.com!</h2>
              <p className="mb-4">
                Hemos creado una cuenta para ti con tickets de prueba. Usa estas credenciales para ingresar:
              </p>

              <div className="bg-green-700/20 p-4 rounded-lg mb-4 flex flex-col sm:flex-row sm:items-center justify-between">
                <div className="space-y-2 mb-3 sm:mb-0">
                  <div>
                    <span className="text-purple-200 text-sm">Usuario:</span>
                    <span className="font-mono font-bold ml-2">{clientData.usuario}</span>
                  </div>
                  <div>
                    <span className="text-purple-200 text-sm">Contraseña:</span>
                    <span className="font-mono font-bold ml-2">{clientData.contrasenia}</span>
                  </div>
                </div>
                <button
                  onClick={copyCredentials}
                  className="bg-green-800 hover:bg-green-900 text-white px-3 py-2 rounded flex items-center justify-center gap-1 transition-colors"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copiado!" : "Copiar"}
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="https://entradita.com/login"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-green-700 font-bold py-2 px-4 rounded-lg hover:text-green-700 transition-colors text-center"
                >
                  Iniciar sesión
                </a>
                <Link
                  to="/documentacion"
                  className="bg-purple-700 text-white font-bold py-2 px-4 rounded-lg hover:text-white transition-colors flex items-center justify-center gap-1"
                >
                  <BookOpen className="h-4 w-4" />
                  Ver documentación
                </Link>
              </div>
            </section>

            {/* Banner de documentación destacado */}
            <section className="bg-purple-900/30 p-6 rounded-lg shadow-lg border-l-4 border-purple-500">
                <div className="bg-purple-800/50 p-3 rounded-full w-min mb-2">
                  <FileText className="h-6 w-6 text-purple-300" />
                </div>
              <div className="flex items-start gap-4">
                <div>
                  <h2 className="text-xl font-bold mb-2">Consulta nuestra documentación completa</h2>
                  <p className="text-gray-300 mb-3">
                    Hemos preparado una guía detallada con toda la información que necesitas para comenzar a usar
                    Entradita.com. Allí encontrarás instrucciones paso a paso sobre cómo:
                  </p>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-purple-400 mt-1 flex-shrink-0" />
                      <span>Crear y configurar tu primer evento</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-purple-400 mt-1 flex-shrink-0" />
                      <span>Gestionar tickets y categorías</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-purple-400 mt-1 flex-shrink-0" />
                      <span>Configurar vendedores (tarjeteros)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-purple-400 mt-1 flex-shrink-0" />
                      <span>Monitorear ventas y estadísticas</span>
                    </li>
                  </ul>
                  <Link
                    to="/documentacion"
                    className="inline-flex items-center gap-2 bg-purple-700 hover:bg-purple-600 text-white hover:text-white px-5 py-2 rounded-lg transition-colors"
                  >
                    <BookOpen className="h-4 w-4" />
                    Acceder a la documentación
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </section>

            {/* Resumen de características */}
            <section className="bg-gray-800/50 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4">Entradita.com en pocas palabras:</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">
                    Crea <strong>eventos ilimitados</strong> y genera tickets con QR
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">
                    Vende directo o con <strong>tarjeteros</strong> (vendedores)
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">
                    Crea <strong>diferentes categorías</strong> de tickets (VIP, general, etc.)
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">
                    Visualiza <strong>ventas en tiempo real</strong> y por vendedor
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">
                    Usa el <strong>scanner de la app</strong> para validar entradas
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">
                    Los tickets no usados <strong>quedan guardados</strong> para otros eventos
                  </p>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <Link to="/precios" className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1">
                  Ver planes y precios
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </section>

            {/* Ventajas principales */}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gray-800/50 p-4 rounded-lg shadow-lg">
                <div className="text-2xl mb-2">📊</div>
                <h3 className="font-bold mb-1">Control total</h3>
                <p className="text-gray-300 text-sm">
                  Visualiza ventas, ingresos y estadísticas en tiempo real desde cualquier dispositivo.
                </p>
              </div>

              <div className="bg-gray-800/50 p-4 rounded-lg shadow-lg">
                <div className="text-2xl mb-2">⚡</div>
                <h3 className="font-bold mb-1">Rápido y simple</h3>
                <p className="text-gray-300 text-sm">Crea eventos en minutos y empieza a vender inmediatamente.</p>
              </div>

              <div className="bg-gray-800/50 p-4 rounded-lg shadow-lg">
                <div className="text-2xl mb-2">✅</div>
                <h3 className="font-bold mb-1">Seguro</h3>
                <p className="text-gray-300 text-sm">Cada ticket tiene un QR único que evita duplicados y fraudes.</p>
              </div>
            </section>

            {/* Nota informativa */}
            <section className="bg-gray-800/50 p-5 rounded-lg shadow-lg border border-gray-700">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold mb-1">¿Nuevo en Entradita.com?</h3>
                  <p className="text-gray-300 text-sm">
                    Te recomendamos comenzar revisando nuestra documentación completa para familiarizarte con todas las
                    funciones. Si tienes alguna duda específica, no dudes en contactarnos directamente.
                  </p>
                </div>
              </div>
            </section>

            {/* Llamada a la acción */}
            <section className="bg-gray-800/50 p-6 rounded-lg shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold mb-1">¿Necesitas ayuda?</h2>
                <p className="text-sm text-gray-300">
                  Estamos disponibles para resolver tus dudas y ayudarte a configurar tu primer evento
                  {clientData.evento ? ` (${clientData.evento})` : ""}.
                </p>
              </div>

              <div className="flex gap-3">
                <a
                  href="https://wa.me/543482586525"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 hover:bg-green-700 hover:text-white text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <FaWhatsapp className="h-4 w-4" />
                  WhatsApp
                </a>

                <a
                  href="https://entradita.com/precios"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-purple-600 hover:bg-purple-700 text-white hover:text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Tag className="h-4 w-4" />
                  Precios
                </a>
              </div>
            </section>
          </div>
        ) : (
          <div className="bg-gray-800/50 p-6 rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Información no disponible</h2>
            <p>No se encontraron los datos necesarios en la URL.</p>
            <p className="text-sm text-gray-400 mt-2">
              Formato esperado: /new-client/nombre=Nico/usuario=nicomuzzin/contrasenia=nicom123
            </p>
          </div>
        )}
      </main>

      {/* Footer con enlace a documentación */}
      <footer className="bg-gray-900 p-4 mt-6 border-t border-gray-800">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Entradita.com - Todos los derechos reservados
            </p>
            <div className="flex items-center gap-4">
              <Link
                to="/documentacion"
                className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1"
              >
                <BookOpen className="h-4 w-4" />
                Documentación
              </Link>
              <a
                href="https://wa.me/543482586525"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-400 hover:text-green-300 text-sm flex items-center gap-1"
              >
                <HelpCircle className="h-4 w-4" />
                Soporte
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default NewClient
