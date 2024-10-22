import { useState, useEffect, useCallback } from 'react';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { PlusIcon, SearchIcon, EyeIcon, Trash2Icon } from "lucide-react"; 
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const VendedorView = ({ uuid }) => {
    const [tickets, setTickets] = useState([]);
    const [filteredTickets, setFilteredTickets] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [vendedor, setVendedor] = useState(null); 
    const [vendedorNotFound, setVendedorNotFound] = useState(false); // Estado para manejar si el vendedor no fue encontrado
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/v1/employees/seller/${uuid}/info/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                
                if (response.status === 404) {
                    setVendedorNotFound(true); // Cambiar el estado si el vendedor no fue encontrado
                    return;
                }

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                console.log(data);
                setVendedor(data.vendedor);
                setTickets(data.tickets);
                setFilteredTickets(data.tickets);
            } catch (error) {
                console.error('Error fetching tickets:', error);
            }
        };

        fetchTickets();
    }, [uuid]);

    const handleSearch = (event) => {
        const term = event.target.value.toLowerCase();
        setSearchTerm(term);
        if (term) {
            const filtered = tickets.filter(ticket => 
                ticket.owner_name.toLowerCase().includes(term) || 
                ticket.owner_dni.toLowerCase().includes(term)
            );
            setFilteredTickets(filtered);
        } else {
            setFilteredTickets(tickets);
        }
    };

    const handleCreateTicket = () => {
        navigate(`/vendedor/${uuid}/create-ticket`);
    };

    const handleViewTicket = useCallback((ticketId) => {
        window.open(`/ticket/${ticketId}`, '_blank');
    }, []);

    const handleDeleteTicket = async (ticket) => {
        try {
            const response = await fetch(`http://localhost:8000/api/v1/employees/seller/${uuid}/delete-ticket/${ticket.id}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const remainingTickets = tickets.filter(t => t.id !== ticket.id);
            setTickets(remainingTickets);
            setFilteredTickets(remainingTickets);
        } catch (error) {
            console.error('Error deleting ticket:', error);
        }
    };

    if (vendedorNotFound) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
                <h1 className="text-2xl">Vendedor no encontrado</h1>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-8 bg-gray-900 text-white p-4 w-full min-h-screen">
            <div className='max-w-6xl mx-auto'>
                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-white text-2xl">Vista de Vendedor</CardTitle>
                        <CardDescription className="text-gray-400">Gestiona los tickets para el evento</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {vendedor && (
                            <div className="mb-4">
                                <h3 className="text-gray-300">Vendedor: {vendedor.assigned_name}</h3>
                                <p className="text-gray-400">Puedes vender: {vendedor.seller_capacity - vendedor.ticket_counter} tickets</p>
                            </div>
                        )}
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
                                    {filteredTickets.map((ticket) => (
                                        <TableRow key={ticket.id} className="border-gray-700">
                                            <TableCell className="text-gray-300">{ticket.owner_name} {ticket.owner_lastname}</TableCell>
                                            <TableCell className="text-gray-300 hidden md:table-cell">{ticket.owner_dni}</TableCell>
                                            <TableCell className="text-right space-x-2">
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
        </div>
    );
};

VendedorView.propTypes = {
    uuid: PropTypes.string.isRequired,
};

export default VendedorView;
