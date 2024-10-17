import { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { LogOutIcon, PlusIcon } from "lucide-react";
import AuthContext from '../context/AuthContext';

export default function Dashboard() {
  const { logoutUser, authToken } = useContext(AuthContext);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const getEvents = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/events/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken.access}`
          },
        });
        const data = await response.json();
        if (response.ok) {
          setEvents(data);
        } else {
          throw new Error('Error al obtener eventos');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error al obtener eventos');
      }
    };
    getEvents();
  }, [authToken.access]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8 w-full">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button onClick={logoutUser} variant="outline" className="bg-gray-800 text-white hover:bg-gray-700">
            <LogOutIcon className="mr-2 h-4 w-4" /> Cerrar Sesión
          </Button>
        </div>

        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-xl text-white">Resumen de Eventos</CardTitle>
              <CardDescription className="text-gray-400">Vista general de tus eventos actuales</CardDescription>
            </div>
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
              <Link to="/create-event">
                <PlusIcon className="mr-2 h-4 w-4" /> Crear Nuevo Evento
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Nombre del Evento</TableHead>
                    <TableHead className="text-gray-300 hidden md:table-cell">Fecha</TableHead>
                    <TableHead className="text-gray-300 hidden md:table-cell">Ubicación</TableHead>
                    <TableHead className="text-gray-300 hidden md:table-cell">Tickets Vendidos</TableHead>
                    <TableHead className="text-gray-300">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => (
                    <TableRow key={event.id} className="border-gray-700">
                      <TableCell className="font-medium text-white">{event.name}</TableCell>
                      <TableCell className="text-gray-300 hidden md:table-cell">{event.date}</TableCell>
                      <TableCell className="text-gray-300 hidden md:table-cell">{event.place}</TableCell>
                      <TableCell className="text-gray-300 hidden md:table-cell">{event.tickets_counter}</TableCell>
                      <TableCell>
                        <Button asChild variant="link" className="p-0 text-blue-400 hover:text-blue-300">
                          <Link to={`/event-details/${event.id}`} state={{ event }}>Ver Detalles</Link>
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