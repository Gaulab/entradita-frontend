import { Link } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen w-screen">
      <main className="flex-grow">
        <div className="space-y-16 py-16">
          {/* Hero Section */}
          <section className="text-center px-4">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4 text-white">
              Gestiona tus Eventos con entradita.com
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Simplifica la venta y verificación de tickets con nuestra plataforma de códigos QR intuitiva y segura.
            </p>
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
              <Link to="/login">Comenzar Ahora</Link>
            </Button>
          </section>

          {/* Features Section */}
          <section id="features" className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8 text-white">Características Principales</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Generación de QR</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">Crea tickets QR únicos para cada asistente con información personalizada.</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Verificación Rápida</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">Escanea y verifica tickets en segundos con nuestra aplicación móvil.</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Gestión de Vendedores</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">Asigna y controla múltiples vendedores para cada evento.</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* About Section */}
          <section id="about" className="bg-gray-800 py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-8 text-white">Sobre Nosotros</h2>
              <p className="text-lg text-center text-gray-300 max-w-3xl mx-auto">
                Ticket QR nació de la necesidad de simplificar la gestión de eventos. Nuestra misión es proporcionar una plataforma fácil de usar que ayude a organizadores, vendedores y asistentes a tener una experiencia sin complicaciones.
              </p>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8 text-white">Contáctanos</h2>
            <p className="text-lg mb-4 text-gray-300">¿Tienes preguntas? Estamos aquí para ayudarte.</p>
            <p className="text-xl font-semibold text-white">Email: info@ticketqr.com</p>
            <p className="text-xl font-semibold text-white">Teléfono: +1 (123) 456-7890</p>
          </section>
        </div>
      </main>
      <footer className="bg-gray-800 border-t border-gray-700 py-8">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>© 2024 Ticket QR App. Todos los derechos reservados.</p>
          <div className="mt-4 flex justify-center space-x-4">
            <a href="#" className="hover:text-white transition-colors">Términos de Servicio</a>
            <a href="#" className="hover:text-white transition-colors">Política de Privacidad</a>
          </div>
        </div>
      </footer>
    </div>
  );
}