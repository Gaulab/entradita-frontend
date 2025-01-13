import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AlertCircle, Save, CreditCard, CheckCircle, XCircle, PlusCircle, MinusCircle, HelpCircle } from 'lucide-react';
import { getPurchaseInfo, putPurchaseInfo } from '@/api/eventApi';
import AuthContext from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import { SiMercadopago } from "react-icons/si";

export default function TicketPurchaseConfig() {
  const { event_id } = useParams();
  const { authToken } = useContext(AuthContext);
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [mercadoPagoAuthStatus, setMercadoPagoAuthStatus] = useState('not_connected');

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const details = await getPurchaseInfo(event_id, authToken.access);
        console.log('details', details);
        setEventDetails(details);
        setTicketTypes(
          details.ticket_tags.map((tag) => ({
            ...tag,
            customQuantity: '',
          }))
        );
        setLoading(false);
      } catch (error) {
        setError('Error al cargar los detalles del evento');
        setLoading(false);
      }
    };
    fetchEventDetails();
  }, [event_id, authToken.access]);

  const handleToggleWebSale = (index) => {
    const updatedTicketTypes = [...ticketTypes];
    updatedTicketTypes[index].web_sale = !updatedTicketTypes[index].web_sale;
    if (!updatedTicketTypes[index].web_sale) {
      updatedTicketTypes[index].web_sale_quantity = null;
    }
    setTicketTypes(updatedTicketTypes);
  };

  const handleCustomQuantityChange = (index, value) => {
    const updatedTicketTypes = [...ticketTypes];
    updatedTicketTypes[index].customQuantity = value;
    setTicketTypes(updatedTicketTypes);
  };

  const handleAddCustomQuantity = (index) => {
    const updatedTicketTypes = [...ticketTypes];
    const customQuantity = parseInt(updatedTicketTypes[index].customQuantity) || 0;
    if (customQuantity > 0) {
      updatedTicketTypes[index].web_sale_quantity = (updatedTicketTypes[index].web_sale_quantity || 0) + customQuantity;
      updatedTicketTypes[index].customQuantity = '';
    }
    setTicketTypes(updatedTicketTypes);
  };

  const handleRemoveCustomQuantity = (index) => {
    const updatedTicketTypes = [...ticketTypes];
    const customQuantity = parseInt(updatedTicketTypes[index].customQuantity) || 0;
    if (customQuantity > 0) {
      updatedTicketTypes[index].web_sale_quantity = Math.max(0, (updatedTicketTypes[index].web_sale_quantity || 0) - customQuantity);
      updatedTicketTypes[index].customQuantity = '';
    }
    setTicketTypes(updatedTicketTypes);
  };

  const handleMercadoPagoAuth = async () => {
    // Aquí iría la lógica real de autenticación con Mercado Pago
    setMercadoPagoAuthStatus('connected');
    alert('Conexión con Mercado Pago simulada');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ticket_tags: ticketTypes.map((tag) => ({
        id: tag.id,
        web_sale: tag.web_sale,
        web_sale_quantity: tag.web_sale_quantity,
      })),
    };
    putPurchaseInfo(event_id, data, authToken.access)
      .then(() => {
        alert('Configuración guardada correctamente');
      })
      .catch((error) => {
        alert('Error al guardar la configuración');
      });
  };
  

  const handleHowToSellOnline = () => {
    alert('Aquí iría la información sobre cómo vender online.');
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="text-white text-2xl">Cargando...</div>
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="text-red-500 text-2xl">{error}</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 sm:py-8 sm:px-4 lg:px-8 ">
      <Card className="max-w-4xl mx-auto bg-gray-800 text-white border border-gray-700 shadow-xl max-sm:rounded-none">
        <CardHeader className="bg-gradient-to-t from-gray-700 to-gray-800/35 text-white p-6 rounded-t-lg">
          <CardTitle className="text-3xl font-bold text-center">Configuración venta online</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={handleSubmit}>
              <Save className="mr-2 h-5 w-5" />
              Guardar Configuración
            </Button>
            <Button onClick={handleHowToSellOnline} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              <HelpCircle className="mr-2 h-5 w-5" />
              ¿Cómo vender online?
            </Button>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Configuración de Mercado Pago</h3>
              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <Button onClick={handleMercadoPagoAuth} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
                  <SiMercadopago className="mr-2 h-7 w-7 " />
                  {mercadoPagoAuthStatus === 'connected' ? 'Reconectar Mercado Pago' : 'Conectar con Mercado Pago'}
                </Button>
                {mercadoPagoAuthStatus === 'connected' ? (
                  <div className="text-gray-900 font-bold bg-green-500 px-2 py-1 flex items-center rounded-full">
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Conectado a Mercado Pago
                  </div>
                ) : (
                  <div className="text-gray-900 font-bold bg-red-500 px-2 py-1 flex items-center rounded-full">
                    <XCircle className="mr-2 h-5 w-5" />
                    No conectado a Mercado Pago
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4">Tipos de Tickets</h3>
              <AnimatePresence>
                {ticketTypes.map((ticket, index) => (
                  <motion.div
                    key={ticket.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="bg-gray-700 p-4 rounded-lg mb-4"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                      <div>
                        <h4 className="text-lg font-semibold">{ticket.name}</h4>
                        <p className="text-sm text-gray-300">Precio: ${ticket.price}</p>
                      </div>
                      <div className="flex items-center mt-2 md:mt-0">
                        <Switch checked={ticket.web_sale} onCheckedChange={() => handleToggleWebSale(index)} className="mr-2" />
                        <span>{ticket.web_sale ? 'Venta web activa' : 'Venta web inactiva'}</span>
                      </div>
                    </div>
                    {ticket.web_sale && (
                      <div>
                        <p className="mb-2">Cantidad en venta: {ticket.web_sale_quantity !== null ? ticket.web_sale_quantity : 'N/A'}</p>
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                          <Input
                            type="number"
                            value={ticket.customQuantity}
                            onChange={(e) => handleCustomQuantityChange(index, e.target.value)}
                            placeholder="Cantidad"
                            className="w-full sm:w-32 bg-gray-600 text-white"
                            min="0"
                          />
                          <Button onClick={() => handleAddCustomQuantity(index)} className="w-full sm:w-auto bg-green-500 hover:bg-green-600">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Agregar
                          </Button>
                          <Button onClick={() => handleRemoveCustomQuantity(index)} className="w-full sm:w-auto bg-red-500 hover:bg-red-600">
                            <MinusCircle className="mr-2 h-4 w-4" />
                            Quitar
                          </Button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
