import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../components/ui/dialog";
import { useState, useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
// API
import { getEvent, updateEvent, deleteEvent } from '../api/eventApi';

export default function EditEvent() {
  const { id } = useParams();
  const { authToken } = useContext(AuthContext);
  const [error, setError] = useState('');
  const [event, setEvent] = useState(null);
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteConfirmationCode, setDeleteConfirmationCode] = useState('');
  const [userInputCode, setUserInputCode] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await getEvent(id, authToken.access);
        setEvent(data);
        setDeleteConfirmationCode(generateConfirmationCode());
      } catch (error) {
        setError(error.message);
      }
    };

    fetchEvent();
  }, [id, authToken.access]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await updateEvent(e, id, authToken.access);
      navigate(`/event/${id}/tickets`);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteEvent = async () => {
    if (userInputCode !== deleteConfirmationCode) {
      setError('Código de confirmación incorrecto');
      return;
    }

    try {
      const data = await deleteEvent(id, authToken.access);
      navigate('/dashboard');
    } catch {
      setError('Error al eliminar el evento');
    }
  };

  const generateConfirmationCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  if (!event) {
    return <div className="text-white w-screen">Cargando...</div>;
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
            <div className="space-y-2">
              <Label htmlFor="password_employee" className="text-gray-200">Contraseña para Empleados</Label>
              <Input
                id="password_employee"
                defaultValue={event.password_employee}
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
        <CardFooter className="flex flex-col items-stretch">
          <Button 
            onClick={() => setIsDeleteDialogOpen(true)} 
            variant="destructive" 
            className="w-full mt-4"
          >
            Eliminar Evento
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación del Evento</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. Por favor, ingrese el siguiente código para confirmar: 
              <span className="font-bold text-red-500"> {deleteConfirmationCode}</span>
            </DialogDescription>
          </DialogHeader>
          <Input
            value={userInputCode}
            onChange={(e) => setUserInputCode(e.target.value)}
            placeholder="Ingrese el código de confirmación"
            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
          />
          <DialogFooter>
            <Button onClick={() => setIsDeleteDialogOpen(false)} variant="outline" className="bg-gray-700 text-white hover:bg-gray-600">
              Cancelar
            </Button>
            <Button onClick={handleDeleteEvent} variant="destructive">
              Eliminar Evento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}