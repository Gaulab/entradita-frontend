// entraditaFront/src/pages/Dashboard.jsx
// react imports
import { useState, useContext, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

// Context
import AuthContext from '../../context/AuthContext.jsx';
// Components
import { Button } from '../../components/ui/button.jsx';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table.jsx';
import LoadingSpinner from '../../components/ui/loadingspinner.jsx';
// Icons
import { LogOutIcon, PlusIcon, ChevronLeft, ChevronRight } from 'lucide-react';

// API
import { getEvents } from '../../api/eventApi.jsx';
import { getAuthorizationUrl } from '../../api/paymentApi.js';
import { formatDate } from '../../utils/dateUtils.js';

export default function Dashboard() {
  const { logoutUser, authToken } = useContext(AuthContext);

  // Hooks para leer la URL
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Estados de datos
  const [events, setEvents] = useState([]);
  const [ticket_limit, setTicketLimit] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const EVENTS_PER_PAGE = 5;

  // Estados para MP
  const [mpSync, setMpSync] = useState(false);
  const [showMpDialog, setShowMpDialog] = useState(false);
  const [mpDialogType, setMpDialogType] = useState(''); // 'success' | 'error'
  const [mpDialogMessage, setMpDialogMessage] = useState('');

  // 1. Efecto para detectar el retorno de Mercado Pago
  useEffect(() => {
    const status = searchParams.get('mp_status');
    const details = searchParams.get('details');

    if (status) {
      setShowMpDialog(true);

      if (status === 'success') {
        setMpDialogType('success');
        setMpDialogMessage('¡Tu cuenta de Mercado Pago se vinculó correctamente!');
      } else {
        setMpDialogType('error');
        // Limpiamos un poco el mensaje de error si viene en formato JSON string
        setMpDialogMessage(details || 'Hubo un error al intentar conectar con Mercado Pago.');
      }

      // Limpiamos la URL para que si recarga la página no vuelva a procesar la alerta
      navigate('/dashboard', { replace: true });
    }

    setTimeout(() => {
      setShowMpDialog(false);
    }, 4000);
    
  }, [searchParams, navigate]);

  // 2. Efecto para cargar eventos
  useEffect(() => {
    const fetchEvents = async () => {
      const data = await getEvents(authToken.access);
      setEvents(data.events);
      setTicketLimit(data.ticket_limit);
      setMpSync(data.mp_sync);
      setIsLoading(false);
    };

    if (authToken.access) {
      fetchEvents();
    }
  }, [authToken.access, showMpDialog]);

  const handleGetAuthorizationUrl = async () => {
    try {
      const data = await getAuthorizationUrl(authToken.access);
      window.location.href = data.url;
    } catch (error) {
      console.error('Error al obtener la URL de autorización:', error.message);
      alert('No se pudo obtener la URL de autorización. Por favor, intenta nuevamente.');
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const dialogColor = mpDialogType === 'success' ? 'green' : 'red';

  const sortedEvents = [...events].sort((a, b) => new Date(b.date) - new Date(a.date));
  const totalPages = Math.max(1, Math.ceil(sortedEvents.length / EVENTS_PER_PAGE));
  const paginatedEvents = sortedEvents.slice(
    (currentPage - 1) * EVENTS_PER_PAGE,
    currentPage * EVENTS_PER_PAGE
  );

  return (
    <div className="min-h-screen w-screen p-4 bg-gray-900 text-gray-100 ">
      <div className="max-w-6xl mx-auto  w-full">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          <Button onClick={logoutUser} variant="entraditaTertiary" className="w-full sm:w-auto">
            <LogOutIcon className="mr-2 h-4 w-4" /> Cerrar Sesión
          </Button>
        </div>

        {/* --- DIALOGO DE FEEDBACK MERCADO PAGO --- */}
        {showMpDialog && (
          <div className={`mb-6 p-4 rounded-lg ${dialogColor === 'green' ? 'bg-green-600' : 'bg-red-600'} text-black transition-all duration-300`}>
            {mpDialogType === 'success' ? (
              <>
                <p className="text-black font-bold">¡Conexión Exitosa!</p>
                <p className="text-black">{mpDialogMessage}</p>
                <p className="text-black text-sm mt-1">Ya puedes recibir pagos de tus eventos.</p>
              </>
            ) : (
              <>
                <p className="text-black font-bold">Error de Conexión</p>
                <p className="text-black">{mpDialogMessage}</p>
              </>
            )}
          </div>
        )}
        {/* ---------------------------------------- */}

        <Card className="bg-gray-800 border-gray-700 mb-4 p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div className='flex flex-row items-center'>
            <img src='/isotipoWhite.png' alt="Ticket" className="w-10 sm:w-16 mr-2 p-0" />
            <CardTitle className="text-white text-xl sm:text-2xl text-left mr-2">Tickets disponibles </CardTitle>
            <CardContent className="items-center p-0">
              <p className="text-2xl sm:text-3xl text-blue-200 font-bold">{ticket_limit}</p>
            </CardContent>
          </div>
          {!mpSync ? (
            <Button className="w-full sm:w-auto" variant="entraditaPrimary" onClick={() => handleGetAuthorizationUrl()}>
              Vincular Mercado Pago
            </Button>
          ) : (
            <Button className="w-full sm:w-auto pointer-events-none" variant="entraditaSuccess" tabIndex={-1}>
              Mercado Pago Vinculado
            </Button>
          )}
        </Card>

        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Tus eventos</CardTitle>
            <CardDescription className="text-gray-400">Administra tus eventos</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="entraditaPrimary" to="/create-event" className="w-full sm:w-auto">
              <PlusIcon className="mr-1 h-4 w-4" />
              Nuevo evento
            </Button>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700 text-left">
                    <TableHead className="text-gray-300">Nombre</TableHead>
                    <TableHead className="text-gray-300 hidden sm:table-cell">Fecha</TableHead>
                    <TableHead className="text-gray-300 hidden md:table-cell">Ubicación</TableHead>
                    <TableHead className="text-gray-300 hidden md:table-cell">Tickets Vendidos</TableHead>
                    <TableHead className="w-8"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedEvents.map((event) => (
                    <TableRow
                      key={event.id}
                      className="border-gray-700 text-left cursor-pointer hover:bg-gray-700/50 transition-colors"
                      onClick={() => navigate(`/event/${event.id}/details/`)}
                    >
                      <TableCell>
                        <span className="text-white">{event.name}</span>
                        <span className="block sm:hidden text-xs text-gray-400 mt-0.5">{formatDate(event.date)}</span>
                      </TableCell>
                      <TableCell className="text-gray-300 hidden sm:table-cell">{formatDate(event.date)}</TableCell>
                      <TableCell className="text-gray-300 hidden md:table-cell">{event.place}</TableCell>
                      <TableCell className="text-gray-300 hidden md:table-cell">{event.tickets_counter}</TableCell>
                      <TableCell className="text-right">
                        <ChevronRight className="h-4 w-4 text-gray-500" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
                <Button
                  variant="entraditaTertiary"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
                </Button>
                <span className="text-sm text-gray-400">
                  Página {currentPage} de {totalPages}
                </span>
                <Button
                  variant="entraditaTertiary"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                >
                  Siguiente <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}