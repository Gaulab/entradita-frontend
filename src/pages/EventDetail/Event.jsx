// entradaFront/src/pages/EventDetail/Event.jsx
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { CalendarDaysIcon, DollarSign, MapPin, Monitor, RotateCcw } from 'lucide-react';
import { useCallback, useContext, useState } from 'react';
import EventDetailsContext from '../../context/EventDetailsContext';
import { Switch } from '../../components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { updateWebSale } from '../../api/eventApi';
import AuthContext from '../../context/AuthContext';
import { formatDate } from '../../utils/dateUtils';
import PropTypes from 'prop-types';

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

  const percentage = event.tickets_sold > 0 ? (event.tickets_scanned / event.tickets_sold) * 100 : 0;

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
      {/* Header */}
      <CardHeader className="pb-0">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden border border-gray-600 shrink-0">
            <img src={event.image_address} alt="Event Logo" className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0">
            <CardTitle className="text-lg sm:text-xl font-bold text-white truncate">{event.name}</CardTitle>
            <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
              <CalendarDaysIcon className="h-3 w-3 inline mr-1 text-blue-400" />{formatDate(event.date)}
              <span className="mx-2 text-gray-600">·</span>
              <MapPin className="h-3 w-3 inline mr-1 text-purple-400" />{event.place}
            </p>
          </div>
        </div>
      </CardHeader>

      {/* Stats */}
      <CardContent className="py-3">
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="bg-gray-900/40 rounded-md py-1.5 px-2">
            <p className="text-[10px] text-gray-500 uppercase tracking-wide">Capacidad</p>
            <p className="text-sm sm:text-base font-semibold text-white">{event.capacity || '∞'}</p>
          </div>
          <div className="bg-gray-900/40 rounded-md py-1.5 px-2">
            <p className="text-[10px] text-gray-500 uppercase tracking-wide">Vendidos</p>
            <p className="text-sm sm:text-base font-semibold text-green-400">{event.tickets_counter}</p>
          </div>
        </div>
      </CardContent>

      {/* Ingreso */}
      <CardContent className="pt-0 pb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-gray-500 uppercase tracking-wide">Ingresaron</span>
          <span className="text-xs text-gray-400">{event.tickets_scanned} / {event.tickets_sold} · {percentage.toFixed(0)}%</span>
        </div>
        <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all" style={{ width: `${percentage}%` }} />
        </div>
      </CardContent>

      {/* Actions */}
      <CardContent className="pt-0 pb-3 border-t border-gray-700/50">
        <div className="flex items-center gap-2 mt-3">
          <Button size="sm" onClick={navigateToWebPage} className="font-semibold bg-indigo-600 hover:bg-indigo-700 text-white border-0 flex-1 sm:flex-none">
            <Monitor className="h-4 w-4 mr-1.5" /> Web
          </Button>
          <Button size="sm" onClick={navigateToEconomy} className="font-semibold bg-green-600 hover:bg-green-700 text-white border-0 flex-1 sm:flex-none">
            <DollarSign className="h-4 w-4 mr-1.5" /> Economía
          </Button>
          {event.is_periodic && (
            <Button size="sm" onClick={() => handleResetEvent(true)} className="font-semibold bg-red-600 hover:bg-red-700 text-white border-0 flex-1 sm:flex-none">
              <RotateCcw className="h-4 w-4 mr-1.5" /> Reiniciar
            </Button>
          )}
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700/50">
          <span className="text-sm text-gray-300">Venta web del evento</span>
          <Switch checked={webSalesEnabled} onChange={() => handleUpdateWebSale()} />
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

Event.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    place: PropTypes.string.isRequired,
    image_address: PropTypes.string,
    capacity: PropTypes.number,
    tickets_counter: PropTypes.number,
    tickets_scanned: PropTypes.number,
    tickets_sold: PropTypes.number,
    is_periodic: PropTypes.bool,
  }).isRequired,
};
