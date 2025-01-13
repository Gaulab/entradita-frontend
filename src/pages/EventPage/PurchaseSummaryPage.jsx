import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CreditCard, Mail, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePurchase } from '@/context/PurchaseContext';

export default function PurchaseSummaryPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { purchaseData } = usePurchase();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    console.log('Submitting purchase:', { ...purchaseData, email, whatsapp });

    setTimeout(() => {
      setIsSubmitting(false);
      alert('Redirecting to payment gateway...');
      // navigate('/payment-gateway');
    }, 1500);
  };

  if (!purchaseData) {
    return <div>No purchase data available. Please select tickets first.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 sm:py-8 sm:px-4 lg:px-8">
      <Card className="max-w-2xl mx-auto bg-gray-800 text-white border border-gray-700 shadow-xl">
        <CardHeader className="bg-gradient-to-t from-gray-700 to-gray-800/35 text-white p-6 rounded-t-lg">
          <CardTitle className="text-3xl font-bold text-center">Resumen de Compra</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">{purchaseData.eventName}</h2>
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Tickets</h3>
                <ul className="space-y-4">
                  {purchaseData.tickets.map((ticket, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-600 p-3 rounded-md"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold">{ticket.ticketType.name}</span>
                        <span className="font-semibold">${ticket.ticketType.price.toLocaleString('es-ES')}</span>
                      </div>
                      <div className="text-sm">
                        <p>Nombre: {ticket.name} {ticket.lastName}</p>
                        {ticket.dni && <p>DNI: {ticket.dni}</p>}
                      </div>
                    </motion.li>
                  ))}
                </ul>
                <div className="mt-4 pt-2 border-t border-gray-600">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-lg font-bold">${purchaseData.totalCost.toLocaleString('es-ES')}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  Correo Electrónico
                </Label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="bg-gray-700 border-gray-600 text-white mt-1"
                />
              </div>
              <div>
                <Label htmlFor="whatsapp" className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  Número de WhatsApp
                </Label>
                <Input
                  type="tel"
                  id="whatsapp"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+54 9 11 1234-5678"
                  required
                  className="bg-gray-700 border-gray-600 text-white mt-1"
                />
              </div>
            </div>

            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center text-yellow-300">
                <AlertCircle className="w-5 h-5 mr-2" />
                <p className="text-sm">Los tickets serán enviados al correo electrónico y número de WhatsApp proporcionados.</p>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Proceder al Pago
                </span>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

