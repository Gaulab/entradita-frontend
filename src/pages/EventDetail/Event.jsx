// entradaFront/src/pages/EventDetail/Event.jsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Progress } from '../../components/ui/progress';
import { Button } from '../../components/ui/button';
import { CalendarDaysIcon, DollarSign, LucideShoppingCart, MapPin, Monitor, TicketSlashIcon } from 'lucide-react';

export default function Event({ event }) {
  const tickets_sold = event.tickets_counter === 0 ? 1 : event.tickets_counter;
  const percentage = (event.tickets_scanned / tickets_sold) * 100;

  const navigateToEconomy = () => {
    window.location.href = `/event/${event.id}/economy`;
  };

  const navigateToWebPage = () => {
    window.location.href = `/event-page/${event.id}`;
  };

  const navigateToGuide = () => {
    window.location.href = `/event/${event.id}/guide`;
  };
  const navigateToOnlineSell = () => {
    window.location.href = `/event/${event.id}/purchase-config`;
  };

  const navigateToWhatsapp = () => {
    window.location.href = `https://wa.me/543482275737?text=Hola!%20Necesito%20ayuda%20con%20el%20evento%20${event.name.split(' ').join('%20')}`;
  };

  return (
    <Card className="bg-gray-800 border-gray-700 mb-4">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-center mb-0">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-700 mr-4">
            <img src={event.image_address} alt="Event Logo" className="w-full h-full object-cover" />
          </div>
          <CardTitle className="text-xl font-bold text-white">{event.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 ">
          <p className="text-gray-200 flex flex-row items-center">
            <CalendarDaysIcon className="h-5 mr-1" />
            Fecha:<span className="text-white ml-2">{event.date}</span>
          </p>
          <p className="text-gray-200 flex flex-row items-center">
            <MapPin className="h-5 mr-1" />
            Lugar:<span className="text-white ml-2">{event.place}</span>
          </p>

          <p className="text-gray-200 flex flex-row items-center">
            <TicketSlashIcon className="h-5 mr-1" />
            Capacidad:<span className="text-white ml-2"> {event.capacity ? event.capacity : 'Ilimitada'}</span>
          </p>
          <p className="text-gray-200 flex flex-row items-center">
            <LucideShoppingCart className="h-5 mr-1" />
            Vendidos:<span className="text-white ml-2">{event.tickets_counter}</span>
          </p>
        </div>
      </CardContent>
      <CardContent>
        <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:flex-wrap">
          <Button onClick={navigateToWebPage} className="font-bold sm:mr-2 sm:mb-2 bg-indigo-600 hover:bg-indigo-700 hover:text-white text-white sm:min-w-48 sm:w-min border hover:border-indigo-600">
            <Monitor className="mr-2 h-4 w-4" /> Página WEB
          </Button>
          <Button onClick={navigateToEconomy} className="font-bold sm:mr-2 bg-green-600 hover:bg-green-700 hover:text-white text-white sm:min-w-48 sm:w-min border hover:border-green-600" new>
            <DollarSign className="mr-2 h-4 w-4" /> Economía
          </Button>
          {/* <Button onClick={navigateToWhatsapp} className="sm:mr-2 bg-gray-700 hover:bg-gray-600  hover:text-white text-white sm:min-w-48 sm:w-min">
            <User2Icon className="mr-2 h-4 w-4" /> Soporte rápido
          </Button> */}
          {/* <Button onClick={navigateToOnlineSell} className="font-bold sm:mr-2 bg-gray-600 hover:bg-yellow-600 hover:text-white text-white sm:min-w-48 sm:w-min border hover:border-yellow-500" soon>
            <ShoppingCartIcon className="mr-2 h-4 w-4" /> Venta online
          </Button> */}
          {/* <Button onClick={navigateToGuide} disabled className="sm:mr-2 bg-gray-700 hover:bg-gray-600 hover:text-white text-white sm:min-w-48 sm:w-min">
            <BookMarkedIcon className="mr-2 h-4 w-4" /> Guias de uso
          </Button> */}
        </div>
      </CardContent>
      <CardContent>
        <div className="space-y-2">
          <div className="relative">
            <Progress value={86} className="h-4 bg-gray-800  border border-gray-500" />
            <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{ width: `${86}%` }} />
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>85%</span>
            <span>{event.tickets_scanned} personas ingresaron al evento</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
