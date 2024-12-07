  // entraaditaFront/src/pages/EventDetail/Dialogs/DialogCreateEmployee.jsx
  import { useState, useEffect } from 'react';
  import { Button } from '../../../components/ui/button';
  import { Input } from '../../../components/ui/input';
  import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../../components/ui/dialog';
  import { Label } from '../../../components/ui/label';
  import { Dropdown } from '../../../components/ui/dropdownlist';
  import { MultiSelectDropdown } from '../../../components/ui/multiselectdropdown';

  export default function DialogCreateEmployee({
    isDialogOpen,
    setIsDialogOpen,
    isSellerEmpleado,
    newEmpleadoName,
    setNewEmpleadoName,
    newEmpleadoCapacity,
    setNewEmpleadoCapacity,
    handleConfirmGenerarEmpleado,
    ticket_tags,
    newTicketTags,
    setNewTicketTags

  }) {
    useEffect(() => {
      // console.log("newTicketTags actualizado:", newTicketTags);
      // console.log("ticket_tags:", ticket_tags);
    }, [newTicketTags]);
    
    const handleConfirm = () => {
      if (!newEmpleadoName.trim()) {
        alert("El nombre es obligatorio");
        return;
      }
      if (isSellerEmpleado && (!newEmpleadoCapacity || newEmpleadoCapacity <= 0)) {
        alert("La capacidad de venta debe ser mayor que cero");
        return;
      }
      if (isSellerEmpleado && newTicketTags.length === 0) {
        alert("Debe seleccionar al menos una categoría");
        return;
      }
      console.log("newTicketTags en DialogCreateEmployee: ", newTicketTags);
      handleConfirmGenerarEmpleado();
    };
    
    
    return (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Crear Nuevo {isSellerEmpleado ? 'Vendedor' : 'Escáner'}</DialogTitle>
            <DialogDescription>Ingrese los detalles para el nuevo {isSellerEmpleado ? 'vendedor' : 'escáner'}.</DialogDescription>
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
              <div className="space-y-4">
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
                <div >
                  <Label htmlFor="categoria" className="text-gray-200">
                    Categoría
                  </Label>
                  <MultiSelectDropdown
                    id="categoria"
                    options={ticket_tags} // Opciones de categorías
                    selectedValues={newTicketTags} // Categorías seleccionadas
                    onChange={setNewTicketTags}
                    placeholder="Seleccionar categorías"
                    className=""
                  />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)} variant="outline" className="bg-gray-700 text-white hover:bg-gray-600">
              Cancelar
            </Button>
            <Button onClick={handleConfirm} className="bg-blue-600 hover:bg-blue-700 text-white">
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
