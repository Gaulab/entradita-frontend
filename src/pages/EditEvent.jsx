// entradaFront/src/pages/EditEvent.jsx
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';
import { useState, useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
// API
import { getEvent, updateEvent, deleteEvent } from '../api/eventApi';
import { ArrowLeftIcon, Edit, Edit2, HelpCircle, X } from 'lucide-react';

export default function EditEvent() {
  const { id } = useParams();
  const { authToken } = useContext(AuthContext);
  const [error, setError] = useState('');
  const [event, setEvent] = useState(null);
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteConfirmationCode, setDeleteConfirmationCode] = useState('');
  const [requireDNI, setRequireDNI] = useState(false);
  const [userInputCode, setUserInputCode] = useState('');
  const [ticketTags, setTicketTags] = useState([]);
  const [tagName, setTagName] = useState('');
  const [tagPrice, setTagPrice] = useState('');
  const [isDeleteTagDialogOpen, setIsDeleteTagDialogOpen] = useState(false);
  const [tagToDelete, setTagToDelete] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await getEvent(id, authToken.access);
        console.log('Data:', data);
        setTicketTags(data.ticket_tags);
        setEvent(data);
        setRequireDNI(data.dni_required);
        setDeleteConfirmationCode(generateConfirmationCode());
      } catch (error) {
        setError(error.message);
      }
    };
    fetchEvent();
  }, [id, authToken.access]);

  useEffect(() => {
    setUserInputCode('');
  }, [isDeleteDialogOpen]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Extrae los datos del formulario y actualiza el objeto del evento
    const formData = new FormData(event.target);
    const eventObject = Object.fromEntries(Array.from(formData.entries()).filter(([key, value]) => value !== ''));
    eventObject.dni_required = requireDNI; // Actualiza el requerimiento de DNI
    eventObject.ticket_tags = ticketTags; // Actualiza las etiquetas de los tickets

    // Elimina el campo password_employee si está vacío
    if (!eventObject.password_employee) {
      delete eventObject.password_employee;
    }

    try {
      const data = await updateEvent(eventObject, id, authToken.access);
      navigate(`/event/${id}/details`);
    } catch (error) {
      setError(error.message || 'Error al editar el evento');
    }
  };

  const handleDeleteEvent = async () => {
    if (userInputCode !== deleteConfirmationCode) {
      setError('Código de confirmación incorrecto');
      return;
    }
    setUserInputCode('');

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

  const addTicketTag = () => {
    if (ticketTags.length < 5) {
      if (tagName && tagPrice && !isNaN(tagPrice)) {
        setTicketTags([...ticketTags, { name: tagName, price: parseFloat(tagPrice) }]);
        setTagName('');
        setTagPrice('');
      }
    } else {
      setError('Solo puedes agregar hasta 5 Ticket Tags.');
      setTimeout(() => setError(''), 3000); // Limpia el error después de 3 segundos
    }
  };

  const removeTicketTag = () => {
    setTicketTags(ticketTags.filter((_, i) => i !== tagToDelete));
    setIsDeleteTagDialogOpen(false);
  };
  const openDeleteTagDialog = (index) => {
    console.log('Index:', index);
    setIsDeleteTagDialogOpen(true);
    setTagToDelete(index); // Guardamos el índice de la etiqueta a eliminar
  };
  const [isEditTagDialogOpen, setIsEditTagDialogOpen] = useState(false);

  const [tagToEdit, setTagToEdit] = useState(1);

  const openEditTagDialog = (index) => {
    setIsEditTagDialogOpen(true);
    console.log('Index:', index);
    setTagToEdit(index);
  };

  const handleEditTag = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedTag = {
      name: formData.get('name'),
      price: parseFloat(formData.get('price')),
    };

    setTicketTags(ticketTags.map((tag, index) => (index === tagToEdit ? updatedTag : tag)));
    setIsEditTagDialogOpen(false);
  };

  if (!event) {
    return <div className="text-white w-screen">Cargando...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4 w-screen">
      <Button  onClick={() => navigate(`/event/${id}/details`)} variant="entraditaTertiary" className="w-full max-w-md mb-4">
        <ArrowLeftIcon className="mr-2 h-4 w-4" /> Volver al evento
      </Button>
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Editar Evento</CardTitle>
          <CardDescription className="text-gray-400">Modifica los detalles de tu evento</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-200">
                Nombre del Evento
              </Label>
              <Input id="name" name="name" defaultValue={event.name} required className="bg-gray-700 border-gray-600 text-white placeholder-gray-400" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date" className="text-gray-200">
                Fecha
              </Label>
              <Input type="date" id="date" name="date" defaultValue={event.date} required className="bg-gray-700 border-gray-600 text-white" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="place" className="text-gray-200">
                Lugar
              </Label>
              <Input id="place" name="place" defaultValue={event.place} required className="bg-gray-700 border-gray-600 text-white placeholder-gray-400" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity" className="text-gray-200">
                Capacidad
              </Label>
              <Input id="capacity" name="capacity" type="number" defaultValue={event.capacity} className="bg-gray-700 border-gray-600 text-white placeholder-gray-400" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact" className="text-gray-200 flex items-center">
                Contacto
              </Label>
              <Input id="contact" name="contact" defaultValue={event.contact} type="number" maxLength="11" className="bg-gray-700 border-gray-600 text-white placeholder-gray-400" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image_address" className="text-gray-200">
                Dirección de la Imagen (Logo)
              </Label>
              <Input id="image_address" name="image_address" defaultValue={event.image_address} className="bg-gray-700 border-gray-600 text-white placeholder-gray-400" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password_employee" className="text-gray-200">
                Contraseña para Empleados
              </Label>
              <Input id="password_employee" name="password_employee"  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400" />
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="dni_required" className="text-gray-200 flex items-center">
                Requerir DNI
              </Label>
              <Switch id="dni_required" checked={requireDNI} onCheckedChange={setRequireDNI} />
              <Input type="hidden" name="dni_required" value={requireDNI} />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-200 flex items-center">Ticket Tags</Label>
              <div className="flex space-x-2">
                <Input value={tagName} onChange={(e) => setTagName(e.target.value)} placeholder="Nombre" maxLength="25" className="bg-gray-700 border-gray-600 text-white placeholder-gray-400" />
                <Input
                  value={tagPrice}
                  onChange={(e) => setTagPrice(e.target.value)}
                  placeholder="Precio"
                  type="number"
                  step="0.01"
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
                <Button type="button" onClick={addTicketTag} className="bg-blue-600 hover:bg-blue-700 text-white">
                  +
                </Button>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                {ticketTags.map((tag, index) => (
                  <div key={index} className="bg-gray-700 text-white py-2 px-4 rounded flex items-center justify-between">
                    <span>
                      {tag.name} - ${tag.price.toFixed(2)}
                    </span>
                    <div className="space-x-2 items-center">
                      <button type="button" onClick={() => openEditTagDialog(index)} className="text-gray-400 hover:text-gray-200 p-1">
                        <Edit2 size={20} />
                      </button>
                      <button type="button" onClick={() => openDeleteTagDialog(index)} className="text-gray-400 hover:text-gray-200 p-1">
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Actualizar Evento
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-stretch">
          <Button onClick={() => setIsDeleteDialogOpen(true)} variant="destructive" className="w-full mt-4">
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
            <Button
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setUserInputCode('');
              }}
              variant="outline"
              className="bg-gray-700 text-white hover:bg-gray-600"
            >
              Cancelar
            </Button>
            <Button onClick={handleDeleteEvent} variant="destructive">
              Eliminar Evento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Diálogo de confirmación de eliminación de TicketTag */}
      <Dialog open={isDeleteTagDialogOpen} onOpenChange={setIsDeleteTagDialogOpen}>
        <DialogContent className="bg-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Advertencia</DialogTitle>
            <DialogDescription>
              Los tickets con esta etiqueta no serán borrados. Permanecerán con esta etiqueta y los vendedores ya no podrán vender este tipo de tickets.
              <br />
              Si desea borrar los tickets con esta etiqueta, se deberán borrar uno a uno. No es recomendado borrar etiquetas.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setIsDeleteTagDialogOpen(false)} variant="outline" className="bg-gray-700 text-white hover:bg-gray-600">
              Cancelar
            </Button>
            <Button onClick={removeTicketTag} variant="destructive">
              Confirmar Eliminación
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Diálogo de confirmación de edicion de TicketTag */}
      <Dialog open={isEditTagDialogOpen} onOpenChange={setIsEditTagDialogOpen}>
        <DialogContent className="bg-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Editar Ticket Tag</DialogTitle>
            <DialogDescription>Modifica los detalles de tu Ticket Tag, los tickets y vendedores con esta etiqueta cambiarán. </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditTag} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-200">
                Nombre del Ticket Tag
              </Label>
              <Input id="name" name="name" required className="bg-gray-700 border-gray-600 text-white placeholder-gray-400" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price" className="text-gray-200">
                Precio
              </Label>
              <Input id="price" name="price" required className="bg-gray-700 border-gray-600 text-white placeholder-gray-400" />
            </div>
            <DialogFooter>
              <Button onClick={() => setIsEditTagDialogOpen(false)} variant="outline" className="bg-gray-700 text-white hover:bg-gray-600">
                Cancelar
              </Button>
              <Button type="submit" variant="destructive">
                Actualizar Ticket Tag
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
