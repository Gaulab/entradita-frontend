import React from 'react';
import {
  ExternalLink,
  Ticket,
  ArrowBigLeft,
  ListStartIcon,
  Trash2,
  ArrowLeft,
  Rocket,
  Laptop,
  Info,
  ShoppingCart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';

const Tip = ({ children }) => (
  <div className="bg-blue-900 text-white p-4 rounded-md my-4">
    <h3 className="font-bold mb-2">💡 Consejo:</h3>
    <p>{children}</p>
  </div>
);

const SellerGuide = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">

        <Card className="mb-4 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-100">
              <Rocket className="inline-block mr-2 text-gray-100" />Guía para Vendedores
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-row items-center">
            <div className="w-full max-w-lg md:mr-2">
              <img
                src="https://i.imgur.com/0eGtnD6.png"
                alt="Imagen del Evento"
                className="w-full h-auto rounded-2xl bg-gray-900"
              />
            </div>
            <div className="w-full max-w-72 ml-2 max-sm:hidden">
              <img
                src="https://i.imgur.com/idC7JtS.jpeg"
                alt="Imagen del Evento"
                className="w-full h-auto rounded-3xl bg-gray-900"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-4 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-100">
              <ListStartIcon className="inline-block mr-2 text-gray-100" /> Inicio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-none space-y-2 mb-4">
              <li>🔗 El organizador te proporcionó un link personalizado.</li>
              <li>🔒 Al entrar, se te solicitará una contraseña. ¡Pídesela al organizador!</li>
              <li>✅ Una vez validada la contraseña, accederás a tu panel principal. ¿Listo para vender?</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-4 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-100">
              <Laptop className="inline-block mr-2 text-gray-100" />Interface
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-row items-center max-sm:p-0">
            <div className="w-full p-0">
              <img
                src="https://i.imgur.com/zaXxk87.png"
                alt="Imagen del Evento"
                className="w-full h-auto rounded-2xl bg-gray-900"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-4 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-100">
              <Ticket className="inline-block mr-2 text-gray-100" />¿Crear un ticket?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">📝 Sigue estos pasos para crear un ticket para el evento:</p>
            <ol className="list-decimal list-inside space-y-2 mb-4">
              <li>📍 Ve al panel principal.</li>
              <li>➕ Haz clic en "Nuevo Ticket".</li>
              <li>
                ✏️ Completa la información requerida: tipo de ticket, nombre, apellido, y DNI
                <span className="text-gray-400">(sin puntos ni espacios).</span>
              </li>
              <li>💾 Cuando todo esté listo, haz clic en "Guardar".</li>
            </ol>
            <Tip>Revisa la información antes de guardar para evitar errores. ¡Ahorrarás tiempo!</Tip>
          </CardContent>
        </Card>

        <Card className="mb-4 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-100">
              <ExternalLink className="inline-block mr-2 text-gray-100" />¿Compartir un ticket?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">📤 Para enviar un ticket a un cliente, sigue estos pasos:</p>
            <ol className="list-decimal list-inside space-y-2 mb-4">
              <li>📲 Al crear un ticket, se te mostrará una opción para compartirlo por varias plataformas.</li>
              <li>
                🔍 Si necesitas compartirlo después, busca el ticket en tu panel principal, haz clic sobre él y
                selecciona las opciones de acción.
              </li>
              <li>📩 Haz clic en "Compartir" para enviar un mensaje personalizado o simplemente copia el enlace con un clic.</li>
              <li>💌 Envía el enlace al cliente por mensaje o correo.</li>
            </ol>
            <Tip>Usa un mensaje personalizado para que el cliente tenga una experiencia más profesional y cercana.</Tip>
          </CardContent>
        </Card>

        <Card className="mb-4 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-100">
              <Trash2 className="inline-block mr-2 text-gray-100" />¿Borrar un ticket?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">❌ Si necesitas eliminar un ticket, sigue estos pasos:</p>
            <ol className="list-decimal list-inside space-y-2 mb-4">
              <li>🔍 Busca el ticket que deseas eliminar en tu panel principal.</li>
              <li>🖱 Haz clic sobre el ticket para abrir las opciones disponibles.</li>
              <li>🗑 Haz clic en "Eliminar" y confirma la acción.</li>
            </ol>
            <Tip>Recuerda que una vez eliminado un ticket, no podrás recuperarlo. ¡Verifica antes de borrar!</Tip>
            <Tip>Si te equivocas en los datos de un ticket, no puedes modificarlo, simplemente borra y crea otro.</Tip>
          </CardContent>
        </Card>

        <Card className="mb-4 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-100">
              <Info className="inline-block mr-2 text-gray-100" />Información del panel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">🖥 En tu panel principal podrás ver la siguiente información:</p>
            <ul className="list-none space-y-2 mb-4">
              <li>👤 Tu nombre: El nombre o apodo con el que te identificó el organizador.</li>
              <li>🎫 Tickets disponibles: El número total de tickets que el organizador te habilitó vender.</li>
              <li>🎫 Tickets vendidos: El número total de tickets que vendiste.</li>
              <li>
                🔄 Estado del vendedor: Aquí te aparecerá también en caso de que el organizador te haya deshabilitado.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-4 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-100">
              <ShoppingCart className="inline-block mr-2 text-gray-100" /> ¿Venta deshabilitada?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">⚠️ Si ves que algún botón está deshabilitado, como la venta, puede ser por varias razones:</p>
            <ul className="list-none space-y-2 mb-4">
              <li>👤 El organizador pausó la venta general para todos los vendedores.</li>
              <li>👤 El organizador pausó la venta para ti.</li>
              <li>🎫 Te quedaste sin tickets disponibles.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SellerGuide;