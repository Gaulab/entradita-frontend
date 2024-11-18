// Custom components
import { Button } from "../../../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../../../components/ui/dialog";

export default function DialogDeleteItem({ deleteConfirmOpen, setDeleteConfirmOpen, itemToDelete, handleConfirmDelete }) {
    return (
        <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <DialogContent className="bg-gray-800 text-white">
            <DialogHeader>
              <DialogTitle>
                {itemToDelete?.status === true ? "Deshabilitar" : "Eliminar"} {itemToDelete?.type}
              </DialogTitle>
              {itemToDelete?.type === "vendedor" ? (
                <DialogDescription>
                  {itemToDelete?.status === true
                    ? `¿Estás seguro de que deseas deshabilitar este ${itemToDelete?.type}? Los tickets no se eliminarán, pero el ${itemToDelete?.type} no podrá vender más tickets.`
                    : `¿Estás seguro de que deseas eliminar este ${itemToDelete?.type}? Esta acción eliminará la información del empleado y todos los tickets asociados.`}
                </DialogDescription>
              ) : (
                <DialogDescription>
                  {itemToDelete?.status === true
                    ? `¿Estás seguro de que deseas deshabilitar este ${itemToDelete?.type}? Los tickets escaneados mantendrán su estado.`
                    : `¿Estás seguro de que deseas eliminar este ${itemToDelete?.type}?`}
                </DialogDescription>
              )}
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => setDeleteConfirmOpen(false)} variant="outline" className="bg-gray-700 text-white hover:bg-gray-600">
                Cancelar
              </Button>
              <Button onClick={handleConfirmDelete} variant="destructive">
                {itemToDelete?.status === true ? "Deshabilitar" : "Eliminar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    )
}