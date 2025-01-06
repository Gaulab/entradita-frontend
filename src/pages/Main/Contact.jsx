import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Textarea  from '@/components/ui/textarea';
import { MessageSquareText, Instagram, Mail, ArrowLeft, Send } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    // Reset form after submission
    setFormData({ name: '', email: '', message: '' });
    // Show a success message to the user
    alert('¡Gracias por contactarnos! Nos pondremos en contacto contigo pronto.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white flex flex-col">
      <header className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img src="/isotipoWhite.png" alt="entradita.com logo" className="h-8 w-auto mr-2 sm:h-12 sm:mr-4" />
            <h1 className="text-xl sm:text-2xl font-bold">entradita.com</h1>
          </div>
          <Button variant="entraditaSecondary" className="">
            <Link className="flex items-center hover:text-white text-white" to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al inicio
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-12 flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-8">
        
        <Card className="bg-gray-800 border-gray-700 w-full max-w-md ">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Contáctanos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-center text-gray-300">Pedí tu cuenta.<br/> Contáctanos a través de cualquiera de estos medios o déjanos tu mensaje.</p>
            <div className="space-y-4">
              <Button className="w-full bg-green-600 hover:bg-green-700 transition-colors duration-300">
                <a className='flex items-center justify-center w-full text-white hover:text-white ' href="https://wa.me/543482586525" target="_blank" rel="noopener noreferrer">
                  <MessageSquareText className="mr-2 h-5 w-5" />
                  WhatsApp
                </a>
              </Button>
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white transition-colors duration-300">
                <a className='flex items-center justify-center w-full text-white hover:text-white' href="https://www.instagram.com/entradita.qr" target="_blank" rel="noopener noreferrer">
                  <Instagram className="mr-2 h-5 w-5" />
                  Instagram
                </a>
              </Button>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300">
                <a className='flex items-center justify-center w-full text-white hover:text-white' href="mailto:aguilarivanx@gmail.com">
                  <Mail className="mr-2 h-5 w-5" />
                  Email
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* <Card className="bg-gray-800 border-gray-700 w-full max-w-md sm:min-h-[30rem]">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Déjanos tu mensaje</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Nombre</label>
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
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
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
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">Mensaje</label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-700 border-gray-600 text-white"
                  placeholder="¿En qué podemos ayudarte?"
                  rows={4}
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300">
                <Send className="mr-2 h-5 w-5" />
                Enviar mensaje
              </Button>
            </form>
          </CardContent>
        </Card> */}
      
      </main>

      <footer className="bg-gray-800 border-t border-gray-700 py-6">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p className="text-sm mb-2">© 2025 entradita.com todos los derechos reservados.</p>
          <p className="text-xs">Transformando la gestión de eventos, un ticket a la vez.</p>
        </div>
      </footer>
    </div>
  );
}

