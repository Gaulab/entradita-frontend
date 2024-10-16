
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { PlusIcon, LogOutIcon } from "lucide-react";
import { useState } from 'react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([
    { id: '1', name: 'Concierto de Rock', date: '2024-07-15', location: 'Estadio Nacional', ticketsSold: 500 },
    { id: '2', name: 'Festival de Jazz', date: '2024-08-20', location: 'Parque Central', ticketsSold: 250 },
    { id: '3', name: 'Obra de Teatro', date: '2024-09-10', location: 'Teatro Municipal', ticketsSold: 150 },
  ]);

  const handleLogout = () => {
    // Aquí iría la lógica para cerrar sesión
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8 w-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button onClick={handleLogout} variant="outline" className="bg-gray-800 text-white hover:bg-gray-700">
            <LogOutIcon className="mr-2 h-4 w-4" /> Cerrar Sesión
          </Button>
        </div>

        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-white">Resumen de Eventos</CardTitle>
            <CardDescription className="text-gray-400">Vista general de tus eventos actuales</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Nombre del Evento</TableHead>
                    <TableHead className="text-gray-300">Fecha</TableHead>
                    <TableHead className="text-gray-300">Ubicación</TableHead>
                    <TableHead className="text-gray-300">Tickets Vendidos</TableHead>
                    <TableHead className="text-gray-300">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => (
                    <TableRow key={event.id} className="border-gray-700">
                      <TableCell className="font-medium text-white">{event.name}</TableCell>
                      <TableCell className="text-gray-300">{event.date}</TableCell>
                      <TableCell className="text-gray-300">{event.location}</TableCell>
                      <TableCell className="text-gray-300">{event.ticketsSold}</TableCell>
                      <TableCell>
                        <Button asChild variant="link" className="text-blue-400 hover:text-blue-300">
                          <Link to={`/eventos/${event.id}`}>Ver Detalles</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl text-white">Acciones Rápidas</CardTitle>
            <CardDescription className="text-gray-400">Crea un nuevo evento o gestiona los existentes</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4 sm:flex-row sm:space-y-0  sm:space-x-4">
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
              <Link to="/eventos/crear">
                <PlusIcon className="mr-2 h-4 w-4" /> Crear Nuevo Evento
              </Link>
            </Button>
            <Button variant="outline" className="bg-gray-700 text-white hover:bg-gray-600">
              Gestionar Vendedores
            </Button>
            <Button variant="outline" className="bg-gray-700 text-white hover:bg-gray-600">
              Ver Estadísticas
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}