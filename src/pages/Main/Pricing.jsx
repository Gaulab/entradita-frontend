// entraditaFront/src/pages/Pricing.jsx
// react import
import React from 'react';
// react-router-dom import
import { Link } from 'react-router-dom';
// lucide-react import
import { ArrowLeft, Check, Star, Zap, Globe, ChevronRight, TrendingUp } from 'lucide-react';
// custom components import
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Badge from '@/components/ui/badge';

// pricing packs
const pricingPacks = [
  {
    title: 'Eventos Pequeños',
    price: 160.0,
    ticketRange: 'Hasta 500 tickets',
    savings: 'Precio base',
    icon: <Star className="w-8 h-8 text-yellow-300" />,
  },
  {
    title: 'Eventos Medianos',
    price: 130,
    ticketRange: '501 - 2500 tickets',
    savings: 'Ahorra hasta 33%',
    isPopular: true,
    icon: <Zap className="w-8 h-8 text-blue-300" />,
  },
  {
    title: 'Eventos Grandes',
    ticketRange: 'Más de 2500 tickets',
    price: 79.99,
    savings: 'Ahorra hasta 47%',
    icon: <Globe className="w-8 h-8 text-green-400" />,
  },
];

// all features
const allFeatures = ['Generación de códigos QR', 'Verificación rápida de tickets', 'Gestión de vendedores', 'Reportes economicos avanzados', 'Soporte prioritario', 'Página web personalizable'];

function PricingCard({ pack }) {
  const handleChoosePlan = () => {
    const message = `Hola, me interesa el plan para ${pack.title} con un precio de $${pack.price.toFixed(2)} por ticket. ¿Podrían darme más información?`;
    const whatsappUrl = `https://wa.me/543482586525?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Card className={`bg-gray-800 border-gray-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-1 ${pack.isPopular ? `border-blue-400` : ''}`}>
      <CardHeader>
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            {pack.icon}
            <CardTitle className="text-white text-xl sm:text-2xl  ml-2">{pack.title}</CardTitle>
          </div>
          {pack.isPopular && (
            <Badge variant="secondary" className="">
              Más popular
            </Badge>
          )}
        </div>
        <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
          ${pack.price.toFixed(2)}
          <span className="text-lg font-normal">/ticket</span>
        </div>
        <p className="text-sm text-gray-400 mb-2">{pack.ticketRange}</p>
        <Badge variant="outline" className="bg-green-500/50 text-gray-950 border-gray-600">
          <TrendingUp className="w-4 h-4 mr-1 " />
          {pack.savings}
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="text-gray-300 mb-6">Todas las características incluidas</p>
        <Button onClick={handleChoosePlan} variant="entraditaTertiary" className={`w-full bg-gray-900 hover:bg-gray-700 text-white`}>
          Elegir este plan
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

export default function Pricing() {
  React.useEffect(() => {
    document.title = 'Precios | entradita.com - Gestión de Eventos Simplificada';
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-gray-950">
      <header className="bg-gray-800 shadow-md sticky top-0 z-10">
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
            Potencia tu Evento con <span className="text-blue-500">Precios Flexibles</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Disfruta de todas nuestras características premium sin importar el tamaño de tu evento. Nuestros precios se adaptan a tu éxito, disminuyendo a medida que vendes más entradas.
          </p>
          <Badge variant="secondary" className="text-xl px-4 py-2 animate-pulse">
            ¡Nuevo! Ahorra hasta un 47% en eventos grandes
          </Badge>
        </section>

        <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
          {pricingPacks.map((pack, index) => (
            <PricingCard key={index} pack={pack} />
          ))}
        </section>

        <section className="bg-gray-800 rounded-lg p-8 mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-white text-center">Características Premium en Todos los Planes</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {allFeatures.map((feature, index) => (
              <div key={index} className="flex items-center text-gray-300 bg-gray-700 rounded-lg p-3 transition-all duration-300 hover:bg-gray-600">
                <Check className="h-5 w-5 mr-2 text-green-500 flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-r from-blue-950 to-gray-800 rounded-lg p-8 text-center mx-auto mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-white">¿Necesitas un Plan Personalizado?</h2>
          <p className="text-lg text-gray-100 mb-6">
            ¿Organizas múltiples eventos o tienes necesidades específicas? Nuestro equipo de expertos creará un plan a medida que se ajuste perfectamente a tus requerimientos.
          </p>
          <Button
            onClick={() => {
              const message = `Hola, me gustaría un plan personalizado para mis eventos`;
              const whatsappUrl = `https://wa.me/543482586525?text=${encodeURIComponent(message)}`;
              window.open(whatsappUrl, '_blank');
            }}
            variant="entraditaTertiary"
            size="lg"
            className="bg-gray-600 text-gray-900 hover:text-gray-900"
          >
            Solicitar Plan Personalizado
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </section>

        <section className="bg-gray-800 rounded-lg p-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-white text-center">Preguntas Frecuentes</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                question: '¿Qué incluye cada plan?',
                answer:
                  'Todos nuestros planes incluyen todas las características premium. La única diferencia es el precio por ticket, que disminuye a medida que aumenta la cantidad de tickets en tu compra.',
              },
              {
                question: '¡No sé cuántos tickets voy a vender!',
                answer:
                  'No te preocupes, no necesitas saberlo de antemano. El precio se ajusta automáticamente según la cantidad total de tickets vendidos, asegurándote siempre el mejor precio. Si deseas ahorrar más, puedes optar por un plan de antemano. De lo contrario, el día anterior al evento se te cobrará el precio correspondiente.',
              },
              {
                question: '¿Puedo usar los tickets restantes en otro evento?',
                answer: 'Sí, los tickets no utilizados se acumulan en tu cuenta y puedes usarlos en cualquier otro evento que organices en el futuro.',
              },
              {
                question: '¿Ofrecen soporte técnico?',
                answer: 'Sí, todos los planes incluyen soporte técnico prioritario. Para eventos más grandes, ofrecemos atención personalizada para asegurar el éxito de tu evento.',
              },
            ].map((item, index) => (
              <div key={index} className="bg-gray-700 rounded-lg p-4 transition-all duration-300 hover:bg-gray-600">
                <h3 className="font-semibold text-white mb-2">{item.question}</h3>
                <p className="text-gray-300">{item.answer}</p>
              </div>
            ))}
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
