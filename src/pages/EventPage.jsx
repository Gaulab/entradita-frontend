import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getEventPage } from '../api/eventPageApi';

const CountdownTimer = ({ targetDate }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    if (difference <= 0) return {};

    return {
      días: Math.floor(difference / (1000 * 60 * 60 * 24)),
      horas: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutos: Math.floor((difference / 1000 / 60) % 60),
      segundos: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="grid grid-cols-4 gap-4 text-center">
      {Object.keys(timeLeft).length ? (
        Object.entries(timeLeft).map(([interval, value]) => (
          <div key={interval} className="flex flex-col items-center">
            <span className="text-4xl md:text-6xl font-bold">{value}</span>
            <span className="text-sm md:text-base">{interval}</span>
          </div>
        ))
      ) : (
        <span>¡El evento ha comenzado!</span>
      )}
    </div>
  );
};

const Title = ({ content, subtitle }) => (
  <motion.div
    className="text-center bg-blue-400 bg-opacity-35 w-full p-4 rounded-lg shadow-lg font-poppins glowing mb-2"
    initial={{ opacity: 0, y: -50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <h1 className="text-5xl sm:text-6xl font-bold mb-2">{content}</h1>
    {subtitle && <h2 className="text-2xl sm:text-3xl font-medium">{subtitle}</h2>}
  </motion.div>
);

const Text = ({ content }) => (
  <motion.p
    className="text-xl md:text-2xl mb-4 text-center bg-blue-400 bg-opacity-35 w-full p-4 rounded-lg shadow-lg"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5, delay: 0.4 }}
  >
    {content}
  </motion.p>
);

const ImageFront = ({ src, alt }) => (
  <motion.img
    src={src}
    alt={alt}
    className="rounded-lg shadow-lg mb-2 w-full opacity-85 max-h-80 object-cover"
    animate={{
      boxShadow: [
        "0 0 10px rgba(255, 255, 255, 0.3)",
        "0 0 20px rgba(255, 255, 255, 0.6)",
        "0 0 10px rgba(255, 255, 255, 0.3)",
      ],
    }}
    transition={{
      repeat: Infinity,
      repeatType: "reverse",
      duration: 4,
    }}
  />
);

const Button = ({ text, link }) => (
  <motion.a
    href={link}
    className="bg-white text-gray-900 hover:bg-gray-100 font-bold py-3 px-6 rounded-lg text-xl transition duration-300 ease-in-out transform hover:scale-105 mb-4 inline-block text-center"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    {text}
  </motion.a>
);

const WhatsAppButton = ({ link }) => (
  <motion.a
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    className="bg-white text-gray-900  hover:bg-gray-100 font-bold py-3 px-6 rounded-lg text-xl transition duration-300 ease-in-out transform hover:scale-105 mb-4 inline-block text-center"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    Contactar por WhatsApp
  </motion.a>
);
const Map = ({ address }) => (
  <motion.a
    href={address}
    target="_blank"
    rel="noopener noreferrer"
    className="bg-white  font-bold py-3 px-6 rounded-lg text-xl transition duration-300 ease-in-out transform hover:scale-105 mb-8 inline-block text-center"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    Ver ubicación
  </motion.a>
);

const CbuAlias = ({ cbu, alias, text }) => (
  <div className="bg-blue-400 bg-opacity-35 w-full p-4 rounded-lg shadow-lg mb-4">
    <p>{text}</p>
    <p className="mb-2"><strong>CBU:</strong> {cbu}</p>
    <p className="mb-2"><strong>Alias:</strong> {alias}</p>
  </div>
);

function EventPage() {
  const { id } = useParams();
  const [eventData, setEventData] = useState(null);

  useEffect(() => {
    const fetchEventPage = async () => {
      try {
        const eventPage = await getEventPage(id);
        setEventData(eventPage);
        console.log("eventPage", eventPage);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchEventPage();
  }, [id]);

  useEffect(() => {
    if (eventData) {
      const link = document.createElement('link');
      link.href = `https://fonts.googleapis.com/css2?family=Condiment&family=Oi&family=Rubik+Bubbles&family=Zen+Dots&display=swap`;
      link.rel = 'stylesheet';
      document.head.appendChild(link);

      return () => {
        document.head.removeChild(link);
      };
    }
  }, [eventData]);

  if (!eventData) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const renderBlock = (blockType) => {
    switch (blockType) {
      case 'title':
        return <Title content={eventData.title} subtitle={eventData.text} />;
      case 'text':
        return <Text content={eventData.text} />;
      case 'image_front':
        return <ImageFront src={eventData.image_front} alt={eventData.title} />;
      case 'countdown':
        return (
          <motion.div
            className="mb-4 max-w-2xl bg-blue-400 bg-opacity-35 w-full p-4 rounded-lg shadow-lg"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <CountdownTimer targetDate={eventData.contdown_date} />
          </motion.div>
        );
      case 'button':
        return <Button text={eventData.button_text} link={eventData.button_link} />;
      case 'button_whatsapp':
        return <WhatsAppButton link={eventData.button_whatsapp} />;
      case 'map':
        return <Map address={eventData.map_address} />;
      case 'cbu_alias':
        return <CbuAlias cbu={eventData.cbu} alias={eventData.alias} text={eventData.text_buy} />;
      default:
        return null;
    }
  };
  return (
    
    <div 
      className="min-h-screen text-white relative overflow-hidden" 
      style={{ 
        fontFamily: "Zen Dots",
        fontWeight: "200",
        color: eventData.font_color
      }}
    >
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ backgroundImage: `url(${eventData.image_background})` }} 
      />
      <div className="absolute inset-0 bg-black opacity-50" />

      <div className="relative z-10 flex flex-col min-h-screen p-4 max-w-lg mx-auto">
        {eventData.block_order.map((blockType, index) => (
          <React.Fragment key={index}>
            {renderBlock(blockType)}
          </React.Fragment>
        ))}
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm text-center opacity-70">
        Powered by entradita.com
      </div>
    </div>
  );
}

export default EventPage;

