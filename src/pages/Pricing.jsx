import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Badge from '@/components/ui/badge';

const pricingPlans = [
  {
    title: 'Small pack',
    price: 149.99,
    ticketRange: 'Hasta 500 tickets',
    savings: 'Precio base',
    features: [
      'Todas las características',
    ],
  },
  {
    title: 'Medium pack',
    price: 100,
    ticketRange: '501 - 2000 tickets',
    savings: 'Ahorra hasta 33%',
    isPopular: true,
    features: [
      'Todas las características',
    ],
  },
  {
    title: 'Big pack',
    price: 79.99,
    ticketRange: 'Más de 2000 tickets',
    savings: 'Ahorra hasta 47%',
    features: [
      'Todas las características',
    ],
  },
];

const allFeatures = [
  'Generación de códigos QR',
  'Verificación rápida de tickets',
  'Gestión de vendedores',
  'Reportes avanzados',
  'Soporte prioritario',
  'Personalización de marca',
  'API personalizada',
  'Gestión multi-evento',
  'Análisis de datos avanzados',
];


function PricingCard({ plan }) {
  return (
    <Card className={`bg-gray-800 border-gray-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-1 ${plan.isPopular ? 'border-blue-500' : ''}`}>
      <CardHeader>
        <div className="flex justify-between items-center mb-2">
          <CardTitle className="text-white text-xl sm:text-2xl">{plan.title}</CardTitle>
          {plan.isPopular && <Badge variant="secondary">Más popular</Badge>}
        </div>
        <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
          ${plan.price.toFixed(2)}
          <span className="text-lg font-normal">/ticket</span>
        </div>
        <p className="text-sm text-gray-400 mb-2">{plan.ticketRange}</p>
        <Badge variant="outline" className="bg-green-900 text-green-300 border-green-500">
          <TrendingDown className="w-4 h-4 mr-1" />
          {plan.savings}
        </Badge>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 mb-6">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center text-gray-300">
              <Check className="h-5 w-5 mr-2 text-green-500 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <Button
          onClick={() => {
            const message = `Hola, me gustaría elegir el plan ${plan.title} con un precio de $${plan.price.toFixed(2)} por ticket.`;
            const whatsappUrl = `https://wa.me/543482586525?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
          }}
          variant="entraditaTertiary" className="w-full">
          Elegir plan
        </Button>
      </CardContent>
    </Card>
  );
}
export default function Pricing() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-gray-950">
      <header className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <img src="/isotipoWhite.png" alt="Logo de Entradita" className="h-10 w-auto mr-2 sm:h-12 sm:mr-4" />
            <h1 className="text-xl sm:text-2xl font-bold text-white">entradita.com</h1>
          </Link>
          <nav>
            <Button variant="entraditaSecondary">
              <Link className="flex items-center hover:text-white text-white" to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al inicio
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-12">
        <section className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 text-white">
            Un Plan, <span className="text-blue-500">Todos los Beneficios</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Disfruta de todas nuestras características sin importar el tamaño de tu evento. <br/> El precio por ticket disminuye a medida que compres más entradas.
          </p>
          <Badge variant="secondary" className="text-xl px-4 py-2">
            ¡Ahorra hasta un 47% en eventos grandes!
          </Badge>
        </section>

        <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
          {pricingPlans.map((plan, index) => (
            <PricingCard key={index} plan={plan} />
          ))}
        </section>

        <section className="bg-gray-800 rounded-lg p-8 mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-white text-center">Todas las Características Incluidas</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {allFeatures.map((feature, index) => (
              <div key={index} className="flex items-center text-gray-300">
                <Check className="h-5 w-5 mr-2 text-green-500 flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gray-800 rounded-lg p-8 text-center  mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-white">¿Necesitas un plan personalizado?</h2>
          <p className="text-lg text-gray-300 mb-6">
            ¿Organizas múltiples eventos o tienes necesidades específicas? Contáctanos para crear un plan a medida que se ajuste perfectamente a tus requerimientos.
          </p>
          <Button
            onClick={() => {
              const message = `Hola, me gustaría un plan personalizado para mis eventos`;
              const whatsappUrl = `https://wa.me/543482586525?text=${encodeURIComponent(message)}`;
              window.open(whatsappUrl, '_blank');
            }}
            variant="entraditaTertiary" size="lg">
              Solicitar plan personalizado
          </Button>
        </section>

        <section className="mt-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-white">Preguntas Frecuentes</h2>
          <div className="grid gap-6 md:grid-cols-2 mt-8">
            <div className="text-left">
              <h3 className="font-semibold text-white mb-2">¿Qué incluye cada plan?</h3>
              <p className="text-gray-300">Todos nuestros planes incluyen todas las características. La diferencia está en el precio por ticket, que disminuye a medida que aumenta la cantidad de tickets.</p>
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-white mb-2">¿Puedo cambiar de plan?</h3>
              <p className="text-gray-300">Sí, puedes cambiar de plan en cualquier momento. El precio se ajustará automáticamente según la cantidad total de tickets vendidos.</p>
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-white mb-2">¿Hay costos adicionales?</h3>
              <p className="text-gray-300">No, el precio por ticket incluye todas las características y servicios. No hay costos ocultos ni cargos adicionales.</p>
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-white mb-2">¿Ofrecen soporte técnico?</h3>
              <p className="text-gray-300">Sí, todos los planes incluyen soporte técnico. Para eventos más grandes, ofrecemos soporte prioritario y atención 24/7.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 border-t border-gray-700 py-8">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p className="text-sm sm:text-base mb-2">© 2024 entradita.com - Transformando la gestión de eventos. Todos los derechos reservados.</p>
          <div className="mt-4 flex justify-center space-x-4 text-sm sm:text-base">
            <Link to="/terms-and-conditions" className="hover:text-white transition-colors">
              Términos de Servicio
            </Link>
            <Link to="/privacy-policy" className="hover:text-white transition-colors">
              Política de Privacidad
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

