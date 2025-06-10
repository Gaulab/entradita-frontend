// entradaFront/src/pages/EventDetail/Dialogs/DialogCreateTicket.jsx
// react imports
import { useState, useContext, useEffect } from 'react';
// react-router imports
// custom components
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dropdown } from '@/components/ui/dropdownlist';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// context imports
import EventDetailsContext from '@/context/EventDetailsContext';
import AuthContext from '@/context/AuthContext';
// apis imports
import { createTicket } from '@/api/ticketApi';

export default function DialogCreateTicket() {
  const { authToken } = useContext(AuthContext);
  const { event, isCreateTicketDialogOpen, setIsCreateTicketDialogOpen, ticketTags, reloadTickets, setReloadTickets } = useContext(EventDetailsContext);
  const [error, setError] = useState('');
  const id = event.id;
  const dni_required = event.dni_required;
  const [valueDropdown, setValueDropdown] = useState(null);


  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    dni: '',
    ticketTag: '',
  });

  useEffect(() => {
    if (!isCreateTicketDialogOpen) {
      // Restablecer el estado del formulario cuando el diálogo se cierra
      setFormData({
        name: '',
        surname: '',
        dni: '',
        ticketTag: [],
      });
      setError('');
    }
  }, [isCreateTicketDialogOpen]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleDropdownChange = (selectedOption) => {
    setValueDropdown(selectedOption);
  };

  // const handleDropdownChange = (selectedOption) => {
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     ticketTag: selectedOption,
  //   }));
  // };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    const submitData = {
      owner_name: formData.name,
      owner_lastname: formData.surname,
      owner_dni: dni_required ? formData.dni : null,
      ticket_tag: valueDropdown.id,
    };

    try {
      const response = await createTicket(submitData, id, authToken.access);
      // console.log('API Response:', response);
      setIsCreateTicketDialogOpen(false);
      setReloadTickets(!reloadTickets);
    } catch (error) {
      console.error('Error creating ticket:', error);
      setError(error.message);
    }
  };

  return (
    <Dialog open={isCreateTicketDialogOpen} onOpenChange={setIsCreateTicketDialogOpen}>
      <DialogContent className="bg-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Crear Ticket</DialogTitle>
          <DialogDescription className="text-center text-gray-400">Ingrese los datos del asistente para el evento</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="categoria" className="text-gray-200">
              Categoría
            </Label>
            <Dropdown
              id="categoria"
              name="ticketTag"
              placeholder="Seleccionar categoría"
              onChange={handleDropdownChange}
              value={valueDropdown}
              options={ticketTags}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="name" className="text-gray-200">
              Nombre
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Nombre del asistente"
              required
              maxLength="25"
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="surname" className="text-gray-200">
              Apellido
            </Label>
            <Input
              id="surname"
              name="surname"
              placeholder="Apellido del asistente"
              value={formData.surname}
              onChange={handleInputChange}
              required
              maxLength="25"
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          {event.dni_required && (
            <div className="space-y-1">
              <Label htmlFor="dni" className="text-gray-200">
                DNI
              </Label>
              <Input
                id="dni"
                name="dni"
                placeholder="DNI del asistente"
                value={formData.dni}
                onChange={handleInputChange}
                required
                maxLength="8"
                type="tel"
                min="0"
                inputMode="numeric"
                pattern="[0-9]*"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button onClick={() => setIsCreateTicketDialogOpen(false)} variant="outline" className="bg-gray-700 text-white hover:bg-gray-600">
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              Crear Ticket
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
