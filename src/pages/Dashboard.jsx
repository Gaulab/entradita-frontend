// Dependencies
import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
// Context
import AuthContext from "../context/AuthContext";
// Components
import { Button } from "../components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
// Icons
import { LogOutIcon, PlusIcon, Eye } from "lucide-react";
// API
import { getEvents } from "../api/eventApi";

export default function Dashboard() {
  const { logoutUser, authToken } = useContext(AuthContext);
  const [events, setEvents] = useState([]);

  // Get events on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents(authToken.access); // Usar la función importada
        setEvents(data); // Actualiza el estado con los eventos obtenidos
      } catch (error) {
        console.error("Error al obtener eventos:", error);
        alert(error.message);
      }
    };

    if (authToken.access) {
      fetchEvents(); // Llamar a la función para obtener eventos
    }
  }, [authToken.access]); // Dependencia del authToken para que se recargue si cambia

  return (
    <div className="min-h-screen w-screen p-4 bg-gray-900 text-gray-100 ">
      <div className="max-w-6xl mx-auto  w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button onClick={logoutUser} variant="entraditaTertiary" >
            <LogOutIcon className="mr-2 h-4 w-4" /> Cerrar Sesión
          </Button>
        </div>

        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Tus eventos</CardTitle>
            <CardDescription className="text-gray-400">Administra tus eventos</CardDescription>
          </CardHeader>
          <CardContent>
            <Button to="/create-event" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
              <PlusIcon className="mr-1 h-4 w-4" />Nuevo evento
            </Button>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700 text-left">
                    <TableHead className="text-gray-300 ">Nombre</TableHead>
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
                        <Button variant="entraditaSecondary" to={`/event/${event.id}/tickets/`} title="Ver detalles">
                            <Eye className="h-4 w-4" />
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
