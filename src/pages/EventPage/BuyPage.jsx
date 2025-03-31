import { Link } from "react-router-dom";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

function BuyPage() {
  return (
    <div className="min-h-screen" style={{
      backgroundImage: `url('https://i.pinimg.com/736x/ee/7d/90/ee7d903fc2f01a8c5cd6c4a0cf602c94.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      {/* Header con logo */}
      <header className="bg-black/30 backdrop-blur-sm rounded-b-xl p-4">
        <div className="max-w-6xl mx-auto">
          <img src="/isotipoWhite.png" alt="Logo" className="h-14 sm:h-26" />
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row items-stretch gap-8 lg:gap-12">
          {/* Sección de imagen - Lateral en desktop */}
          <div className="w-full md:w-1/2 lg:w-[45%] h-full">
            <div className="relative h-full rounded-xl overflow-hidden shadow-xl">
              <img
                src="https://i.pinimg.com/736x/f8/3a/e2/f83ae2c05fb1686b4da0ec1aff2a4147.jpg"
                alt="Evento"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Sección de información - Lateral en desktop */}
          <div className="w-full md:w-1/2 lg:w-[55%] h-full flex flex-col justify-center">
            <div className="bg-black/30 backdrop-blur-sm p-6 rounded-xl shadow-xl h-full flex flex-col justify-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Techno SFE
              </h1>
              
              <div className="flex items-center text-gray-200 mb-4">
                <CalendarIcon className="mr-2 h-5 w-5 flex-shrink-0" />
                <time dateTime="2023-12-31" className="text-lg">31 de Diciembre, 2023</time>
              </div>

              <p className="text-gray-200 text-lg md:text-xl mb-8 leading-relaxed">
                Descripción del evento. Aquí puedes agregar detalles sobre el evento, como el lugar, los artistas que se
                presentarán, o cualquier otra información relevante para los asistentes.
              </p>

              <Link to="/seleccionar-tickets" className="block w-fit">
                <Button className="bg-blue-600/40 text-white text-lg md:text-xl px-8 py-6 rounded-xl transition-transform hover:scale-105">
                  Comprar Entradas
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default BuyPage;
