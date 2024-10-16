import { Link, useParams } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { PlusIcon } from "lucide-react";
import { useState } from 'react';

export default function EventDetails() {
  const { id } = useParams();
  const [tickets, setTickets] = useState([
    { id: 1, nombre: 'Juan Pérez', dni: '12345678', vendedor: 'Admin' },
    { id: 2, nombre: 'María García', dni: '87654321', vendedor: 'Vendedor1' },
  ]);

  const [vendedores, setVendedores] = useState([
    { id: 1, nombre: 'Vendedor1', enlace: `${id}/vender/1` },
    { id: 2, nombre: 'Vendedor2', enlace: `${id}/vender/2` },
  ]);

  const [escaners, setEscaners] = useState([
    { id: 1, nombre: 'Escaner1', enlace: `${id}/escanear/1` },
    { id: 2, nombre: 'Escaner2', enlace: `${id}/escanear/2` },
  ]);

  const handleGenerarTicket = () => {
    console.log('Generando nuevo ticket');
  };

  const handleEliminarTicket = (id) => {
    setTickets(tickets.filter(ticket => ticket.id !== id));
  };

  return (
    <div className="space-y-6 pb-8 bg-gray-900 text-white p-4 w-screen">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Detalles del Evento</CardTitle>
          <CardDescription className="text-gray-400">ID del Evento: {id}</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Aquí irían más detalles del evento */}
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Tickets</CardTitle>
          <CardDescription className="text-gray-400">Gestiona los tickets para este evento</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleGenerarTicket} className="mb-4 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
            <PlusIcon className="mr-2 h-4 w-4" /> Generar Nuevo Ticket
          </Button>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">ID</TableHead>
                  <TableHead className="text-gray-300">Nombre</TableHead>
                  <TableHead className="text-gray-300">DNI</TableHead>
                  <TableHead className="text-gray-300">Vendedor</TableHead>
                  <TableHead className="text-gray-300 text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.map(ticket => (
                  <TableRow key={ticket.id} className="border-gray-700">
                    <TableCell className="font-medium text-white">{ticket.id}</TableCell>
                    <TableCell className="text-gray-300">{ticket.nombre}</TableCell>
                    <TableCell className="text-gray-300">{ticket.dni}</TableCell>
                    <TableCell className="text-gray-300">{ticket.vendedor}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="destructive" onClick={() => handleEliminarTicket(ticket.id)} size="sm">
                        Eliminar
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
          <CardTitle className="text-white">Enlaces para Vendedores</CardTitle>
          <CardDescription className="text-gray-400">Gestiona los enlaces para vendedores</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="mb-4 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
            <Link to={`/eventos/${id}/crear-enlace?tipo=vendedor`}>
              <PlusIcon className="mr-2 h-4 w-4" /> Crear Nuevo Enlace para Vendedor
            </Link>
          </Button>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">Nombre</TableHead>
                  <TableHead className="text-gray-300">Enlace</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendedores.map(vendedor => (
                  <TableRow key={vendedor.id} className="border-gray-700">
                    <TableCell className="text-gray-300">{vendedor.nombre}</TableCell>
                    <TableCell>
                      <Link to={`/eventos/${vendedor.enlace}`} className="text-blue-400 hover:text-blue-300 break-all">
                        {`https://tudominio.com/eventos/${vendedor.enlace}`}
                      </Link>
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
          <CardTitle className="text-white">Enlaces para Escáneres</CardTitle>
          <CardDescription className="text-gray-400">Gestiona los enlaces para escáneres</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="mb-4 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
            <Link to={`/eventos/${id}/crear-enlace?tipo=escaner`}>
              <PlusIcon className="mr-2 h-4 w-4" /> Crear Nuevo Enlace para Escáner
            </Link>
          </Button>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">Nombre</TableHead>
                  <TableHead className="text-gray-300">Enlace</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {escaners.map(escaner => (
                  <TableRow key={escaner.id} className="border-gray-700">
                    <TableCell className="text-gray-300">{escaner.nombre}</TableCell>
                    <TableCell>
                      <Link to={`/eventos/${escaner.enlace}`} className="text-blue-400 hover:text-blue-300 break-all">
                        {`https://tudominio.com/eventos/${escaner.enlace}`}
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}