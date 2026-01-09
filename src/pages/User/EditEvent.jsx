// entradaFront/src/pages/EditEvent.jsx
// react-router-dom imports
import { useNavigate, useParams } from 'react-router-dom';
// react imports
import { useState, useContext, useEffect } from 'react';
// Custom components imports
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card.jsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Switch } from '@/components/ui/switch.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Tooltip } from '@/components/ui/tooltip';
import LoadingSpinner from '@/components/ui/loadingspinner.jsx';

// context imports
import AuthContext from '@/context/AuthContext.jsx';
// API
import { getEvent, updateEvent, deleteEvent } from '@/api/eventApi.jsx';
import { ArrowLeftIcon, Edit2, HelpCircle, X, Repeat } from 'lucide-react';

const DAYS_OF_WEEK = [
  { id: 0, label: 'Lun', full: 'Lunes' },
  { id: 1, label: 'Mar', full: 'Martes' },
  { id: 2, label: 'Mié', full: 'Miércoles' },
  { id: 3, label: 'Jue', full: 'Jueves' },
  { id: 4, label: 'Vie', full: 'Viernes' },
  { id: 5, label: 'Sáb', full: 'Sábado' },
  { id: 6, label: 'Dom', full: 'Domingo' },
];

export default function EditEvent() {
  const { id } = useParams();
  const { authToken } = useContext(AuthContext);
  const [error, setError] = useState('');
  const [event, setEvent] = useState(null);
  const navigate = useNavigate();

  // Estados para eliminación de evento
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteConfirmationCode, setDeleteConfirmationCode] = useState('');
  const [userInputCode, setUserInputCode] = useState('');

  // Estados del formulario
  const [requireDNI, setRequireDNI] = useState(false);
  const [date, setDate] = useState('');

  // Estados de Periodicidad (Homólogos a CreateEvent)
  const [isPeriodic, setIsPeriodic] = useState(false);
  const [periodicity, setPeriodicity] = useState(null);
  const [recurrenceEndDate, setRecurrenceEndDate] = useState('');

  // Estados de Ticket Tags
  const [ticketTags, setTicketTags] = useState([]);
  const [tagName, setTagName] = useState('');
  const [tagPrice, setTagPrice] = useState('');
  const [tagCommission, setTagCommission] = useState('');

  // Estados para diálogos de tags
  const [isDeleteTagDialogOpen, setIsDeleteTagDialogOpen] = useState(false);
  const [tagToDelete, setTagToDelete] = useState(null);
  const [isEditTagDialogOpen, setIsEditTagDialogOpen] = useState(false);
  const [tagToEdit, setTagToEdit] = useState(0);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await getEvent(id, authToken.access);
        setTicketTags(data.ticket_tags);
        setEvent(data);
        setRequireDNI(data.dni_required);
        setDate(data.date);
        setIsPeriodic(data.is_periodic);
        setRecurrenceEndDate(data.recurrence_end_date);
        setPeriodicity(data.periodicity);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (ticketTags.length === 0) {
      setError('Debes tener al menos un Ticket Tag activo.');
      setTimeout(() => setError(''), 5000);
      return;
    }

    // Validaciones de periodicidad (Igual que CreateEvent)
    if (isPeriodic && periodicity === null) {
      setError('Debes seleccionar un día de la semana para el evento periódico.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    const formData = new FormData(e.target);
    const selectedDate = new Date(formData.get('date') + 'T00:00:00');

    // Validación de fecha fin vs inicio
    if (isPeriodic && recurrenceEndDate) {
      const endDateObj = new Date(recurrenceEndDate + 'T00:00:00');
      if (endDateObj < selectedDate) {
        setError('La fecha de fin debe ser posterior a la fecha de inicio.');
        setTimeout(() => setError(''), 3000);
        return;
      }
    }

    const eventObject = Object.fromEntries(Array.from(formData.entries()).filter(([key, value]) => value !== ''));

    eventObject.dni_required = requireDNI;
    eventObject.ticket_tags = ticketTags;

    // Lógica periodicidad para guardar
    eventObject.is_periodic = isPeriodic; // Usamos is_periodic para mantener consistencia
    if (isPeriodic) {
      eventObject.periodicity = periodicity; // Valor único
      if (recurrenceEndDate) {
        eventObject.recurrence_end_date = recurrenceEndDate;
      } else {
        eventObject.recurrence_end_date = null;
      }
    } else {
      // Limpiar si desactivaron la periodicidad
      eventObject.periodicity = null;
      eventObject.recurrence_end_date = null;
    }

    if (!eventObject.password_employee) {
      delete eventObject.password_employee;
    }

    try {
      await updateEvent(eventObject, id, authToken.access);
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
      await deleteEvent(id, authToken.access);
      navigate('/dashboard');
    } catch {
      setError('Error al eliminar el evento');
    }
  };

  const generateConfirmationCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  // Toggle de selección única (Igual que en CreateEvent)
  const toggleDay = (dayId) => {
    if (periodicity === dayId) {
      setPeriodicity(null);
    } else {
      setPeriodicity(dayId);
    }
  };

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  // --- LÓGICA DE TICKET TAGS ---

  const addTicketTag = () => {
    if (ticketTags.length < 50) {
      if (tagName && tagPrice && !isNaN(tagPrice)) {
        const commission = tagCommission && !isNaN(tagCommission) ? parseFloat(tagCommission) : 0;

        setTicketTags([
          ...ticketTags,
          {
            name: tagName,
            price: parseFloat(tagPrice),
            commission_per_ticket: commission
          }
        ]);

        setTagName('');
        setTagPrice('');
        setTagCommission('');
      }
    } else {
      setError('Límite de Ticket Tags alcanzado.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const removeTicketTag = () => {
    setTicketTags(ticketTags.filter((_, i) => i !== tagToDelete));
    setIsDeleteTagDialogOpen(false);
  };

  const openDeleteTagDialog = (index) => {
    setIsDeleteTagDialogOpen(true);
    setTagToDelete(index);
  };

  const openEditTagDialog = (index) => {
    setIsEditTagDialogOpen(true);
    setTagToEdit(index);
  };

  const handleEditTag = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedTag = {
      ...ticketTags[tagToEdit],
      name: formData.get('name'),
      price: parseFloat(formData.get('price')),
      commission_per_ticket: parseFloat(formData.get('commission') || 0),
    };
    setTicketTags(ticketTags.map((tag, index) => (index === tagToEdit ? updatedTag : tag)));
    setIsEditTagDialogOpen(false);
  };

  if (!event) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen md:w-3/4 mx-auto p-4 bg-gray-900 text-gray-100">
      <div className="max-w-6xl mx-auto w-full flex flex-col items-center w-3/4">

        <Button onClick={() => navigate(`/event/${id}/details`)} variant="entraditaTertiary" className="w-full mb-4">
          <ArrowLeftIcon className="mr-2 h-4 w-4" /> Volver al evento
        </Button>

        <Card className="w-full bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Editar Evento</CardTitle>
            <CardDescription className="text-gray-400">Modifica los detalles de tu evento</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">

              {/* --- Sección Nombre --- */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-200 flex items-center">
                  Nombre del Evento
                  <Tooltip content="ℹ️ Ingresa el nombre oficial del evento">
                    <HelpCircle className="w-4 h-4 ml-1" />
                  </Tooltip>
                </Label>
                <Input id="name" name="name" defaultValue={event.name} required maxLength="25" className="bg-gray-700 border-gray-600 text-white placeholder-gray-400" />
              </div>

              {/* --- Sección Tipo de Evento (Switch) --- */}
              <div className="space-y-2 flex flex-col justify-end">
                <div className="flex items-center justify-between bg-gray-700 p-2 rounded-lg border border-gray-600">
                  <Label htmlFor="is_periodic" className="text-gray-200 flex items-center cursor-pointer">
                    <Repeat className="w-4 h-4 mr-2 text-blue-400" />
                    ¿Es un evento periódico?
                    <Tooltip content="Activa esto si el evento se repite semanalmente (ej: todos los sábados)">
                      <HelpCircle className="w-4 h-4 ml-1 text-gray-400" />
                    </Tooltip>
                  </Label>
                  <Switch
                    id="is_periodic"
                    checked={isPeriodic}
                    onCheckedChange={setIsPeriodic}
                  />
                </div>
              </div>

              {/* --- Sección Fechas --- */}
              <div className={`space-y-2 ${!isPeriodic ? "md:col-span-2" : "md:col-span-1"}`}>
                <Label htmlFor="date" className="text-gray-200 flex items-center">
                  {isPeriodic ? "Fecha de Inicio" : "Fecha del Evento"}
                  <Tooltip content="ℹ️ Fecha de inicio o fecha única del evento.">
                    <HelpCircle className="w-4 h-4 ml-1" />
                  </Tooltip>
                </Label>
                <Input type="date" id="date" name="date" value={date} onChange={handleDateChange} required className="bg-gray-700 border-gray-600 text-white" />
              </div>

              {/* Si es periódico, mostramos la fecha de fin y selector de días */}
              {isPeriodic && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="recurrence_end_date" className="text-gray-200 flex items-center">
                      Fecha de Fin (Opcional)
                      <Tooltip content="ℹ️ Hasta cuándo se repetirá el evento. Si se deja vacío, será indefinido.">
                        <HelpCircle className="w-4 h-4 ml-1" />
                      </Tooltip>
                    </Label>
                    <Input
                      type="date"
                      id="recurrence_end_date"
                      value={recurrenceEndDate}
                      onChange={(e) => setRecurrenceEndDate(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2 bg-gray-700/30 p-3 rounded-lg border border-gray-600 border-dashed">
                    <Label className="text-gray-200 flex items-center mb-2">
                      Días de repetición
                      <Tooltip content="Selecciona el día de la semana que ocurre el evento.">
                        <HelpCircle className="w-4 h-4 ml-1" />
                      </Tooltip>
                    </Label>
                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                      {DAYS_OF_WEEK.map((day) => (
                        <button
                          key={day.id}
                          type="button"
                          onClick={() => toggleDay(day.id)}
                          className={`
                            px-3 py-2 rounded-md text-sm font-medium transition-all
                            ${periodicity === day.id
                              ? 'bg-blue-600 text-white border-blue-500 shadow-lg scale-105'
                              : 'bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600'}
                          `}
                        >
                          {day.label}
                        </button>
                      ))}
                    </div>
                    {periodicity === null && (
                      <p className="text-xs text-red-400 mt-1">Selecciona un día.</p>
                    )}
                  </div>
                </>
              )}

              {/* --- Resto de Campos --- */}
              <div className="space-y-2">
                <Label htmlFor="place" className="text-gray-200 flex items-center">
                  Lugar
                  <Tooltip content="ℹ️ Ubicación del evento">
                    <HelpCircle className="w-4 h-4 ml-1" />
                  </Tooltip>
                </Label>
                <Input id="place" name="place" defaultValue={event.place} required maxLength="25" className="bg-gray-700 border-gray-600 text-white placeholder-gray-400" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity" className="text-gray-200 flex items-center">
                  Capacidad {isPeriodic ? "por fecha" : "Total"}
                  <Tooltip content="ℹ️ Capacidad máxima de tickets a vender.">
                    <HelpCircle className="w-4 h-4 ml-1" />
                  </Tooltip>
                </Label>
                <Input id="capacity" name="capacity" type="number" defaultValue={event.capacity} min="0" className="bg-gray-700 border-gray-600 text-white placeholder-gray-400" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact" className="text-gray-200 flex items-center">
                  Contacto
                  <Tooltip content="ℹ️ Número de WhatsApp (sin espacios)">
                    <HelpCircle className="w-4 h-4 ml-1" />
                  </Tooltip>
                </Label>
                <Input id="contact" name="contact" defaultValue={event.contact} type="number" maxLength="11" className="bg-gray-700 border-gray-600 text-white placeholder-gray-400" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_address" className="text-gray-200 flex items-center">
                  Logo (URL)
                  <Tooltip content="ℹ️ URL de la imagen del evento">
                    <HelpCircle className="w-4 h-4 ml-1" />
                  </Tooltip>
                </Label>
                <Input id="image_address" name="image_address" defaultValue={event.image_address} maxLength="500" className="bg-gray-700 border-gray-600 text-white placeholder-gray-400" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password_employee" className="text-gray-200 flex items-center">
                  Contraseña Empleados
                  <Tooltip content="ℹ️ Deja vacío si no quieres cambiarla">
                    <HelpCircle className="w-4 h-4 ml-1" />
                  </Tooltip>
                </Label>
                <Input id="password_employee" name="password_employee" placeholder="Nueva contraseña (opcional)" maxLength="25" className="bg-gray-700 border-gray-600 text-white placeholder-gray-400" />
              </div>

              <div className="space-y-2 flex flex-col justify-end">
                <div className="flex items-center justify-between bg-gray-700 p-2 rounded-lg border border-gray-600">
                  <Label htmlFor="dni_required" className="text-gray-200 flex items-center cursor-pointer">
                    <Repeat className="w-4 h-4 mr-2 text-blue-400" />
                    ¿Requerir DNI?
                    <Tooltip content="ℹ️ Obligatorio para los compradores">
                      <HelpCircle className="w-4 h-4 ml-1" />
                    </Tooltip>
                  </Label>
                  <Switch
                    id="dni_required"
                    checked={requireDNI}
                    onCheckedChange={setRequireDNI}
                  />
                </div>
                <Input type="hidden" name="dni_required" value={requireDNI} />
              </div>

              {/* --- Sección Ticket Tags --- */}
              <div className="space-y-2 md:col-span-2 mt-4 pt-4 border-t border-gray-700">
                <Label className="text-gray-200 flex items-center text-lg font-semibold">
                  Ticket Tags
                  <Tooltip content="Gestiona los tipos de entradas, precios y comisiones.">
                    <HelpCircle className="w-4 h-4 ml-1" />
                  </Tooltip>
                </Label>

                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    <Input
                      value={tagName}
                      onChange={(e) => setTagName(e.target.value)}
                      placeholder="Nombre"
                      maxLength="25"
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 text-sm"
                    />
                    <Input
                      value={tagPrice}
                      onChange={(e) => setTagPrice(e.target.value)}
                      placeholder="Precio ($)"
                      type="number"
                      step="100"
                      max="99999999"
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 text-sm"
                    />
                    <Input
                      value={tagCommission}
                      onChange={(e) => setTagCommission(e.target.value)}
                      placeholder="Comisión ($)"
                      type="number"
                      step="0.01"
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 text-sm"
                    />
                    <Button
                      type="button"
                      onClick={addTicketTag}
                      className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                    >
                      <span className="hidden sm:inline">Agregar</span>
                      <span className="sm:hidden">+</span>
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
                    {ticketTags.map((tag, index) => (
                      <div
                        key={index}
                        className="bg-gray-700 text-white p-3 rounded-lg border border-gray-600 hover:border-gray-500 transition-all flex flex-col justify-between"
                      >
                        <div className="space-y-1 flex-1">
                          <div className="font-semibold text-white text-sm sm:text-base break-words flex justify-between">
                            {tag.name}
                            {tag.id && <span className="text-xs text-gray-500">#{tag.id}</span>}
                          </div>
                          <div className="text-gray-300 text-xs sm:text-sm">
                            Precio: <span className="text-green-400 font-semibold">${parseFloat(tag.price).toFixed(2)}</span>
                          </div>
                          <div className="text-gray-300 text-xs sm:text-sm">
                            Comisión: <span className="text-yellow-400 font-semibold">
                              ${tag.commission_per_ticket ? parseFloat(tag.commission_per_ticket).toFixed(2) : "0.00"}
                            </span>
                          </div>
                        </div>

                        <div className="flex space-x-2 mt-3 pt-2 border-t border-gray-600">
                          <button
                            type="button"
                            onClick={() => openEditTagDialog(index)}
                            className="flex-1 text-gray-400 hover:text-blue-400 p-1 flex justify-center rounded hover:bg-gray-600 transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => openDeleteTagDialog(index)}
                            className="flex-1 text-gray-400 hover:text-red-400 p-1 flex justify-center rounded hover:bg-gray-600 transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {error && (
                <Alert variant="destructive" className="md:col-span-2">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white mt-4">
                Guardar Cambios
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col items-stretch border-t border-gray-700 pt-6 mt-2">
            <Label className="text-red-400 mb-2 text-center">Zona de Peligro</Label>
            <Button onClick={() => setIsDeleteDialogOpen(true)} variant="destructive" className="w-full">
              Eliminar Evento
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* --- DIÁLOGOS --- */}

      {/* Diálogo Eliminar Evento */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-gray-800 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación del Evento</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. Por favor, ingrese el siguiente código para confirmar:
              <span className="font-bold text-red-500 ml-2">{deleteConfirmationCode}</span>
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

      {/* Diálogo Eliminar Tag */}
      <Dialog open={isDeleteTagDialogOpen} onOpenChange={setIsDeleteTagDialogOpen}>
        <DialogContent className="bg-gray-800 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle>Advertencia</DialogTitle>
            <DialogDescription className="text-gray-400">
              Los tickets vendidos con esta etiqueta <strong>no serán borrados</strong>.
              <br className="mb-2" />
              Sin embargo, los vendedores ya no podrán generar nuevos tickets de esta categoría.
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

      {/* Diálogo Editar Tag */}
      {ticketTags.length > 0 && ticketTags[tagToEdit] && (
        <Dialog open={isEditTagDialogOpen} onOpenChange={setIsEditTagDialogOpen}>
          <DialogContent className="bg-gray-800 text-white border-gray-700">
            <DialogHeader>
              <DialogTitle>Editar Ticket Tag</DialogTitle>
              <DialogDescription className="text-gray-400">
                Modifica los detalles. Los cambios afectarán a futuras ventas.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditTag} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name" className="text-gray-200">Nombre</Label>
                <Input id="edit-name" name="name" defaultValue={ticketTags[tagToEdit].name} required maxLength="25" className="bg-gray-700 border-gray-600 text-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-price" className="text-gray-200">Precio ($)</Label>
                <Input id="edit-price" name="price" defaultValue={ticketTags[tagToEdit].price} type="number" step="0.01" required className="bg-gray-700 border-gray-600 text-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-commission" className="text-gray-200">Comisión ($)</Label>
                <Input
                  id="edit-commission"
                  name="commission"
                  defaultValue={ticketTags[tagToEdit].commission_per_ticket || 0}
                  type="number"
                  step="0.01"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <DialogFooter>
                <Button type="button" onClick={() => setIsEditTagDialogOpen(false)} variant="outline" className="bg-gray-700 text-white hover:bg-gray-600">
                  Cancelar
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Guardar Cambios
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}