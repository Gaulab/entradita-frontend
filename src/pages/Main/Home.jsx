'use client';

// entraditaFrontend/src/pages/Main/Home.jsx
// react imports
import { useState, useEffect, useRef } from 'react';
// react-router imports
import { Link } from 'react-router-dom';
// custom components
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
// lucide-react icons
import { QrCode, Zap, Users, MessageSquareText, Menu, X, Star, Shield, DollarSign, BookOpen, LogIn, HeartHandshake, Link2 } from 'lucide-react';
// prop-types
import PropTypes from 'prop-types';
import { FaWhatsapp } from 'react-icons/fa';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    const particles = [];
    const particleCount = 100;

    const initParticles = () => {
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2 + 1,
          color: `rgba(59, 130, 246, ${Math.random() * 0.5 + 0.5})`, // Changed to blue color
          velocity: {
            x: (Math.random() - 0.5) * 2,
            y: (Math.random() - 0.5) * 2,
          },
        });
      }
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((particle) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();

        particle.x += particle.velocity.x;
        particle.y += particle.velocity.y;

        if (particle.x < 0 || particle.x > canvas.width) {
          particle.velocity.x *= -1;
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.velocity.y *= -1;
        }
      });

      animationFrameId = requestAnimationFrame(drawParticles);
    };

    resizeCanvas();
    initParticles();
    drawParticles();

    window.addEventListener('resize', () => {
      resizeCanvas();
      initParticles();
    });

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 overflow-x-hidden">
      <canvas ref={canvasRef} className="fixed inset-0 z-0" />
      <div className="relative z-10 flex-grow">
        <header className="bg-gray-800 shadow-md">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <img src="isotipoWhite.png" alt="Logo de Entradita, plataforma para eventos y tickets QR" className="h-10 w-auto mr-2 sm:h-12 sm:mr-4" />
              <h1 className="text-xl sm:text-2xl font-bold text-white">entradita.com</h1>
            </div>

            <nav className="hidden sm:flex items-center space-x-3">
              <Link className="text-white hover:text-white" to="/contact">
                <Button variant="entraditaSecondary" className="text-white w-full">
                  Contacto
                </Button>
              </Link>
              <Link className="text-white hover:text-white flex items-center" to="/documentacion">
                <Button variant="entraditaSecondary" className="text-white w-full">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Documentación
                </Button>
              </Link>
              <Link className="text-white hover:text-white flex items-center" to="/login">
                <Button variant="entraditaPrimary" className="text-white w-full">
                  <LogIn className="h-4 w-4 mr-2" />
                  Iniciar Sesión
                </Button>
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <Button variant="ghost" className="sm:hidden text-white bg-gray-800" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="sm:hidden bg-gray-800 py-2 border-t border-gray-700">
              <Link to="/contact" className="block px-4 py-2 text-white hover:bg-gray-700" onClick={() => setIsMenuOpen(false)}>
                Contacto
              </Link>
              <Link to="/pricing" className="block px-4 py-2 text-white hover:bg-gray-700" onClick={() => setIsMenuOpen(false)}>
                Precios
              </Link>
              <Link to="/terms-and-conditions" className="block px-4 py-2 text-white hover:bg-gray-700" onClick={() => setIsMenuOpen(false)}>
                Términos de Servicio
              </Link>
              <Link to="/privacy-policy" className="block px-4 py-2 text-white hover:bg-gray-700" onClick={() => setIsMenuOpen(false)}>
                Política de Privacidad
              </Link>
            </div>
          )}
        </header>

        <main className="container mx-auto px-4">
          <div className="space-y-4 py-16">
            <section className="text-center mb-16">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-4 text-white animate-fade-in-down">
                Revoluciona tus <span className="text-blue-500">Eventos</span>
              </h1>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4 text-gray-300 animate-fade-in-down">Tickets QR seguros y gestión simplificada</h2>
              <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-8 animate-fade-in-up">
                Simplifica la venta y verificación de tickets con nuestra plataforma intuitiva y segura. Potencia tus eventos con tecnología de vanguardia.
              </p>

              <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/contact" className="w-full sm:w-auto">
                  <Button variant="entraditaPrimary" size="lg" className="text-white w-full sm:w-auto">
                    Empezar ahora
                  </Button>
                </Link>
                <Link to="/pricing" className="w-full sm:w-auto">
                  <Button variant="entraditaTertiary" size="lg" className="text-white w-full sm:w-auto">
                    Ver precios
                  </Button>
                </Link>
              </div>

              <div className="sm:hidden flex flex-col space-y-4 mt-4">
                <Link to="/login" className="w-full">
                  <Button variant="entraditaTertiary" size="lg" className="text-white w-full">
                    <LogIn className="h-4 w-4 mr-2" />
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link to="/documentacion" className="w-full">
                  <Button variant="entraditaTertiary" size="lg" className="text-white w-full">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Documentación
                  </Button>
                </Link>
              </div>
            </section>

            <section id="features" className="pb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-white">Características Principales</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <FeatureCard
                  icon={<QrCode className="h-12 w-12 text-blue-400" />}
                  title="Generación de QR Avanzada"
                  description="Crea tickets QR únicos y seguros para cada asistente con información personalizada y encriptada."
                />
                <FeatureCard
                  icon={<Zap className="h-12 w-12 text-yellow-400" />}
                  title="Verificación Instantánea"
                  description="Escanea y verifica tickets en milisegundos con nuestra aplicación móvil de alto rendimiento."
                />
                <FeatureCard
                  icon={<Users className="h-12 w-12 text-green-400" />}
                  title="Gestión de Vendedores Inteligente"
                  description="Asigna, controla y analiza el rendimiento de múltiples vendedores en tiempo real para cada evento."
                />
                <FeatureCard
                  icon={<Star className="h-12 w-12 text-purple-400" />}
                  title="Experiencia de Usuario Premium"
                  description="Interfaz intuitiva y amigable que facilita la compra y gestión de tickets tanto para organizadores como para asistentes."
                />
                <FeatureCard
                  icon={<Shield className="h-12 w-12 text-red-400" />}
                  title="Seguridad de Datos Avanzada"
                  description="Protección de datos de última generación para garantizar la privacidad y seguridad de todos los usuarios."
                />
                <FeatureCard
                  icon={<DollarSign className="h-12 w-12 text-emerald-400" />}
                  title="Análisis Financiero Detallado"
                  description="Obtén insights valiosos sobre las ventas y el rendimiento financiero de tus eventos con nuestros reportes avanzados."
                />
              </div>
            </section>

            <section className="bg-gray-800 py-8 rounded-lg shadow-xl">
              <div className="container mx-auto px-4">
                <div className="flex flex-col items-center justify-center mb-4 space-y-4 sm:space-y-0 sm:flex-row sm:space-x-3">
                  <BookOpen className="h-12 w-12 sm:h-8 sm:w-8 text-blue-400" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-white text-center">Documentación Completa</h2>
                </div>
                <p className="text-base sm:text-lg text-center text-gray-300 max-w-7xl mx-auto mb-4">
                  Accede a nuestra guía detallada para aprender a utilizar todas las funcionalidades de entradita. Desde la creación de eventos hasta la gestión de vendedores y tickets, encontrarás
                  todo lo que necesitas para sacar el máximo provecho de nuestra plataforma.
                </p>
                <div className="flex justify-center">
                  <Link to="/documentacion" className="w-full sm:w-auto">
                    <Button variant="entraditaSecondary" size="lg" className="text-white w-full sm:w-auto">
                      <BookOpen className="h-5 w-5 mr-2" />
                      Ver Documentación
                    </Button>
                  </Link>
                </div>
              </div>
            </section>

            {/* Beneficial Cause Section */}
            <section id="beneficial-cause" className="bg-gray-800 py-8 rounded-lg shadow-xl">
              <div className="container mx-auto px-4">
                <div className="flex flex-col items-center justify-center mb-4 space-y-4 sm:space-y-0 sm:flex-row sm:space-x-3">
                  <HeartHandshake className="h-12 w-12 sm:h-8 sm:w-8 text-blue-400" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-white text-center">¿Tienes una causa benéfica?</h2>
                </div>
                <p className="text-lg sm:text-xl text-center text-gray-300 max-w-7xl mx-auto mb-4">
                  En entradita, creemos en el poder de la comunidad y en apoyar causas que marcan la diferencia. Si organizas un evento benéfico, queremos ser parte de tu misión auspiciando las
                  entradas. Juntos, podemos maximizar el impacto de tu evento y crear un cambio positivo en la sociedad.
                </p>
                <p className="text-lg sm:text-xl text-center text-gray-300 max-w-7xl mx-auto mb-4">
                  Por favor, envíanos un mensaje con los detalles de tu causa y cómo podemos ayudarte a hacerla realidad.
                </p>
                <div className="flex justify-center">
                  <Link to="https://wa.me/543482586525" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                    <Button variant="entraditaSecondary" size="lg" className="text-white w-full sm:w-auto">
                      <Link2 className="h-5 w-5 mr-2" />
                      Solicita tu auspicio
                    </Button>
                  </Link>
                </div>
              </div>
            </section>
            <section id="contact" className="bg-gray-800 py-8 rounded-lg shadow-xl">
              <div className="container mx-auto px-4">
                <div className="flex flex-col items-center justify-center mb-4 space-y-4 sm:space-y-0 sm:flex-row sm:space-x-3">
                  <MessageSquareText className="h-12 w-12 sm:h-8 sm:w-8 text-blue-400" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-white text-center">Contáctanos</h2>
                </div>
                <p className="text-lg sm:text-xl text-center text-gray-300 max-w-7xl mx-auto mb-4">
                  ¿Listo para llevar tus eventos al siguiente nivel? <br /> Estamos aquí para ayudarte.
                </p>
                <div className="flex justify-center">
                  <Link to="https://wa.me/543482586525" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                    <Button variant="entraditaSecondary" size="lg" className="text-white w-full sm:w-auto">
                      <FaWhatsapp className="h-5 w-5 mr-2" />
                      Envíanos un whatsapp
                    </Button>
                  </Link>
                </div>
              </div>
            </section>
            <section id="about" className="bg-gray-800 py-8 rounded-lg shadow-xl">
              <div className="container mx-auto px-4">
                <div className="flex flex-col items-center justify-center mb-4 space-y-4 sm:space-y-0 sm:flex-row sm:space-x-3">
                  <BookOpen className="h-12 w-12 sm:h-8 sm:w-8 text-blue-400" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-white text-center">Sobre Nosotros</h2>
                </div>
                <p className="text-lg sm:text-xl text-center text-gray-300 max-w-7xl mx-auto mb-4">
                  entradita nació de la pasión por simplificar la gestión de eventos y elevar la experiencia de los asistentes. Nuestra misión es proporcionar una plataforma innovadora y fácil de usar
                  que empodere a organizadores, vendedores y asistentes, permitiéndoles enfocarse en lo que realmente importa: crear momentos inolvidables.
                </p>
              </div>
            </section>
          </div>
        </main>
      </div>
      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-2 md:mb-0">
              <img src="/isotipoWhite.png" alt="entradita.com logo" className="h-8 w-auto mr-2 hidden sm:block" />
              <div>
                <h3 className="font-bold text-center sm:text-left">entradita.com</h3>
                <p className="text-xs text-gray-400 ">Transformando la gestión de eventos</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-6">
              <Link to="/documentacion" className="text-gray-300 hover:text-white text-sm">
                Documentación
              </Link>
              <Link to="/contact" className="text-gray-300 hover:text-white text-sm">
                Contacto
              </Link>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-6 pt-6 text-center text-gray-400">
            <p className="text-sm">© 2025 entradita.com todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <Card className="bg-gray-800 border-gray-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-1">
      <CardHeader className="m-0 pt-4 pb-0">
        <div className="flex justify-center mb-2">{icon}</div>
        <CardTitle className="text-white text-center text-xl sm:text-2xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-300 text-center text-base sm:text-lg">{description}</p>
      </CardContent>
    </Card>
  );
}

FeatureCard.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};
