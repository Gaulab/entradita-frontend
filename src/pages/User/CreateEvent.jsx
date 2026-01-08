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
import { ArrowLeftIcon, HelpCircle, X } from 'lucide-react';

export default function CreateEvent() {
  const [requireDNI, setRequireDNI] = useState(false);
  const [ticketTags, setTicketTags] = useState([]);
  const [tagName, setTagName] = useState('');
  const [tagPrice, setTagPrice] = useState('');
  const [tagCommission, setTagCommission] = useState('');
  const { authToken, user } = useContext(AuthContext);
  const [error, setError] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault(); // Evita el comportamiento predeterminado del formulario

    if (ticketTags.length === 0) {
      setError('Debes agregar al menos un Ticket Tag.');
      setTimeout(() => setError(''), 5000);
      return;
    }

    // Extrae los datos del formulario y construye el objeto del evento
    const formData = new FormData(event.target);
    const selectedDate = new Date(formData.get('date') + 'T00:00:00');
    const currentDate = new Date(new Date().toISOString().split('T')[0] + 'T00:00:00');
    if (selectedDate < currentDate) {
      setError('La fecha seleccionada no puede ser menor a la fecha actual.');
      setTimeout(() => setError(''), 3000);
      return;
    }
    const eventObject = Object.fromEntries(Array.from(formData.entries()).filter(([key, value]) => value !== ''));
    eventObject.dni_required = requireDNI; // Agrega el requerimiento de DNI al objeto
    eventObject.ticket_tags = ticketTags; // Agrega los TicketTags al objeto

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
      console.log('Ticket Tags actuales:', ticketTags);
    } else {
      setError('Solo puedes agregar hasta 6 Ticket Tags.');
      setTimeout(() => setError(''), 3000); // Limpia el error después de 3 segundos
    }
  };

  const removeTicketTag = (index) => {
    setTicketTags(ticketTags.filter((_, i) => i !== index));
  };

  const handleDateChange = (event) => {
    const inputDate = new Date(event.target.value);
    const offsetDate = new Date(inputDate.getTime() - 3 * 60 * 60 * 1000); // Ajuste a zona horaria -3
    setDate(offsetDate.toISOString().split('T')[0]); // Formato YYYY-MM-DD
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
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-200 flex items-center">
                  Nombre del Evento
                  <Tooltip content="ℹ️ Ingresa el nombre del evento">
                    <HelpCircle className="w-4 h-4 ml-1" />
                  </Tooltip>
                </Label>
                <Input id="name" name="name" maxLength="25" required className="bg-gray-700 border-gray-600 text-white placeholder-gray-400" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date" className="text-gray-200 flex items-center">
                  Fecha
                  <Tooltip content="ℹ️ Ingresa la fecha en la que se realizara el evento. Obligatorio, podras editarlo mas adelante">
                    <HelpCircle className="w-4 h-4 ml-1" />
                  </Tooltip>
                </Label>
                <Input type="date" id="date" name="date" required className="bg-gray-700 border-gray-600 text-white" onChange={handleDateChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="place" className="text-gray-200 flex items-center">
                  Lugar
                  <Tooltip content="ℹ️ Ingresa el lugar en el que se realizara el evento. Obligatorio, podras editarlo mas adelante">
                    <HelpCircle className="w-4 h-4 ml-1" />
                  </Tooltip>
                </Label>
                <Input id="place" name="place" maxLength="25" required className="bg-gray-700 border-gray-600 text-white placeholder-gray-400" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity" className="text-gray-200 flex items-center">
                  Capacidad
                  <Tooltip content="ℹ️ Esta capacidad sera la cantidad maxima de tickets que se podran vender para el evento. Si no se completa seran ilimitados, podra editarse mas adelante">
                    <HelpCircle className="w-4 h-4 ml-1" />
                  </Tooltip>
                </Label>
                <Input id="capacity" name="capacity" type="number" min="0" inputMode="numeric--" pattern="[0-9]*" className="bg-gray-700 border-gray-600 text-white placeholder-gray-400" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact" className="text-gray-200 flex items-center">
                  Contacto
                  <Tooltip content="ℹ️ Este es un numero de whatsapp para que las personas puedan contactar directamente para la compra de tickets, es opcional y se puede modificar luego. Ingresar el numero entero sin espacios ni caracteristica del país">
                    <HelpCircle className="w-4 h-4 ml-1" />
                  </Tooltip>
                </Label>
                <Input id="contact" name="contact" type="number" maxLength="11" className="bg-gray-700 border-gray-600 text-white placeholder-gray-400" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_address" className="text-gray-200 flex items-center">
                  Dirección de la Imagen (Logo)
                  <Tooltip content="ℹ️ Esta es la dirección de la imagen que se mostrara en los tickets y en la pagina del evento. No es obligatorio y puedes modificarla luego, si no sabes como obtener la dirección de una imagen puedes consultar con soporte">
                    <HelpCircle className="w-4 h-4 ml-1" />
                  </Tooltip>
                </Label>
                <Input id="image_address" name="image_address" maxLength="500" className="bg-gray-700 border-gray-600 text-white placeholder-gray-400" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password_employee" className="text-gray-200 flex items-center">
                  Contraseña para Empleados
                  <Tooltip content=" ℹ️ Esta contraseña es un metodo mas de seguridad para los empleados que trabajen en el evento. Obligatorio, podras editarlo mas adelante">
                    <HelpCircle className="w-4 h-4 ml-1" />
                  </Tooltip>
                </Label>
                <Input id="password_employee" name="password_employee" required maxLength="25" className="bg-gray-700 border-gray-600 text-white placeholder-gray-400" />
              </div>

              <div className="flex flex-col space-y-2">
                <Label htmlFor="dni_required" className="text-gray-200 flex items-center">
                  Requerir DNI
                  <Tooltip content="ℹ️ Si activas esta opción, para crear un ticket deberas ingresar el DNI el dueño del ticket al crearlo, ademas de su nombre y apellido. Obligatorio, no podra editarse luego">
                    <HelpCircle className="w-4 h-4 ml-1" />
                  </Tooltip>
                </Label>
                <Switch id="dni_required" checked={requireDNI} onCheckedChange={setRequireDNI} />
                <Input type="hidden" name="dni_required" value={requireDNI} />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label className="text-gray-200 flex items-center">
                  Ticket Tags
                  <Tooltip
                    content={`ℹ️ Estas son las categorias de tickets que se podran vender para el evento, podras agregar hasta 6 categorias y podras editarlas mas adelante. \nEjemplo de categorias: VIP, STAFF, General, etc. \nTambien puedes diferenciar tandas de tickets con categorias aqui, como 'Early Bird - General', 'Preventa - VIP', etc. \nSi necesitas mas categorias puedes contactar con soporte.`}
                  >
                    <HelpCircle className="w-4 h-4 ml-1" />
                  </Tooltip>
                </Label>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-2">
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
                      max="100"
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
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white">
                Crear Evento
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
