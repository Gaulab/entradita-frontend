'use client';

import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ChevronRight, BookOpen, Tag, Copy, Check, HelpCircle, ArrowRight, FileText, Info, LogIn, DollarSign } from 'lucide-react';
import { FaMoneyBill, FaWhatsapp } from 'react-icons/fa';
import Login from '../Login';
import { Button } from '../../components/ui/button';

function NewClient() {
  // Estado para los datos del cliente
  const [clientData, setClientData] = useState({
    nombre: '',
    usuario: '',
    contrasenia: '',
    evento: '',
  });

  // Estado para el botón de copiado
  const [copied, setCopied] = useState(false);

  // Efecto para extraer los parámetros de la URL
  useEffect(() => {
    // Obtener la ruta completa
    const path = window.location.pathname;

    // Extraer los parámetros de la ruta
    const segments = path.split('/');
    const newClientData = { ...clientData };

    segments.forEach((segment) => {
      if (segment.includes('=')) {
        const [key, value] = segment.split('=');
        if (key && value) {
          newClientData[key] = decodeURIComponent(value);
        }
      }
    });

    // También verificar los parámetros de consulta
    const params = new URLSearchParams(window.location.search);
    if (params.get('nombre')) newClientData.nombre = params.get('nombre');
    if (params.get('usuario')) newClientData.usuario = params.get('usuario');
    if (params.get('contrasenia')) newClientData.contrasenia = params.get('contrasenia');
    if (params.get('evento')) newClientData.evento = params.get('evento');

    setClientData(newClientData);
  }, []);

  // Función para copiar credenciales
  const copyCredentials = () => {
    const text = `Usuario: ${clientData.usuario}\nContraseña: ${clientData.contrasenia}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Verificar si tenemos al menos el nombre y usuario
  const hasMinimumData = clientData.nombre && clientData.usuario;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">

      {/* Header */}
      <header className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img src="/isotipoWhite.png" alt="entradita.com logo" className="h-8 w-auto mr-2 sm:h-12 sm:mr-4" />
            <h1 className="text-xl sm:text-2xl font-bold">entradita.com</h1>
          </div>
          {clientData.nombre && <div className="bg-gray-700 px-3 py-1 rounded-full text-sm">{clientData.nombre}</div>}
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {hasMinimumData ? (
          <div className="space-y-6">
            {/* Tarjeta de bienvenida con credenciales */}
            <section className="bg-gray-800/30 p-6 rounded-lg shadow-lg border-l-4 border-green-500">
              <h2 className="text-2xl font-bold mb-3">¡Bienvenido {clientData.nombre} a entradita.com!</h2>
              <p className="mb-4">Hemos creado una cuenta para ti con tickets de prueba. Usa estas credenciales para ingresar:</p>

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
                <button onClick={copyCredentials} className="bg-green-800 hover:bg-green-900 text-white px-3 py-2 rounded flex items-center justify-center gap-1 transition-colors">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Copiado!' : 'Copiar'}
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" variant="entraditaSecondary" className="text-white">
                  <Link className="flex items-center hover:text-white text-white" to="/login">
                    <LogIn className="mr-2 h-4 w-4" />
                    Iniciar sesión
                  </Link>
                </Button>
              </div>
            </section>

            {/* Banner de documentación destacado */}
            <section className="bg-gray-800/30 p-6 rounded-lg shadow-lg border-l-4 border-purple-500">
              <div className="bg-purple-800/50 p-3 rounded-full w-min mb-2">
                <FileText className="h-6 w-6 text-purple-300" />
              </div>
              <div className="flex items-start gap-4">
                <div>
                  <h2 className="text-xl font-bold mb-2">Consulta nuestra documentación completa</h2>
                  <p className="text-gray-300 mb-3">
                    Hemos preparado una guía detallada con toda la información que necesitas para comenzar a usar entradita. Allí encontrarás instrucciones paso a paso sobre cómo:
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

                  <Button size="lg" variant="entraditaSecondary" className="text-white">
                    <Link className="flex items-center hover:text-white text-white" to="/documentacion">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Documentación
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </section>

            {/* Resumen de características */}
            <section className="bg-gray-800/30 p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
              <h2 className="text-xl font-bold mb-4">Entradita.com en pocas palabras:</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">
                    Crea <strong>eventos ilimitados</strong> y genera tickets con QR
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">
                    Vende directo o con <strong>tarjeteros</strong> (vendedores)
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">
                    Crea <strong>diferentes categorías</strong> de tickets (VIP, general, etc.)
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">
                    Visualiza <strong>ventas en tiempo real</strong> y por vendedor
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">
                    Usa el <strong>scanner de la app</strong> para validar entradas
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">
                    Los tickets no usados <strong>quedan guardados</strong> para otros eventos
                  </p>
                </div>
              </div>

              <div className="mt-4 flex justify-start">
                <Button size="lg" variant="entraditaSecondary" className="text-white">
                  <Link className="flex items-center hover:text-white text-white" to="/pricing">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Ver planes y precios
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </section>

            {/* Ventajas principales */}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gray-800/50 p-4 rounded-lg shadow-lg">
                <div className="text-2xl mb-2">📊</div>
                <h3 className="font-bold mb-1">Control total</h3>
                <p className="text-gray-300 text-sm">Visualiza ventas, ingresos y estadísticas en tiempo real desde cualquier dispositivo.</p>
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
                    Te recomendamos comenzar revisando nuestra documentación completa para familiarizarte con todas las funciones. Si tienes alguna duda específica, no dudes en contactarnos
                    directamente.
                  </p>
                </div>
              </div>
            </section>

            {/* Llamada a la acción */}
            <section className="bg-gray-900/50 p-6 rounded-lg shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
              <h3 className="text-xl font-bold mb-3">¿Necesitas más ayuda?</h3>
              <p className="mb-4">
                Si tienes dudas adicionales o necesitas asistencia personalizada, no dudes en contactarnos. Estamos aquí para ayudarte a sacar el máximo provecho de Entradita.com.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://wa.me/543482586525"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-gray-800 text-green-600 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 hover:text-green-700 transition-colors"
                >
                  Contactar por WhatsApp
                </a>
              </div>
            </section>
          </div>
        ) : (
          <div className="bg-gray-800/50 p-6 rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Información no disponible</h2>
            <p>No se encontraron los datos necesarios en la URL.</p>
            <p className="text-sm text-gray-400 mt-2">Formato esperado: /new-client/nombre=Nico/usuario=nicomuzzin/contrasenia=nicom123</p>
          </div>
        )}
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
  );
}

export default NewClient;
