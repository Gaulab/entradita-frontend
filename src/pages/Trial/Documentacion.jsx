'use client';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDown,
  ArrowLeft,
  LogIn,
  LayoutDashboard,
  Calendar,
  Ticket,
  Users,
  BarChart,
  Settings,
  HelpCircle,
  Copy,
  Trash,
  Edit,
  PauseCircle,
  ExternalLink,
  Share2,
  Tag,
  Clock,
  MapPin,
  UserCheck,
  Lock,
  ImageIcon,
  AlertCircle,
  Scan,
  Store,
  TagIcon,
  Repeat,
  MapPinCheck,
  HelpCircleIcon,
  ImagesIcon,
  AlertCircleIcon,
  TagsIcon,
  LockIcon,
  Monitor,
  DollarSign,
  RotateCcw,
} from 'lucide-react';
import { Button } from '../../components/ui/button';

function Documentacion() {
  const [openSection, setOpenSection] = useState('inicio');

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Header */}
      <header className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img src="/isotipoWhite.png" alt="entradita.com logo" className="h-8 w-auto mr-2 sm:h-12 sm:mr-4" />
            <h1 className="text-xl sm:text-2xl font-bold">entradita.com</h1>
          </div>
          <Link className="text-white hover:text-white flex items-center" to="/">
            <Button variant="entraditaSecondary" className="text-white w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>

        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center gap-2 mb-6">
          <Settings className="h-6 w-6 text-blue-400" />
          <h1 className="text-2xl font-bold">Documentación completa</h1>
        </div>

        {/* Índice de contenidos */}
        <div className="bg-gray-800/50 p-4 rounded-lg mb-8">
          <h2 className="font-bold mb-3">Índice de contenidos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            <button onClick={() => toggleSection('login')} className="text-left flex items-center gap-2 text-blue-300 hover:text-blue-200">
              <LogIn className="h-4 w-4" />
              <span>Inicio de sesión</span>
            </button>
            <button onClick={() => toggleSection('dashboard')} className="text-left flex items-center gap-2 text-blue-300 hover:text-blue-200">
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </button>
            <button onClick={() => toggleSection('crear-evento')} className="text-left flex items-center gap-2 text-blue-300 hover:text-blue-200">
              <Calendar className="h-4 w-4" />
              <span>Crear evento</span>
            </button>
            <button onClick={() => toggleSection('pagina-evento')} className="text-left flex items-center gap-2 text-blue-300 hover:text-blue-200">
              <Settings className="h-4 w-4" />
              <span>Página del evento</span>
            </button>
            <button onClick={() => toggleSection('tickets')} className="text-left flex items-center gap-2 text-blue-300 hover:text-blue-200">
              <Ticket className="h-4 w-4" />
              <span>Tickets</span>
            </button>
            <button onClick={() => toggleSection('vendedores')} className="text-left flex items-center gap-2 text-blue-300 hover:text-blue-200">
              <Users className="h-4 w-4" />
              <span>Vendedores</span>
            </button>
          </div>
        </div>

        {/* Secciones colapsables */}
        <div className="space-y-6">
          {/* Login */}
          <div className="border border-gray-700 rounded-lg overflow-hidden">
            <button className="w-full p-4 flex items-center justify-between bg-gray-800 hover:bg-gray-700 transition-colors" onClick={() => toggleSection('login')}>
              <div className="flex items-center gap-2">
                <LogIn className="h-5 w-5 text-blue-400" />
                <span className="font-bold">Inicio de sesión</span>
              </div>
              <ChevronDown className={`h-5 w-5 transition-transform ${openSection === 'login' ? 'transform rotate-180' : ''}`} />
            </button>

            {openSection === 'login' && (
              <div className="p-6 bg-gray-800/50">
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-3">Acceso a la plataforma</h3>
                  <p className="mb-4">Para comenzar a utilizar Entradita.com, necesitarás las credenciales proporcionadas por el administrador del sistema.</p>

                  <div className="bg-gray-700/50 p-4 rounded-lg mb-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-yellow-400" />
                      Importante
                    </h4>
                    <p className="text-sm text-gray-300">
                      Tus credenciales son personales y no deben ser compartidas. Si necesitas que más personas accedan al sistema, contacta al administrador para crear usuarios adicionales o
                      configura vendedores dentro de tu cuenta.
                    </p>
                  </div>

                  <h4 className="font-semibold mb-2">Pasos para iniciar sesión:</h4>
                  <ol className="list-decimal list-inside space-y-2 ml-2">
                    <li className="text-gray-300">
                      Accede a{' '}
                      <a href="https://entradita.com/login" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:underline">
                        https://entradita.com/login
                      </a>
                    </li>
                    <li className="text-gray-300">Ingresa tu nombre de usuario en el campo correspondiente</li>
                    <li className="text-gray-300">Ingresa tu contraseña</li>
                    <li className="text-gray-300">Haz clic en el botón "Iniciar sesión"</li>
                  </ol>
                </div>

                <div className="bg-blue-900/30 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-blue-400" />
                    ¿Olvidaste tu contraseña?
                  </h4>
                  <p className="text-sm text-gray-300">
                    Si has olvidado tu contraseña, contacta directamente con el administrador del sistema para restablecerla. Por motivos de seguridad, no existe un proceso de recuperación automática.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Dashboard */}
          <div className="border border-gray-700 rounded-lg overflow-hidden">
            <button className="w-full p-4 flex items-center justify-between bg-gray-800 hover:bg-gray-700 transition-colors" onClick={() => toggleSection('dashboard')}>
              <div className="flex items-center gap-2">
                <LayoutDashboard className="h-5 w-5 text-blue-400" />
                <span className="font-bold">Dashboard</span>
              </div>
              <ChevronDown className={`h-5 w-5 transition-transform ${openSection === 'dashboard' ? 'transform rotate-180' : ''}`} />
            </button>

            {openSection === 'dashboard' && (
              <div className="p-6 bg-gray-800/50">
                <h3 className="text-xl font-bold mb-3">Panel principal</h3>
                <p className="mb-4">
                  El dashboard es la pantalla principal que verás al iniciar sesión. Desde aquí podrás acceder a todas las funcionalidades de la plataforma y visualizar información importante sobre
                  tus eventos.
                </p>

                <div className="space-y-6">
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Ticket className="h-4 w-4 text-green-400" />
                      Tickets disponibles
                    </h4>
                    <p className="text-sm text-gray-300 mb-2">
                      En la parte superior izquierda del dashboard podrás ver la cantidad de tickets que tienes disponibles para usar en tus eventos. Estos tickets son otorgados por la administración al
                      realizar la compra de un paquete.
                    </p>
                    <div className="bg-gray-800/70 p-3 rounded text-xs text-gray-400">
                      <strong>Nota:</strong> Cada vez que creas un ticket para cualquiera de tus eventos, se consume un ticket de tu disponibilidad total. Los tickets no utilizados quedan guardados
                      para futuros eventos.
                    </div>
                  </div>

                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Store className="h-4 w-4 text-blue-400" />
                      Vincular Mercado Pago
                    </h4>
                    <p className="text-sm text-gray-300 mb-2">
                      En la parte superior derecha del dashboard podrás ver el botón "Vincular Mercado Pago". Al hacerlo, podrás asociar tu cuenta de Mercado Pago con la plataforma para poder vender tickets de tus eventos a través de ella.
                    </p>
                  </div>

                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-purple-400" />
                      Crear nuevo evento
                    </h4>
                    <p className="text-sm text-gray-300">
                      El botón "Crear nuevo evento" te permitirá iniciar el proceso de configuración de un nuevo evento. Al hacer clic en él, serás redirigido a un formulario donde podrás completar
                      todos los detalles necesarios.
                    </p>
                  </div>

                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Settings className="h-4 w-4 text-orange-400" />
                      Lista de eventos
                    </h4>
                    <p className="text-sm text-gray-300 mb-2">
                      En la parte principal del dashboard encontrarás una lista de todos tus eventos, tanto activos como pasados. Para cada evento podrás ver información básica como:
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-2 text-gray-400 text-sm">
                      <li>Nombre del evento</li>
                      <li>Fecha</li>
                      <li>Cantidad de tickets vendidos</li>
                      <li>Estado (activo/finalizado)</li>
                    </ul>
                    <p className="text-sm text-gray-300 mt-2">
                      Cada evento tiene un botón "Ver" que te llevará a la página de gestión específica de ese evento, donde podrás acceder a todas sus funcionalidades.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Crear Evento */}
          <div className="border border-gray-700 rounded-lg overflow-hidden">
            <button className="w-full p-4 flex items-center justify-between bg-gray-800 hover:bg-gray-700 transition-colors" onClick={() => toggleSection('crear-evento')}>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-400" />
                <span className="font-bold">Crear evento</span>
              </div>
              <ChevronDown className={`h-5 w-5 transition-transform ${openSection === 'crear-evento' ? 'transform rotate-180' : ''}`} />
            </button>

            {openSection === 'crear-evento' && (
              <div className="p-6 bg-gray-800/50">
                <h3 className="text-xl font-bold mb-3">Configuración de un nuevo evento</h3>
                <p className="mb-4">
                  El formulario de creación te permite configurar eventos únicos o repetitivos, definir la seguridad de acceso y estructurar tu esquema de precios con comisiones personalizadas.
                </p>

                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="bg-gray-700/50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Tag className="h-4 w-4 text-blue-400" />
                        Nombre del evento
                      </h4>
                      <p className="text-sm text-gray-300">Elige un nombre distintivo. Este aparecerá en los tickets digitales y en el panel de control.</p>
                    </div>

                    <div className="bg-gray-700/50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Repeat className="h-4 w-4 text-blue-400" />
                        Periodicidad y Fechas
                      </h4>
                      <p className="text-sm text-gray-300">
                        Puedes crear un evento de fecha única o activarlo como <strong>periódico</strong>. Si es periódico, deberás seleccionar una fecha de inicio, los días de la semana en que se
                        repite (ej: Sábados) y opcionalmente una fecha de fin.
                      </p>
                    </div>

                    <div className="bg-gray-700/50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-blue-400" />
                        Lugar del evento
                      </h4>
                      <p className="text-sm text-gray-300">Indica la ubicación física donde se llevará a cabo el evento para informar a los asistentes.</p>
                    </div>

                    <div className="bg-gray-700/50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-400" />
                        Capacidad
                      </h4>
                      <p className="text-sm text-gray-300">
                        Define el límite máximo de tickets a vender. En el caso de eventos periódicos, esta capacidad se aplica <strong>por cada fecha</strong> individualmente.
                      </p>
                    </div>

                    <div className="bg-gray-700/50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <HelpCircle className="h-4 w-4 text-blue-400" />
                        Contacto
                      </h4>
                      <p className="text-sm text-gray-300">Número de teléfono para soporte o comunicación directa con la administración.</p>
                    </div>

                    <div className="bg-gray-700/50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <ImageIcon className="h-4 w-4 text-blue-400" />
                        Logo del evento
                      </h4>
                      <p className="text-sm text-gray-300">URL de la imagen representativa del evento. Se mostrará en la cabecera de los tickets generados.</p>
                    </div>

                    <div className="bg-gray-700/50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <LockIcon className="h-4 w-4 text-blue-400" />
                        Contraseña para empleados
                      </h4>
                      <p className="text-sm text-gray-300">Clave única que utilizarán tus vendedores y el personal de escaneo (puerta) para acceder a sus funciones en la app.</p>
                    </div>

                    <div className="bg-gray-700/50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <UserCheck className="h-4 w-4 text-blue-400" />
                        Solicitar DNI
                      </h4>
                      <p className="text-sm text-gray-300">
                        Al activar esta opción, será obligatorio ingresar el documento de identidad de cada asistente al momento de emitir el ticket, aumentando la seguridad.
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <TagIcon className="h-4 w-4 text-blue-400" />
                      Categorías de tickets (Ticket tags)
                    </h4>
                    <p className="text-sm text-gray-300 mb-2">Configura los tipos de entrada (ej: General, VIP). Para cada categoría debes definir:</p>
                    <ul className="list-disc list-inside text-sm text-gray-300 ml-2">
                      <li>
                        <strong>Nombre y Precio:</strong> Valor base de la entrada.
                      </li>
                      <li>
                        <strong>Comisión:</strong> El monto que recibe el vendedor por cada ticket vendido de este tipo.
                      </li>
                      <li>
                        <strong>Venta Web:</strong> Un interruptor para habilitar o deshabilitar la venta online de esa categoría específica.
                      </li>
                    </ul>
                  </div>

                  <div className="bg-blue-900/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <AlertCircleIcon className="h-4 w-4 text-blue-400" />
                      Recomendaciones
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                      <li>Verifica si tu evento requiere repetición semanal para configurar correctamente la periodicidad.</li>
                      <li>Utiliza la opción de "Venta Web" en los Ticket Tags para controlar qué entradas están disponibles al público general y cuáles son exclusivas de venta por WhatsApp.</li>
                      <li>Si configuras una fecha de fin en eventos periódicos, el sistema dejará de generar fechas automáticamente después de ese día.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Página del Evento */}
          <div className="border border-gray-700 rounded-lg overflow-hidden">
            <button className="w-full p-4 flex items-center justify-between bg-gray-800 hover:bg-gray-700 transition-colors" onClick={() => toggleSection('pagina-evento')}>
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-blue-400" />
                <span className="font-bold">Página del evento</span>
              </div>
              <ChevronDown className={`h-5 w-5 transition-transform ${openSection === 'pagina-evento' ? 'transform rotate-180' : ''}`} />
            </button>

            {openSection === 'pagina-evento' && (
              <div className="p-6 bg-gray-800/50">
                <h3 className="text-xl font-bold mb-3">Gestión del evento</h3>
                <p className="mb-4">
                  Una vez creado el evento, accederás a su página de gestión donde podrás controlar todos los aspectos relacionados con él. Esta página está dividida en varias secciones a las que
                  puedes acceder mediante los botones de navegación.
                </p>

                <div className="space-y-6">
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Información general</h4>
                    <p className="text-sm text-gray-300 mb-2">En la parte superior de la página encontrarás la información general del evento:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2 text-gray-400 text-sm">
                      <li>Nombre del evento con imagen representativa</li>
                      <li>Fecha del evento</li>
                      <li>Lugar donde se realizará</li>
                      <li>Capacidad total (o "Ilimitada" si no hay límite)</li>
                      <li>Cantidad de tickets vendidos</li>
                    </ul>
                  </div>

                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Monitor className="h-4 w-4 text-indigo-400" />
                      Página WEB
                    </h4>
                    <p className="text-sm text-gray-300">
                      El botón "Página WEB" te permite acceder a la página pública del evento donde los usuarios pueden ver la información y comprar tickets online. Esta es la página que compartirás con tu público.
                    </p>
                  </div>

                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-400" />
                      Economía
                    </h4>
                    <p className="text-sm text-gray-300 mb-2">El botón "Economía" te lleva a una sección detallada con datos financieros del evento, donde encontrarás información sobre:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2 text-gray-400 text-sm">
                      <li>Ventas totales por categoría</li>
                      <li>Comisiones a tarjeteros</li>
                      <li>Ingresos netos</li>
                      <li>Estadísticas de venta por día/semana</li>
                    </ul>
                  </div>

                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <RotateCcw className="h-4 w-4 text-red-400" />
                      Reiniciar Evento (Solo eventos periódicos)
                    </h4>
                    <p className="text-sm text-gray-300">
                      Si tu evento está configurado como periódico (por ejemplo, una fiesta semanal), verás el botón "Reiniciar Evento". Esta función te permite resetear las estadísticas del evento para la próxima fecha disponible, manteniendo la configuración base.
                    </p>
                  </div>

                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Settings className="h-4 w-4 text-blue-400" />
                      Control de venta web
                    </h4>
                    <p className="text-sm text-gray-300">
                      Encontrarás un interruptor para "Habilitar venta web del evento". Con este control puedes activar o desactivar la posibilidad de que el público compre tickets a través de la página web del evento. Cuando está desactivado, solo se pueden vender tickets de forma manual.
                    </p>
                  </div>

                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Users className="h-4 w-4 text-purple-400" />
                      Control de asistencia en tiempo real
                    </h4>
                    <p className="text-sm text-gray-300 mb-2">
                      En la página principal del evento verás una barra de progreso que muestra el porcentaje de personas que han ingresado al evento. Esta información incluye:
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-2 text-gray-400 text-sm">
                      <li>Porcentaje de asistencia (calculado sobre tickets vendidos)</li>
                      <li>Cantidad exacta de personas que ingresaron (tickets escaneados)</li>
                      <li>Visualización gráfica con barra de progreso colorida</li>
                    </ul>
                    <p className="text-sm text-gray-300 mt-2">
                      Este dato se actualiza automáticamente cada vez que se escanea un ticket en la entrada del evento.
                    </p>
                  </div>

                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Settings className="h-4 w-4 text-orange-400" />
                      Navegación entre secciones
                    </h4>
                    <p className="text-sm text-gray-300 mb-3">Además de estos controles principales, en otras partes de la interfaz encontrarás botones de navegación para acceder a:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                      <div className="bg-gray-800/70 p-3 rounded text-center">
                        <Ticket className="h-4 w-4 mx-auto mb-1 text-blue-400" />
                        <span className="text-xs">Tickets</span>
                        <p className="text-xs text-gray-400 mt-1">Ver todos los tickets del evento</p>
                      </div>
                      <div className="bg-gray-800/70 p-3 rounded text-center">
                        <Users className="h-4 w-4 mx-auto mb-1 text-blue-400" />
                        <span className="text-xs">Vendedores</span>
                        <p className="text-xs text-gray-400 mt-1">Gestionar tarjeteros</p>
                      </div>
                      <div className="bg-gray-800/70 p-3 rounded text-center">
                        <Scan className="h-4 w-4 mx-auto mb-1 text-blue-400" />
                        <span className="text-xs">Scanners</span>
                        <p className="text-xs text-gray-400 mt-1">Configurar control de acceso</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-900/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-blue-400" />
                      Recomendaciones
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                      <li>Activa la venta web solo cuando estés seguro de que toda la información del evento es correcta.</li>
                      <li>Monitorea regularmente la barra de progreso de asistencia durante el evento para controlar el ingreso de personas.</li>
                      <li>Si tienes un evento periódico, usa la función "Reiniciar Evento" después de cada fecha para comenzar con estadísticas limpias.</li>
                      <li>Comparte el enlace de la Página WEB en tus redes sociales para facilitar la venta de tickets.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tickets */}
          <div className="border border-gray-700 rounded-lg overflow-hidden">
            <button className="w-full p-4 flex items-center justify-between bg-gray-800 hover:bg-gray-700 transition-colors" onClick={() => toggleSection('tickets')}>
              <div className="flex items-center gap-2">
                <Ticket className="h-5 w-5 text-blue-400" />
                <span className="font-bold">Tickets</span>
              </div>
              <ChevronDown className={`h-5 w-5 transition-transform ${openSection === 'tickets' ? 'transform rotate-180' : ''}`} />
            </button>

            {openSection === 'tickets' && (
              <div className="p-6 bg-gray-800/50">
                <h3 className="text-xl font-bold mb-3">Gestión de tickets</h3>
                <p className="mb-4">Los tickets son el elemento central de Entradita.com. Cada ticket tiene un código QR único que permite el acceso al evento y evita duplicados o falsificaciones.</p>

                <div className="space-y-6">
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Información del ticket</h4>
                    <p className="text-sm text-gray-300 mb-2">Al seleccionar un ticket, podrás ver su información detallada:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2 text-gray-400 text-sm">
                      <li>Categoría del ticket</li>
                      <li>Nombre del comprador</li>
                      <li>DNI (si se solicitó)</li>
                      <li>Fecha de creación</li>
                      <li>Vendedor que lo generó</li>
                      <li>Estado (usado/no usado)</li>
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-700/50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Copy className="h-4 w-4 text-blue-400" />
                        Copiar link del ticket
                      </h4>
                      <p className="text-sm text-gray-300">
                        Este botón te permite copiar solamente el enlace del ticket, que podrás compartir con el comprador. Al acceder a este enlace, el comprador podrá ver y descargar su ticket con
                        el código QR.
                      </p>
                    </div>

                    <div className="bg-gray-700/50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Share2 className="h-4 w-4 text-green-400" />
                        Copiar mensaje completo
                      </h4>
                      <p className="text-sm text-gray-300">
                        Este botón, además de copiar el link del ticket, copia un mensaje agradable para compartir con el cliente. Es la opción más recomendada para enviar el ticket por WhatsApp u
                        otro medio de comunicación.
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Trash className="h-4 w-4 text-red-400" />
                      Borrar ticket
                    </h4>
                    <p className="text-sm text-gray-300">
                      Si es necesario, puedes eliminar un ticket. Ten en cuenta que esta acción es irreversible y el ticket ya no podrá ser utilizado para ingresar al evento.
                    </p>
                  </div>

                  <div className="bg-blue-900/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-blue-400" />
                      Consideraciones importantes
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                      <li>Cada ticket consume una unidad de tu disponibilidad total de tickets adquiridos en tu paquete.</li>
                      <li>Los tickets no pueden ser duplicados. Cada código QR es único y solo permite un ingreso al evento.</li>
                      <li>Si un ticket ya fue utilizado (escaneado en la entrada), aparecerá marcado como "usado" y no podrá ser utilizado nuevamente.</li>
                      <li>Es recomendable mantener un registro de a quién le has enviado cada ticket, especialmente si manejas grandes volúmenes.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Vendedores */}
          <div className="border border-gray-700 rounded-lg overflow-hidden">
            <button className="w-full p-4 flex items-center justify-between bg-gray-800 hover:bg-gray-700 transition-colors" onClick={() => toggleSection('vendedores')}>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-400" />
                <span className="font-bold">Vendedores</span>
              </div>
              <ChevronDown className={`h-5 w-5 transition-transform ${openSection === 'vendedores' ? 'transform rotate-180' : ''}`} />
            </button>

            {openSection === 'vendedores' && (
              <div className="p-6 bg-gray-800/50">
                <h3 className="text-xl font-bold mb-3">Gestión de vendedores (tarjeteros)</h3>
                <p className="mb-4">
                  Los vendedores o tarjeteros son personas que pueden vender tickets para tu evento. Cada vendedor tiene su propio portal de ventas y puede generar tickets de las categorías que tú le
                  asignes.
                </p>

                <div className="space-y-6">
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Crear un nuevo vendedor</h4>
                    <p className="text-sm text-gray-300 mb-2">Al crear un nuevo vendedor, deberás completar la siguiente información:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2 text-gray-400 text-sm mb-3">
                      <li>
                        <strong>Categorías de venta:</strong> Selecciona qué categorías de tickets podrá vender este vendedor. Puedes seleccionar varias categorías.
                      </li>
                      <li>
                        <strong>Nombre del vendedor:</strong> Asigna un nombre identificativo. El vendedor podrá ver qué nombre le has asignado.
                      </li>
                      <li>
                        <strong>Capacidad de venta:</strong> Establece cuántos tickets puede vender este vendedor. Este valor puede ser modificado posteriormente.
                      </li>
                    </ul>
                    <p className="text-sm text-gray-300">
                      Una vez creado el vendedor, deberás proporcionarle el enlace a su portal de ventas y la contraseña que estableciste para los empleados al crear el evento.
                    </p>
                  </div>

                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Gestión de un vendedor existente</h4>
                    <p className="text-sm text-gray-300 mb-3">Al hacer clic sobre un vendedor en la lista, accederás a su información detallada y podrás realizar varias acciones:</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-gray-800/70 p-3 rounded">
                        <h5 className="text-sm font-medium mb-1 flex items-center gap-1">
                          <Copy className="h-3 w-3 text-blue-400" />
                          Copiar link del portal
                        </h5>
                        <p className="text-xs text-gray-400">Copia el enlace del portal de ventas del vendedor, que podrás compartir con él.</p>
                      </div>

                      <div className="bg-gray-800/70 p-3 rounded">
                        <h5 className="text-sm font-medium mb-1 flex items-center gap-1">
                          <ExternalLink className="h-3 w-3 text-green-400" />
                          Ir al portal del vendedor
                        </h5>
                        <p className="text-xs text-gray-400">Te redirige al mismo portal de ventas, donde podrás ver exactamente lo que ve el vendedor.</p>
                      </div>

                      <div className="bg-gray-800/70 p-3 rounded">
                        <h5 className="text-sm font-medium mb-1 flex items-center gap-1">
                          <Share2 className="h-3 w-3 text-blue-400" />
                          Copiar mensaje para el vendedor
                        </h5>
                        <p className="text-xs text-gray-400">
                          Copia el enlace junto con un mensaje amigable para invitar al vendedor a vender tickets para tu evento. Recuerda que debes proporcionarle la contraseña por separado.
                        </p>
                      </div>

                      <div className="bg-gray-800/70 p-3 rounded">
                        <h5 className="text-sm font-medium mb-1 flex items-center gap-1">
                          <Edit className="h-3 w-3 text-yellow-400" />
                          Editar datos del vendedor
                        </h5>
                        <p className="text-xs text-gray-400">Permite modificar la información del vendedor, como su nombre, categorías asignadas o capacidad de venta.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-800/70 p-3 rounded">
                        <h5 className="text-sm font-medium mb-1 flex items-center gap-1">
                          <PauseCircle className="h-3 w-3 text-orange-400" />
                          Pausar vendedor
                        </h5>
                        <p className="text-xs text-gray-400">Permite pausar temporalmente la capacidad del vendedor para generar tickets. Puedes reanudar su actividad en cualquier momento.</p>
                      </div>

                      <div className="bg-gray-800/70 p-3 rounded">
                        <h5 className="text-sm font-medium mb-1 flex items-center gap-1">
                          <Trash className="h-3 w-3 text-red-400" />
                          Borrar vendedor
                        </h5>
                        <p className="text-xs text-gray-400">
                          Elimina al vendedor del sistema. ¡Atención! Esta acción también eliminará todos los tickets que haya creado y que aún no hayan sido utilizados.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-900/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-blue-400" />
                      Recomendaciones para gestionar vendedores
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                      <li>Asigna nombres claros a tus vendedores para poder identificarlos fácilmente en los reportes.</li>
                      <li>Establece límites de venta razonables para cada vendedor según su capacidad y confianza.</li>
                      <li>Monitorea regularmente las ventas de cada vendedor para detectar patrones inusuales o problemas.</li>
                      <li>Comunica claramente a los vendedores qué categorías pueden vender y a qué precios.</li>
                      <li>Recuerda que los vendedores necesitarán la contraseña de empleados que estableciste al crear el evento.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Botón de contacto */}
        <div className="mt-8 bg-gray-900 p-6 rounded-lg text-center">
          <h3 className="text-xl font-bold mb-3">¿Necesitas más ayuda?</h3>
          <p className="mb-4">Si tienes dudas adicionales o necesitas asistencia personalizada, no dudes en contactarnos. Estamos aquí para ayudarte a sacar el máximo provecho de Entradita.com.</p>
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
  );
}

export default Documentacion;
