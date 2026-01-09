import { useState, useContext, useEffect } from 'react';
// Custom components
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { AlertTriangle } from 'lucide-react';
// context
import AuthContext from '@/context/AuthContext';
import EventDetailsContext from '@/context/EventDetailsContext';
// api
import { resetEvent } from '@/api/eventApi'; // Asumo que crearás esta función en tu API

export default function DialogResetEvent({ currentDate, newDate, soldTicketsCount }) {
  const { authToken } = useContext(AuthContext);
  const { 
    event, 
    isResetDialogOpen, 
    setIsResetDialogOpen, 
    setReloadTickets, // Para refrescar la lista de tickets después del reset
    reloadTickets 
  } = useContext(EventDetailsContext);
  
  const [isChecked, setIsChecked] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  useEffect(() => {
    if (!isResetDialogOpen) {
      // Restablecer el estado del formulario cuando el diálogo se cierra
      setIsChecked(false);
      setIsResetting(false);
    }
  }, [isResetDialogOpen]);

  const handleConfirmReset = async () => {
    if (!event) return;
    setIsResetting(true);
    
    try {
      await resetEvent(event.id, authToken.access); 
      
      // Actualizamos el contexto para que la UI refleje los cambios
      setReloadTickets(!reloadTickets);
      setIsResetDialogOpen(false);
      
    } catch (error) {
      console.error('Error in reset operation:', error.message);
      alert('Error al reiniciar el evento: ' + error.message);
    } finally {
      setIsResetting(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(`${dateStr}T00:00:00`).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formattedCurrentDate = formatDate(currentDate);
  const formattedNewDate = formatDate(newDate);

  return (
    <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
      <DialogContent className="bg-gray-800 text-white border-gray-700 sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="bg-red-500/10 p-3 rounded-full">
                <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold text-center text-white">
            ¿Reiniciar Evento Periódico?
          </DialogTitle>
          
          <DialogDescription className="text-gray-300 pt-4 space-y-4">
            <p className="space-y-2">
              <span className="block">Moverás el evento a la próxima fecha programada:</span>
              <div className="flex items-center justify-center gap-3 font-semibold">
                <span className="text-gray-300 capitalize">{formattedCurrentDate}</span>
                <span className="text-gray-500">→</span>
                <span className="text-green-400 text-lg capitalize">{formattedNewDate}</span>
              </div>
            </p>
            
            <div className="bg-red-900/20 border border-red-900/50 rounded-lg p-3 text-sm text-red-200">
                <p className="font-semibold flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" /> Advertencia Crítica:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>
                        Se eliminarán los <span className="font-bold">{soldTicketsCount} tickets</span> vendidos hasta ahora.
                    </li>
                    <li>
                        Los tickets actuales <strong>NO servirán</strong> para ingresar en la nueva fecha.
                    </li>
                    <li>
                        Los contadores de venta de los empleados se reiniciarán a 0.
                    </li>
                </ul>
            </div>
          </DialogDescription>

          <div className="mt-6 flex items-start space-x-3 bg-gray-900/50 p-3 rounded border border-gray-700">
            <input 
                type="checkbox" 
                id="confirm-reset" 
                checked={isChecked} 
                onChange={handleCheckboxChange} 
                className="mt-1 h-5 w-5 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500" 
            />
            <label htmlFor="confirm-reset" className="text-sm text-gray-400 cursor-pointer select-none">
              Entiendo que al reiniciar el evento se actualizará la fecha y se <strong>eliminarán todos los tickets vendidos</strong> de la fecha anterior.
            </label>
          </div>
        </DialogHeader>

        <DialogFooter className="mt-4 gap-2 sm:gap-0">
          <Button 
            onClick={() => setIsResetDialogOpen(false)} 
            variant="outline" 
            className="bg-gray-700 text-white hover:bg-gray-600 border-gray-600 w-full sm:w-auto"
            disabled={isResetting}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirmReset} 
            disabled={!isChecked || isResetting} 
            className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto"
          >
            {isResetting ? "Reiniciando..." : "Confirmar Reinicio"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}