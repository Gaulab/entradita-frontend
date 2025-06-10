// entradaFront/src/pages/EventDetail/Tabs/Tickets.jsx
// react imports
import { useState, useContext, useCallback } from 'react';
// react-router imports
// context imports
import AuthContext from '../../../context/AuthContext';
import EventDetailsContext from '../../../context/EventDetailsContext';
// Custom components
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../../components/ui/dialog';
import { Switch } from '../../../components/ui/switch';
import { PlusIcon, SearchIcon, EyeIcon, Trash2Icon, LinkIcon, Share2 } from 'lucide-react';
// API
import { updateTicketSales } from '../../../api/eventApi';
import PropTypes from 'prop-types';


export default function Tickets() {
  const { authToken } = useContext(AuthContext);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const {
    event,
    tickets,
    hasMoreTickets,
    // loadMoreTickets,
    setSearchTerm,
    searchTerm,
    currentPage,
    setCurrentPage,
    ticketSalesEnabled,
    setTicketSalesEnabled,
    copyToClipboard,
    setItemToDelete,
    setIsDeleteConfirmDialogOpen,
    setIsCreateTicketDialogOpen,
  } = useContext(EventDetailsContext);

  const handleGenerarTicket = useCallback(() => {
    setIsCreateTicketDialogOpen(true);
  }, [setIsCreateTicketDialogOpen]);

  const handleUpdateTicketSales = useCallback(async () => {
    try {
      const data = await updateTicketSales(event.id, authToken.access);
      setTicketSalesEnabled(data.ticket_sales_enabled);
    } catch (error) {
      console.error(error.message);
    }
  }, [event, authToken, setTicketSalesEnabled]);

  const handleDeleteTicket = useCallback((id_ticket) => {
    setItemToDelete({ type: 'ticket', id: id_ticket });
    setIsDeleteConfirmDialogOpen(true);
  }, [setItemToDelete, setIsDeleteConfirmDialogOpen]);



  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Tickets</CardTitle>
        <CardDescription className="text-gray-400">
          Gestiona los tickets para este evento <br /> {window.innerWidth < 640 && 'Haz click en una fila para ver más acciones'}
        </CardDescription>
        <div className="flex flex-row items-center ">
          <Switch checked={ticketSalesEnabled} onChange={() => handleUpdateTicketSales()} />
          <span className="text-sm text-gray-400 ml-2">Habilitar venta de tickets</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          <Button onClick={() => handleGenerarTicket(true)} disabled={!ticketSalesEnabled} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
            <PlusIcon className="mr-2 h-4 w-4" /> Nuevo Ticket
          </Button>
          <div className="relative w-full sm:w-auto">
            <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-8 w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700 text-left">
                <TableHead className="text-gray-300 ">Nombre</TableHead>
                {event.dni_required && <TableHead className="text-gray-300 sm:table-cell ">DNI</TableHead>}
                <TableHead className="text-gray-300 hidden sm:table-cell">Tipo</TableHead>
                <TableHead className="text-gray-300 ">Vendedor</TableHead>
                <TableHead className="text-gray-300 hidden sm:table-cell text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow
                  key={ticket.id}
                  className="border-gray-700 cursor-pointer sm:cursor-default h-16" // Added h-16 for row height
                  onClick={() => {
                    if (window.innerWidth < 640) {
                      console.log('MobileActionDialog' + ticket);
                      setSelectedTicket(ticket);
                    }
                  }}
                >
                  <TableCell className="text-gray-300 truncate overflow-hidden whitespace-nowrap max-w-28 ">{ticket.owner_name + ' ' + ticket.owner_lastname}</TableCell>
                  {event.dni_required && (
                    <TableCell className="text-gray-300 sm:table-cell truncate overflow-hidden whitespace-nowrap max-w-15">{ticket.owner_dni ? ticket.owner_dni : 'No disponible'}</TableCell>
                  )}
                  <TableCell className="text-gray-300 hidden sm:table-cell">{ticket.ticket_tag.name}</TableCell>
                  <TableCell className="text-gray-300 ">{ticket.seller_name === 'Unknown' ? 'Organizer' : ticket.seller_name}</TableCell>
                  <TableCell className="hidden sm:table-cell  text-right sm:space-x-1 space-y-1">
                    <Button
                      variant="outline"
                      onClick={() => copyToClipboard(`¡Acá está tu ticket para el evento ${event.name} 🎟️!\n\n ${window.location.origin}/ticket/${ticket.uuid}`)}
                      size="sm"
                      title="Copiar invitación del cliente"
                    >
                      <Share2 className="h-4 w-4" />
                      <span className="sr-only">Copiar texto invitación del cliente</span>
                    </Button>

                    <Button variant="outline" onClick={() => copyToClipboard(`${window.location.origin}/ticket/${ticket.uuid}`)} size="sm" title="Copiar enlace de ticket">
                      <LinkIcon className="h-4 w-4" />
                      <span className="sr-only">Copiar enlace de ticket</span>
                    </Button>
                    <Button variant="outline" onClick={() => window.open(`/ticket/${ticket.uuid}`, '_blank')} size="sm" title="Ver ticket">
                      <EyeIcon className="h-4 w-4" />
                      <span className="sr-only">Ver ticket</span>
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        handleDeleteTicket(ticket.id);
                        setCurrentPage(1);
                      }}
                      size="sm"
                      title="Eliminar ticket"
                    >
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
          <Button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="bg-gray-700 text-white">
            Anterior
          </Button>
          <span className="text-gray-400">Página {currentPage}</span>
          <Button disabled={!hasMoreTickets} onClick={() => setCurrentPage((prev) => prev + 1)} className="bg-gray-700 text-white">
            Siguiente
          </Button>
        </div>
      </CardContent>
      <MobileActionDialog ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />
    </Card>
  );
}

const ticketShape = {
  id: PropTypes.number.isRequired,
  uuid: PropTypes.string.isRequired,
  owner_name: PropTypes.string,
  owner_lastname: PropTypes.string,
  owner_dni: PropTypes.string,
  seller_name: PropTypes.string,
  ticket_tag: PropTypes.shape({
    name: PropTypes.string,
  }),
};

function MobileActionDialog({ ticket, onClose }) {
  const { event, copyToClipboard, handleDeleteTicket } = useContext(EventDetailsContext);
  return (
    <Dialog className="" open={!!ticket} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-gray-800 ">
        <DialogHeader>
          <DialogTitle>Acciones para el ticket</DialogTitle>
        </DialogHeader>
        <DialogDescription className="mb-0 m-0">
          Selecciona una acción para realizar sobre el ticket de:
        </DialogDescription>
        <div className="text-gray-300">
          <p>
            <strong>Nombre:</strong> {ticket?.owner_name} {ticket?.owner_lastname}
          </p>
          {event.dniRequired && (
            <p>
              <strong>DNI:</strong> {ticket?.owner_dni || 'No disponible'}
            </p>
          )}
          <p>
            <strong>Tipo:</strong> {ticket?.ticket_tag.name}</p>
          <p>
            <strong>Vendedor:</strong> {ticket?.seller_name === 'Unknown' ? 'Organizer' : ticket?.seller_name}
          </p>
        </div>
        <div className="flex flex-col space-y-2 m-0">
          <Button
            className="justify-start"
            variant="entraditaSecondary"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: `🎟️ Tu ticket para el evento ${event.name}`,
                  text: `¡Acá está tu ticket para el evento ${event.name} 🎟️!🎉\n${ticket.owner_name} ${ticket.owner_lastname}:\n`,
                  url: `${window.location.origin}/ticket/${ticket.uuid}`,
                }).catch(console.error);
              } else {
                alert(`Comparte este enlace: ${window.location.origin}/ticket/${ticket.uuid}`);
                navigator.clipboard.writeText(`${window.location.origin}/ticket/${ticket.uuid}`);
              }
              onClose();
            }}
          >
            <Share2 className="mr-2 h-4 w-4" /> Compartir ticket
          </Button>
          <Button
            className="justify-start"
            variant="entraditaSecondary"
            onClick={() => {
              copyToClipboard(`${window.location.origin}/ticket/${ticket?.uuid}`);
              onClose();
            }}
          >
            <LinkIcon className="mr-2 h-4 w-4" />
            Copiar enlace de ticket
          </Button>
          <Button
            className="justify-start"
            variant="entraditaSecondary"
            onClick={() => {
              window.open(`/ticket/${ticket?.uuid}`, '_blank');
              onClose();
            }}
          >
            <EyeIcon className="mr-2 h-4 w-4" />
            Ver página de ticket
          </Button>
          <Button
            className="justify-start"
            variant="entraditaSecondary"
            onClick={() => {
              handleDeleteTicket(ticket?.id);
              onClose();
            }}
          >
            <Trash2Icon className="mr-2 h-4 w-4" />
            Eliminar ticket
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

MobileActionDialog.propTypes = {
  ticket: PropTypes.shape(ticketShape),
  onClose: PropTypes.func.isRequired,
};