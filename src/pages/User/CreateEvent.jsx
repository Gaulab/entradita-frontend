// entradaFront/src/pages/CreateEvent.jsx

// React and Router
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
// UI Components
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Button } from '../../components/ui/button';
import { Switch } from '../../components/ui/switch';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Tooltip } from '../../components/ui/tooltip';
// Context
import AuthContext from '../../context/AuthContext';
// API
import { createEvent } from '../../api/eventApi';
// ICONS
import { ArrowLeftIcon, HelpCircle, X, CalendarDays, Repeat } from 'lucide-react';

const DAYS_OF_WEEK = [
  { id: 0, label: 'Lun', full: 'Lunes' },
  { id: 1, label: 'Mar', full: 'Martes' },
  { id: 2, label: 'Mié', full: 'Miércoles' },
  { id: 3, label: 'Jue', full: 'Jueves' },
  { id: 4, label: 'Vie', full: 'Viernes' },
  { id: 5, label: 'Sáb', full: 'Sábado' },
  { id: 6, label: 'Dom', full: 'Domingo' },
];

export default function CreateEvent() {
  // Estados existentes
  const [requireDNI, setRequireDNI] = useState(false);
  const [ticketTags, setTicketTags] = useState([]);
  const [tagName, setTagName] = useState('');
  const [tagPrice, setTagPrice] = useState('');
  const [tagCommission, setTagCommission] = useState('');
  const { authToken } = useContext(AuthContext);
  const [error, setError] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const navigate = useNavigate();

  // Nuevos estados para periodicidad
  const [isPeriodic, setIsPeriodic] = useState(false);
  const [periodicity, setPeriodicity] = useState(null); // Array de IDs de días
  const [recurrenceEndDate, setRecurrenceEndDate] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (ticketTags.length === 0) {
      setError('Debes agregar al menos un Ticket Tag.');
      setTimeout(() => setError(''), 5000);
      return;
    }

    // Validaciones extra para eventos periódicos
    if (isPeriodic && periodicity === null) {
      setError('Debes seleccionar un día de la semana para el evento periódico.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    const formData = new FormData(event.target);
    const selectedDate = new Date(formData.get('date') + 'T00:00:00');
    const currentDate = new Date(new Date().toISOString().split('T')[0] + 'T00:00:00');

    if (selectedDate < currentDate) {
      setError('La fecha de inicio no puede ser menor a la fecha actual.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    // Si hay fecha de fin, validamos que sea mayor a la de inicio
    if (isPeriodic && recurrenceEndDate) {
      const endDateObj = new Date(recurrenceEndDate + 'T00:00:00');
      if (endDateObj < selectedDate) {
        setError('La fecha de fin debe ser posterior a la fecha de inicio.');
        setTimeout(() => setError(''), 3000);
        return;
      }
    }

    const eventObject = Object.fromEntries(Array.from(formData.entries()).filter(([key, value]) => value !== ''));

    // Agregamos campos booleanos y arrays
    eventObject.dni_required = requireDNI;
    eventObject.ticket_tags = ticketTags;

    // Lógica de periodicidad para el backend
    eventObject.is_periodic = isPeriodic;
    if (isPeriodic) {
      // Convertimos el array [0, 2] a string "0,2"
      eventObject.periodicity = periodicity;
      if (recurrenceEndDate) {
        eventObject.recurrence_end_date = recurrenceEndDate;
      }
    }

    console.log('Evento a crear:', eventObject);

    try {
      await createEvent(eventObject, authToken.access);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error al crear el evento:', error.message);
      setError(error.message);
    }
  };

  const addTicketTag = () => {
    if (ticketTags.length < 6) {
      if (tagName && tagPrice && !isNaN(tagPrice)) {
        const commission = tagCommission && !isNaN(tagCommission) ? parseFloat(tagCommission) : 0;
        setTicketTags([...ticketTags, { name: tagName, price: parseFloat(tagPrice), commission_per_ticket: commission }]);
        setTagName('');
        setTagPrice('');
        setTagCommission('');
      }
    } else {
      setError('Solo puedes agregar hasta 6 Ticket Tags.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const removeTicketTag = (index) => {
    setTicketTags(ticketTags.filter((_, i) => i !== index));
  };

  const handleDateChange = (event) => {
    const inputDate = new Date(event.target.value);
    // Ajuste simple para evitar problemas de zona horaria al visualizar
    const offsetDate = new Date(inputDate.getTime() - 3 * 60 * 60 * 1000);
    setDate(offsetDate.toISOString().split('T')[0]);
  };

  const toggleDay = (dayId) => {
    if (periodicity === dayId) {
      setPeriodicity(null);
    } else {
      setPeriodicity(dayId);
    }
  };

  return (
    <div className="min-h-screen md:w-3/4 mx-auto p-4 bg-gray-900 text-gray-100 ">
      <div className="max-w-6xl mx-auto w-full flex flex-col items-center w-3/4">
        <Button onClick={() => navigate(`/dashboard`)} variant="entraditaTertiary" className="w-full mb-4">
          <ArrowLeftIcon className="mr-2 h-4 w-4" /> Volver al dashboard
        </Button>
        <Card className="w-full bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Crear Nuevo Evento</CardTitle>
            <CardDescription className="text-gray-400">Ingresa los detalles de tu nuevo evento</CardDescription>
          </CardHeader>
          <CardContent className="">
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">

              {/* --- Sección Nombre --- */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-200 flex items-center">
                  Nombre del Evento
                  <Tooltip content="ℹ️ Ingresa el nombre del evento">
                    <HelpCircle className="w-4 h-4 ml-1" />
                  </Tooltip>
                </Label>
                <Input id="name" name="name" maxLength="25" required className="bg-gray-700 border-gray-600 text-white placeholder-gray-400" />
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

              {/* --- Sección Fechas (Dinámica) --- */}
              <div className={`space-y-2 ${!isPeriodic ? "md:col-span-2" : "md:col-span-1"}`}>
                <Label htmlFor="date" className="text-gray-200 flex items-center">
                  {isPeriodic ? "Fecha de Inicio (Primera fecha)" : "Fecha del Evento"}
                  <Tooltip content="ℹ️ Cuándo comienza el evento.">
                    <HelpCircle className="w-4 h-4 ml-1" />
                  </Tooltip>
                </Label>
                <Input type="date" id="date" name="date" required className="bg-gray-700 border-gray-600 text-white" onChange={handleDateChange} />
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
                      <Tooltip content="Selecciona qué días de la semana ocurre el evento.">
                        <HelpCircle className="w-4 h-4 ml-1" />
                      </Tooltip>
                    </Label>
                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                      {DAYS_OF_WEEK.map((day) => (
                        <button
                          key={day.id}
                          type="button"
                          onClick={() => toggleDay(day.id)}
                          className={`px-3 py-2 rounded-md text-sm font-medium transition-all
                            ${periodicity === day.id
                              ? 'bg-blue-600 text-white border-blue-500 shadow-lg scale-105'
                              : 'bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600'}`}
                        >
                          {day.label}
                        </button>
                      ))}
                    </div>
                    {periodicity === null && (
                      <p className="text-xs text-red-400 mt-1">Selecciona un día de la semana.</p>
                    )}
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="place" className="text-gray-200 flex items-center">
                  Lugar
                  <Tooltip content="ℹ️ Ingresa el lugar en el que se realizara el evento.">
                    <HelpCircle className="w-4 h-4 ml-1" />
                  </Tooltip>
                </Label>
                <Input id="place" name="place" maxLength="25" required className="bg-gray-700 border-gray-600 text-white placeholder-gray-400" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity" className="text-gray-200 flex items-center">
                  Capacidad {isPeriodic ? "por fecha" : "Total"}
                  <Tooltip content="ℹ️ Cantidad máxima de tickets a vender.">
                    <HelpCircle className="w-4 h-4 ml-1" />
                  </Tooltip>
                </Label>
                <Input id="capacity" name="capacity" type="number" min="0" className="bg-gray-700 border-gray-600 text-white placeholder-gray-400" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact" className="text-gray-200 flex items-center">
                  Contacto
                  <Tooltip content="ℹ️ WhatsApp de contacto (opcional)">
                    <HelpCircle className="w-4 h-4 ml-1" />
                  </Tooltip>
                </Label>
                <Input id="contact" name="contact" type="number" maxLength="11" className="bg-gray-700 border-gray-600 text-white placeholder-gray-400" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_address" className="text-gray-200 flex items-center">
                  Dirección de la Imagen (Logo)
                  <Tooltip content="ℹ️ URL del logo del evento">
                    <HelpCircle className="w-4 h-4 ml-1" />
                  </Tooltip>
                </Label>
                <Input id="image_address" name="image_address" maxLength="500" className="bg-gray-700 border-gray-600 text-white placeholder-gray-400" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password_employee" className="text-gray-200 flex items-center">
                  Contraseña para Empleados
                  <Tooltip content=" ℹ️ Seguridad para empleados.">
                    <HelpCircle className="w-4 h-4 ml-1" />
                  </Tooltip>
                </Label>
                <Input id="password_employee" name="password_employee" required maxLength="25" className="bg-gray-700 border-gray-600 text-white placeholder-gray-400" />
              </div>

              <div className="space-y-2 flex flex-col justify-end">
                <div className="flex items-center justify-between bg-gray-700 p-2 rounded-lg border border-gray-600">
                  <Label htmlFor="is_periodic" className="text-gray-200 flex items-center cursor-pointer">
                    <Repeat className="w-4 h-4 mr-2 text-blue-400" />
                    ¿Requerir DNI?
                    <Tooltip content="ℹ️ Hacer que el DNI sea obligatorio para comprar tickets.">
                      <HelpCircle className="w-4 h-4 ml-1" />
                    </Tooltip>
                  </Label>
                  <Switch
                    id="dni_required"
                    checked={requireDNI}
                    onCheckedChange={setRequireDNI}
                  />
                </div>
              </div>

              {/* --- Sección Ticket Tags --- */}
              <div className="space-y-2 md:col-span-2 pt-4 border-t border-gray-700">
                <Label className="text-gray-200 flex items-center text-lg font-semibold">
                  Ticket Tags
                  <Tooltip content={`ℹ️ Categorías de tickets (VIP, General, etc).`}>
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
                      onClick={() => addTicketTag()}
                      className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:col-span-1 col-span-1"
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
                          <div className="font-semibold text-white text-sm sm:text-base break-words">
                            {tag.name}
                          </div>
                          <div className="text-gray-300 text-xs sm:text-sm">
                            Precio: <span className="text-green-400 font-semibold">${tag.price.toFixed(2)}</span>
                          </div>
                          {tag.commission_per_ticket > 0 && (
                            <div className="text-gray-300 text-xs sm:text-sm">
                              Comisión: <span className="text-yellow-400 font-semibold">${tag.commission_per_ticket.toFixed(2)}</span>
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeTicketTag(index)}
                          className="mt-2 text-gray-400 hover:text-red-400 p-1 w-full flex justify-center rounded hover:bg-gray-600 transition-colors"
                        >
                          <X size={16} className="sm:w-5 sm:h-5" />
                        </button>
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
                Crear Evento
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}