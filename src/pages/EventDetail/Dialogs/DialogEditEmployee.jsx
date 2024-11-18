// Custom components
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../../../components/ui/dialog";
import { Label } from "../../../components/ui/label";

export default function DialogEditEmployee({ isEditDialogOpen, setIsEditDialogOpen, editingEmpleado, newEmpleadoName, setNewEmpleadoName, newEmpleadoCapacity, setNewEmpleadoCapacity, handleConfirmEditEmpleado }) {
    return (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-gray-800 text-white">
            <DialogHeader>
              <DialogTitle>Editar {editingEmpleado?.is_seller ? "Vendedor" : "Escáner"}</DialogTitle>
              <DialogDescription>Modifique los detalles del {editingEmpleado?.is_seller ? "vendedor" : "escáner"}.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="editEmpleadoName">Nombre</Label>
                <Input
                  id="editEmpleadoName"
                  value={newEmpleadoName}
                  onChange={(e) => setNewEmpleadoName(e.target.value)}
                  placeholder="Nombre del empleado"
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
              {editingEmpleado?.is_seller && (
                <div>
                  <Label htmlFor="editEmpleadoCapacity">Capacidad de venta</Label>
                  <Input
                    id="editEmpleadoCapacity"
                    type="number"
                    value={newEmpleadoCapacity}
                    onChange={(e) => setNewEmpleadoCapacity(e.target.value)}
                    placeholder="Sin limite"
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button onClick={() => setIsEditDialogOpen(false)} variant="outline" className="bg-gray-700 text-white hover:bg-gray-600">
                Cancelar
              </Button>
              <Button onClick={handleConfirmEditEmpleado} className="bg-blue-600 hover:bg-blue-700 text-white">
                Guardar Cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    )
}