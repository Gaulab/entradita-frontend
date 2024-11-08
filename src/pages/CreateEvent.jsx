import { useNavigate } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';

export default function CreateEvent() {
  const { authToken, user } = useContext(AuthContext);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/api/v1/events/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken.access}`
        },
        body: JSON.stringify({
          name: e.target.name.value,
          date: e.target.date.value,
          place: e.target.place.value,
          capacity: e.target.capacity.value ? parseInt(e.target.capacity.value) : null,
          image_address: e.target.image_address.value ? e.target.image_address.value : null,
          password_employee: e.target.password_employee.value
        }),
      });
      const data = await response.json();

      if (response.status === 201) {
        navigate('/dashboard');
      } else {
        console.log(user);
        console.log(data);
        setError('Error al crear el evento: ' + JSON.stringify(data));
      }
    } catch {
      setError('Error al crear el evento');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4 w-screen">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Crear Nuevo Evento</CardTitle>
          <CardDescription className="text-gray-400">Ingresa los detalles de tu nuevo evento</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-200">Nombre del Evento</Label>
              <Input
                id="name"
                required
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date" className="text-gray-200">Fecha</Label>
              <Input
                type="date"
                id="date"
                required
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="place" className="text-gray-200">Lugar</Label>
              <Input
                id="place"
                required
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity" className="text-gray-200">Capacidad</Label>
              <Input
                id="capacity"
                type="number"
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image_address" className="text-gray-200">Dirección de la Imagen (Logo)</Label>
              <Input
                id="image_address"
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password_employee" className="text-gray-200">Contraseña para Empleados</Label>
              <Input
                id="password_employee"
                required
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">Crear Evento</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}