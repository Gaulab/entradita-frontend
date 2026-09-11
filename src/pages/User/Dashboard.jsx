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
import { LogOutIcon, PlusIcon, ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';

// API
import { getEvents } from '../../api/eventApi.jsx';
import { getAuthorizationUrl } from '../../api/paymentApi.js';
import { formatDate } from '../../utils/dateUtils.js';
import { notifyError, notifySuccess } from '../../utils/notify.js';

export default function Dashboard() {
  const { logoutUser, authToken, user } = useContext(AuthContext);

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
  const [mpRefreshKey, setMpRefreshKey] = useState(0);

  // 1. Efecto para detectar el retorno de Mercado Pago
  useEffect(() => {
    const status = searchParams.get('mp_status');
    const details = searchParams.get('details');

    if (status) {
      if (status === 'success') {
        notifySuccess('¡Tu cuenta de Mercado Pago se vinculó correctamente!');
      } else {
        notifyError(details || 'Hubo un error al intentar conectar con Mercado Pago.');
      }
      setMpRefreshKey((k) => k + 1);
      navigate('/dashboard', { replace: true });
    }
  }, [searchParams, navigate]);

  // 2. Efecto para cargar eventos
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents(authToken.access);
        setEvents(data.events);
        setTicketLimit(data.ticket_limit);
        setMpSync(data.mp_sync);
      } catch (err) {
        notifyError(err.message || 'No se pudieron cargar los eventos.');
      } finally {
        setIsLoading(false);
      }
    };

    if (authToken.access) {
      fetchEvents();
    }
  }, [authToken.access, mpRefreshKey]);

  const handleGetAuthorizationUrl = async () => {
    try {
      const data = await getAuthorizationUrl(authToken.access);
      window.location.href = data.url;
    } catch (error) {
      console.error('Error al obtener la URL de autorización:', error.message);
      notifyError('No se pudo obtener la URL de autorización. Por favor, intenta nuevamente.');
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }


  const sortedEvents = [...events].sort((a, b) => new Date(b.date) - new Date(a.date));
  const totalPages = Math.max(1, Math.ceil(sortedEvents.length / EVENTS_PER_PAGE));
  const paginatedEvents = sortedEvents.slice(
    (currentPage - 1) * EVENTS_PER_PAGE,
    currentPage * EVENTS_PER_PAGE
  );

  return (
    <div className="min-h-screen w-screen p-4 bg-background text-gray-100 ">
      <div className="max-w-6xl mx-auto  w-full">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          <Button onClick={logoutUser} variant="entraditaTertiary" className="w-full sm:w-auto">
            <LogOutIcon className="mr-2 h-4 w-4" /> Cerrar Sesión
          </Button>
          {user?.is_staff && (
            <Button onClick={() => navigate('/admin')} variant="entraditaTertiary" className="w-full sm:w-auto">
              Panel de administración →
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {/* Bloque: Tickets disponibles */}
          <Card className="bg-card border-border px-4 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 rounded-lg p-2 shrink-0">
                <img src='/isotipoWhite.png' alt="Ticket" className="w-6 h-6 object-contain" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium leading-none mb-0.5">Tickets disponibles</p>
                <p className="text-2xl font-bold text-primary leading-tight">{ticket_limit}</p>
              </div>
            </div>
            <Button className="shrink-0" variant="entraditaPrimary" onClick={() => navigate('/buy-tickets')}>
              <ShoppingCart className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Comprar</span>
            </Button>
          </Card>

          {/* Bloque: Mercado Pago */}
          <Card className={`border px-4 py-3 flex items-center justify-between gap-3 ${mpSync ? 'bg-emerald-950/40 border-emerald-700/50' : 'bg-card border-border'}`}>
            <div className="flex items-center gap-3">
              <div className={`rounded-lg p-2 shrink-0 ${mpSync ? 'bg-emerald-500/10' : 'bg-secondary/60'}`}>
                <img src="/mercadopago.png" alt="Mercado Pago" className="h-6 w-auto object-contain" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium leading-none mb-0.5">Mercado Pago</p>
                <div className="flex items-center gap-1.5">
                  <span className={`inline-block w-2 h-2 rounded-full shrink-0 ${mpSync ? 'bg-emerald-400' : 'bg-secondary'}`} />
                  <p className={`text-sm font-semibold ${mpSync ? 'text-emerald-400' : 'text-muted-foreground'}`}>
                    {mpSync ? 'Vinculado' : 'Sin vincular'}
                  </p>
                </div>
              </div>
            </div>
            {!mpSync ? (
              <Button className="shrink-0" variant="entraditaPrimary" onClick={() => handleGetAuthorizationUrl()}>
                Vincular
              </Button>
            ) : (
              <Button className="shrink-0 pointer-events-none" variant="entraditaSuccess" tabIndex={-1}>
                Activo
              </Button>
            )}
          </Card>
        </div>

        <Card className="bg-card border-border mb-8">
          <CardHeader>
            <CardTitle className="text-white">Tus eventos</CardTitle>
            <CardDescription className="text-muted-foreground">Administra tus eventos</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="entraditaPrimary" to="/create-event" className="w-full sm:w-auto">
              <PlusIcon className="mr-1 h-4 w-4" />
              Nuevo evento
            </Button>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border text-left">
                    <TableHead className="text-muted-foreground">Nombre</TableHead>
                    <TableHead className="text-muted-foreground hidden sm:table-cell">Fecha</TableHead>
                    <TableHead className="text-muted-foreground hidden md:table-cell">Ubicación</TableHead>
                    <TableHead className="text-muted-foreground hidden md:table-cell">Tickets Vendidos</TableHead>
                    <TableHead className="w-8"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedEvents.map((event) => (
                    <TableRow
                      key={event.id}
                      className="border-border text-left cursor-pointer hover:bg-secondary/50 transition-colors"
                      onClick={() => navigate(`/event/${event.id}/details/`)}
                    >
                      <TableCell>
                        <span className="text-white">{event.name}</span>
                        <span className="block sm:hidden text-xs text-muted-foreground mt-0.5">{formatDate(event.date)}</span>
                      </TableCell>
                      <TableCell className="text-muted-foreground hidden sm:table-cell">{formatDate(event.date)}</TableCell>
                      <TableCell className="text-muted-foreground hidden md:table-cell">{event.place}</TableCell>
                      <TableCell className="text-muted-foreground hidden md:table-cell">{event.tickets_counter}</TableCell>
                      <TableCell className="text-right">
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <Button
                  variant="entraditaTertiary"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground">
                  {currentPage}/{totalPages}
                </span>
                <Button
                  variant="entraditaTertiary"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}