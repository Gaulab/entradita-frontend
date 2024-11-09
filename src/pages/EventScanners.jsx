// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { PlusIcon, ArrowLeftIcon, PencilIcon, TicketX, Trash2Icon, LinkIcon } from "lucide-react";
import AuthContext from "../context/AuthContext";

export default function EventScanners() {
  const { id } = useParams();
  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [escaners, setEscaners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newEmpleadoName, setNewEmpleadoName] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [editingEmpleado, setEditingEmpleado] = useState(null);
  const [copyMessage, setCopyMessage] = useState("");

  useEffect(() => {
    const getEscaners = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${apiUrl}/api/v1/events/${id}/scanners`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken.access}`,
          },
        });
        const data = await response.json();
        if (response.status === 200) {
          setEscaners(data.scanners || []);
        } else {
          throw new Error(data.message || "Error al obtener escáneres");
        }
      } catch (error) {
        console.error("Error fetching scanners:", error);
        setError("Error al obtener escáneres. Por favor, intente de nuevo.");
      } finally {
        setIsLoading(false);
      }
    };
    getEscaners();
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
          is_seller: false,
          assigned_name: newEmpleadoName,
          event: id,
        }),
      });

      const data = await response.json();
      if (response.status === 201) {
        setEscaners(prevEscaners => [...prevEscaners, data]);
      } else {
        throw new Error(data.message || "Error al generar escáner");
      }
    } catch (error) {
      console.error("Error creating scanner:", error);
      alert("Error al generar escáner. Por favor, intente de nuevo.");
    }

    setIsDialogOpen(false);
    setNewEmpleadoName("");
  }, [authToken.access, id, newEmpleadoName, apiUrl]);

  const handleEditEmpleado = useCallback((empleado) => {
    setEditingEmpleado(empleado);
    setNewEmpleadoName(empleado.assigned_name);
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
        }),
      });

      if (response.ok) {
        const updatedEmpleado = await response.json();
        setEscaners(prevEscaners => prevEscaners.map((e) => (e.id === updatedEmpleado.id ? updatedEmpleado : e)));
      } else {
        throw new Error("Error al actualizar escáner");
      }
    } catch (error) {
      console.error("Error updating scanner:", error);
      alert("Error al actualizar escáner. Por favor, intente de nuevo.");
    }

    setIsEditDialogOpen(false);
    setEditingEmpleado(null);
    setNewEmpleadoName("");
  }, [authToken.access, editingEmpleado, newEmpleadoName, apiUrl]);

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
        setEscaners(prevEscaners => 
          itemToDelete.status
            ? prevEscaners.map(e => e.id === itemToDelete.id ? {...e, status: false} : e)
            : prevEscaners.filter(e => e.id !== itemToDelete.id)
        );
      } else {
        throw new Error(`Error al ${itemToDelete.status ? "deshabilitar" : "eliminar"} escáner`);
      }
    } catch (error) {
      console.error("Error in delete operation:", error);
      alert(`Error en la operación de ${itemToDelete.status ? "deshabilitar" : "eliminar"}. Por favor, intente de nuevo.`);
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

  if (error) {
    return <div className="flex justify-center items-center h-screen bg-gray-900 text-white">{error}</div>;
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
            <CardTitle className="text-white">Enlaces para Escáneres</CardTitle>
            <CardDescription className="text-gray-400">Gestiona los enlaces para escáneres</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleGenerarEmpleado} className="mb-4 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
              <PlusIcon className="mr-2 h-4 w-4" /> Crear Nuevo Enlace para Escáner
            </Button>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Nombre</TableHead>
                    <TableHead className="text-gray-300 text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {escaners.map((escaner) => (
                    <TableRow key={escaner.id} className={`border-gray-700 ${escaner.status === false ? "opacity-50" : ""}`}>
                      <TableCell className="text-gray-300">{escaner.assigned_name}</TableCell>
                      <TableCell className="text-right space-x-1 space-y-1">
                        <Button variant="outline" onClick={() => copyToClipboard(`${window.location.origin}/escaner/${escaner.uuid}`)} size="sm" title="Copiar enlace de escáner">
                          <LinkIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" onClick={() => handleEditEmpleado(escaner)} size="sm" title="Editar escáner">
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" onClick={() => handleEliminarEmpleado(escaner)} size="sm" title={escaner.status === true ? "Deshabilitar escáner" : "Eliminar escáner"}>
                          {escaner.status === true ? <TicketX className="h-4 w-4" /> : <Trash2Icon className="h-4 w-4" />}
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
              <DialogTitle>Crear Nuevo Escáner</DialogTitle>
              <DialogDescription>Ingrese los detalles para el nuevo escáner.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="newEmpleadoName">Nombre</Label>
                <Input
                  id="newEmpleadoName"
                  value={newEmpleadoName}
                  onChange={(e) => setNewEmpleadoName(e.target.value)}
                  placeholder="Nombre del escáner"
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
              <DialogTitle>Editar Escáner</DialogTitle>
              <DialogDescription>Modifique los detalles del escáner.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="editEmpleadoName">Nombre</Label>
                <Input
                  id="editEmpleadoName"
                  value={newEmpleadoName}
                  onChange={(e) => setNewEmpleadoName(e.target.value)}
                  placeholder="Nombre del escáner"
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
                {itemToDelete?.status === true ? "Deshabilitar" : "Eliminar"} Escáner
              </DialogTitle>
              <DialogDescription>
                {itemToDelete?.status === true
                  ? "¿Estás seguro de que deseas deshabilitar este escáner? El escáner no podrá escanear más tickets."
                  : "¿Estás seguro de que deseas eliminar este escáner? Esta acción eliminará la información del empleado."}
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