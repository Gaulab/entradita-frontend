// entraditaFront/src/pages/Dashboard.jsx
// react imports
import { useState, useEffect } from 'react';
// Components
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// Icons
import { LogOutIcon, PlusIcon, Eye } from 'lucide-react';

export default function Dashboard() {
  const [events, setEvents] = useState([
    { id: 1, name: 'Concierto de Rock', date: '2025-02-15', place: 'Estadio Principal', tickets_counter: 150 },
    { id: 2, name: 'Festival de Jazz', date: '2025-03-10', place: 'Teatro Municipal', tickets_counter: 200 },
    { id: 3, name: 'Exposición de Arte', date: '2025-04-05', place: 'Galería Nacional', tickets_counter: 50 }
  ]);
  const [ticket_limit, setTicketLimit] = useState(500);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Simulación de carga
    setIsLoading(false); // Aquí podrías agregar un timeout si quieres simular la carga
  }, []);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="min-h-screen w-screen p-4 bg-gray-900 text-gray-100 ">
      <div className="max-w-6xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          <Button onClick={() => alert('Cerrar sesión')} variant="entraditaTertiary" className="w-full sm:w-auto">
            <LogOutIcon className="mr-2 h-4 w-4" /> Cerrar Sesión
          </Button>
        </div>

        <Card className="bg-gray-800 border-gray-700 mb-4 flex flex-row items-center p-4">
          <img src="/isotipoWhite.png" alt="Ticket" className="w-10 sm:w-16 mr-2 p-0" />
          <CardTitle className="text-white text-xl sm:text-2xl text-left mr-2">Tickets disponibles </CardTitle>
          <CardContent className="items-center p-0">
            <p className="text-2xl sm:text-3xl text-blue-200 font-bold">{ticket_limit}</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Tus eventos</CardTitle>
            <CardDescription className="text-gray-400">Administra tus eventos</CardDescription>
          </CardHeader>
          <CardContent>
            <Button to="/create-event" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
              <PlusIcon className="mr-1 h-4 w-4" />
              Nuevo evento
            </Button>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700 text-left">
                    <TableHead className="text-gray-300">Nombre</TableHead>
                    <TableHead className="text-gray-300 hidden sm:table-cell">Fecha</TableHead>
                    <TableHead className="text-gray-300 hidden md:table-cell">Ubicación</TableHead>
                    <TableHead className="text-gray-300 hidden md:table-cell">Tickets Vendidos</TableHead>
                    <TableHead className="text-gray-300 text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => (
                    <TableRow key={event.id} className="border-gray-700 text-left">
                      <TableCell className="text-white">{event.name}</TableCell>
                      <TableCell className="text-gray-300 hidden sm:table-cell">{event.date}</TableCell>
                      <TableCell className="text-gray-300 hidden md:table-cell">{event.place}</TableCell>
                      <TableCell className="text-gray-300 hidden md:table-cell">{event.tickets_counter}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="entraditaSecondary" to={`/event/${event.id}/details/`} title="Ver detalles">
                          <Eye className="mr-2 h-4 w-4" /> Ver
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
