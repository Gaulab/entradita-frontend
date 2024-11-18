// Custom components
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../../../components/ui/dialog";
import { Label } from "../../../components/ui/label";

export default function DialogCreateEmployee({ isDialogOpen, setIsDialogOpen, isSellerEmpleado, newEmpleadoName, setNewEmpleadoName, newEmpleadoCapacity, setNewEmpleadoCapacity, handleConfirmGenerarEmpleado }) {
    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-gray-800 text-white">
            <DialogHeader>
              <DialogTitle>Crear Nuevo {isSellerEmpleado ? "Vendedor" : "Escáner"}</DialogTitle>
              <DialogDescription>Ingrese los detalles para el nuevo {isSellerEmpleado ? "vendedor" : "escáner"}.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="newEmpleadoName">Nombre</Label>
                <Input
                  id="newEmpleadoName"
                  value={newEmpleadoName}
                  onChange={(e) => setNewEmpleadoName(e.target.value)}
                  placeholder="Nombre del empleado"
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
              {isSellerEmpleado && (
                <div>
                  <Label htmlFor="newEmpleadoCapacity">Capacidad de venta</Label>
                  <Input
                    id="newEmpleadoCapacity"
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
              <Button onClick={() => setIsDialogOpen(false)} variant="outline" className="bg-gray-700 text-white hover:bg-gray-600">
                Cancelar
              </Button>
              <Button onClick={handleConfirmGenerarEmpleado} className="bg-blue-600 hover:bg-blue-700 text-white">
                Confirmar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    )
}