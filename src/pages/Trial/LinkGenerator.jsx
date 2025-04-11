"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Copy, Check, Link2, ExternalLink, RefreshCw } from "lucide-react"
import { Switch } from "@/components/ui/switch"

export default function LinkGenerator() {
  const [formData, setFormData] = useState({
    nombre: "",
    usuario: "",
    contrasenia: "",
    evento: "",
  })

  const [generatedLink, setGeneratedLink] = useState("")
  const [copied, setCopied] = useState(false)
  const [includeBaseUrl, setIncludeBaseUrl] = useState(true)
  const [baseUrl, setBaseUrl] = useState("entradita.com")

  // Generar el enlace cuando cambian los datos del formulario
  useEffect(() => {
    generateLink()
  }, [formData, includeBaseUrl, baseUrl])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const generateLink = () => {
    // Crear la ruta con los parámetros
    let path = "/new-client"

    // Añadir parámetros si tienen valor
    if (formData.nombre) path += `/nombre=${encodeURIComponent(formData.nombre)}`
    if (formData.usuario) path += `/usuario=${encodeURIComponent(formData.usuario)}`
    if (formData.contrasenia) path += `/contrasenia=${encodeURIComponent(formData.contrasenia)}`
    if (formData.evento) path += `/evento=${encodeURIComponent(formData.evento)}`

    // Generar el enlace completo
    const fullLink = includeBaseUrl ? `${baseUrl}${path}` : path

    setGeneratedLink(fullLink)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const resetForm = () => {
    setFormData({
      nombre: "",
      usuario: "",
      contrasenia: "",
      evento: "",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img src="/isotipoWhite.png" alt="entradita.com logo" className="h-8 w-auto mr-2 sm:h-12 sm:mr-4" />
            <h1 className="text-xl sm:text-2xl font-bold">entradita.com</h1>
          </div>
          <Button variant="entraditaSecondary" className="text-white">
            <Link className="flex items-center hover:text-white text-white" to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al inicio
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8">Generador de Enlaces</h1>
          <p className="text-lg text-gray-300 text-center mb-10 max-w-2xl mx-auto">
            Crea enlaces personalizados para compartir con tus clientes. Estos enlaces dirigirán a una página de
            bienvenida con la información que proporciones.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Formulario */}
            <Card className="bg-gray-800 border-gray-700 lg:col-span-3">
              <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center">
                  <Link2 className="h-5 w-5 mr-2 text-blue-400" />
                  Datos del cliente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre del cliente *</Label>
                    <Input
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      placeholder="Ej: Nicolás"
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="usuario">Usuario *</Label>
                    <Input
                      id="usuario"
                      name="usuario"
                      value={formData.usuario}
                      onChange={handleChange}
                      placeholder="Ej: nicomuzzin"
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contrasenia">Contraseña *</Label>
                    <Input
                      id="contrasenia"
                      name="contrasenia"
                      value={formData.contrasenia}
                      onChange={handleChange}
                      placeholder="Ej: nicom123"
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="evento">Evento (opcional)</Label>
                    <Input
                      id="evento"
                      name="evento"
                      value={formData.evento}
                      onChange={handleChange}
                      placeholder="Ej: Fiesta 13 abril"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch id="includeBaseUrl" checked={includeBaseUrl} onCheckedChange={setIncludeBaseUrl} />
                      <Label htmlFor="includeBaseUrl">Incluir URL base</Label>
                    </div>
                    <Button variant="outline" size="sm" onClick={resetForm} className="text-gray-300 border-gray-600">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Limpiar
                    </Button>
                  </div>

                  {includeBaseUrl && (
                    <div className="mt-3">
                      <Label htmlFor="baseUrl">URL base</Label>
                      <Input
                        id="baseUrl"
                        value={baseUrl}
                        onChange={(e) => setBaseUrl(e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white mt-1"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="text-sm text-gray-400 border-t border-gray-700 mt-4 pt-4">
                * Campos obligatorios para generar el enlace
              </CardFooter>
            </Card>

            {/* Enlace generado */}
            <Card className="bg-gray-800 border-gray-700 lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center">
                  <ExternalLink className="h-5 w-5 mr-2 text-green-400" />
                  Enlace generado
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-900 p-4 rounded-lg break-all">
                  <p className="font-mono text-sm text-blue-400 overflow-x-auto">
                    {generatedLink || "El enlace se generará automáticamente"}
                  </p>
                </div>

                <div className="flex flex-col space-y-3">
                  <Button
                    onClick={copyToClipboard}
                    className="bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300"
                    disabled={!generatedLink}
                  >
                    {copied ? (
                      <span className="flex items-center">
                        <Check className="mr-2 h-5 w-5" />
                        ¡Copiado!
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Copy className="mr-2 h-5 w-5" />
                        Copiar enlace
                      </span>
                    )}
                  </Button>

                  <Button variant="outline" className="border-gray-600 text-gray-300" disabled={!generatedLink}>
                    <a
                      href={generatedLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-full"
                    >
                      <ExternalLink className="mr-2 h-5 w-5" />
                      Abrir enlace
                    </a>
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="text-sm text-gray-400 border-t border-gray-700 mt-4 pt-4 flex flex-col items-start">
                <p className="mb-2">Este enlace dirigirá a una página personalizada con:</p>
                <ul className="list-disc list-inside text-xs space-y-1 text-gray-400">
                  <li>Mensaje de bienvenida personalizado</li>
                  <li>Credenciales de acceso</li>
                  <li>Información sobre entradita.com</li>
                  <li>Enlaces a documentación y soporte</li>
                </ul>
              </CardFooter>
            </Card>
          </div>


        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            
            <div className="flex items-center mb-2 md:mb-0">
              <img src="/isotipoWhite.png" alt="entradita.com logo" className="h-8 w-auto mr-2 hidden sm:block" />
              <div>
                <h3 className="font-bold text-center sm:text-left">entradita.com</h3>
                <p className="text-xs text-gray-400 ">Transformando la gestión de eventos</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-6">
              <Link to="/documentacion" className="text-gray-300 hover:text-white text-sm">
                Documentación
              </Link>
              <Link to="/contact" className="text-gray-300 hover:text-white text-sm">
                Contacto
              </Link>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-6 pt-6 text-center text-gray-400">
            <p className="text-sm">© 2025 entradita.com todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
