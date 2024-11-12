// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../components/ui/dialog";
import { PlusIcon, SearchIcon, ArrowLeftIcon, EyeIcon, Trash2Icon, LinkIcon } from "lucide-react";
import AuthContext from "../context/AuthContext";
import EventDetails from './EventsDetail';

export default function EventTickets() {
  const { id } = useParams();
  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [event, setEvent] = useState({});
  const [tickets, setTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [copyMessage, setCopyMessage] = useState("");

  const itemsPerPage = 10;

  useEffect(() => {
    const getTickets = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/v1/events/${id}/tickets`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken.access}`,
          },
        });
        const data = await response.json();
        console.log(data);
        if (response.status === 200) {
          setTickets(data.tickets);
          setEvent(data.event);
        } else {
          alert("Error al obtener tickets");
        }
      } catch (error) {
        console.error("Error fetching tickets:", error);
        alert("Error al obtener tickets");
      }
    };
    getTickets();
  }, [id, authToken.access, apiUrl]);

  const handleGenerarTicket = useCallback(() => {
    navigate(`/event/${id}/create-ticket`);
  }, [id, navigate]);

  const handleEliminarTicket = useCallback((ticketId) => {
    setItemToDelete({ id: ticketId });
    setDeleteConfirmOpen(true);
  }, []);

  const handleViewTicket = useCallback((uuid) => {
    window.open(`/ticket/${uuid}`, "_blank");
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!itemToDelete) return;

    try {
      const response = await fetch(`${apiUrl}/api/v1/tickets/${itemToDelete.id}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken.access}`,
        },
      });

      if (response.ok) {
        setTickets(tickets.filter((ticket) => ticket.id !== itemToDelete.id));
      } else {
        alert("Error al eliminar ticket");
      }
    } catch (error) {
      console.error("Error deleting ticket:", error);
      alert("Error al eliminar ticket");
    }

    setDeleteConfirmOpen(false);
    setItemToDelete(null);
  }, [authToken.access, itemToDelete, tickets, apiUrl]);

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

  const filteredTickets = tickets.filter((ticket) => 
    ticket.owner_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    ticket.owner_dni.includes(searchTerm)
  );

  const pageCount = Math.ceil(filteredTickets.length / itemsPerPage);
  const paginatedTickets = filteredTickets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="min-h-screen w-screen p-4 bg-gray-900 text-gray-100 flex justify-center space-y-6 pb-8   ">
      <div className="max-w-6xl mx-auto w-full">
        <EventDetails id={id} event={event} />
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Tickets</CardTitle>
            <CardDescription className="text-gray-400">Gestiona los tickets para este evento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
              <Button onClick={handleGenerarTicket} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
                <PlusIcon className="mr-2 h-4 w-4" />Nuevo ticket
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
                  <TableRow className="border-gray-700 text-left">
                    <TableHead className="text-gray-300 hidden sm:table-cell">ID</TableHead>
                    <TableHead className="text-gray-300">Nombre</TableHead>
                    <TableHead className="text-gray-300 hidden sm:table-cell">DNI</TableHead>
                    <TableHead className="text-gray-300 hidden sm:table-cell">Vendedor</TableHead>
                    <TableHead className="text-gray-300 text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedTickets.map((ticket, index) => (
                    <TableRow key={ticket.id} className="border-gray-700 text-left">
                      <TableCell className="font-medium text-white hidden sm:table-cell">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                      <TableCell className="text-gray-300">{ticket.owner_name + " " + ticket.owner_lastname}</TableCell>
                      <TableCell className="text-gray-300 hidden sm:table-cell">{ticket.owner_dni}</TableCell>
                      <TableCell className="text-gray-300 hidden sm:table-cell">{ticket.seller_name === "Unknown" ? "Organizer" : ticket.seller_name}</TableCell>
                      <TableCell className="space-x-1 space-y-1 text-right">
                        <Button variant="outline" onClick={() => copyToClipboard(`${window.location.origin}/ticket/${ticket.uuid}`)} size="sm" title="Copiar enlace de ticket">
                          <LinkIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" onClick={() => handleViewTicket(ticket.uuid)} size="sm" title="Ver ticket">
                          <EyeIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" onClick={() => handleEliminarTicket(ticket.id)} size="sm" title="Eliminar ticket">
                          <Trash2Icon className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex justify-between items-center mt-4">
              <Button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="bg-gray-700 text-white">
                Anterior
              </Button>
              <span className="text-gray-400">
                Página {currentPage} de {pageCount}
              </span>
              <Button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pageCount))} disabled={currentPage === pageCount} className="bg-gray-700 text-white">
                Siguiente
              </Button>
            </div>
          </CardContent>
        </Card>

        {copyMessage && <div className="fixed bottom-4 right-4 bg-green-400 text-black px-4 py-2 rounded-md shadow-lg">{copyMessage}</div>}

        <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <DialogContent className="bg-gray-800 text-white">
            <DialogHeader>
              <DialogTitle>Eliminar Ticket</DialogTitle>
              <DialogDescription>
                ¿Estás seguro de que deseas eliminar este ticket? Esta acción no se puede deshacer.
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