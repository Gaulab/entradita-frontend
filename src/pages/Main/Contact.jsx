'use client';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Textarea from '@/components/ui/textarea';
import { MessageSquareText, Instagram, Mail, ArrowLeft, Send, CheckCircle, Clock, HelpCircle, MapPin } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import emailjs from '@emailjs/browser';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    emailjs.send('service_rjeq6ji', 'template_mozs7vx', formData, 'cJaMPYPdNQlBDDGkf').then(
      (result) => {
        console.log('Email sent:', result.text);
        setFormData({ name: '', email: '', message: '' });
        setIsSubmitted(true);
        setIsLoading(false);

        setTimeout(() => setIsSubmitted(false), 5000);
      },
      (error) => {
        console.error('EmailJS error:', error.text);
        setIsLoading(false);
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img src="/isotipoWhite.png" alt="entradita.com logo" className="h-8 w-auto mr-2 sm:h-12 sm:mr-4" />
            <h1 className="text-xl sm:text-2xl font-bold">entradita.com</h1>
          </div>
          <Button variant="entraditaSecondary" className="text-white">
            <Link className="flex items-center hover:text-white text-white" to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al inicio
            </Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <div className="">
        <div className="container mx-auto px-4 py-6 text-center">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-2">Comienza tu experiencia</h1>
          <p className="text-sm sm:text-xl text-gray-300 max-w-2xl mx-auto">Estamos aquí para ayudarte a revolucionar la gestión de tus eventos con nuestra plataforma de tickets QR.</p>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          {/* Contact Options */}
          <div className="flex flex-col lg:flex-row gap-8 mb-8">
            {/* Contact Methods Card */}
            <Card className="bg-gray-800 border-gray-700 w-full lg:w-1/2">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Contáctanos directamente</CardTitle>
                <p className="text-gray-300 mt-2">Elige el método que prefieras para comunicarte con nosotros. Estamos disponibles para ayudarte con cualquier consulta.</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button className="bg-green-600 hover:bg-green-700 transition-colors duration-300 h-14">
                    <a className="flex items-center justify-center w-full text-white hover:text-white" href="https://wa.me/543482586525" target="_blank" rel="noopener noreferrer">
                      <FaWhatsapp className="mr-2 h-5 w-5" />
                      WhatsApp
                    </a>
                  </Button>
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white transition-colors duration-300 h-14">
                    <a className="flex items-center justify-center w-full text-white hover:text-white" href="https://www.instagram.com/entradita.qr" target="_blank" rel="noopener noreferrer">
                      <Instagram className="mr-2 h-5 w-5" />
                      Instagram
                    </a>
                  </Button>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300 h-14">
                  <a className="flex items-center justify-center w-full text-white hover:text-white" href="mailto:gaulabcontact@gmail.com">
                    <Mail className="mr-2 h-5 w-5" />
                    gaulabcontact@gmail.com
                  </a>
                </Button>

                <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg mt-6">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <MessageSquareText className="h-5 w-5 mr-2 text-blue-400" />
                    Atención personalizada
                  </h3>
                  <p className="text-sm text-gray-300">Nuestro equipo está disponible para brindarte asesoramiento personalizado sobre cómo implementar nuestra plataforma en tu evento.</p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Form Card */}
            <Card className="bg-gray-800 border-gray-700 w-full lg:w-1/2">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Déjanos tu mensaje</CardTitle>
                <p className="text-gray-300 mt-2">Completa el formulario y nos pondremos en contacto contigo lo antes posible.</p>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="bg-green-800 bg-opacity-30 border border-green-700 rounded-lg p-6 text-center">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">¡Mensaje enviado!</h3>
                    <p className="text-gray-300">Gracias por contactarnos. Nos pondremos en contacto contigo pronto.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                        Nombre
                      </label>
                      <Input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full bg-gray-700 border-gray-600 text-white"
                        placeholder="Tu nombre"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                        Email
                      </label>
                      <Input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full bg-gray-700 border-gray-600 text-white"
                        placeholder="tu@email.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                        Mensaje
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="w-full bg-gray-700 border-gray-600 text-white"
                        placeholder="¿En qué podemos ayudarte? Cuéntanos sobre tu evento..."
                        rows={5}
                      />
                    </div>
                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300 h-12" disabled={isLoading}>
                      {isLoading ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Enviando...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          <Send className="mr-2 h-5 w-5" />
                          Enviar mensaje
                        </span>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
              <CardFooter className="text-sm text-gray-400 border-t border-gray-700 mt-4 pt-4">Tu información está segura con nosotros. No compartiremos tus datos con terceros.</CardFooter>
            </Card>
          </div>
          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <Clock className="h-8 w-8 text-blue-400 mb-2" />
                <CardTitle>Respuesta rápida</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Nos comprometemos a responder a todas las consultas en menos de 24 horas.</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <HelpCircle className="h-8 w-8 text-blue-400 mb-2" />
                <CardTitle>Soporte personalizado</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Te guiaremos en cada paso del proceso para configurar tu evento.</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <MapPin className="h-8 w-8 text-blue-400 mb-2" />
                <CardTitle>Cobertura nacional</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Nuestro servicio está disponible en todo el país para todo tipo de eventos.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* FAQ Section */}
      <section className="bg-gray-800 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">Preguntas frecuentes</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-gray-700 bg-opacity-50 p-5 rounded-lg">
              <h3 className="font-bold text-lg mb-2">¿Cómo funciona el sistema de tickets QR?</h3>
              <p className="text-gray-300">
                Nuestro sistema genera códigos QR únicos para cada ticket. Estos pueden ser escaneados en la entrada del evento para verificar su validez y registrar la asistencia.
              </p>
            </div>

            <div className="bg-gray-700 bg-opacity-50 p-5 rounded-lg">
              <h3 className="font-bold text-lg mb-2">¿Cuánto cuesta el servicio?</h3>
              <p className="text-gray-300">Ofrecemos diferentes planes según la cantidad de tickets que necesites. Contáctanos para recibir una cotización personalizada para tu evento.</p>
            </div>

            <div className="bg-gray-700 bg-opacity-50 p-5 rounded-lg">
              <h3 className="font-bold text-lg mb-2">¿Puedo tener múltiples vendedores?</h3>
              <p className="text-gray-300">Sí, puedes asignar diferentes vendedores y monitorear sus ventas individualmente. Cada vendedor tendrá su propio acceso al sistema.</p>
            </div>

            <div className="bg-gray-700 bg-opacity-50 p-5 rounded-lg">
              <h3 className="font-bold text-lg mb-2">¿Qué pasa si no uso todos los tickets?</h3>
              <p className="text-gray-300">Los tickets no utilizados quedan guardados en tu cuenta y puedes usarlos para futuros eventos sin costo adicional.</p>
            </div>
          </div>
        </div>
      </section>

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
