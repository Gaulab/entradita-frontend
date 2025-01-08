import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dropdown } from '@/components/ui/dropdownlist';
import { AlertCircle, CreditCard, Plus, Trash2, Ticket } from 'lucide-react';
import { getPurchaseInfo } from '../api/eventApi';
import { motion, AnimatePresence } from 'framer-motion';

export default function TicketPurchasePage() {
  const { event_id } = useParams();
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [valueDropdown, setValueDropdown] = useState(null);
  const [currentTicket, setCurrentTicket] = useState({
    ticketType: null,
    name: '',
    lastName: '',
    dni: '',
  });
  const [tickets, setTickets] = useState([]);
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const details = await getPurchaseInfo(event_id);
        setEventDetails(details);
        setLoading(false);
      } catch (error) {
        setError('Error al cargar los detalles del evento');
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [event_id]);

  useEffect(() => {
    if (eventDetails && tickets.length > 0) {
      const cost = tickets.reduce((total, ticket) => {
        return total + ticket.ticketType.price;
      }, 0);
      setTotalCost(cost);
    } else {
      setTotalCost(0);
    }
  }, [tickets, eventDetails]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentTicket((prev) => ({ ...prev, [name]: value }));
  };

  const handleDropdownChange = (selectedOption) => {
    setValueDropdown(selectedOption);
    setCurrentTicket((prev) => ({
      ...prev,
      ticketType: selectedOption,
    }));
  };

  const addTicket = () => {
    if (tickets.length < 10 && currentTicket.ticketType && currentTicket.name && currentTicket.lastName) {
      setTickets((prev) => [...prev, currentTicket]);
      setCurrentTicket({ ticketType: null, name: '', lastName: '', dni: '' });
      setValueDropdown(null);
    }
  };

  const removeTicket = (index) => {
    setTickets(tickets.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos de los tickets:', tickets);
    console.log('Costo total:', totalCost);
    // Aquí iría la lógica para iniciar el proceso de pago con Mercado Pago
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen bg-gray-900"><div className="text-white text-2xl">Cargando...</div></div>;
  if (error) return <div className="flex justify-center items-center min-h-screen bg-gray-900"><div className="text-red-500 text-2xl">{error}</div></div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 sm:py-8 sm:px-4 lg:px-8">
      <Card className="max-w-4xl mx-auto bg-gray-800 text-white border border-gray-700 shadow-xl max-sm:rounded-none">
        <CardHeader className="bg-gradient-to-t from-gray-700 to-gray-800/35 text-white p-6 rounded-t-lg">
          <h1 className='text-4xl text-center font-bold mb-2'>{eventDetails.event_name}</h1>
          <CardTitle className="text-2xl font-bold text-center">Comprar Tickets</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1  gap-6 mb-6">
            <div className="bg-gray-700 p-4 rounded-lg shadow-inner">
              <h3 className="text-xl font-semibold mb-4">Precio de las entradas</h3>
              <ul className="space-y-2">
                {eventDetails.ticket_tags.map((tag) => (
                  <li key={tag.id} className="flex justify-between items-center">
                    <span>{tag.name}</span> 
                    <span className="flex-grow border-t-2 border-dashed border-gray-50/40 mx-2"></span>
                    <span className="font-bold">${tag.price.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-center space-x-2 text-yellow-300 bg-gray-700 p-4 rounded-md">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">Completar con datos reales, ya que serán utilizados para la generación de los tickets</p>
            </div>
            <div className="space-y-4 p-4 bg-gray-700 rounded-lg shadow-md">
              <div className="space-y-2">
                <Label htmlFor="ticketType" className="text-gray-200">
                  Tipo de Ticket
                </Label>
                <Dropdown
                  id="ticketType"
                  name="ticketType"
                  placeholder="Seleccionar tipo de ticket"
                  onChange={handleDropdownChange}
                  value={valueDropdown}
                  options={eventDetails.ticket_tags}
                  className="bg-gray-600 border-gray-500 text-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input type="text" id="name" name="name" value={currentTicket.name} onChange={handleInputChange} className="bg-gray-600 text-white" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido</Label>
                  <Input type="text" id="lastName" name="lastName" value={currentTicket.lastName} onChange={handleInputChange} className="bg-gray-600 text-white" required />
                </div>
              </div>

              {eventDetails.dni_required && (
                <div className="space-y-2">
                  <Label htmlFor="dni">DNI</Label>
                  <Input type="text" id="dni" name="dni" value={currentTicket.dni} onChange={handleInputChange} className="bg-gray-600 text-white" required />
                </div>
              )}

              <Button
                type="button"
                variant="outline"
                className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white"
                onClick={addTicket}
                disabled={tickets.length >= 10 || !currentTicket.ticketType || !currentTicket.name || !currentTicket.lastName}
              >
                <Plus className="mr-2 h-4 w-4" />
                Agregar ticket
              </Button>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-xl">Tickets Seleccionados</h3>
              <AnimatePresence>
                {tickets.map((ticket, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex justify-between items-center bg-gray-700 p-3 rounded-md shadow-md"
                  >
                    <div className="flex items-center space-x-2">
                      <Ticket className="h-5 w-5 text-blue-400" />
                      <span>
                        {ticket.name} - {ticket.lastName} - {eventDetails.dni_required && `${ticket.dni} - `}{ticket.ticketType.name}
                      </span>
                      
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="font-semibold">${ticket.ticketType.price.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      <Button type="button" variant="destructive" size="sm" onClick={() => removeTicket(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg shadow-inner">
              <h3 className="text-xl font-semibold mb-4">Resumen de Compra</h3>
              <div className="space-y-4">
                <p>Tickets seleccionados: {tickets.length}</p>
                <p className="text-2xl font-bold">Total: ${totalCost.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
            </div>
                
            <div className="flex items-center justify-center space-x-2 text-blue-300 bg-gray-700 p-4 rounded-md">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">El pago se procesará de forma segura a través de Mercado Pago</p>
            </div>
          </form>
        </CardContent>
        <CardFooter className="bg-gray-800 pt-0 px-6">
          <Button 
            type="submit" 
            variant="entraditaSuccess"
            className="w-full"
            onClick={handleSubmit} 
            disabled={tickets.length === 0}
          >
            <CreditCard className="mr-2 h-5 w-5" />
            Proceder al pago ({tickets.length} ticket{tickets.length !== 1 ? 's' : ''})
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

