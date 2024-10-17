import { useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../components/ui/dialog";
import { PlusIcon, SearchIcon, EyeIcon, Trash2Icon } from "lucide-react";
import { Alert, AlertDescription } from "../components/ui/alert";
import AuthContext from '../context/AuthContext';

const generateMockTickets = (count) => {
    return Array.from({ length: count }, (_, index) => ({
        id: index + 1,
        name: `Nombre ${index + 1}`,
        surname: `Apellido ${index + 1}`,
        dni: `DNI${index + 1}`
    }));
};

export default function VendorView() {
    const { eventId, vendorId } = useParams();
    const { authToken } = useContext(AuthContext);
    const navigate = useNavigate();

    const [tickets, setTickets] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [ticketToDelete, setTicketToDelete] = useState(null);

    const itemsPerPage = 10;

    const fetchTickets = useCallback(async () => {
        setIsLoading(true);
        try {
            // Simulate fetching data
            const data = {
                results: generateMockTickets(itemsPerPage),
                count: 50 // Total number of mock tickets
            };
            setTickets(data.results);
            setTotalPages(Math.ceil(data.count / itemsPerPage));
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, searchTerm]);

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    const handleCreateTicket = () => {
        navigate(`/create-ticket/${eventId}`);
    };

    const handleViewTicket = (ticketId) => {
        window.open(`/ticket/${ticketId}`, '_blank');
    };

    const handleDeleteTicket = (ticket) => {
        setTicketToDelete(ticket);
        setDeleteConfirmOpen(true);
    };

    const confirmDeleteTicket = async () => {
        if (!ticketToDelete) return;
        try {
            // Simulate deleting a ticket
            setTickets(tickets.filter(t => t.id !== ticketToDelete.id));
            setDeleteConfirmOpen(false);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    if (isLoading) return <div className="text-center text-white">Cargando...</div>;
    if (error) return <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>;

    return (
        <div className="space-y-6 pb-8 bg-gray-900 text-white p-4 w-full min-h-screen">
             <div className='max-w-6xl mx-auto'>
            <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                    <CardTitle className="text-white text-2xl">Vista de Vendedor</CardTitle>
                    <CardDescription className="text-gray-400">Gestiona los tickets para este evento</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between items-center mb-4">
                        <Button onClick={handleCreateTicket} className="w-auto bg-blue-600 hover:bg-blue-700 text-white">
                            <PlusIcon className="mr-2 h-4 w-4" /> Crear Nuevo Ticket
                        </Button>
                        <div className="relative">
                            <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Buscar por nombre o DNI"
                                value={searchTerm}
                                onChange={handleSearch}
                                className="pl-8 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-gray-700">
                                    <TableHead className="text-gray-300">Nombre</TableHead>
                                    <TableHead className="text-gray-300 hidden md:table-cell">DNI</TableHead>
                                    <TableHead className="text-gray-300 text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tickets.map((ticket) => (
                                    <TableRow key={ticket.id} className="border-gray-700">
                                        <TableCell className="text-gray-300">{ticket.name} {ticket.surname}</TableCell>
                                        <TableCell className="text-gray-300 hidden md:table-cell">{ticket.dni}</TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button variant="outline" onClick={() => handleViewTicket(ticket.id)} size="sm" title="Ver ticket">
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
                        <Button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="bg-gray-700 text-white"
                        >
                            Anterior
                        </Button>
                        <span className="text-gray-400">
                            Página {currentPage} de {totalPages}
                        </span>
                        <Button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="bg-gray-700 text-white"
                        >
                            Siguiente
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
                <DialogContent className="bg-gray-800 text-white">
                    <DialogHeader>
                        <DialogTitle>Confirmar Eliminación</DialogTitle>
                        <DialogDescription>
                            ¿Estás seguro de que deseas eliminar el ticket de {ticketToDelete?.name} {ticketToDelete?.surname}?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={() => setDeleteConfirmOpen(false)} variant="outline" className="bg-gray-700 text-white hover:bg-gray-600">
                            Cancelar
                        </Button>
                        <Button onClick={confirmDeleteTicket} variant="destructive">
                            Eliminar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            </div>
        </div>
    );
}