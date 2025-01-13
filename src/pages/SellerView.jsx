// entraditaFront/src/pages/SellerView.jsx
// react imports
import { useState, useEffect, useCallback } from 'react';
// react-router imports
import { useNavigate } from 'react-router-dom';
// lucide-react icons imports
import { PlusIcon, SearchIcon, EyeIcon, Trash2Icon, LinkIcon, ShoppingCart, Share2 } from 'lucide-react';
// prop-types imports
import PropTypes from 'prop-types';
// custom components
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
// apis imports
import { deleteTicketBySeller } from '../api/ticketApi';
import { checkPassword } from '../api/employeeApi';
import { getSeller } from '../api/employeeApi';

export default function VendedorView({ uuid }) {
  // main states
  const [tickets, setTickets] = useState([]);
  const [vendedor, setVendedor] = useState(null);
  const [dniRequired, setDniRequired] = useState(false);
  const [ticketsSalesEnabled, setTicketsSalesEnabled] = useState(true);
  const [organizerHasCapacity, setOrganizerHasCapacity] = useState(true);
  // password states
  const [password, setPassword] = useState('');
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // search states
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [vendedorNotFound, setVendedorNotFound] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState(null);
  const [copyMessage, setCopyMessage] = useState('');
  const [ticketTags, setTicketTags] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const pageCount = Math.ceil(filteredTickets.length / itemsPerPage);
  const paginatedTickets = filteredTickets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const navigate = useNavigate();

  const copyToClipboard = useCallback((text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopyMessage('Copiado');
        setTimeout(() => setCopyMessage(''), 2000); // El mensaje desaparece después de 2 segundos
      })
      .catch((err) => {
        console.error('Error al copiar: ', err);
        setCopyMessage('Error al copiar');
        setTimeout(() => setCopyMessage(''), 2000);
      });
  }, []);

  const shareTicketLink = useCallback(
    (link) => {
      if (navigator.share) {
        navigator
          .share({
            title: 'Compartir Ticket',
            text: 'Aquí está el enlace de tu ticket QR:',
            url: link,
          })
          .then(() => {
            console.log('Compartido exitosamente');
          })
          .catch((err) => {
            console.error('Error al intentar compartir:', err);
          });
      } else {
        copyToClipboard(link);
      }
    },
    [copyToClipboard]
  );

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem('isPasswordCorrect');
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    const storedPasswordStatus = localStorage.getItem('isPasswordCorrect');
    if (storedPasswordStatus) {
      setIsPasswordCorrect(JSON.parse(storedPasswordStatus));
    }
    const fetchTickets = async () => {
      try {
        const data = await getSeller(uuid);
        setVendedor(data.seller);
        setTickets(data.tickets.sort((a, b) => b.id - a.id));
        setFilteredTickets(data.tickets);
        setTicketsSalesEnabled(data.sales_enabled);
        setDniRequired(data.dni_required);
        setOrganizerHasCapacity(data.organizer_has_capacity);
        setTicketTags(data.seller.ticket_tags);
      } catch (error) {
        console.error(error.message);
      }
    };
    if (isPasswordCorrect) {
      fetchTickets();
    }
  }, [uuid, isPasswordCorrect]);

  const verifyPassword = async () => {
    try {
      await checkPassword(uuid, password);
      setIsPasswordCorrect(true);
      localStorage.setItem('isPasswordCorrect', 'true');
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

  const handleShare = (ticket) => {
    console.log('uuid', uuid);
    if (navigator.share) {
      navigator
        .share({
          title: `🎟️ Tu ticket para el evento ${vendedor?.event_name}`,
          text: `¡Aquí está tu ticket para el evento ${vendedor?.event_name}! 🎉 ${ticket.owner_name} ${ticket.owner_lastname}\n`,
          url: `${window.location.origin}/ticket/${ticket.uuid}`,
        })
        .then(() => {
          console.log('Ticket compartido exitosamente');
        })
        .catch((error) => {
          console.log('Error sharing', error);
        });
    } else {
      // Fallback for browsers that don't support the Web Share API
      alert(`Comparte este enlace: ${ticket.uuid}`);
      navigator.clipboard
        .writeText(ticket.uuid)
        .then(() => {
          console.log('Ticket URL copiado al portapapeles');
        })
        .catch((error) => {
          console.log('Error al copiar el URL', error);
        });
    }
  };

  const handleCreateTicket = (dniRequired, ticketTags) => {
    navigate(`/seller/${uuid}/create-ticket`, { state: { dniRequired, ticketTags } });
  };

  const handleViewTicket = useCallback((ticketId) => {
    window.open(`/ticket/${ticketId}`, '_blank');
  }, []);

  const handleDeleteTicket = (ticket) => {
    setTicketToDelete(ticket);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDeleteTicket = async () => {
    if (!ticketToDelete) return;
    try {
      await deleteTicketBySeller(uuid, ticketToDelete.id);
      const remainingTickets = tickets.filter((t) => t.id !== ticketToDelete.id);
      setTickets(remainingTickets);
      setFilteredTickets(remainingTickets);

      // Actualizar el contador de tickets del vendedor
      setVendedor((prevVendedor) => ({
        ...prevVendedor,
        ticket_counter: prevVendedor.ticket_counter - 1,
      }));
    } catch (error) {
      console.error(error.message);
    }
    setIsDeleteConfirmOpen(false);
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

  const MobileActionDialog = ({ ticket, onClose }) => (
    <Dialog className="" open={!!ticket} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-gray-800 ">
        <DialogHeader>
          <DialogTitle>Acciones para el ticket</DialogTitle>
        </DialogHeader>
        <DialogDescription className="mb-0 m-0">Selecciona una accion para realizar sobre el ticket de:</DialogDescription>
        <div className="text-gray-300">
          <p>
            <strong>Nombre:</strong> {ticket?.owner_name} {ticket?.owner_lastname}
          </p>
          {dniRequired && (
            <p>
              <strong>DNI:</strong> {ticket?.owner_dni ? ticket.owner_dni : 'No disponible'}
            </p>
          )}
          <p>
            <strong>Tipo:</strong> {ticket?.ticket_tag.name}
          </p>
        </div>
        <div className="flex flex-col space-y-2 m-0">
          <Button
            className="justify-start"
            variant="entraditaSecondary"
            onClick={() => {
              onClose();
              copyToClipboard(`${window.location.origin}/ticket/${ticket?.uuid}`);
            }}
          >
            <LinkIcon className="mr-2 h-4 w-4" />
            Copiar enlace del ticket
          </Button>
          <Button className="justify-start" variant="entraditaSecondary" onClick={() => handleShare(ticket)}>
            <Share2 className="mr-2 h-4 w-4" />
            Compartir ticket
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

  return (
    <div className="flex justify-center pb-8 bg-gradient-to-b from-gray-900 to-gray-950 text-white pt-4 min-h-screen w-screen">
      <div className="max-w-6xl w-full mx-2">
        <Card className="bg-gray-800 border-gray-700 mb-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex flex-row ">
              <ShoppingCart className="mr-2" />
              Vendedor page
            </CardTitle>
            <CardDescription className="text-gray-400">Estas vendiendo para el evento {vendedor?.event_name}</CardDescription>
          </CardHeader>
          <CardContent>
            {vendedor && (
              <div className="mb-2 p-0">
                <h3 className="text-gray-200">
                  Nombre: <a className="text-blue-400 ">{vendedor.assigned_name}</a>
                </h3>
                {vendedor.status === false ? (
                  <p className="text-gray-200">
                    El organizador te <a className="text-red-400 ">deshabilito</a>
                  </p>
                ) : (
                  <p className="text-gray-200">
                    Tickets disponibles: <a className="text-blue-400 ">{vendedor.seller_capacity !== null ? vendedor.seller_capacity - vendedor.ticket_counter : 'ilimitados'} tickets</a>
                  </p>
                )}
                <p className="text-gray-200">
                  Tickets vendidos: <a className="text-blue-400 ">{vendedor.ticket_counter} </a>
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 ">
          <CardHeader>
            <CardTitle className="text-white ">Tickets</CardTitle>
            <CardDescription className="text-gray-400">
              Gestiona los tickets para el evento <br /> {window.innerWidth < 640 && 'Haz click en una fila para ver más acciones'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-2 gap-4">
              <Button
                disabled={
                  (vendedor && vendedor.status === false) ||
                  !ticketsSalesEnabled ||
                  (vendedor && vendedor.seller_capacity !== null && vendedor.ticket_counter >= vendedor.seller_capacity) ||
                  (vendedor && organizerHasCapacity === false)
                }
                onClick={() => handleCreateTicket(dniRequired, ticketTags)}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
              >
                <PlusIcon className="mr-2 h-4 w-4" /> Nuevo Ticket
              </Button>
              <div className="relative w-full sm:w-auto">
                <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar por Nombre o DNI"
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-8 w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
            </div>
            {(!ticketsSalesEnabled || !organizerHasCapacity) && <CardDescription className="text-red-400 mb-3">El organizador deshabilitó la venta de tickets</CardDescription>}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700 text-left">
                    <TableHead className="text-gray-300">Nombre</TableHead>
                    {dniRequired && <TableHead className="text-gray-300">DNI</TableHead>}
                    <TableHead className="text-gray-300 ">Tipo</TableHead>
                    <TableHead className="text-gray-300 text-right hidden sm:table-cell">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedTickets.map((ticket) => (
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
                      <TableCell className="text-gray-300 truncate overflow-hidden whitespace-nowrap max-w-28">
                        {ticket.owner_name} {ticket.owner_lastname}
                      </TableCell>
                      {dniRequired && <TableCell className="text-gray-300 truncate overflow-hidden whitespace-nowrap max-w-15">{ticket.owner_dni ? ticket.owner_dni : 'No disponible'}</TableCell>}
                      <TableCell className="text-gray-300 ">{ticket.ticket_tag.name}</TableCell>
                      <TableCell className="text-right space-x-1 space-y-1 min-w-40 hidden sm:table-cell">
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
            <div className="flex justify-between items-center mt-4">
              <Button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))} disabled={currentPage === 1} className="bg-gray-700 text-white">
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
      </div>
      {/* Mensaje de copiado simple */}
      {copyMessage && <div className="fixed bottom-4 right-4 bg-green-400 text-black px-4 py-2 rounded-md shadow-lg">{copyMessage}</div>}

      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen} className="">
        <DialogContent className="bg-gray-800 text-white ">
          <DialogHeader>
            <DialogTitle>Confirmar eliminación de ticket</DialogTitle>
            <DialogDescription>¿Estás seguro de que deseas eliminar este ticket? Esta acción no se puede deshacer.</DialogDescription>
          </DialogHeader>
          <DialogFooter className=" space-y-2">
            <Button onClick={() => setIsDeleteConfirmOpen(false)} variant="outline" className="bg-gray-700 text-white hover:bg-gray-600 mt-2">
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
