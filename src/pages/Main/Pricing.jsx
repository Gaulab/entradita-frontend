'use client';

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, Star, Zap, Globe, ChevronRight, Calculator, Sparkles } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';

const pricingTiers = [
  {
    name: 'Eventos Pequeños',
    range: [1, 499],
    price: 140,
    color: 'bg-blue-400',
    icon: <Star className="w-5 h-5 sm:w-6 sm:h-6" />,
    description: 'Perfecto para eventos íntimos y exclusivos',
  },
  {
    name: 'Eventos Medianos',
    range: [500, 1000],
    price: 110,
    color: 'bg-green-400',
    icon: <Zap className="w-5 h-5 sm:w-6 sm:h-6" />,
    description: 'Ideal para eventos corporativos y festivales',
    popular: true,
  },
  {
    name: 'Eventos Grandes',
    range: [1001, 5000],
    price: 99.99,
    color: 'bg-purple-400',
    icon: <Globe className="w-5 h-5 sm:w-6 sm:h-6" />,
    description: 'Para grandes producciones y conciertos',
  },
];

const allFeatures = [
  'Generación de códigos QR únicos',
  'Verificación instantánea de tickets',
  'Gestión avanzada de vendedores',
  'Reportes económicos en tiempo real',
  'Soporte técnico prioritario',
  'Página web personalizable',
  'Dashboard analítico completo',
  'Integración con redes sociales',
];

export default function ModernPricing() {
  const [ticketCount, setTicketCount] = useState([500]);
  const [currentTier, setCurrentTier] = useState(null);
  const [totalCost, setTotalCost] = useState(0);
  const [savings, setSavings] = useState(0);

  useEffect(() => {
    document.title = 'Precios | entradita.com - Gestión de Eventos Simplificada';
  }, []);

  useEffect(() => {
    const tickets = ticketCount[0];
    let tier = pricingTiers.find((t) => tickets >= t.range[0] && tickets <= t.range[1]);

    if (!tier && tickets > 1000) {
      tier = pricingTiers[2]; // Eventos Grandes
    }

    if (tier) {
      setCurrentTier(tier);
      const cost = tickets * tier.price;
      setTotalCost(cost);

      // Calculate savings compared to highest tier
      const highestPrice = pricingTiers[0].price;
      const potentialCost = tickets * highestPrice;
      setSavings(potentialCost - cost);
    }
  }, [ticketCount]);

  const handleChoosePlan = (tier) => {
    const message = `Hola, me interesa el plan para ${tier.name} con un precio de $${tier.price.toFixed(2)} por ticket para ${ticketCount[0]} tickets. ¿Podrían darme más información?`;
    const whatsappUrl = `https://wa.me/543482586525?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCustomPlan = () => {
    const message = `Hola, me gustaría un plan personalizado para ${ticketCount[0]} tickets en mi evento`;
    const whatsappUrl = `https://wa.me/543482586525?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Header - Reduced height */}
      <header className="backdrop-blur-md bg-slate-900/80 border-b border-slate-700/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 sm:py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center group">
            <img src="/isotipoWhite.png" alt="Logo de Entradita" className="h-8 w-auto mr-2 sm:h-10 sm:mr-3 transition-transform group-hover:scale-105" />
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">entradita.com</h1>
          </Link>
          <Link to="/">
            <Button variant="entraditaTertiary" className="border-slate-600 text-slate-300 hover:bg-slate-800/50 hover:text-white backdrop-blur-sm text-sm sm:text-base">
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Volver al inicio</span>
              <span className="sm:hidden">Inicio</span>
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-6 sm:py-12">
        {/* Hero Section - Reduced height */}
        <section className="text-center mb-8 sm:mb-16">
          <div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-4 sm:mb-8 backdrop-blur-sm">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400 mr-2" />
            <span className="text-xs sm:text-sm text-blue-200">Precios que se adaptan a tu éxito</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4 sm:mb-6">
            <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">Potencia tu Evento con </span>
            <span className="bg-gradient-to-r from-blue-400 to-green-500 bg-clip-text text-transparent">Precios Flexibles</span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed px-4 sm:px-0">
            Disfruta de todas nuestras características premium sin importar el tamaño de tu evento. Nuestros precios se adaptan a tu éxito, disminuyendo a medida que vendes más entradas.
          </p>
        </section>

        {/* Interactive Pricing Calculator - Reduced padding */}
        <section className="mb-8 sm:mb-16">
          <Card className="backdrop-blur-md bg-slate-800/40 border-slate-700/50 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
            <CardHeader className="text-center pb-4 sm:pb-6 p-0 sm:p-0">
              <div className="flex justify-center items-center mb-3 sm:mb-4">
                <div className="p-2 sm:p-3 rounded-full bg-gradient-to-r from-blue-500/20 to-blue-500/20 border border-blue-500/30">
                  <Calculator className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />
                </div>
              </div>
              <CardTitle className="text-2xl sm:text-3xl font-bold text-white mb-2">Calculadora de Precios</CardTitle>
              <p className="text-slate-300 text-sm sm:text-base">Desliza para ver cómo cambian los precios según la cantidad de tickets</p>
            </CardHeader>

            <CardContent className="space-y-6 sm:space-y-8 p-0">
              {/* Slider */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 font-medium text-sm sm:text-base">Cantidad de tickets:</span>
                  <span className="text-xl sm:text-2xl font-bold text-white">{ticketCount[0].toLocaleString()}</span>
                </div>

                <Slider value={ticketCount} onValueChange={setTicketCount} max={2000} min={1} step={1} className="w-full" />

                <div className="flex justify-between text-xs sm:text-sm text-slate-400">
                  <span>1</span>
                  <span>1,000</span>
                  <span>2,000+</span>
                </div>
              </div>

              {/* Current Pricing Display */}
              {currentTier && (
                <div className="text-center p-4 sm:p-6 rounded-xl bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-slate-600/50">
                  <div className="flex justify-center items-center mb-3 sm:mb-4">
                    <div className={`p-2 sm:p-3 rounded-full bg-gradient-to-r ${currentTier.color} text-white`}>{currentTier.icon}</div>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">{currentTier.name}</h3>
                  <p className="text-slate-300 mb-2 text-sm sm:text-base">{currentTier.description}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 text-center">
                    <div>
                      <p className="text-xs sm:text-sm text-slate-400">Por ticket</p>
                      <p className="text-lg sm:text-2xl font-bold text-white">${currentTier.price.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-slate-400">Costo total</p>
                      <p className="text-lg sm:text-2xl font-bold text-green-400">${totalCost.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-slate-400">Ahorras</p>
                      <p className="text-lg sm:text-2xl font-bold text-blue-400">${savings.toLocaleString()}</p>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleChoosePlan(currentTier)}
                    className="mt-4 sm:mt-6 w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0 px-6 sm:px-8 py-2 sm:py-3"
                  >
                    Elegir este plan
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Pricing Tiers - Reduced spacing */}
        <section className="mb-8 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
            <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Planes Disponibles</span>
          </h2>

          <div className="grid gap-4 sm:gap-6 lg:gap-8 md:grid-cols-3">
            {pricingTiers.map((tier, index) => (
              <Card
                key={index}
                className={`backdrop-blur-md bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10 ${
                  tier.popular ? 'ring-2 ring-blue-500/50' : ''
                }`}
              >
                <CardHeader className="text-center pb-3 sm:pb-4 p-4 sm:p-6">


                  <div className={`inline-flex p-0 pl-4 sm:p-2 rounded-full ${tier.color} bg-opacity-80 mb-0 sm:mb-2`}>
                    <div className="flex items-end sm:items-center justify-center w-6 h-6 mr-2 text-gray-900">{tier.icon}</div>
                    <CardTitle className="text-gray-900 text-lg sm:text-lg font-bold mb-0">{tier.name}</CardTitle>
                  </div>

                  {tier.popular && (
                    <Badge variant="secondary" className="mb-2 sm:mb-4 text-xs sm:text-sm bg-gray-600 text-white">
                      Más Popular
                    </Badge>
                  )}

                  <p className="text-slate-300 text-xs sm:text-sm mb-3 sm:mb-4">{tier.description}</p>

                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                    ${tier.price.toFixed(2)}
                    <span className="text-sm sm:text-base lg:text-lg font-normal text-slate-400">/ticket</span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-400">
                    {tier.range[0].toLocaleString()} - {tier.range[1].toLocaleString()} tickets
                  </p>
                </CardHeader>

                <CardContent className="p-4 sm:p-6 pt-0">
                  <Button
                    onClick={() => handleChoosePlan(tier)}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0 text-sm sm:text-base"
                  >
                    Elegir plan
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Features Section - Reduced padding */}
        <section className="mb-8 sm:mb-16">
          <Card className="backdrop-blur-md bg-slate-800/40 border-slate-700/50 p-4 sm:p-6 lg:p-8">
            <CardHeader className="text-center pb-4 sm:pb-6 p-0">
              <CardTitle className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">Características Premium en Todos los Planes</CardTitle>
              <p className="text-slate-300 text-sm sm:text-base">Sin importar el plan que elijas, tendrás acceso completo a todas nuestras funcionalidades</p>
            </CardHeader>

            <CardContent className="p-0">
              <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {allFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center p-3 sm:p-4 rounded-lg bg-slate-700/50 border border-slate-600/50 hover:bg-slate-700/70 transition-colors">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-green-400 flex-shrink-0" />
                    <span className="text-slate-300 text-sm sm:text-base">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Custom Plan Section - Reduced padding */}
        <section className="mb-8 sm:mb-16">
          <Card className="backdrop-blur-md bg-gradient-to-r from-blue-900/40 to-purple-900/40 border-blue-500/30 p-4 sm:p-6 lg:p-8 text-center">
            <CardHeader className="p-0 pb-4 sm:pb-6">
              <CardTitle className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">¿Necesitas un Plan Personalizado?</CardTitle>
              <p className="text-base sm:text-lg text-slate-200 mb-4 sm:mb-6 max-w-2xl mx-auto">
                ¿Organizas múltiples eventos o tienes necesidades específicas? Nuestro equipo de expertos creará un plan a medida que se ajuste perfectamente a tus requerimientos.
              </p>
            </CardHeader>

            <CardContent className="p-0">
              <Button
                onClick={handleCustomPlan}
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 px-6 sm:px-8 py-3 sm:py-4"
              >
                Plan Personalizado
                <ChevronRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* FAQ Section - Reduced padding */}
        <section className="mb-8 sm:mb-16">
          <Card className="backdrop-blur-md bg-slate-800/40 border-slate-700/50 p-4 sm:p-6 lg:p-8">
            <CardHeader className="text-center pb-6 sm:pb-8 p-0">
              <CardTitle className="text-2xl sm:text-3xl font-bold text-white">Preguntas Frecuentes</CardTitle>
            </CardHeader>

            <CardContent className="p-0">
              <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                {[
                  {
                    question: '¿Qué incluye cada plan?',
                    answer:
                      'Todos nuestros planes incluyen todas las características premium. La única diferencia es el precio por ticket, que disminuye a medida que aumenta la cantidad de tickets en tu compra.',
                  },
                  {
                    question: '¡No sé cuántos tickets voy a vender!',
                    answer: 'No te preocupes, no necesitas saberlo de antemano. El precio se ajusta automáticamente según la cantidad total de tickets vendidos, asegurándote siempre el mejor precio.',
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
                  <div key={index} className="p-4 sm:p-6 rounded-lg bg-slate-700/50 border border-slate-600/50 hover:bg-slate-700/70 transition-colors">
                    <h3 className="font-semibold text-white mb-2 sm:mb-3 text-base sm:text-lg">{item.question}</h3>
                    <p className="text-slate-300 leading-relaxed text-sm sm:text-base">{item.answer}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Footer - Reduced padding */}
      <footer className="backdrop-blur-md bg-slate-900/80 border-t border-slate-700/50 py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-slate-400 mb-4 sm:mb-6">
            <p className="text-base sm:text-lg mb-3 sm:mb-4">© 2025 entradita.com - Transformando la gestión de eventos</p>
            <div className="flex justify-center space-x-4 sm:space-x-6">
              <Link to="/terms-and-conditions" className="hover:text-white transition-colors text-sm sm:text-base">
                Términos de Servicio
              </Link>
              <Link to="/privacy-policy" className="hover:text-white transition-colors text-sm sm:text-base">
                Política de Privacidad
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
