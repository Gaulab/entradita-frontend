import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { QrCode, Zap, Users, MessageSquareText, Menu, X } from 'lucide-react';
import PropTypes from 'prop-types';

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
          color: `rgba(17, 24, 100, ${Math.random() * 0.5 + 0.5})`,
          velocity: { 
            x: (Math.random() - 0.5) * 2, 
            y: (Math.random() - 0.5) * 2 
          }
        });
      }
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(particle => {
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
    <div className="flex flex-col min-h-screen bg-gray-900 overflow-x-hidden">
      <canvas ref={canvasRef} className="fixed inset-0 z-0" />
      <div className="relative z-10 flex-grow">
        <header className="bg-gray-800 shadow-md">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <img src="isotipoWhite.png" alt="entradita.com logo" className="h-10 w-auto mr-2 sm:h-12 sm:mr-4" />
              <h1 className="text-xl sm:text-2xl font-bold text-white">entradita.com</h1>
            </div>
            <nav className="hidden sm:block">
              <Button asChild variant="ghost" className="text-white hover:bg-gray-700 ml-2">
                <Link to="/contact">Contacto</Link>
              </Button>
              <Button asChild variant="ghost" className="text-white hover:bg-gray-700 ml-2">
                <Link to="/login">Iniciar Sesión</Link>
              </Button>
            </nav>
            <Button
              variant="ghost"
              className="sm:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
          {isMenuOpen && (
            <div className="sm:hidden bg-gray-800 py-2">
              <Link to="/contact" className="block px-4 py-2 text-white hover:bg-gray-700" onClick={() => setIsMenuOpen(false)}>
                Contacto
              </Link>
              <Link to="/login" className="block px-4 py-2 text-white hover:bg-gray-700" onClick={() => setIsMenuOpen(false)}>
                Iniciar Sesión
              </Link>
            </div>
          )}
        </header>
        <main className="container mx-auto px-4">
          <div className="space-y-16 py-16">
            {/* Hero Section */}
            <section className="text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 text-white animate-fade-in-down">
                Gestiona tus eventos con entradita.com
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-8 animate-fade-in-up">
                Simplifica la venta y verificación de tickets con nuestra plataforma de códigos QR intuitiva y segura.
              </p>
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white animate-pulse">
                <Link to="/contact">Contactar</Link>
              </Button>
            </section>

            {/* Features Section */}
            <section id="features" className="py-16">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12 text-white">Características Principales</h2>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                <FeatureCard
                  icon={<QrCode className="h-10 w-10 sm:h-12 sm:w-12 text-blue-400" />}
                  title="Generación de QR"
                  description="Crea tickets QR únicos para cada asistente con información personalizada."
                />
                <FeatureCard
                  icon={<Zap className="h-10 w-10 sm:h-12 sm:w-12 text-yellow-400" />}
                  title="Verificación Rápida"
                  description="Escanea y verifica tickets en segundos con nuestra aplicación móvil."
                />
                <FeatureCard
                  icon={<Users className="h-10 w-10 sm:h-12 sm:w-12 text-green-400" />}
                  title="Gestión de Vendedores"
                  description="Asigna y controla múltiples vendedores para cada evento."
                />
              </div>
            </section>

            {/* About Section */}
            <section id="about" className="bg-gray-800 py-16 rounded-lg shadow-xl">
              <div className="container mx-auto px-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-white">Sobre Nosotros</h2>
                <p className="text-base sm:text-lg text-center text-gray-300 max-w-3xl mx-auto">
                  entradita.com nació de la necesidad de simplificar la gestión de eventos. Nuestra misión es proporcionar una plataforma fácil de usar que ayude a organizadores, vendedores y asistentes a tener una experiencia sin complicaciones.
                </p>
              </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-16 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-white">Contáctanos</h2>
              <p className="text-base sm:text-lg mb-4 text-gray-300">¿Tienes preguntas? Estamos aquí para ayudarte.</p>
              <div className="flex justify-center">
                <a href="https://wa.me/543482586525" target="_blank" rel="noopener noreferrer" className="flex items-center text-white hover:text-blue-400 transition-colors">
                  <MessageSquareText className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
                  <span className="text-sm sm:text-base">+543482586525 WhatsApp</span>
                </a>
              </div>
            </section>
          </div>
        </main>
      </div>
      <footer className="relative z-10 bg-gray-800 border-t border-gray-700 py-8">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p className="text-sm sm:text-base">© 2024 entradita.com todos los derechos reservados.</p>
          <div className="mt-4 flex justify-center space-x-4 text-sm sm:text-base">
            <a href="#" className="hover:text-white transition-colors">Términos de Servicio</a>
            <a href="#" className="hover:text-white transition-colors">Política de Privacidad</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <Card className="bg-gray-800 border-gray-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-1">
      <CardHeader>
        <div className="flex justify-center mb-4">{icon}</div>
        <CardTitle className="text-white text-center text-lg sm:text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-300 text-center text-sm sm:text-base">{description}</p>
      </CardContent>
    </Card>
  );
}

FeatureCard.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};