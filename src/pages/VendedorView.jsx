import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { PlusIcon, SearchIcon, EyeIcon, Trash2Icon, LinkIcon } from "lucide-react";
import PropTypes from "prop-types";
// Custom components
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
// API
import { checkPassword } from "../api/empleadoApi";
import { getVendedor } from "../api/empleadoApi";
import { deleteTicketBySeller } from "../api/ticketApi";


export default function VendedorView({ uuid }) {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [vendedor, setVendedor] = useState(null);
  const [eventId, setEventId] = useState(null);
  const [vendedorNotFound, setVendedorNotFound] = useState(false);
  const [password, setPassword] = useState("");
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState(null);
  const [copyMessage, setCopyMessage] = useState("");
  const [ticketsSalesEnabled, setTicketsSalesEnabled] = useState(true);
  const navigate = useNavigate();

  const shareTicketLink = useCallback((link) => {
    if (navigator.share) {
      navigator.share({
        title: "Compartir Ticket",
        text: "Aquí está el enlace de tu ticket:",
        url: link,
      }).then(() => {
        console.log("Compartido exitosamente");
      }).catch((err) => {
        console.error("Error al compartir:", err);
      });
    } else {
      // Copia al portapapeles como alternativa
      navigator.clipboard.writeText(link).then(() => {
        setCopyMessage("Copiado");
        setTimeout(() => setCopyMessage(""), 2000);
      }).catch((err) => {
        console.error("Error al copiar: ", err);
        setCopyMessage("Error al copiar");
        setTimeout(() => setCopyMessage(""), 2000);
      });
    }
  }, []);


  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem("isPasswordCorrect");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    const storedPasswordStatus = localStorage.getItem("isPasswordCorrect");
    if (storedPasswordStatus) {
      setIsPasswordCorrect(JSON.parse(storedPasswordStatus));
    }

    const fetchTickets = async () => {
      try {
        const data = await getVendedor(uuid);
        setVendedor(data.vendedor);
        setTickets(data.tickets);
        setFilteredTickets(data.tickets);
        setEventId(data.vendedor.event);
        setTicketsSalesEnabled(data.sales_enabled);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchTickets();
  }, [uuid]);

  const verifyPassword = async () => {
    if (!eventId) {
      setPasswordError("ID de evento no disponible.");
      return;
    }

    try {
      await checkPassword(eventId, password);
      setIsPasswordCorrect(true);
      localStorage.setItem("isPasswordCorrect", "true");
    } catch (error) {
      setPasswordError(error.message);
    }
  };

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    if (term) {
      const filtered = tickets.filter((ticket) => ticket.owner_name.toLowerCase().includes(term) || ticket.owner_dni.toLowerCase().includes(term));
      setFilteredTickets(filtered);
    } else {
      setFilteredTickets(tickets);
    }
  };

  const handleCreateTicket = () => {
    navigate(`/vendedor/${uuid}/create-ticket`);
  };

  const handleViewTicket = useCallback((ticketId) => {
    window.open(`/ticket/${ticketId}`, "_blank");
  }, []);

  const handleDeleteTicket = (ticket) => {
    setTicketToDelete(ticket);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteTicket = async () => {
    if (!ticketToDelete) return;

    try {
      await deleteTicketBySeller(uuid, ticketToDelete.id);
      const remainingTickets = tickets.filter((t) => t.id !== ticketToDelete.id);
      setTickets(remainingTickets);
      setFilteredTickets(remainingTickets);
    } catch (error) {
      console.error(error.message);
    }

    setDeleteConfirmOpen(false);
    setTicketToDelete(null);
  };

  if (vendedorNotFound) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <h1 className="text-2xl">Vendedor no encontrado</h1>
      </div>
    );
  }

  if (!isPasswordCorrect) {
    if (!eventId) {
      return <div className="flex items-center justify-center h-screen bg-gray-900 text-white w-screen">Cargando...</div>;
    }

    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <Card className="bg-gray-800 border-gray-700 p-6 max-w-md w-full mx-4">
          <CardHeader>
            <CardTitle className="text-white text-xl">Ingrese la contraseña del evento</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-4 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            />
            {passwordError && <p className="text-red-500 mb-2">{passwordError}</p>}
            <Button onClick={verifyPassword} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Verificar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center pb-8 bg-gray-900 text-white pt-4 min-h-screen w-screen">
      <div className="max-w-6xl w-full mx-2">
        <Card className="bg-gray-800 border-gray-700 ">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Vista de Vendedor</CardTitle>
            <CardDescription className="text-gray-400">Gestiona los tickets para el evento</CardDescription>
          </CardHeader>
          <CardContent>
            {vendedor && (
              <div className="mb-4">
                <h3 className="text-gray-300">Vendedor: {vendedor.assigned_name}</h3>
                {vendedor.status === false ? (
                  <p className="text-gray-400">El organizador te deshabilito</p>
                ) : (
                  <p className="text-gray-400">Puedes vender: {vendedor.seller_capacity ? vendedor.seller_capacity - vendedor.ticket_counter : "ilimitados"} tickets</p>
                )}
                <p className="text-gray-400">Tickets vendidos: {vendedor.ticket_counter}</p>
              </div>
            )}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-2 gap-4">
                <Button disabled={(vendedor && vendedor.status === false) || !ticketsSalesEnabled} onClick={handleCreateTicket} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
                  <PlusIcon className="mr-2 h-4 w-4" /> Nuevo Ticket
                </Button>
              <div className="relative w-full sm:w-auto">
                <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar"
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-8 w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
            </div>
            {!ticketsSalesEnabled && <CardDescription className="text-red-400 mb-3">El organizador deshabilitó la venta de tickets</CardDescription>}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700 text-left">
                    <TableHead className="text-gray-300">Nombre</TableHead>
                    <TableHead className="text-gray-300 hidden md:table-cell">DNI</TableHead>
                    <TableHead className="text-gray-300 text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTickets.map((ticket) => (
                    <TableRow key={ticket.id} className="border-gray-700">
                      <TableCell className="text-gray-300">
                        {ticket.owner_name} {ticket.owner_lastname}
                      </TableCell>
                      <TableCell className="text-gray-300 hidden md:table-cell">{ticket.owner_dni}</TableCell>
                      <TableCell className="text-right space-x-1 space-y-1">
                        <Button variant="outline" onClick={() => shareTicketLink(`${window.location.origin}/ticket/${ticket.uuid}`)} size="sm" title="Compartir enlace de ticket">
                          <LinkIcon className="h-4 w-4" />
                          <span className="sr-only">Compartir enlace de ticket</span>
                        </Button>

                        <Button variant="outline" onClick={() => handleViewTicket(ticket.uuid)} size="sm" title="Ver ticket">
                          <EyeIcon className="h-4 w-4" />
                          <span className="sr-only">Ver ticket</span>
                        </Button>

                        <Button variant="destructive" onClick={() => handleDeleteTicket(ticket)} size="sm" title="Eliminar ticket">
                          <Trash2Icon className="h-4 w-4" />
                          <span className="sr-only">Eliminar ticket</span>
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
      {/* Mensaje de copiado simple */}
      {copyMessage && <div className="fixed bottom-4 right-4 bg-green-400 text-black px-4 py-2 rounded-md shadow-lg">{copyMessage}</div>}

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen} className="">
        <DialogContent className="bg-gray-800 text-white ">
          <DialogHeader>
            <DialogTitle>Confirmar eliminación de ticket</DialogTitle>
            <DialogDescription>¿Estás seguro de que deseas eliminar este ticket? Esta acción no se puede deshacer.</DialogDescription>
          </DialogHeader>
          <DialogFooter className=" space-y-2">
            <Button onClick={() => setDeleteConfirmOpen(false)} variant="outline" className="bg-gray-700 text-white hover:bg-gray-600 mt-2">
              Cancelar
            </Button>
            <Button onClick={confirmDeleteTicket} variant="destructive">
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

VendedorView.propTypes = {
  uuid: PropTypes.string.isRequired,
};
