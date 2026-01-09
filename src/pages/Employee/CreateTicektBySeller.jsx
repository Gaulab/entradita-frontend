import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
// Custom components
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Dropdown } from '../../components/ui/dropdownlist';
// API
import { createTicketBySeller } from '../../api/ticketApi';

export default function CreateTicketBySeller() {
  const { uuid } = useParams();
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { dniRequired, ticketTags = [] } = location.state || {}; // Added fallback to {} to avoid crash if state is null
  const [valueDropdown, setValueDropdown] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const formData = {
      owner_name: e.target.name.value,
      owner_lastname: e.target.surname.value,
      owner_dni: e.target.dni ? e.target.dni.value : null,
      ticket_tag: valueDropdown ? valueDropdown.id : null,
    };

    try {
      const response = await createTicketBySeller(formData, uuid);
      navigate(`/ticket-share/${uuid}`, {
        state: { ticketUrl: `${window.location.origin}/ticket/${response.uuid}` }
      });
    } catch (error) {
      console.error('Error creating ticket:', error.message);
      setError(error.message);
    }
  };

  const handleDropdownChange = (selectedOption) => {
    setValueDropdown(selectedOption);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4 w-screen">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-white">Crear Ticket</CardTitle>
          <CardDescription className="text-center text-gray-400">
            Ingrese los datos del asistente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-2">
              <Label htmlFor="categoria" className="text-gray-200">
                Categoría
              </Label>
              <Dropdown
                id="categoria"
                onChange={handleDropdownChange}
                value={valueDropdown}
                options={ticketTags}
                placeholder="Seleccionar categoría"
                className=""
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-200">
                Nombre
              </Label>
              <Input
                id="name"
                name="name"
                required
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="surname" className="text-gray-200">
                Apellido
              </Label>
              <Input
                id="surname"
                name="surname"
                required
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>

            {dniRequired && (
              <div className="space-y-2">
                <Label htmlFor="dni" className="text-gray-200">
                  DNI
                </Label>
                <Input
                  id="dni"
                  name="dni"
                  maxLength="8"
                  type="tel"
                  pattern="[0-9]*"
                  required
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Crear Ticket
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}