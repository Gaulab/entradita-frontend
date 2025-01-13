import React, { useState } from 'react';
import { ExternalLink, Image, Type, Clock, CreditCard, Music, ArrowBigLeft } from 'lucide-react';
import { FaPlay } from 'react-icons/fa';
import { Button } from '../../components/ui/button';
import { useNavigate } from 'react-router-dom';
const Card = ({ title, children, icon: Icon }) => (
  <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6 border border-gray-700 transition-colors">
    <div className="flex items-center mb-4">
      <Icon className="w-6 h-6 mr-2 text-blue-500" />
      <h2 className="text-2xl font-bold">{title}</h2>
    </div>
    {children}
  </div>
);

const ExternalLinkButton = ({ href, children }) => (
  <Button to={href} target="_blank" rel="noopener noreferrer" variant="entraditaPrimary" className="inline-flex items-center my-2 ">
    {children}
    <ExternalLink className="ml-2 h-4 w-4" />
  </Button>
);

const Tip = ({ children }) => (
  <div className="bg-blue-900 text-white p-4 rounded-md my-4">
    <h3 className="font-bold mb-2">💡 Consejo:</h3>
    <p>{children}</p>
  </div>
);

const InteractiveExample = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-gray-700 rounded-md my-2">
      <button className="w-full text-left p-4 bg-gray-700 hover:bg-gray-600 transition-colors flex justify-between items-center" onClick={() => setIsOpen(!isOpen)}>
        <span className="font-bold">{title}</span>
        <span>{isOpen ? '▲' : '▼'}</span>
      </button>
      {isOpen && <div className="p-4 bg-gray-800">{children}</div>}
    </div>
  );
};



const EventPageGuide = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-center">Configuración de la página web</h1>
        <div className="flex max-sm:flex-col mb-4 justify-between items-center">
            <Button className="max-sm:w-full" variant="entraditaTertiary" onClick={handleGoBack}>
              <ArrowBigLeft className="mr-2 h-4 w-4" /> Volver
            </Button>
        </div>
        <Card title="Introducción" icon={FaPlay}>
          <p className="mb-4">
            Bienvenido a la guía de configuración de tu página de evento. Aquí aprenderás a crear una página atractiva y funcional para tu evento utilizando nuestra intuitiva interfaz de bloques.
          </p>
          <p>
            Tu página de evento se construirá a partir de bloques consecutivos, cada uno con una función específica. Piensa en estos bloques como piezas de Lego que puedes apilar y reorganizar para
            crear la página perfecta para tu evento.
          </p>
        </Card>

        <Card title="Configuración General" icon={Image}>
          <p className="mb-4">La Configuración General es el lienzo sobre el cual construirás tu página de evento. Aquí definirás el aspecto general y el estilo que se aplicará a toda la página.</p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Imagen de fondo:</strong> Es la imagen que aparecerá detrás de todo el contenido de tu página. <br /> ¡Te dejamos una coleccion de fondos en pinterest para que te inspires!
              <br />
              <ExternalLinkButton href="https://pin.it/wOntgQlcs">Fondos en Pinterest</ExternalLinkButton>
              <InteractiveExample title="¿Cómo obtener una URL de imagen?">
                <ol className="list-decimal list-inside space-y-2">
                  <li>Encuentra una imagen que te guste en internet.</li>
                  <li>Haz clic derecho sobre la imagen.</li>
                  <li>Selecciona "Copiar dirección de imagen" o "Copiar URL de imagen".</li>
                  <li>Pega esta URL en el campo de Imagen de fondo.</li>
                </ol>
                <p className="my-2 ">Alternativamente, puedes subir tu propia imagen a un servicio como Imgur o ImgBB y usar el enlace directo proporcionado.</p>
                <ExternalLinkButton href="https://imgur.com/upload">Subir imagen a Imgur</ExternalLinkButton>
              </InteractiveExample>
            </li>
            <li>
              <strong>Color de tarjetas:</strong> Este color se aplicará como fondo a los bloques de contenido, creando un contraste con la imagen de fondo.
            </li>
            <li>
              <strong>Fuente:</strong> La tipografía principal que se usará en toda la página.
            </li>
            <li>
              <strong>Color de la letra:</strong> El color principal para el texto en toda la página.
            </li>
          </ul>
          <Tip>Elige colores y fuentes que reflejen el estilo y la atmósfera de tu evento. Un buen contraste entre el fondo y el texto mejorará la legibilidad.</Tip>
        </Card>

        <Card title="Tipos de Bloques" icon={Type}>
          <p className="mb-4">
            Los bloques son los elementos fundamentales de tu página de evento. Cada bloque tiene una función específica y se apilará uno encima de otro para formar tu página completa. Ningún bloque
            es obligatiorio.
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <li className="bg-gray-700 p-4 rounded-md">
              <strong>Título:</strong> Para el nombre principal y subtítulo de tu evento.
            </li>
            <li className="bg-gray-700 p-4 rounded-md">
              <strong>Texto:</strong> Para añadir descripciones o información detallada.
            </li>
            <li className="bg-gray-700 p-4 rounded-md">
              <strong>Imagen:</strong> Para incluir fotos o gráficos adicionales.
            </li>
            <li className="bg-gray-700 p-4 rounded-md">
              <strong>Cuenta Regresiva:</strong> Muestra el tiempo restante hasta el evento.
            </li>
            <li className="bg-gray-700 p-4 rounded-md">
              <strong>Botón:</strong> Para enlaces o llamadas a la acción.
            </li>
            <li className="bg-gray-700 p-4 rounded-md">
              <strong>Info Bancaria:</strong> Para detalles de pago por transferencia.
            </li>
            <li className="bg-gray-700 p-4 rounded-md">
              <strong>Mercado Pago:</strong> Para integrar pagos online.
            </li>
            <li className="bg-gray-700 p-4 rounded-md">
              <strong>Spotify:</strong> Para compartir una playlist del evento.
            </li>
          </ul>
        </Card>

        <Card title="Creación y Edición de Bloques" icon={Clock}>
          <ol className="list-decimal list-inside space-y-2 mb-4">
            <li>Haz clic en "Nuevo bloque" en la sección de Bloques.</li>
            <li>Elige el tipo de bloque que deseas añadir.</li>
            <li>Completa la información requerida para ese bloque.</li>
            <li>Usa las flechas para reordenar los bloques si es necesario.</li>
            <li>Para editar un bloque, simplemente modifica su contenido en el panel.</li>
          </ol>
          <InteractiveExample title="Ejemplo: Creando un bloque de Título">
            <p>Imagina que estás creando un bloque de Título para tu evento "Fiesta de Verano 2023":</p>
            <ol className="list-decimal list-inside space-y-2 mt-2">
              <li>Haz clic en "Nuevo bloque"</li>
              <li>Selecciona "Título" de la lista de tipos de bloque</li>
              <li>En el campo "Título", escribe: Fiesta de Verano 2023</li>
              <li>En "Subtítulo", podrías añadir: ¡La noche más caliente del año!</li>
              <li>Ajusta el tamaño y color del texto según tus preferencias</li>
            </ol>
          </InteractiveExample>
        </Card>

        <Card title="Previsualización y Guardado" icon={CreditCard}>
          <ol className="list-decimal list-inside space-y-2 mb-4">
            <li>Usa el botón "Página" para ver una vista previa en tiempo real.</li>
            <li>Haz los ajustes necesarios en la configuración.</li>
            <li>Haz clic en "Guardar cambios" para aplicar las modificaciones.</li>
            <li>Recuerda guardar antes de salir de la página de configuración.</li>
          </ol>
          <Tip>Previsualiza tu página frecuentemente mientras la construyes para asegurarte de que todo se ve como esperas.</Tip>
        </Card>

        <Card title="Consejos Finales" icon={Music}>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>Mantén un diseño limpio y fácil de leer.</li>
            <li>Usa imágenes de alta calidad que representen bien tu evento.</li>
            <li>Asegúrate de que el texto sea legible sobre el fondo.</li>
            <li>Utiliza la cuenta regresiva para generar expectativa.</li>
            <li>Incluye información clara sobre cómo participar o comprar entradas.</li>
            <li>Si usas Spotify, elige una playlist que refleje el ambiente de tu evento.</li>
          </ul>
          {/* <ExternalLinkButton href="https://pinterest.com/search/pins/?q=event%20design%20inspiration">Inspiración para diseño de eventos</ExternalLinkButton> */}
        </Card>
      </div>
    </div>
  );
};

export default EventPageGuide;
