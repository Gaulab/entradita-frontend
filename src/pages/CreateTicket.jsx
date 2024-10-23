import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';

export default function CreateTicket() {
  const { authToken } = useContext(AuthContext);
  const { id } = useParams();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`https://entraditaback-production.up.railway.app/api/v1/tickets/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken.access}` // Corrected authorization token
        },
        body: JSON.stringify({
          event: id, // Event ID from URL params
          owner_name: e.target.name.value,
          owner_lastname: e.target.surname.value,
          owner_dni: e.target.dni.value,
        }),
      });
      
      // const data = await response.json();
      // console.log(data);
      if (response.status === 201) {
        navigate(`/event-details/${id}/`); // Navigate to event details on success
      } else {
        setError('Error al crear el ticket');
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
      setError('Error al crear el ticket');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4 w-screen">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-white">Crear Ticket</CardTitle>
          <CardDescription className="text-center text-gray-400">
            Ingrese los datos del asistente para el evento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-200">Nombre</Label>
              <Input
                id="name"
                required
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="surname" className="text-gray-200">Apellido</Label>
              <Input
                id="surname"
                required
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dni" className="text-gray-200">DNI</Label>
              <Input
                id="dni"
                required
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
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