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
        alert("Error al obtener eventos");
      }
    };

    if (authToken.access) {
      fetchEvents(); // Llamar a la función para obtener eventos
    }
  }, [authToken.access]); // Dependencia del authToken para que se recargue si cambia

  return (
    <div className="min-h-screen w-screen p-4 bg-gray-900 text-gray-100 ">
      <div className="max-w-4xl mx-auto  w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button onClick={logoutUser} variant="entraditaTertiary" >
            <LogOutIcon className="mr-2 h-4 w-4" /> Cerrar Sesión
          </Button>
        </div>

        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-xl text-white">Resumen de eventos</CardTitle>
              <CardDescription className="text-gray-400">Vista general de tus eventos actuales</CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <Button to="/create-event" variant="entraditaSecondary">
              <PlusIcon className="mr-1 h-4 w-4" /> New event
            </Button>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700 text-center">
                    <TableHead className="text-gray-300 ">Nombre</TableHead>
                    <TableHead className="text-gray-300 hidden sm:table-cell">Fecha</TableHead>
                    <TableHead className="text-gray-300 hidden md:table-cell">Ubicación</TableHead>
                    <TableHead className="text-gray-300 hidden md:table-cell">Tickets Vendidos</TableHead>
                    <TableHead className="text-gray-300">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => (
                    <TableRow key={event.id} className="border-gray-700 text-center">
                      <TableCell className="text-white">{event.name}</TableCell>
                      <TableCell className="text-gray-300 hidden sm:table-cell">{event.date}</TableCell>
                      <TableCell className="text-gray-300 hidden md:table-cell">{event.place}</TableCell>
                      <TableCell className="text-gray-300 hidden md:table-cell">{event.tickets_counter}</TableCell>
                      <TableCell>
                        <Button variant="entraditaSecondary" to={`/event/${event.id}/details/`}>
                            <Eye className="mr-2 h-4 w-4" /> detalles
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
