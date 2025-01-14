import React from 'react';
import { ExternalLink, Ticket, ArrowBigLeft, ListStartIcon, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Card = ({ title, children, icon: Icon }) => (
  <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6 border border-gray-700">
    <div className="flex items-center mb-4">
      <Icon className="w-6 h-6 mr-2 text-blue-500" />
      <h2 className="text-2xl font-bold">{title}</h2>
    </div>
    {children}
  </div>
);

const Tip = ({ children }) => (
  <div className="bg-blue-900 text-white p-4 rounded-md my-4">
    <h3 className="font-bold mb-2">💡 Consejo:</h3>
    <p>{children}</p>
  </div>
);

const SellerGuide = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">🚀 Guía para Vendedores</h1>
        <Button variant="entraditaTertiary" onClick={handleGoBack} className="mb-6">
          <ArrowBigLeft className="mr-2 h-4 w-4" /> Volver
        </Button>

        <img src="https://i.imgur.com/wITBOR5.png" alt="Imagen del Evento" className="w-full h-auto rounded-lg mb-4 p-2 bg-gray-800" />

        <Card title="Inicio" icon={ListStartIcon}>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>🔗 El organizador te proporcionó un link personalizado.</li>
            <li>🔒 Al entrar, se te solicitará una contraseña. ¡Pídesela al organizador!</li>
            <li>✅ Una vez validada la contraseña, accederás a tu panel principal. ¿Listo para vender?</li>
          </ul>
        </Card>

        <Card title="¿Cómo crear un ticket?" icon={Ticket}>
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
        </Card>

        <Card title="¿Cómo compartir un ticket?" icon={ExternalLink}>
          <p className="mb-4">📤 Para enviar un ticket a un cliente, sigue estos pasos:</p>
          <ol className="list-decimal list-inside space-y-2 mb-4">
            <li>📲 Al crear un ticket, se te mostrará una opción para compartirlo por varias plataformas.</li>
            <li>
              🔍 Si necesitas compartirlo después, busca el ticket en tu panel principal, haz clic sobre él y selecciona las opciones de acción.
            </li>
            <li>
              📩 Haz clic en "Compartir" para enviar un mensaje personalizado o simplemente copia el enlace con un clic.
            </li>
            <li>💌 Envía el enlace al cliente por mensaje o correo.</li>
          </ol>
          <Tip>Usa un mensaje personalizado para que el cliente tenga una experiencia más profesional y cercana.</Tip>
        </Card>

        <Card title="¿Cómo borrar un ticket?" icon={Trash2}>
          <p className="mb-4">❌ Si necesitas eliminar un ticket, sigue estos pasos:</p>
          <ol className="list-decimal list-inside space-y-2 mb-4">
            <li>🔍 Busca el ticket que deseas eliminar en tu panel principal.</li>
            <li>🖱 Haz clic sobre el ticket para abrir las opciones disponibles.</li>
            <li>🗑 Haz clic en "Eliminar" y confirma la acción.</li>
          </ol>
          <Tip>Recuerda que una vez eliminado un ticket, no podrás recuperarlo. ¡Verifica antes de borrar!</Tip>
        </Card>

        <Card title="¿Qué información hay en el panel?" icon={ListStartIcon}>
          <p className="mb-4">🖥 En tu panel principal podrás ver la siguiente información:</p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>🎫 Tickets creados: El número total de tickets que has generado.</li>
            <li>👤 Nombre del cliente: El nombre de la persona a la que se le vendió el ticket.</li>
            <li>🔄 Estado del ticket: Si está activo o ha sido cancelado.</li>
            <li>📅 Fecha de venta: La fecha en que se generó el ticket.</li>
          </ul>
        </Card>

        <Card title="¿Por qué algunos botones están deshabilitados?" icon={Ticket}>
          <p className="mb-4">⚠️ Si ves que algún botón está deshabilitado, puede ser por varias razones:</p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>🔒 Faltan campos por completar: Asegúrate de llenar todos los campos requeridos antes de proceder.</li>
            <li>🚫 No tienes permisos suficientes: Puede que necesites permisos adicionales para realizar ciertas acciones, como eliminar un ticket.</li>
            <li>⚠️ Estado del ticket: Si el ticket ya ha sido cancelado o está en estado inactivo, algunas opciones estarán deshabilitadas.</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default SellerGuide;
