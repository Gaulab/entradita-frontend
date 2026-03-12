'use client';

// react imports
import { useState, useEffect, useCallback, useRef } from 'react';
// react-router imports
import { useNavigate } from 'react-router-dom';
// lucide-react icons imports
import { PlusIcon, SearchIcon, EyeIcon, Trash2Icon, LinkIcon, Printer, ChevronLeft, ChevronRight, ChevronRight as ChevronRightRow } from 'lucide-react';
// prop-types imports
import PropTypes from 'prop-types';
// custom components
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// apis imports
import { deleteTicketBySeller } from '@/api/ticketApi';
import { checkPassword } from '@/api/employeeApi';
import { getSeller } from '@/api/employeeApi';
// custom components
import MobileActionDialog from '@/components/seller/MobileActionDialog';
import PasswordForm from '@/components/seller/PasswordForm';
import { notifyInfo } from '@/utils/notify';

import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';

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
  const [vendedorNotFound] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState(null);
  const [copyMessage, setCopyMessage] = useState('');
  const [ticketTags, setTicketTags] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const pageCount = Math.ceil(filteredTickets.length / itemsPerPage);
  const paginatedTickets = filteredTickets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Print states
  const [printPayload, setPrintPayload] = useState(null);

  // Ref al div oculto que tendrá el <QRCodeSVG> para "foto" con html2canvas
  const hiddenQrRef = useRef(null);

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
      setPasswordError('');
    } catch (error) {
      if (error.response?.status === 429) {
        setPasswordError('Demasiados intentos. Intenta nuevamente en un minuto.');
      } else {
        setPasswordError('Contraseña incorrecta.');
      }
    }
  };

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    if (term) {
      const filtered = tickets.filter((ticket) =>
        `${ticket.owner_name} ${ticket.owner_lastname}`.toLowerCase().includes(term) ||
        (ticket.owner_dni && ticket.owner_dni.toLowerCase().includes(term))
      );
      setFilteredTickets(filtered);
    } else {
      setFilteredTickets(tickets);
    }
  };

  const handleShare = (ticket) => {
    if (navigator.share) {
      navigator
        .share({
          title: `🎟️ Tu ticket para el evento ${vendedor?.event_name}`,
          text: `¡Acá está tu ticket para el evento ${vendedor?.event_name} 🎟️!\n${ticket.owner_name} ${ticket.owner_lastname}:\n`,
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
      notifyInfo(`Comparte este enlace: ${window.location.origin}/ticket/${ticket.uuid}`);
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

  const handlePrintTicketQR = async (ticket) => {
    if (!ticket) return;

    setPrintPayload(ticket.qr_payload);

    setTimeout(async () => {
      if (!hiddenQrRef.current) return;
      try {
        const canvas = await html2canvas(hiddenQrRef.current, {
          scale: 4,
          backgroundColor: null,
        });
        const dataUrl = canvas.toDataURL('image/png');

        const printWindow = window.open('', '_blank', `width=800,height=600`);
        if (!printWindow) return;

        const eventDate = ticket.event_date ? new Date(ticket.event_date).toLocaleDateString('es-ES') : 'Fecha no disponible';
        const ticketDate = new Date(ticket.created_at).toLocaleDateString('es-ES');

        const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Ticket - ${ticket.owner_name} ${ticket.owner_lastname}</title>
            <meta charset="UTF-8">
            <style>
              @page {
                size: A4;
                margin: 0;
              }
              body {
                margin: 0;
                padding: 0;
                font-family: 'Helvetica', 'Arial', sans-serif;
                background-color: white;
              }
              .page {
                width: 210mm;
                height: 297mm;
                padding: 15mm;
                box-sizing: border-box;
                position: relative;
                background-color: #f5f5f5;
              }
              .instructions-header {
                text-align: center;
                margin-bottom: 20px;
                color: #666;
              }
              .instructions-header h1 {
                margin: 0 0 10px;
                font-size: 24px;
                color: #333;
              }
              .instructions-header p {
                margin: 0;
                font-size: 14px;
              }
              .ticket-container {
                width: 180mm;
                margin: 0 auto;
                position: relative;
              }
              .cut-line-top {
                border-top: 3px dashed #999;
                margin-bottom: 15px;
                position: relative;
                background-color: #f5f5f5;
              }
              .cut-line-bottom {
                border-bottom: 3px dashed #999;
                margin-top: 15px;
                position: relative;
                background-color: #f5f5f5;
              }
              .scissors-left {
                position: absolute;
                left: 20px;
                top: -12px;
                font-size: 20px;
                color: #666;
              }
              .scissors-right {
                position: absolute;
                right: 20px;
                top: -12px;
                font-size: 20px;
                color: #666;
              }
              .ticket-main {
                background-color: white;
                display: flex;
                min-height: 180px;
                position: relative;
              }
              .ticket-left {
                width: 180px;
                padding: 20px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background-color: white;
                border-right: 2px dashed #ddd;
              }
              .qr-code {
                width: 140px;
                height: 140px;
                margin-bottom: 10px;
              }
              .qr-label {
                font-size: 12px;
                color: #666;
                text-align: center;
              }
              .ticket-right {
                flex: 1;
                padding: 20px 25px;
                background-color: white;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
              }
              .ticket-header {
                margin-bottom: 15px;
              }
              .event-name {
                font-size: 20px;
                font-weight: bold;
                color: #333;
                margin: 0 0 5px;
              }
              .event-date {
                font-size: 14px;
                color: #666;
                margin: 0;
              }
              .ticket-info {
                flex: 1;
              }
              .info-row {
                display: flex;
                margin-bottom: 8px;
                align-items: center;
              }
              .info-label {
                font-weight: bold;
                width: 100px;
                color: #555;
                font-size: 13px;
              }
              .info-value {
                flex: 1;
                font-size: 13px;
                color: #333;
              }
              .ticket-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 15px;
                padding-top: 15px;
                border-top: 1px solid #eee;
              }
              .entradita-brand {
                font-size: 12px;
                color: #666;
                font-weight: bold;
              }
              .ticket-id {
                font-size: 10px;
                color: #999;
                font-family: monospace;
              }
              .instructions-section {
                margin-top: 30px;
                padding: 20px;
                background-color: #f9f9f9;
                border-radius: 8px;
                color: #666;
              }
              .instructions-section h3 {
                margin: 0 0 15px;
                font-size: 16px;
                color: #333;
              }
              .instructions-list {
                margin: 0;
                padding-left: 20px;
              }
              .instructions-list li {
                margin-bottom: 8px;
                font-size: 14px;
                line-height: 1.4;
              }
              .footer-note {
                margin-top: 20px;
                text-align: center;
                font-size: 12px;
                color: #999;
                line-height: 1.4;
              }
              @media print {
                .no-print {
                  display: none;
                }
              }
            </style>
          </head>
          <body>
            <div class="page">
              <div class="instructions-header">
                <h1>Ticket para ${vendedor?.event_name || 'Evento'}</h1>
                <p>Generado por entradita.com - ${eventDate}</p>
              </div>
              
              <div class="ticket-container">
                <div class="cut-line-top">
                  <span class="scissors-left">✂</span>
                  <span class="scissors-right">✂</span>
                </div>
                
                <div class="ticket-main">
                  <div class="ticket-left">
                    <img src="${dataUrl}" alt="Código QR del ticket" class="qr-code" />
                    <div class="qr-label">Código de Acceso</div>
                  </div>
                  
                  <div class="ticket-right">
                    <div class="ticket-header">
                      <h2 class="event-name">${vendedor?.event_name || 'Evento'}</h2>
                      <p class="event-date">${eventDate}</p>
                    </div>
                    
                    <div class="ticket-info">
                      <div class="info-row">
                        <div class="info-label">Nombre:</div>
                        <div class="info-value">${ticket.owner_name} ${ticket.owner_lastname}</div>
                      </div>
                      
                      ${
                        dniRequired && ticket.owner_dni
                          ? `
                      <div class="info-row">
                        <div class="info-label">DNI:</div>
                        <div class="info-value">${ticket.owner_dni}</div>
                      </div>
                      `
                          : ''
                      }
                      
                      <div class="info-row">
                        <div class="info-label">Tipo:</div>
                        <div class="info-value">${ticket.ticket_tag.name}</div>
                      </div>
                      
                      <div class="info-row">
                        <div class="info-label">Emisión:</div>
                        <div class="info-value">${ticketDate}</div>
                      </div>
                    </div>
                    
                    <div class="ticket-footer">
                      <div class="entradita-brand">entradita.com</div>
                      <div class="ticket-id">#${ticket.uuid.substring(0, 8)}</div>
                    </div>
                  </div>
                </div>
                
                <div class="cut-line-bottom">
                  <span class="scissors-left">✂</span>
                  <span class="scissors-right">✂</span>
                </div>
              </div>
              
              <div class="instructions-section">
                <h3>Instrucciones de Uso</h3>
                <ol class="instructions-list">
                  <li>Recorta el ticket por las líneas punteadas marcadas con tijeras</li>
                  <li>Conserva el ticket completo hasta el día del evento</li>
                  <li>Presenta el código QR en la entrada del evento para el escaneo</li>
                  <li>El código QR es único e intransferible</li>
                  <li>En caso de pérdida, contacta al organizador del evento</li>
                </ol>
              </div>
              
              <div class="footer-note">
                <p>Este ticket es personal e intransferible. La organización se reserva el derecho de admisión.</p>
                <p>Ticket generado por entradita.com - Plataforma de gestión de eventos</p>
              </div>
            </div>
            
            <script>
              window.onload = function() {
                window.print();
                setTimeout(function() {
                  window.close();
                }, 500);
              };
            </script>
          </body>
        </html>
      `;

        printWindow.document.write(html);
        printWindow.document.close();
      } catch (err) {
        console.error('Error al imprimir:', err);
      } finally {
        setPrintPayload(null);
      }
    }, 50);
  };

  if (vendedorNotFound) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <h1 className="text-2xl">Vendedor no encontrado</h1>
      </div>
    );
  }

  if (!isPasswordCorrect) {
    return <PasswordForm password={password} setPassword={setPassword} verifyPassword={verifyPassword} passwordError={passwordError} />;
  }

  return (
    <>
      {/* Contenedor oculto para el QR */}
      <div
        ref={hiddenQrRef}
        style={{
          position: 'absolute',
          top: '-9999px',
          left: '-9999px',
        }}
      >
        {printPayload && (
          <div className="bg-white p-0 rounded-xl mb-4">
            <QRCodeSVG id="qr-to-print" value={printPayload} size={260} level="M" fgColor="#000000" bgColor="#FFFFFF" />
          </div>
        )}
      </div>

      {/* UI principal */}
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white">
        <div className="max-w-4xl mx-auto px-3 py-4 space-y-3">

          {/* Branding */}
          <div className="flex items-center gap-2 px-1">
            <img src="/isotipoWhite.png" alt="Entradita" className="w-7 h-7" />
            <span className="font-bold text-white/90 text-sm tracking-wide">entradita.com</span>
          </div>

          {/* Header con info del vendedor */}
          <Card className="bg-gray-800 border-gray-700 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-blue-500 via-blue-400 to-cyan-400" />
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <CardTitle className="text-white text-lg sm:text-xl truncate">
                    {vendedor?.assigned_name}
                  </CardTitle>
                  <p className="text-sm text-gray-400 mt-0.5 truncate">{vendedor?.event_name}</p>
                </div>
                {vendedor?.status === false && (
                  <span className="shrink-0 text-xs font-semibold bg-red-500/15 text-red-400 px-2.5 py-1 rounded-full">
                    Deshabilitado
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-blue-500/10 border border-blue-500/15 rounded-md py-2 px-3 text-center">
                  <p className="text-xs text-gray-400">Vendidos</p>
                  <p className="text-xl font-bold text-blue-300">{vendedor?.ticket_counter ?? 0}</p>
                </div>
                <div className="bg-cyan-500/10 border border-cyan-500/15 rounded-md py-2 px-3 text-center">
                  <p className="text-xs text-gray-400">Disponibles</p>
                  <p className="text-xl font-bold text-cyan-300">
                    {vendedor?.seller_capacity != null
                      ? vendedor.seller_capacity - vendedor.ticket_counter
                      : '∞'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tickets */}
          <Card className="bg-gray-800 border-gray-700 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-blue-500/50 to-transparent" />
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-lg">Tickets</CardTitle>
                <Button
                  size="sm"
                  disabled={
                    (vendedor && vendedor.status === false) ||
                    !ticketsSalesEnabled ||
                    (vendedor && vendedor.seller_capacity !== null && vendedor.ticket_counter >= vendedor.seller_capacity) ||
                    (vendedor && organizerHasCapacity === false)
                  }
                  onClick={() => handleCreateTicket(dniRequired, ticketTags)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <PlusIcon className="h-4 w-4 mr-1.5" />
                  <span className="hidden sm:inline">Nuevo Ticket</span>
                  <span className="sm:hidden">Nuevo</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              {(!ticketsSalesEnabled || !organizerHasCapacity) && (
                <div className="bg-red-500/10 text-red-400 text-sm px-3 py-2 rounded-md">
                  El organizador deshabilitó la venta de tickets
                </div>
              )}

              <div className="relative">
                <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Buscar por nombre o DNI..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-8 bg-gray-700 border-gray-600 text-white placeholder-gray-500 max-w-sm"
                />
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-400">Nombre</TableHead>
                      {dniRequired && <TableHead className="text-gray-400 hidden sm:table-cell">DNI</TableHead>}
                      <TableHead className="text-gray-400 hidden sm:table-cell">Tipo</TableHead>
                      <TableHead className="text-gray-400 text-right hidden sm:table-cell">Acciones</TableHead>
                      <TableHead className="text-gray-400 w-6 p-0 sm:hidden" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedTickets.map((ticket) => (
                      <TableRow
                        key={ticket.id}
                        className="border-gray-700 cursor-pointer sm:cursor-default hover:bg-gray-700/50 transition-colors"
                        onClick={() => {
                          if (window.innerWidth < 640) {
                            setSelectedTicket(ticket);
                          }
                        }}
                      >
                        <TableCell className="text-gray-200">
                          <span className="block truncate">{ticket.owner_name} {ticket.owner_lastname}</span>
                          <span className="block sm:hidden text-xs text-gray-400 mt-0.5">{ticket.ticket_tag.name}</span>
                        </TableCell>
                        {dniRequired && (
                          <TableCell className="text-gray-300 hidden sm:table-cell">
                            {ticket.owner_dni || '—'}
                          </TableCell>
                        )}
                        <TableCell className="text-gray-300 hidden sm:table-cell">{ticket.ticket_tag.name}</TableCell>
                        <TableCell className="text-right hidden sm:table-cell">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
                              onClick={(e) => { e.stopPropagation(); shareTicketLink(`${window.location.origin}/ticket/${ticket.uuid}`); }}
                              title="Compartir"
                            >
                              <LinkIcon className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
                              onClick={(e) => { e.stopPropagation(); handleViewTicket(ticket.uuid); }}
                              title="Ver ticket"
                            >
                              <EyeIcon className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
                              onClick={(e) => { e.stopPropagation(); handlePrintTicketQR(ticket); }}
                              title="Imprimir QR"
                            >
                              <Printer className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0 text-gray-400 hover:text-red-400 hover:bg-gray-700"
                              onClick={(e) => { e.stopPropagation(); setTicketToDelete(ticket); setIsDeleteConfirmOpen(true); }}
                              title="Eliminar"
                            >
                              <Trash2Icon className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="sm:hidden w-6 p-0 pr-3">
                          <ChevronRightRow className="h-4 w-4 text-gray-500" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {pageCount > 1 && (
                <div className="flex items-center justify-center gap-3 pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-gray-400">{currentPage}/{pageCount}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white"
                    disabled={currentPage === pageCount}
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, pageCount))}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>

            <MobileActionDialog
              ticket={selectedTicket}
              onClose={() => setSelectedTicket(null)}
              copyToClipboard={copyToClipboard}
              handleShare={handleShare}
              handleViewTicket={handleViewTicket}
              handleDeleteTicket={(ticket) => { setTicketToDelete(ticket); setIsDeleteConfirmOpen(true); }}
              handlePrintTicket={handlePrintTicketQR}
            />
          </Card>
          {/* Footer */}
          <p className="text-center text-xs text-gray-600 pt-2 pb-4">
            Powered by <span className="font-semibold text-gray-500">entradita.com</span>
          </p>
        </div>

        {copyMessage && (
          <div className="fixed bottom-4 right-4 bg-green-500/90 text-white text-sm px-4 py-2 rounded-lg shadow-lg">
            {copyMessage}
          </div>
        )}

        <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
          <DialogContent className="bg-gray-800 text-white border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Eliminar ticket</DialogTitle>
              <DialogDescription className="text-gray-300">
                ¿Estás seguro? Esta acción no se puede deshacer.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button onClick={() => setIsDeleteConfirmOpen(false)} variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-700">
                Cancelar
              </Button>
              <Button onClick={confirmDeleteTicket} className="bg-red-600 hover:bg-red-700 text-white border-0">
                Eliminar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

VendedorView.propTypes = {
  uuid: PropTypes.string.isRequired,
};
