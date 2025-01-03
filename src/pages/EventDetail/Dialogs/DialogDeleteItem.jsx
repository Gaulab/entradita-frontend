// entradit
import { useState, useContext, useCallback, useEffect } from 'react';
// Custom components
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
// context
import AuthContext from '@/context/AuthContext';
import EventDetailsContext from '@/context/EventDetailsContext';
// api
import { deleteEmployee } from '@/api/employeeApi';
import { deleteTicket } from '@/api/ticketApi';

export default function DialogDeleteItem({}) {
  const { authToken } = useContext(AuthContext);
  const {
    event,
    isDeleteConfirmDialogOpen,
    setIsDeleteConfirmDialogOpen,
    itemToDelete,
    setItemToDelete,
    tickets,
    sellers,
    scanners,
    setTickets,
    setSellers,
    setScanners,
  } = useContext(EventDetailsContext);
  const id = event.id;
  const [isChecked, setIsChecked] = useState(false);
  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  useEffect(() => {
    if (!isDeleteConfirmDialogOpen) {
      // Restablecer el estado del formulario cuando el diálogo se cierra
      setIsChecked(false);
    }
  }, [isDeleteConfirmDialogOpen]);

  const handleConfirmDelete = useCallback(async () => {
    if (!itemToDelete) return;
    try {
      let response;
      if (itemToDelete.type === 'ticket') {
        response = await deleteTicket(authToken.access, itemToDelete);
      } else {
        response = await deleteEmployee(authToken.access, itemToDelete);
      }
      if (itemToDelete.type === 'ticket') {
        setTickets(tickets.filter((ticket) => ticket.id !== itemToDelete.id));
      } else if (itemToDelete.status === 1) {
        // Update the employee's status in the state
        const updateEmployee = (empleados) => empleados.map((e) => (e.id === itemToDelete.id ? { ...e, status: 0 } : e));
        if (itemToDelete.type === 'vendedor') {
          setSellers(updateEmployee);
        } else {
          setScanners(updateEmployee);
        }
      } else {
        // Remove the employee from the state
        if (itemToDelete.type === 'vendedor') {
          setSellers(sellers.filter((v) => v.id !== itemToDelete.id));
        } else {
          setScanners(scanners.filter((e) => e.id !== itemToDelete.id));
        }
      }
    } catch (error) {
      console.error('Error in delete operation:', error.message);
      alert(error.message);
    }

    setIsDeleteConfirmDialogOpen(false);
    setItemToDelete(null);
    setIsChecked(false);
  }, [itemToDelete]);

  return (
    <Dialog open={isDeleteConfirmDialogOpen} onOpenChange={setIsDeleteConfirmDialogOpen} className="">
      <DialogContent className="bg-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Eliminar {itemToDelete?.type}</DialogTitle>
          {itemToDelete?.type === 'vendedor' ? (
            <DialogDescription className=" text-gray-400">
              ¿Estás seguro de que deseas eliminar este {itemToDelete?.type}? Esta acción eliminará la información del empleado y <a className="text-red-500 ">todos los tickets asociados</a>.
              <br />
              Si queres que solamente no pueda vender mas, podes deshabilitarlo desde el menu.
            </DialogDescription>
          ) : (
            <DialogDescription>¿Estás seguro de que deseas eliminar este {itemToDelete?.type}?</DialogDescription>
          )}
          <div className=" text-gray-400 flex items-center ">
            <input type="checkbox" id="confirm-delete" checked={isChecked} onChange={handleCheckboxChange} className=" mr-2  h-5 w-5" />
            <label htmlFor="confirm-delete" className=" text-gray-400">
              Quiero eliminar al {itemToDelete?.type} {itemToDelete?.type === 'vendedor' ? 'junto con los ticket que creo.' : ''}
            </label>
          </div>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => setIsDeleteConfirmDialogOpen(false)} variant="outline" className="bg-gray-700 text-white hover:bg-gray-600">
            Cancelar
          </Button>
          <Button onClick={handleConfirmDelete} disabled={!isChecked} className="bg-red-700 hover:bg-red-800 text-white">
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
