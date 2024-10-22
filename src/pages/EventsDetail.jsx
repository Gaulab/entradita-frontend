import { useState, useContext, useEffect, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../components/ui/dialog";
import { PlusIcon, SearchIcon, ArrowLeftIcon, EditIcon, EyeIcon, Trash2Icon, PencilIcon, TicketX} from "lucide-react";
import { Label } from "../components/ui/label";
import AuthContext from '../context/AuthContext';

export default function EventDetails() {
  const { id } = useParams();
  const { authToken, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [event, setEvent] = useState({});
  const [tickets, setTickets] = useState([]);
  const [vendedores, setVendedores] = useState([]);
  const [escaners, setEscaners] = useState([]);
  const [reload, setReload] = useState(false);

  const [activeTab, setActiveTab] = useState("tickets");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newEmpleadoName, setNewEmpleadoName] = useState("");
  const [newEmpleadoCapacity, setNewEmpleadoCapacity] = useState("");
  const [isSellerEmpleado, setIsSellerEmpleado] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [editingEmpleado, setEditingEmpleado] = useState(null);
  
  const itemsPerPage = 10;

  useEffect(() => {
    const getEventData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/v1/events/${id}/details`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken.access}`
          },
        });
        const data = await response.json();
        console.log(data);
        if (response.status === 200) {
          setEvent(data.event);
          setTickets(data.tickets);
          setVendedores(data.vendedores);
          setEscaners(data.escaners);
        } else {
          alert('Error al obtener datos del evento');
          // logoutUser();
        }
      } catch (error) {
        console.error("Error fetching event data:", error);
        alert('Error al obtener datos del evento');
      }
    };
    getEventData();
  }, [reload, authToken.access, id, logoutUser]);

  const handleEditEvent = () => {
    navigate(`/edit-event/${id}`);
  };

  const handleGenerarTicket = useCallback(() => {
    navigate(`/event/${id}/create-ticket`);
  }, [id, navigate]);

  const handleEliminarTicket = useCallback((id_ticket) => {
    setItemToDelete({ type: 'ticket', id: id_ticket });
    setDeleteConfirmOpen(true);
  }, []);

  const handleViewTicket = useCallback((uuid) => {
    window.open(`/ticket/${uuid}`, '_blank');
  }, []);

  const handleGenerarEmpleado = useCallback((isSeller) => {
    setIsSellerEmpleado(isSeller);
    setIsDialogOpen(true);
  }, []);

  const handleConfirmGenerarEmpleado = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/employees/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken.access}`
        },
        body: JSON.stringify({
          is_seller: isSellerEmpleado,
          assigned_name: newEmpleadoName,
          seller_capacity: parseInt(newEmpleadoCapacity),
          event: id
        })
      });

      const data = await response.json();
      if (response.status === 201) {
        if (isSellerEmpleado) {
          setVendedores([...vendedores, data]);
        } else {
          setEscaners([...escaners, data]);
        }
        setReload(!reload);
      } else {
        alert('Error al generar empleado');
        console.log(data);
      }
    } catch (error) {
      console.error("Error creating empleado:", error);
      alert('Error al generar empleado');
    }

    setIsDialogOpen(false);
    setNewEmpleadoName("");
    setNewEmpleadoCapacity("");
  }, [authToken.access, id, isSellerEmpleado, newEmpleadoName, newEmpleadoCapacity, vendedores, escaners, reload]);

  const handleEditEmpleado = useCallback((empleado) => {
    setEditingEmpleado(empleado);
    setNewEmpleadoName(empleado.assigned_name);
    const capacity = empleado.seller_capacity !== null ? empleado.seller_capacity.toString() : "";
    setNewEmpleadoCapacity(capacity);
    setIsEditDialogOpen(true);
  }, []);

  const handleConfirmEditEmpleado = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/employees/${editingEmpleado.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken.access}`
        },
        body: JSON.stringify({
          assigned_name: newEmpleadoName,
          seller_capacity: parseInt(newEmpleadoCapacity),
        })
      });

      if (response.ok) {
        const updatedEmpleado = await response.json();
        if (editingEmpleado.is_seller) {
          setVendedores(vendedores.map(v => v.id === updatedEmpleado.id ? updatedEmpleado : v));
        } else {
          setEscaners(escaners.map(e => e.id === updatedEmpleado.id ? updatedEmpleado : e));
        }
        setReload(!reload);
      } else {
        alert('Error al actualizar empleado');
      }
    } catch (error) {
      console.error("Error updating empleado:", error);
      alert('Error al actualizar empleado');
    }

    setIsEditDialogOpen(false);
    setEditingEmpleado(null);
    setNewEmpleadoName("");
    setNewEmpleadoCapacity("");
  }, [authToken.access, editingEmpleado, newEmpleadoName, newEmpleadoCapacity, vendedores, escaners, reload]);

  const handleEliminarEmpleado = useCallback((empleado) => {
    setItemToDelete({ type: empleado.is_seller ? 'vendedor' : 'escaner', id: empleado.id, status: empleado.status });
    setDeleteConfirmOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!itemToDelete) return;

    try {
      let response;
      if (itemToDelete.type === 'ticket') {
        response = await fetch(`http://localhost:8000/api/v1/tickets/${itemToDelete.id}/`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken.access}`
          },
        });
      } else {
        if (itemToDelete.status === true) {
          // Disable the employee
          console.log("Disabling employee");
          console.log(itemToDelete);
          response = await fetch(`http://localhost:8000/api/v1/employees/${itemToDelete.id}/`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken.access}`
            },
          });
        } else {
          // Delete the employee and their tickets
          console.log("Deleting employee");
          console.log(itemToDelete);

          response = await fetch(`http://localhost:8000/api/v1/employees/${itemToDelete.id}/`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken.access}`
            },
          });
        }
      }

      if (response.ok) {
        if (itemToDelete.type === 'ticket') {
          setTickets(tickets.filter(ticket => ticket.id !== itemToDelete.id));
        } else if (itemToDelete.status === 1) {
          // Update the employee's status in the state
          const updateEmpleado = (empleados) => 
            empleados.map(e => e.id === itemToDelete.id ? {...e, status: 0} : e);
          if (itemToDelete.type === 'vendedor') {
            setVendedores(updateEmpleado);
          } else {
            setEscaners(updateEmpleado);
          }
        } else {
          // Remove the employee from the state
          if (itemToDelete.type === 'vendedor') {
            setVendedores(vendedores.filter(v => v.id !== itemToDelete.id));
          } else {
            setEscaners(escaners.filter(e => e.id !== itemToDelete.id));
          }
        }
        setReload(!reload);
      } else {
        const data = await response.json();
        console.log(data);
        alert(`Error al ${itemToDelete.status === 1 ? 'deshabilitar' : 'eliminar'} ${itemToDelete.type}`);
      }
    } catch (error) {
      console.error("Error in delete operation:", error);
      alert(`Error en la operación de ${itemToDelete.status === 1 ? 'deshabilitar' : 'eliminar'}`);
    }

    setDeleteConfirmOpen(false);
    setItemToDelete(null);
  }, [authToken.access, itemToDelete, tickets, vendedores, escaners, reload]);

  const filteredTickets = tickets.filter(ticket =>
    ticket.owner_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.owner_dni.includes(searchTerm)
  );

  const pageCount = Math.ceil(filteredTickets.length / itemsPerPage);
  const paginatedTickets = filteredTickets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6 pb-8 bg-gray-900 text-white p-4 w-full min-h-screen">
      <div className='max-w-6xl mx-auto'>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <Button onClick={() => navigate('/dashboard')} variant="outline" className="w-full sm:w-auto bg-gray-800 text-white hover:bg-gray-700">
            <ArrowLeftIcon className="mr-2 h-4 w-4" /> Volver al Dashboard
          </Button>
          <Button onClick={handleEditEvent} variant="outline" className="w-full sm:w-auto bg-gray-800 text-white hover:bg-gray-700">
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
                <p className="text-gray-400">Capacidad: <span className="text-white">{event.capacity ? event.capacity : "Ilimitada"}</span></p>
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
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                  <Button onClick={handleGenerarTicket} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
                    <PlusIcon className="mr-2 h-4 w-4" /> Generar Nuevo Ticket
                  </Button>
                  <div className="relative w-full sm:w-auto">
                    <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Buscar por nombre o DNI"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-700">
                        <TableHead className="text-gray-300 hidden sm:table-cell">ID</TableHead>
                        <TableHead  className="text-gray-300">Nombre</TableHead>
                        <TableHead className="text-gray-300 hidden sm:table-cell">DNI</TableHead>
                        <TableHead className="text-gray-300 hidden sm:table-cell">Vendedor</TableHead>
                        <TableHead className="text-gray-300 text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedTickets.map((ticket, index) => (
                        <TableRow key={ticket.id} className="border-gray-700">
                          <TableCell className="font-medium text-white hidden sm:table-cell">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                          <TableCell className="text-gray-300">{ticket.owner_name + " " + ticket.owner_lastname}</TableCell>
                          <TableCell className="text-gray-300 hidden sm:table-cell">{ticket.owner_dni}</TableCell>
                          <TableCell className="text-gray-300 hidden sm:table-cell">{ticket.seller_name === "Unknown" ? "Organizer" : ticket.seller_name}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button variant="outline" onClick={() => handleViewTicket(ticket.uuid)} size="sm" title="Ver ticket">
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
                <Button onClick={() => handleGenerarEmpleado(true)} className="mb-4 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
                  <PlusIcon className="mr-2 h-4 w-4" /> Crear Nuevo Enlace para Vendedor
                </Button>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-700" >
                        <TableHead className="text-gray-300">Nombre</TableHead>
                        <TableHead className="text-gray-300 hidden sm:table-cell">Enlace</TableHead>
                        <TableHead className="text-gray-300 hidden sm:table-cell">Capacidad</TableHead>
                        <TableHead className="text-gray-300 hidden sm:table-cell">Tickets Vendidos</TableHead>
                        <TableHead className="text-gray-300 text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vendedores.map(vendedor => (
                        <TableRow key={vendedor.id} className={`border-gray-700 ${vendedor.status === false ? 'opacity-50' : ''}`}>
                          <TableCell className="text-gray-300">{vendedor.assigned_name}</TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Link to={`/vendedor/${vendedor.uuid}`} className="text-blue-400 hover:text-blue-300 break-all">
                              {`${vendedor.uuid}`}
                            </Link>
                          </TableCell>
                          <TableCell className="text-gray-300 hidden sm:table-cell">{vendedor.seller_capacity !== null ? vendedor.seller_capacity : "sin límite"}</TableCell>
                          <TableCell className="text-gray-300 hidden sm:table-cell">{vendedor.ticket_counter}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button variant="outline" onClick={() => handleEditEmpleado(vendedor)} size="sm" title="Editar vendedor">
                              <PencilIcon className="h-4 w-4" />
                              <span className="sr-only">Editar vendedor</span>
                            </Button>
                            <Button 
                              variant="destructive" 
                              onClick={() => handleEliminarEmpleado(vendedor)} 
                              size="sm" 
                              title={vendedor.status === true ? "Deshabilitar vendedor" : "Eliminar vendedor"}
                            >
                              {vendedor.status === true ? <TicketX className="h-4 w-4" /> : <Trash2Icon className="h-4 w-4" />}
                              <span className="sr-only">{vendedor.status === true ? "Deshabilitar vendedor" : "Eliminar vendedor"}</span>
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
                <Button onClick={() => handleGenerarEmpleado(false)} className="mb-4 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
                  <PlusIcon className="mr-2 h-4 w-4" /> Crear Nuevo Enlace para Escáner
                </Button>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-700">
                        <TableHead className="text-gray-300">Nombre</TableHead>
                        <TableHead className="text-gray-300 hidden sm:table-cell">Enlace</TableHead>
                        <TableHead className="text-gray-300 text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {escaners.map(escaner => (
                        <TableRow key={escaner.id} className={`border-gray-700 ${escaner.status === false ? 'opacity-50' : ''}`}>
                          <TableCell className="text-gray-300">{escaner.assigned_name}</TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Link to={`/scanner/${escaner.uuid}`} className="text-blue-400 hover:text-blue-300 break-all">
                              {`${escaner.uuid}`}
                            </Link>
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button variant="outline" onClick={() => handleEditEmpleado(escaner)} size="sm" title="Editar escáner">
                              <PencilIcon className="h-4 w-4" />
                              <span className="sr-only">Editar escáner</span>
                            </Button>
                            <Button 
                              variant="destructive" 
                              onClick={() => handleEliminarEmpleado(escaner)} 
                              size="sm" 
                              title={escaner.status === true ? "Deshabilitar escáner" : "Eliminar escáner"}
                            >
                              {escaner.status === true ? <TicketX className="h-4 w-4" /> : <Trash2Icon className="h-4 w-4" />}
                              <span className="sr-only">{escaner.status === 1 ? "Deshabilitar escáner" : "Eliminar escáner"}</span>
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
              <DialogTitle>Crear Nuevo {isSellerEmpleado ? "Vendedor" : "Escáner"}</DialogTitle>
              <DialogDescription>
                Ingrese los detalles para el nuevo {isSellerEmpleado ? "vendedor" : "escáner"}.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="newEmpleadoName">Nombre</Label>
                <Input
                  id="newEmpleadoName"
                  value={newEmpleadoName}
                  onChange={(e) => setNewEmpleadoName(e.target.value)}
                  placeholder="Nombre del empleado"
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
              {isSellerEmpleado && (
                <div>
                  <Label htmlFor="newEmpleadoCapacity">Capacidad de venta</Label>
                  <Input
                    id="newEmpleadoCapacity"
                    type="number"
                    value={newEmpleadoCapacity}
                    onChange={(e) => setNewEmpleadoCapacity(e.target.value)}
                    placeholder="Sin limite"
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button onClick={() => setIsDialogOpen(false)} variant="outline" className="bg-gray-700 text-white hover:bg-gray-600">
                Cancelar
              </Button>
              <Button onClick={handleConfirmGenerarEmpleado} className="bg-blue-600 hover:bg-blue-700 text-white">
                Confirmar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-gray-800 text-white">
            <DialogHeader>
              <DialogTitle>Editar {editingEmpleado?.is_seller ? "Vendedor" : "Escáner"}</DialogTitle>
              <DialogDescription>
                Modifique los detalles del {editingEmpleado?.is_seller ? "vendedor" : "escáner"}.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="editEmpleadoName">Nombre</Label>
                <Input
                  id="editEmpleadoName"
                  value={newEmpleadoName}
                  onChange={(e) => setNewEmpleadoName(e.target.value)}
                  placeholder="Nombre del empleado"
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
              {editingEmpleado?.is_seller && (
                <div>
                  <Label htmlFor="editEmpleadoCapacity">Capacidad de venta</Label>
                  <Input
                    id="editEmpleadoCapacity"
                    type="number"
                    value={newEmpleadoCapacity}
                    onChange={(e) => setNewEmpleadoCapacity(e.target.value)}
                    placeholder="Sin limite"
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button onClick={() => setIsEditDialogOpen(false)} variant="outline" className="bg-gray-700 text-white hover:bg-gray-600">
                Cancelar
              </Button>
              <Button onClick={handleConfirmEditEmpleado} className="bg-blue-600 hover:bg-blue-700 text-white">
                Guardar Cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <DialogContent className="bg-gray-800 text-white">
            <DialogHeader>
              <DialogTitle>
                {itemToDelete?.status === true ? "Deshabilitar" : "Eliminar"} {itemToDelete?.type}
              </DialogTitle>
              <DialogDescription>
                {itemToDelete?.status === true
                  ? `¿Estás seguro de que deseas deshabilitar este ${itemToDelete?.type}? Los tickets no se eliminarán, pero el ${itemToDelete?.type} no podrá vender más tickets.`
                  : `¿Estás seguro de que deseas eliminar este ${itemToDelete?.type}? Esta acción eliminará todos los tickets asociados.`
                }
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => setDeleteConfirmOpen(false)} variant="outline" className="bg-gray-700 text-white hover:bg-gray-600">
                Cancelar
              </Button>
              <Button onClick={handleConfirmDelete} variant="destructive">
                {itemToDelete?.status === true ? "Deshabilitar" : "Eliminar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}