import { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { PlusIcon, ArrowLeftIcon, PencilIcon, TicketX, Trash2Icon, LinkIcon } from "lucide-react";
import AuthContext from "../context/AuthContext";

export default function EventSellers() {
  const { id } = useParams();
  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [vendedores, setVendedores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newEmpleadoName, setNewEmpleadoName] = useState("");
  const [newEmpleadoCapacity, setNewEmpleadoCapacity] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [editingEmpleado, setEditingEmpleado] = useState(null);
  const [copyMessage, setCopyMessage] = useState("");

  useEffect(() => {
    const getVendedores = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${apiUrl}/api/v1/events/${id}/sellers/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken.access}`,
          },
        });
        const data = await response.json();
        
        if (response.status === 200) {
          setVendedores(data.vendedores);
        } else {
          console.error("Error al obtener vendedores:", data);
          alert("Error al obtener vendedores");
        }
      } catch (error) {
        console.error("Error fetching vendors:", error);
        alert("Error al obtener vendedores");
      } finally {
        setIsLoading(false);
      }
    };
    getVendedores();
  }, [id, authToken.access, apiUrl]);

  const handleGenerarEmpleado = useCallback(() => {
    setIsDialogOpen(true);
  }, []);

  const handleConfirmGenerarEmpleado = useCallback(async () => {
    try {
      const response = await fetch(`${apiUrl}/api/v1/employees/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken.access}`,
        },
        body: JSON.stringify({
          is_seller: true,
          assigned_name: newEmpleadoName,
          seller_capacity: parseInt(newEmpleadoCapacity) || null,
          event: id,
        }),
      });

      const data = await response.json();
      if (response.status === 201) {
        setVendedores(prevVendedores => [...prevVendedores, data]);
      } else {
        console.error("Error al generar vendedor:", data);
        alert("Error al generar vendedor");
      }
    } catch (error) {
      console.error("Error creating vendor:", error);
      alert("Error al generar vendedor");
    }

    setIsDialogOpen(false);
    setNewEmpleadoName("");
    setNewEmpleadoCapacity("");
  }, [authToken.access, id, newEmpleadoName, newEmpleadoCapacity, apiUrl]);

  const handleEditEmpleado = useCallback((empleado) => {
    setEditingEmpleado(empleado);
    setNewEmpleadoName(empleado.assigned_name);
    const capacity = empleado.seller_capacity !== null ? empleado.seller_capacity.toString() : "";
    setNewEmpleadoCapacity(capacity);
    setIsEditDialogOpen(true);
  }, []);

  const handleConfirmEditEmpleado = useCallback(async () => {
    if (!editingEmpleado) return;

    try {
      const response = await fetch(`${apiUrl}/api/v1/employees/${editingEmpleado.id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken.access}`,
        },
        body: JSON.stringify({
          assigned_name: newEmpleadoName,
          seller_capacity: parseInt(newEmpleadoCapacity) || null,
        }),
      });

      if (response.ok) {
        const updatedEmpleado = await response.json();
        setVendedores(prevVendedores => 
          prevVendedores.map((v) => (v.id === updatedEmpleado.id ? updatedEmpleado : v))
        );
      } else {
        console.error("Error al actualizar vendedor:", await response.json());
        alert("Error al actualizar vendedor");
      }
    } catch (error) {
      console.error("Error updating vendor:", error);
      alert("Error al actualizar vendedor");
    }

    setIsEditDialogOpen(false);
    setEditingEmpleado(null);
    setNewEmpleadoName("");
    setNewEmpleadoCapacity("");
  }, [authToken.access, editingEmpleado, newEmpleadoName, newEmpleadoCapacity, apiUrl]);

  const handleEliminarEmpleado = useCallback((empleado) => {
    setItemToDelete({
      id: empleado.id,
      status: empleado.status,
    });
    setDeleteConfirmOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!itemToDelete) return;

    try {
      const response = await fetch(`${apiUrl}/api/v1/employees/${itemToDelete.id}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken.access}`,
        },
      });

      if (response.ok) {
        setVendedores(prevVendedores => 
          itemToDelete.status
            ? prevVendedores.map(v => v.id === itemToDelete.id ? {...v, status: false} : v)
            : prevVendedores.filter(v => v.id !== itemToDelete.id)
        );
      } else {
        console.error("Error en la operación de eliminar/deshabilitar:", await response.json());
        alert(`Error al ${itemToDelete.status ? "deshabilitar" : "eliminar"} vendedor`);
      }
    } catch (error) {
      console.error("Error in delete operation:", error);
      alert(`Error en la operación de ${itemToDelete.status ? "deshabilitar" : "eliminar"}`);
    }

    setDeleteConfirmOpen(false);
    setItemToDelete(null);
  }, [authToken.access, itemToDelete, apiUrl]);

  const copyToClipboard = useCallback((text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopyMessage("Copiado");
        setTimeout(() => setCopyMessage(""), 2000);
      })
      .catch((err) => {
        console.error("Error al copiar: ", err);
        setCopyMessage("Error al copiar");
        setTimeout(() => setCopyMessage(""), 2000);
      });
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen bg-gray-900 text-white">Cargando...</div>;
  }

  return (
    <div className="flex justify-center space-y-6 pb-8 bg-gray-900 text-white p-4 min-h-screen w-screen">
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <Button onClick={() => navigate(`/event/${id}/details`)} variant="outline" className="w-full sm:w-auto bg-gray-800 text-white hover:bg-gray-700">
            <ArrowLeftIcon className="mr-2 h-4 w-4" /> Volver al Evento
          </Button>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Enlaces para Vendedores</CardTitle>
            <CardDescription className="text-gray-400">Gestiona los enlaces para vendedores</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleGenerarEmpleado} className="mb-4 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
              <PlusIcon className="mr-2 h-4 w-4" /> Nuevo Vendedor
            </Button>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300 text-left">Nombre</TableHead>
                    <TableHead className="text-gray-300 hidden sm:table-cell text-left">Capacidad</TableHead>
                    <TableHead className="text-gray-300 hidden sm:table-cell text-left">Tickets Vendidos</TableHead>
                    <TableHead className="text-gray-300 text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendedores.map((vendedor) => (
                    <TableRow key={vendedor.id} className={`border-gray-700 ${vendedor.status === false ? "opacity-50" : ""}`}>
                      <TableCell className="text-gray-300">{vendedor.assigned_name}</TableCell>
                      <TableCell className="text-gray-300 hidden sm:table-cell">{vendedor.seller_capacity !== null ? vendedor.seller_capacity : "sin límite"}</TableCell>
                      <TableCell className="text-gray-300 hidden sm:table-cell">{vendedor.ticket_counter}</TableCell>
                      <TableCell className="text-right space-x-1 space-y-1">
                        <Button variant="outline" onClick={() => copyToClipboard(`${window.location.origin}/vendedor/${vendedor.uuid}`)} size="sm" title="Copiar enlace de vendedor">
                          <LinkIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" onClick={() => handleEditEmpleado(vendedor)} size="sm" title="Editar vendedor">
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" onClick={() => handleEliminarEmpleado(vendedor)} size="sm" title={vendedor.status === true ? "Deshabilitar vendedor" : "Eliminar vendedor"}>
                          {vendedor.status === true ? <TicketX className="h-4 w-4" /> : <Trash2Icon className="h-4 w-4" />}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {copyMessage && <div className="fixed bottom-4 right-4 bg-green-400 text-black px-4 py-2 rounded-md shadow-lg">{copyMessage}</div>}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-gray-800 text-white">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Vendedor</DialogTitle>
              <DialogDescription>Ingrese los detalles para el nuevo vendedor.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="newEmpleadoName">Nombre</Label>
                <Input
                  id="newEmpleadoName"
                  value={newEmpleadoName}
                  onChange={(e) => setNewEmpleadoName(e.target.value)}
                  placeholder="Nombre del vendedor"
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
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
              <DialogTitle>Editar Vendedor</DialogTitle>
              <DialogDescription>Modifique los detalles del vendedor.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="editEmpleadoName">Nombre</Label>
                <Input
                  id="editEmpleadoName"
                  value={newEmpleadoName}
                  onChange={(e) => setNewEmpleadoName(e.target.value)}
                  placeholder="Nombre del vendedor"
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
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
                {itemToDelete?.status === true ? "Deshabilitar" : "Eliminar"} Vendedor
              </DialogTitle>
              <DialogDescription>
                {itemToDelete?.status === true
                  ? "¿Estás seguro de que deseas deshabilitar este vendedor? Los tickets no se eliminarán, pero el vendedor no podrá vender más tickets."
                  : "¿Estás seguro de que deseas eliminar este vendedor? Esta acción eliminará la información del empleado y todos los tickets asociados."}
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