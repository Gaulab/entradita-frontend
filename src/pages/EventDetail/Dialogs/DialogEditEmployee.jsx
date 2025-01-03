// react imports
import { useContext, useState, useRef, useEffect } from 'react';
// custom components
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { MultiSelectDropdown } from '@/components/ui/multiselectdropdown';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
// context imports
import EventDetailsContext from '@/context/EventDetailsContext';
import AuthContext from '@/context/AuthContext';
// api imports
import { updateEmployee } from '@/api/employeeApi';

export default function DialogEditEmployee() {
  const { authToken } = useContext(AuthContext);
  const { event, sellers, setSellers, scanners, setScanners, reloadEmployees, setReloadEmployees, editingEmployee, setEditingEmployee, isEditEmployeeDialogOpen, setIsEditEmployeeDialogOpen } =
    useContext(EventDetailsContext);

  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
    ticket_tags: [],
  });

  const [error, setError] = useState('');
  const firstInputRef = useRef(null);

  useEffect(() => {
    if (isEditEmployeeDialogOpen && editingEmployee) {
      setFormData({
        name: editingEmployee.assigned_name || '',
        capacity: editingEmployee.seller_capacity || '',
        ticket_tags: editingEmployee.ticket_tags || [],
      });
    }
  }, [isEditEmployeeDialogOpen, editingEmployee]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleMultiSelectChange = (selectedOptions) => {
    setFormData((prevData) => ({
      ...prevData,
      ticket_tags: selectedOptions,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    const submitData = {
      assigned_name: formData.name,
      seller_capacity: editingEmployee.is_seller ? formData.capacity : null,
      ticket_tags: editingEmployee.is_seller ? formData.ticket_tags.map((tag) => ({ id: tag.id })) : [],
    };
    try {
      const updatedEmployee = await updateEmployee(submitData, authToken.access, editingEmployee.id);
      if (editingEmployee.is_seller) {
        setSellers(sellers.map((v) => (v.id === updatedEmployee.id ? updatedEmployee : v)));
      } else {
        setScanners(scanners.map((e) => (e.id === updatedEmployee.id ? updatedEmployee : e)));
      }
      setReloadEmployees(!reloadEmployees);
      setIsEditEmployeeDialogOpen(false);
      setEditingEmployee(null);
    } catch (error) {
      console.error('Error updating employee:', error);
      setError(error.message || 'An error occurred while updating the employee.');
    }
  };

  return (
    <Dialog open={isEditEmployeeDialogOpen} onOpenChange={setIsEditEmployeeDialogOpen}>
      <DialogContent className="bg-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Editar {editingEmployee?.is_seller ? 'Vendedor' : 'Escáner'}</DialogTitle>
          <DialogDescription className="text-center text-gray-400">Modifique los detalles del {editingEmployee?.is_seller ? 'vendedor' : 'escáner'}.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {editingEmployee?.is_seller && (
            <div className="space-y-2">
              <Label htmlFor="categoria" className="text-gray-200">
                Categoría
              </Label>
              <MultiSelectDropdown
                id="categoria"
                options={event.ticket_tags || []}
                selectedValues={formData.ticket_tags}
                onChange={handleMultiSelectChange}
                placeholder="Seleccionar categorías"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-200">
              Nombre
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Nombre del empleado"
              maxLength="25"
              className="bg-gray-700 border-gray-600 text-white"
              ref={firstInputRef}
            />
          </div>

          {editingEmployee?.is_seller && (
            <div className="space-y-2">
              <Label htmlFor="capacity" className="text-gray-200">
                Capacidad de venta
              </Label>
              <Input id="capacity" name="capacity" type="number" value={formData.capacity} onChange={handleInputChange} placeholder="Sin limite" className="bg-gray-700 border-gray-600 text-white" />
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button
              onClick={() => {
                setIsEditEmployeeDialogOpen(false);
                setEditingEmployee(null);
              }}
              variant="outline"
              className="bg-gray-700 text-white hover:bg-gray-600"
              type="button"
            >
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              Guardar Cambios
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
