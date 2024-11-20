import { useState } from "react";
import { useNavigate } from "react-router-dom";
// Custom components
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../components/ui/card";
import { Switch } from "../../../components/ui/switch";
import { PlusIcon, SearchIcon, EyeIcon, Trash2Icon, LinkIcon } from "lucide-react";
// API
import { updateTicketSales } from "../../../api/eventApi";

export default function Tickets({ id, paginatedTickets, setSearchTerm, searchTerm, copyToClipboard, handleEliminarTicket, currentPage, setCurrentPage, itemsPerPage, pageCount, ticketSalesEnabled, handleUpdateTicketSales }) {
    const navigate = useNavigate();

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
                    <Button onClick={() => navigate(`/event/${id}/create-ticket`)} disabled={!ticketSalesEnabled} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
                        <PlusIcon className="mr-2 h-4 w-4"/> Nuevo Ticket
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
                                <TableHead className="text-gray-300 hidden sm:table-cell">ID</TableHead>
                                <TableHead className="text-gray-300">Nombre</TableHead>
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
                                    <TableCell className="text-right space-x-1 space-y-1">
                                        <Button variant="outline" onClick={() => copyToClipboard(`${window.location.origin}/ticket/${ticket.uuid}`)} size="sm" title="Copiar enlace de ticket">
                                            <LinkIcon className="h-4 w-4" />
                                            <span className="sr-only">Copiar enlace de ticket</span>
                                        </Button>
                                        <Button variant="outline" onClick={() => window.open(`/ticket/${ticket.uuid}`, "_blank")} size="sm" title="Ver ticket">
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
        </Card>
    )
} 