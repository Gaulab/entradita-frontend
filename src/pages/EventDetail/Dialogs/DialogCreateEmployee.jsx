// entradaFront/src/pages/EventDetail/Dialogs/DialogCreateEmployee.jsx

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
import AuthContext from '@/context/AuthContext';
import EventDetailsContext from '@/context/EventDetailsContext';
// api imports
import { createEmployee } from '@/api/employeeApi';

export default function DialogCreateEmployee() {
  const { authToken } = useContext(AuthContext);
  const { event, reloadEmployees, setReloadEmployees, isCreateEmployeeDialogOpen, setIsCreateEmployeeDialogOpen, isSellerEmployee } = useContext(EventDetailsContext);
  const id = event.id;

  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
    ticket_tags: [],
  });

  const [error, setError] = useState('');
  const firstInputRef = useRef(null);

  useEffect(() => {
    if (!isCreateEmployeeDialogOpen) {
      // Restablecer el estado del formulario cuando el diálogo se cierra
      setFormData({
        name: '',
        capacity: '',
        ticket_tags: [],
      });
      setError('');
    }
  }, [isCreateEmployeeDialogOpen]);

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
      seller_capacity: isSellerEmployee ? formData.capacity : null,
      ticket_tags: isSellerEmployee ? formData.ticket_tags.map((tag) => ({ id: tag.id })) : [],
      is_seller: isSellerEmployee,
    };

    try {
      const response = await createEmployee(submitData, authToken.access, id);
      console.log('API Response:', response);
      setIsCreateEmployeeDialogOpen(false);
      setReloadEmployees(!reloadEmployees);
      setFormData({
        name: '',
        capacity: '',
        ticket_tags: [],
      });
    } catch (error) {
      console.error('Error creating employee:', error);
      setError(error.message || 'An error occurred while creating the employee.');
    }
  };

  return (
    <Dialog open={isCreateEmployeeDialogOpen} onOpenChange={setIsCreateEmployeeDialogOpen}>
      <DialogContent className="bg-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Nuevo {isSellerEmployee ? 'Vendedor' : 'Escáner'}</DialogTitle>
          <DialogDescription className="text-center text-gray-400">Ingrese los detalles para el nuevo {isSellerEmployee ? 'vendedor' : 'escáner'}.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="categoria" className="text-gray-200">
              Categorías
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

          {isSellerEmployee && (
            <>
              <div className="space-y-2">
                <Label htmlFor="capacity" className="text-gray-200">
                  Capacidad de venta
                </Label>
                <Input id="capacity" name="capacity" type="number" value={formData.capacity} onChange={handleInputChange} placeholder="Sin limite" className="bg-gray-700 border-gray-600 text-white" />
              </div>
            </>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button onClick={() => setIsCreateEmployeeDialogOpen(false)} variant="outline" className="bg-gray-700 text-white hover:bg-gray-600" type="button">
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              Confirmar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
