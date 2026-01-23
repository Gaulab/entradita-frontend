// entradaFront/src/pages/EventDetail/Event.jsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Progress } from '../../components/ui/progress';
import { Button } from '../../components/ui/button';
import { CalendarDaysIcon, DollarSign, LucideShoppingCart, MapPin, Monitor, RotateCcw, TicketSlashIcon } from 'lucide-react';
import { useCallback, useContext, useState } from 'react';
import EventDetailsContext from '../../context/EventDetailsContext';
import { Switch } from '../../components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { updateWebSale } from '../../api/eventApi';
import AuthContext from '../../context/AuthContext';

export default function Event({ event }) {
  const { authToken } = useContext(AuthContext);
  const { 
    setIsResetDialogOpen,
    webSalesEnabled,
    setWebSalesEnabled
   } = useContext(EventDetailsContext);
  
  const [errorDialog, setErrorDialog] = useState({
    isOpen: false,
    message: ''
  });

  const percentage = (event.tickets_scanned / event.tickets_sold) * 100;

  const handleResetEvent = useCallback(() => {
    setIsResetDialogOpen(true);
  }, [setIsResetDialogOpen]);

  const handleUpdateWebSale = useCallback(async () => {
    try {
      const response = await updateWebSale(event.id, authToken.access);
      setWebSalesEnabled(response.web_sale_enabled);
    } catch (error) {
      setErrorDialog({
        isOpen: true,
        message: error.message
      });
    }
  }, [event.id, authToken, setWebSalesEnabled]);

  const navigateToEconomy = () => {
    window.location.href = `/event/${event.id}/economy`;
  };

  const navigateToWebPage = () => {
    window.location.href = `/event-page/${event.id}`;
  };

  return (
    <Card className="bg-gray-800 border-gray-700 mb-4">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-center mb-0">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-700 mr-4">
            <img src={event.image_address} alt="Event Logo" className="w-full h-full object-cover" />
          </div>
          <CardTitle className="text-xl font-bold text-white">{event.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 ">
          <p className="text-gray-200 flex flex-row items-center">
            <CalendarDaysIcon className="h-5 mr-1" />
            Fecha:<span className="text-white ml-2">{event.date}</span>
          </p>
          <p className="text-gray-200 flex flex-row items-center">
            <MapPin className="h-5 mr-1" />
            Lugar:<span className="text-white ml-2">{event.place}</span>
          </p>

          <p className="text-gray-200 flex flex-row items-center">
            <TicketSlashIcon className="h-5 mr-1" />
            Capacidad:<span className="text-white ml-2"> {event.capacity ? event.capacity : 'Ilimitada'}</span>
          </p>
          <p className="text-gray-200 flex flex-row items-center">
            <LucideShoppingCart className="h-5 mr-1" />
            Vendidos:<span className="text-white ml-2">{event.tickets_counter}</span>
          </p>
        </div>
      </CardContent>
      <CardContent className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:flex-wrap">
          <Button onClick={navigateToWebPage} className="font-bold sm:mr-2 sm:mb-2 bg-indigo-600 hover:bg-indigo-700 hover:text-white text-white sm:min-w-48 sm:w-min border hover:border-indigo-600">
            <Monitor className="mr-2 h-4 w-4" /> Página WEB
          </Button>
          <Button onClick={navigateToEconomy} className="font-bold sm:mr-2 bg-green-600 hover:bg-green-700 hover:text-white text-white sm:min-w-48 sm:w-min border hover:border-green-600" new>
            <DollarSign className="mr-2 h-4 w-4" /> Economía
          </Button>
          { event.is_periodic &&
            <Button onClick={() => handleResetEvent(true)} className="font-bold sm:mr-2 bg-red-600 hover:bg-red-700 hover:text-white text-white sm:min-w-48 sm:w-min border hover:border-red-600">
              <RotateCcw className="mr-2 h-4 w-4" /> Reiniciar Evento
            </Button>
          }
        </div>
        <div className="flex flex-row items-center ">
          <Switch checked={webSalesEnabled} onChange={() => handleUpdateWebSale()} />
          <span className="text-sm text-gray-400 ml-2">Habilitar venta web del evento</span>
        </div>
      </CardContent>
      <CardContent>
        <div className="space-y-2">
          <div className="relative">
            <Progress value={percentage} className="h-4 bg-gray-800  border border-gray-500" />
            <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{ width: `${percentage}%` }} />
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>{percentage.toFixed(1)}%</span>
            <span>{event.tickets_scanned} personas ingresaron al evento</span>
          </div>
        </div>
      </CardContent>

      <Dialog open={errorDialog.isOpen} onOpenChange={(isOpen) => setErrorDialog({ ...errorDialog, isOpen })}>
        <DialogContent className="bg-gray-800 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-red-500">Error al actualizar venta web</DialogTitle>
          </DialogHeader>
          <p className="text-gray-200">{errorDialog.message}</p>
          <DialogFooter>
            <Button 
              onClick={() => setErrorDialog({ ...errorDialog, isOpen: false })}
              className="bg-gray-700 hover:bg-gray-600"
            >
              Aceptar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
