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
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../../components/ui/dialog';
import { Switch } from '../../../components/ui/switch';
import { PlusIcon, SearchIcon, EyeIcon, Trash2Icon, LinkIcon, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
// API
import { updateTicketSales } from '../../../api/eventApi';
import PropTypes from 'prop-types';
import { notifyInfo } from '../../../utils/notify';

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

  const handleDeleteTicket = useCallback(
    (id_ticket) => {
      setItemToDelete({ type: 'ticket', id: id_ticket });
      setIsDeleteConfirmDialogOpen(true);
    },
    [setItemToDelete, setIsDeleteConfirmDialogOpen]
  );

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3 space-y-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Tickets</CardTitle>
          <div className={`flex items-center gap-3 px-3 py-1.5 rounded-lg border ${ticketSalesEnabled ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
            <span className="text-xs text-gray-200 font-medium">
              {ticketSalesEnabled ? 'Ventas habilitadas' : 'Ventas deshabilitadas'}
            </span>
            <Switch checked={ticketSalesEnabled} onChange={() => handleUpdateTicketSales()} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <SearchIcon className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 bg-secondary border-border text-white placeholder-gray-400 h-9 text-sm"
            />
          </div>
          <Button
            onClick={() => handleGenerarTicket(true)}
            disabled={!ticketSalesEnabled}
            size="sm"
            className="bg-primary hover:bg-primary/90 text-white shrink-0"
          >
            <PlusIcon className="h-4 w-4 mr-1.5" />
            Nuevo
          </Button>
        </div>
      </CardHeader>

      {/* Table */}
      <CardContent className="pt-0 pb-3">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border text-left">
                <TableHead className="text-muted-foreground">Nombre</TableHead>
                {event.dni_required && <TableHead className="text-muted-foreground">DNI</TableHead>}
                <TableHead className="text-muted-foreground hidden sm:table-cell">Tipo</TableHead>
                <TableHead className="text-muted-foreground hidden sm:table-cell">Vendedor</TableHead>
                <TableHead className="text-muted-foreground text-center w-24">Escaneado</TableHead>
                <TableHead className="text-muted-foreground hidden sm:table-cell text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow
                  key={ticket.id}
                  className="border-border cursor-pointer sm:cursor-default hover:bg-secondary/30 transition-colors"
                  onClick={() => {
                    if (window.innerWidth < 640) {
                      setSelectedTicket(ticket);
                    }
                  }}
                >
                  <TableCell>
                    <span className="text-white truncate block max-w-[140px] sm:max-w-none">
                      {ticket.owner_name} {ticket.owner_lastname}
                    </span>
                    <span className="text-xs text-muted-foreground sm:hidden block mt-0.5">
                      {ticket.ticket_tag.name} · {ticket.seller_name === 'Unknown' ? 'Organizer' : ticket.seller_name}
                    </span>
                  </TableCell>
                  {event.dni_required && (
                    <TableCell className="text-muted-foreground truncate max-w-[80px]">{ticket.owner_dni || '—'}</TableCell>
                  )}
                  <TableCell className="text-muted-foreground hidden sm:table-cell">{ticket.ticket_tag.name}</TableCell>
                  <TableCell className="text-muted-foreground hidden sm:table-cell">{ticket.seller_name === 'Unknown' ? 'Organizer' : ticket.seller_name}</TableCell>
                  <TableCell className="text-center">
                    {ticket.scanned
                      ? <span className="text-xs font-medium text-green-400">✓ Sí</span>
                      : <span className="text-xs font-medium text-muted-foreground">✗ No</span>
                    }
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-white"
                        onClick={() => copyToClipboard(`¡Acá está tu ticket para el evento ${event.name} 🎟️!\n\n ${window.location.origin}/ticket/${ticket.uuid}`)}
                        title="Compartir"
                      >
                        <Share2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-white"
                        onClick={() => copyToClipboard(`${window.location.origin}/ticket/${ticket.uuid}`)}
                        title="Copiar enlace"
                      >
                        <LinkIcon className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-white"
                        onClick={() => window.open(`/ticket/${ticket.uuid}`, '_blank')}
                        title="Ver ticket"
                      >
                        <EyeIcon className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-red-400"
                        onClick={() => {
                          handleDeleteTicket(ticket.id);
                          setCurrentPage(1);
                        }}
                        title="Eliminar"
                      >
                        <Trash2Icon className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="text-muted-foreground hover:text-white disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
          </Button>
          <span className="text-xs text-muted-foreground">Página {currentPage}</span>
          <Button
            variant="ghost"
            size="sm"
            disabled={!hasMoreTickets}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="text-muted-foreground hover:text-white disabled:opacity-30"
          >
            Siguiente <ChevronRight className="h-4 w-4 ml-1" />
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
  const { event, copyToClipboard, setItemToDelete, setIsDeleteConfirmDialogOpen } = useContext(EventDetailsContext);
  const handleDeleteTicket = useCallback(
    (id_ticket) => {
      setItemToDelete({ type: 'ticket', id: id_ticket });
      setIsDeleteConfirmDialogOpen(true);
    },
    [setItemToDelete, setIsDeleteConfirmDialogOpen]
  );

  return (
    <Dialog className="" open={!!ticket} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-card ">
        <DialogHeader>
          <DialogTitle className="text-white">Acciones para el ticket</DialogTitle>
        </DialogHeader>
        <DialogDescription className="mb-0 m-0 text-muted-foreground">Selecciona una acción para realizar sobre el ticket de:</DialogDescription>
        <div className="text-muted-foreground">
          <p>
            <strong>Nombre:</strong> {ticket?.owner_name} {ticket?.owner_lastname}
          </p>
          {event.dniRequired && (
            <p>
              <strong>DNI:</strong> {ticket?.owner_dni || 'No disponible'}
            </p>
          )}
          <p>
            <strong>Tipo:</strong> {ticket?.ticket_tag.name}
          </p>
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
                navigator
                  .share({
                    title: `🎟️ Tu ticket para el evento ${event.name}`,
                    text: `¡Acá está tu ticket para el evento ${event.name} 🎟️!🎉\n${ticket.owner_name} ${ticket.owner_lastname}:\n`,
                    url: `${window.location.origin}/ticket/${ticket.uuid}`,
                  })
                  .catch(console.error);
              } else {
                notifyInfo(`Comparte este enlace: ${window.location.origin}/ticket/${ticket.uuid}`);
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
