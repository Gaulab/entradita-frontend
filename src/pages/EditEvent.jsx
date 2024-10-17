import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { useState, useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext';

export default function EditEvent() {
  const { id } = useParams();
  const { authToken } = useContext(AuthContext);
  const [error, setError] = useState('');
  const [event, setEvent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/v1/events/${id}/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken.access}`
          },
        });
        if (response.ok) {
          const data = await response.json();
          setEvent(data);
        } else {
          setError('Error al cargar el evento');
        }
      } catch (error) {
        setError('Error al cargar el evento');
      }
    };

    fetchEvent();
  }, [id, authToken.access]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/api/v1/events/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken.access}`
        },
        body: JSON.stringify({
          name: e.target.name.value,
          date: e.target.date.value,
          place: e.target.place.value,
          capacity: e.target.capacity.value ? parseInt(e.target.capacity.value) : 0,
          image_address: e.target.image_address.value
        }),
      });
      
      if (response.ok) {
        navigate(`/event-details/${id}`);
      } else {
        const data = await response.json();
        setError('Error al actualizar el evento: ' + JSON.stringify(data));
      }
    } catch (error) {
      setError('Error al actualizar el evento');
    }
  };

  if (!event) {
    return <div className="text-white">Cargando...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4 w-screen">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Editar Evento</CardTitle>
          <CardDescription className="text-gray-400">Modifica los detalles de tu evento</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-200">Nombre del Evento</Label>
              <Input
                id="name"
                defaultValue={event.name}
                required
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date" className="text-gray-200">Fecha</Label>
              <Input
                type="date"
                id="date"
                defaultValue={event.date}
                required
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="place" className="text-gray-200">Lugar</Label>
              <Input
                id="place"
                defaultValue={event.place}
                required
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity" className="text-gray-200">Capacidad</Label>
              <Input
                id="capacity"
                type="number"
                defaultValue={event.capacity}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image_address" className="text-gray-200">Dirección de la Imagen (Logo)</Label>
              <Input
                id="image_address"
                defaultValue={event.image_address}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">Actualizar Evento</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}