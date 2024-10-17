import { useState, useContext, useEffect, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../components/ui/dialog";
import { PlusIcon, SearchIcon, ArrowLeftIcon, EditIcon, EyeIcon, Trash2Icon } from "lucide-react";
import AuthContext from '../context/AuthContext';

export default function EventDetails() {
  // Get the event ID from the URL
  const { id } = useParams();
  const { authToken, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  // State variables
  const [event, setEvent] = useState({});
  const [tickets, setTickets] = useState([]);
  const [vendedores, setVendedores] = useState([]);
  const [escaners, setEscaners] = useState([]);
  const [reload, setReload] = useState(false);
  // Tabs state
  const [activeTab, setActiveTab] = useState("tickets");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newUrlName, setNewUrlName] = useState("");
  const [isSellerUrl, setIsSellerUrl] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const itemsPerPage = 10;

  const handleGenerarTicket = useCallback(() => {
  // Functions
  const handleGenerarTicket = () => {
    navigate(`/create-ticket/${id}`);
  }, []);

  const handleEliminarTicket = useCallback((id_ticket) => {
    setItemToDelete({ type: 'ticket', id: id_ticket });
    setDeleteConfirmOpen(true);
  }, []);

  const handleViewTicket = useCallback((ticketToken) => {
    window.open(`/ticket/${ticketToken}`, '_blank');
  }, []);

  const handleGenerarURL = useCallback((isSeller) => {
    setIsSellerUrl(isSeller);
    setIsDialogOpen(true);
  }, []);

  const handleConfirmGenerarURL = useCallback(() => {
    const createURL = async () => {
      const urlDetail = isSellerUrl ? 'seller' : 'escaner';
      const urlNumber = isSellerUrl ? vendedores.length + 1 : escaners.length + 1;
      const url = `https://entradita.com/events/${id}/${urlDetail}/${urlNumber}/`
      const response = await fetch(`http://localhost:8000/api/v1/events/${id}/urlAccess/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken.access}`
        },
        body: JSON.stringify({ is_seller: isSellerUrl, assigned_name: newUrlName, url: url })
      })
      const data = await response.json()
      if (response.status === 201) {
        if (isSellerUrl) {
          setVendedores([...vendedores, data])
        }
        else {
          setEscaners([...escaners, data])
        }
        setReload(!reload)
      }
      else {
        alert('Error al generar URL')
        console.log(data)
      }
    }
    createURL();
    setIsDialogOpen(false);
    setNewUrlName("");
  }, [authToken.access, vendedores, escaners, id, isSellerUrl, newUrlName]);

  const handleEliminarURL = useCallback((urlId, isSeller) => {
    setItemToDelete({ type: isSeller ? 'vendedor' : 'escaner', id: urlId });
    setDeleteConfirmOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (!itemToDelete) return;
    console.log('en funcion')

  
    const deleteItem = async () => {
      let response;
      if (itemToDelete.type === 'ticket') {
        response = await fetch(`http://localhost:8000/api/v1/events/${id}/tickets/${itemToDelete.id}/`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken.access}`
          },
        });
      } else {
        response = await fetch(`http://localhost:8000/api/v1/events/${id}/urlAccess/${itemToDelete.id}/`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken.access}`
          },
        });
      }
  
      if (response.status === 204) {
        if (itemToDelete.type === 'ticket') {
          setTickets(tickets.filter(ticket => ticket.id !== itemToDelete.id));
        } else if (itemToDelete.type === 'vendedor') {
          setVendedores(vendedores.filter(v => v.id !== itemToDelete.id));
        } else if (itemToDelete.type === 'escaner') {
          setEscaners(escaners.filter(e => e.id !== itemToDelete.id));
        }
        setReload(!reload);
      } else {
        data = await response.json();
        console.log(data);
        alert(`Error al eliminar ${itemToDelete.type}`);
      }
    };
  
    deleteItem();
    setDeleteConfirmOpen(false);
    setItemToDelete(null);
  }, [authToken.access, id, itemToDelete, tickets, vendedores, escaners]);
  

  const handleEditEvent = () => {
    navigate(`/edit-event/${id}`);
  };

  const filteredTickets = tickets.filter(ticket =>
    ticket.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.dni.includes(searchTerm)
  );

  const pageCount = Math.ceil(filteredTickets.length / itemsPerPage);
  const paginatedTickets = filteredTickets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    const getEventData = async () => {
      const response = await fetch(`http://localhost:8000/api/v1/eventData/${id}/tickets/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken.access}`
        },
      })
      const data = await response.json()
      if (response.status === 200) {
        setEvent(data.event)
        setTickets(data.tickets)
        setVendedores(data.vendedores)
        setEscaners(data.escaners)
      }
      else {
        alert('Error al obtener datos del evento')
        logoutUser()
      }
    }
    getEventData();
  }, [reload, authToken.access, id, logoutUser]);

  return (
    <div className="space-y-6 pb-8 bg-gray-900 text-white p-4 w-full min-h-screen ">
      <div className='max-w-6xl mx-auto'>
      <div className="flex justify-between items-center mb-8">
        <Button onClick={() => navigate('/dashboard')} variant="outline" className="bg-gray-800 text-white hover:bg-gray-700">
          <ArrowLeftIcon className="mr-2 h-4 w-4" /> Volver al Dashboard
        </Button>
        <Button onClick={handleEditEvent} variant="outline" className="bg-gray-800 text-white hover:bg-gray-700">
          <EditIcon className="mr-2 h-4 w-4" /> Editar Evento
        </Button>
      </div>

      <Card className="bg-gray-800 border-gray-700 mb-8">
        <CardHeader>
          <CardTitle className="text-white text-2xl">{event.name}</CardTitle>
          <CardDescription className="text-gray-400">ID del Evento: {id}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400">Fecha: <span className="text-white">{event.date}</span></p>
              <p className="text-gray-400">Lugar: <span className="text-white">{event.place}</span></p>
            </div>
            <div>
              <p className="text-gray-400">Capacidad: <span className="text-white">{(event.capacity !== 0) ? event.capacity : "Ilimitada"}</span></p>
              <p className="text-gray-400">Tickets Vendidos: <span className="text-white">{event.tickets_counter}</span></p>
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
                      <TableHead className="text-gray-300 hidden md:table-cell">ID</TableHead>
                      <TableHead className="text-gray-300">Nombre</TableHead>
                      <TableHead className="text-gray-300 hidden md:table-cell">DNI</TableHead>
                      <TableHead className="text-gray-300 hidden md:table-cell">Vendedor</TableHead>
                      <TableHead className="text-gray-300 text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedTickets.map((ticket, index) => (
                      <TableRow key={ticket.id} className="border-gray-700">
                        <TableCell className="font-medium text-white hidden md:table-cell">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                        <TableCell className="text-gray-300">{ticket.name + " " + ticket.surname}</TableCell>
                        <TableCell className="text-gray-300 hidden md:table-cell">{ticket.dni}</TableCell>
                        <TableCell className="text-gray-300 hidden md:table-cell">{ticket.seller}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="outline" onClick={() => handleViewTicket(ticket.qr_payload)} size="sm" title="Ver ticket">
                            <EyeIcon className="h-4 w-4" />
                            <span className="sr-only">Ver ticket</span>
                          </Button>
                          <Button variant="destructive" onClick={() => handleEliminarTicket(ticket.id)} size="sm" title="Eliminar ticket">
                            <Trash2Icon className="h-4 w-4" />
                            <span className="sr-only">Eliminar ticket</span>
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
              <Button onClick={() => handleGenerarURL(true)} className="mb-4 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
                <PlusIcon className="mr-2 h-4 w-4" /> Crear Nuevo Enlace para Vendedor
              </Button>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300">Nombre</TableHead>
                      <TableHead className="text-gray-300">Enlace</TableHead>
                      <TableHead  className="text-gray-300 text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vendedores.map(vendedor => (
                      <TableRow key={vendedor.id} className="border-gray-700">
                        <TableCell className="text-gray-300">{vendedor.assigned_name}</TableCell>
                        <TableCell>
                          <Link to={`${vendedor.url}`} className="text-blue-400 hover:text-blue-300 break-all">
                            {`${vendedor.url}`}
                          </Link>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="destructive" onClick={() => handleEliminarURL(vendedor.id, true)} size="sm" title="Eliminar enlace">
                            <Trash2Icon className="h-4 w-4" />
                            <span className="sr-only">Eliminar enlace</span>
                          </Button>
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
              <Button onClick={() => handleGenerarURL(false)} className="mb-4 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
                <PlusIcon className="mr-2 h-4 w-4" /> Crear Nuevo Enlace para Escáner
              </Button>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300">Nombre</TableHead>
                      <TableHead className="text-gray-300">Enlace</TableHead>
                      <TableHead className="text-gray-300 text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {escaners.map(escaner => (
                      <TableRow key={escaner.id} className="border-gray-700">
                        <TableCell className="text-gray-300">{escaner.assigned_name}</TableCell>
                        <TableCell>
                          <Link to={`${escaner.url}`} className="text-blue-400 hover:text-blue-300 break-all">
                            {`${escaner.url}`}
                          </Link>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="destructive" onClick={() => handleEliminarURL(escaner.id, false)} size="sm" title="Eliminar enlace">
                            <Trash2Icon className="h-4 w-4" />
                            <span className="sr-only">Eliminar enlace</span>
                          </Button>
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Asignar Nombre a la Nueva URL</DialogTitle>
            <DialogDescription>
              Ingrese un nombre para la nueva URL de {isSellerUrl ? "vendedor" : "escáner"}.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={newUrlName}
            onChange={(e) => setNewUrlName(e.target.value)}
            placeholder="Nombre para la URL"
            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
          />
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)} variant="outline" className="bg-gray-700 text-white hover:bg-gray-600">
              Cancelar
            </Button>
            <Button onClick={handleConfirmGenerarURL} className="bg-blue-600 hover:bg-blue-700 text-white">
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="bg-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar este {itemToDelete?.type}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setDeleteConfirmOpen(false)} variant="outline" className="bg-gray-700 text-white hover:bg-gray-600">
              Cancelar
            </Button>
            <Button onClick={handleConfirmDelete} variant="destructive">
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
}