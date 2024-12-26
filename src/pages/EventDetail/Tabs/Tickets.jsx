import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Custom components
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import { Switch } from '../../../components/ui/switch';
import { PlusIcon, SearchIcon, EyeIcon, Trash2Icon, LinkIcon } from 'lucide-react';
// API
import { updateTicketSales } from '../../../api/eventApi';
import { DialogDescription } from '@radix-ui/react-dialog';

export default function Tickets({
  id,
  paginatedTickets,
  setSearchTerm,
  searchTerm,
  copyToClipboard,
  handleEliminarTicket,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  pageCount,
  ticketSalesEnabled,
  handleUpdateTicketSales,
  dniRequired,
  ticketTags,
}) {
  const navigate = useNavigate();
  const [selectedTicket, setSelectedTicket] = useState(null);

  const MobileActionDialog = ({ ticket, onClose }) => (
    <Dialog className="" open={!!ticket} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-gray-800 ">
        <DialogHeader>
          <DialogTitle>Acciones para el ticket</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Selecciona una accion para realizar sobre el ticket de:  {ticket?.owner_name} {ticket?.owner_lastname}
        </DialogDescription>
        <div className="flex flex-col space-y-2">
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
            Ver ticket
          </Button>
          <Button
            className="justify-start"
            variant="entraditaSecondary"
            onClick={() => {
              handleEliminarTicket(ticket?.id);
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
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <div className="flex flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-auto">
            <CardTitle className="text-white">Tickets</CardTitle>
            <CardDescription className="text-gray-400">Gestiona los tickets para este evento</CardDescription>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400 mr-2 hidden sm:table-cell">Habilitar venta de tickets</span>
            <Switch checked={ticketSalesEnabled} onChange={() => handleUpdateTicketSales()} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          <Button
            onClick={() => navigate(`/event/${id}/create-ticket`, { state: { dniRequired, ticketTags } })}
            disabled={!ticketSalesEnabled}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
          >
            <PlusIcon className="mr-2 h-4 w-4" /> Nuevo Ticket
          </Button>
          <div className="relative w-full sm:w-auto">
            <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar"
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
                <TableHead className="text-gray-300 ">Nombre</TableHead>
                {dniRequired && <TableHead className="text-gray-300  sm:table-cell ">DNI</TableHead>}
                <TableHead className="text-gray-300 hidden sm:table-cell">Tipo</TableHead>
                <TableHead className="text-gray-300 ">Vendedor</TableHead>
                <TableHead className="text-gray-300 hidden sm:table-cell text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTickets.map((ticket, index) => (
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
                  {dniRequired && (
                    <TableCell className="text-gray-300 sm:table-cell truncate overflow-hidden whitespace-nowrap max-w-15">{ticket.owner_dni ? ticket.owner_dni : 'No disponible'}</TableCell>
                  )}
                  <TableCell className="text-gray-300 hidden sm:table-cell">{ticket.ticket_tag.name}</TableCell>
                  <TableCell className="text-gray-300 ">{ticket.seller_name === 'Unknown' ? 'Organizer' : ticket.seller_name}</TableCell>
                  <TableCell className="hidden sm:table-cell  text-right sm:space-x-1 space-y-1">
                    <Button variant="outline" onClick={() => copyToClipboard(`${window.location.origin}/ticket/${ticket.uuid}`)} size="sm" title="Copiar enlace de ticket">
                      <LinkIcon className="h-4 w-4" />
                      <span className="sr-only">Copiar enlace de ticket</span>
                    </Button>
                    <Button variant="outline" onClick={() => window.open(`/ticket/${ticket.uuid}`, '_blank')} size="sm" title="Ver ticket">
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
      <MobileActionDialog ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />
    </Card>
  );
}
