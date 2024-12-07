// Custom components
import { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../../components/ui/dialog';

export default function DialogDeleteItem({ deleteConfirmOpen, setDeleteConfirmOpen, itemToDelete, handleConfirmDelete }) {
  const [isChecked, setIsChecked] = useState(false);
  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };
  return (
    <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen} className="">
      <DialogContent className="bg-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>Eliminar {itemToDelete?.type}</DialogTitle>
          {itemToDelete?.type === 'vendedor' ? (
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar este {itemToDelete?.type}? Esta acción eliminará la información del empleado y <a className="text-red-500 hover:text-red-500">todos los tickets asociados</a>.
              <br />
              Si queres que solamente no pueda vender mas, podes deshabilitarlo desde el menu.
            </DialogDescription>
          ) : (
            <DialogDescription>¿Estás seguro de que deseas eliminar este {itemToDelete?.type}?</DialogDescription>
          )}
          <div className="flex justify-start items-center ">
            <input type="checkbox" id="confirm-delete" checked={isChecked} onChange={handleCheckboxChange} className="mr-2"  />
            <label htmlFor="confirm-delete" className="text-gray-200 text-left">
              Quiero eliminar al vendedor junto con los ticket que creo.
            </label>
          </div>
        </DialogHeader>
        <DialogFooter className="">
          <Button onClick={handleConfirmDelete} variant="destructive" disabled={!isChecked} className="m">
            Eliminar
          </Button>
          <Button onClick={() => setDeleteConfirmOpen(false)} variant="outline" className="bg-gray-700 text-white hover:bg-gray-600 mb-2">
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
