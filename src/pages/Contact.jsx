import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { MessageSquareText, Instagram, Mail, ArrowLeft } from 'lucide-react';

export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <header className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img src="/isotipoWhite.png" alt="entradita.com logo" className="h-8 w-auto mr-2 sm:h-12 sm:mr-4" />
            <h1 className="text-xl sm:text-2xl font-bold">entradita.com</h1>
          </div>
          <Button variant="entraditaSecondary" className="">
            <Link className="text-white flex flex-row items-center" to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al inicio
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <Card className="bg-gray-800 border-gray-700 w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Contacto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-center text-gray-300">Estamos aquí para ayudarte. <br/> Contáctanos a través de cualquiera de estos medios</p>
            <div className="space-y-4">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                <a className='text-white flex flex-row' href="https://wa.me/543482586525" target="_blank" rel="noopener noreferrer">
                  <MessageSquareText className="mr-2 h-5 w-5" />
                  WhatsApp
                </a>
              </Button>
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                <a className='text-white flex flex-row' href="https://www.instagram.com/entradita.qr" target="_blank" rel="noopener noreferrer">
                  <Instagram className="mr-2 h-5 w-5" />
                  Instagram
                </a>
              </Button>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <a className='text-white flex flex-row' href="mailto:aguilarivanx@gmail.com">
                  <Mail className="mr-2 h-5 w-5" />
                  Email
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="bg-gray-800 border-t border-gray-700 py-4">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p className="text-sm">© 2024 entradita.com todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
