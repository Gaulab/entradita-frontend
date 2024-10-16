import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { PlusIcon, SearchIcon } from "lucide-react";

export default function EventDetails() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("tickets");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;

  const [event, setEvent] = useState({
    id: id,
    nombre: "Concierto de Rock",
    fecha: "2024-07-15",
    lugar: "Estadio Nacional",
    capacidad: 1000,
    vendidos: 750,
  });

  const [tickets, setTickets] = useState(
    Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      nombre: `Asistente ${i + 1}`,
      dni: `${10000000 + i}`,
      vendedor: `Vendedor${(i % 5) + 1}`,
    }))
  );

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

  const filteredTickets = tickets.filter(ticket =>
    ticket.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.dni.includes(searchTerm)
  );

  const pageCount = Math.ceil(filteredTickets.length / itemsPerPage);
  const paginatedTickets = filteredTickets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6 pb-8 bg-gray-900 text-white p-4 w-screen min-h-screen">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-2xl">{event.nombre}</CardTitle>
          <CardDescription className="text-gray-400">ID del Evento: {event.id}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400">Fecha: <span className="text-white">{event.fecha}</span></p>
              <p className="text-gray-400">Lugar: <span className="text-white">{event.lugar}</span></p>
            </div>
            <div>
              <p className="text-gray-400">Capacidad: <span className="text-white">{event.capacidad}</span></p>
              <p className="text-gray-400">Tickets Vendidos: <span className="text-white">{event.vendidos}</span></p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
          <TabsTrigger value="vendedores">Vendedores</TabsTrigger>
          <TabsTrigger value="escaners">Escáneres</TabsTrigger>
        </TabsList>
        <TabsContent value="tickets">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Tickets</CardTitle>
              <CardDescription className="text-gray-400">Gestiona los tickets para este evento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <Button onClick={handleGenerarTicket} className="w-auto bg-blue-600 hover:bg-blue-700 text-white">
                  <PlusIcon className="mr-2 h-4 w-4" /> Generar Nuevo Ticket
                </Button>
                <div className="relative">
                  <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Buscar por nombre o DNI"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
              </div>
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
                    {paginatedTickets.map(ticket => (
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
              <div className="flex justify-between items-center mt-4">
                <Button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="bg-gray-700 text-white"
                >
                  Anterior
                </Button>
                <span className="text-gray-400">
                  Página {currentPage} de {pageCount}
                </span>
                <Button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
                  disabled={currentPage === pageCount}
                  className="bg-gray-700 text-white"
                >
                  Siguiente
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="vendedores">
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
        </TabsContent>
        <TabsContent value="escaners">
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
        </TabsContent>
      </Tabs>
    </div>
  );
}