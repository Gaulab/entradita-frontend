import { useState, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
// Custom components
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Dropdown } from '../components/ui/dropdownlist';
import AuthContext from '../context/AuthContext';
// API
import { createTicket } from '../api/ticketApi';

export default function CreateTicket() {
  const { authToken } = useContext(AuthContext);
  const { id } = useParams();
  const [error, setError] = useState('');
  const location = useLocation();
  const { dniRequired, ticketTags } = location.state;
  const navigate = useNavigate();
  const [valueDropdown, setValueDropdown] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Creating ticket...' + event.target.name.value + ' ' + event.target.surname.value + ' ' + event.target.dni.value + ' ' + valueDropdown);
    try {
      event.target.tag = valueDropdown;
      await createTicket(event, id, authToken);
      navigate(`/event/${id}/tickets`);
    } catch (error) {
      setError(error.message);
    }
    setValueDropdown('');
  };


  const handleDropdownChange = (e) => {
    setValueDropdown(e);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4 w-screen">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-white">Crear Ticket</CardTitle>
          <CardDescription className="text-center text-gray-400">Ingrese los datos del asistente para el evento</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-200">
                Nombre
              </Label>
              <Input id="name" required maxLength="25" className="" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="surname" className="text-gray-200">
                Apellido
              </Label>
              <Input id="surname" required maxLength="25" className="" />
            </div>

            {dniRequired && (
              <div className="space-y-2">
                <Label htmlFor="dni" className="text-gray-200">
                  DNI
                </Label>
                <Input id="dni" required maxLength="8" type="tel" min="0" inputMode="numeric" pattern="[0-9]*" className="" />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="categoria" className="text-gray-200">
                Categoría
              </Label>
              <Dropdown id="categoria" onChange={handleDropdownChange} value={valueDropdown} options={ticketTags} placeholder="Seleccionar categoría" className="" />
            </div>
            <Input id="ticket_tag" name="ticket_tag" type="hidden" value={id} />
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
