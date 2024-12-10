import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

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

function EventPage() {
  const { id } = useParams();
  const [eventInfo, setEventInfo] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState('');
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const backgroundImages = [
      'https://i.pinimg.com/736x/83/b1/a2/83b1a22c28ba23ece455030a97225e08.jpg',
      'https://i.pinimg.com/736x/ef/2e/55/ef2e550edadc110e615b0f91607605d8.jpg',
      'https://i.pinimg.com/736x/b0/e6/97/b0e6971c88bb02d442b32fe8fc6f0e8e.jpg',
      'https://i.pinimg.com/736x/69/c7/4b/69c74b8f422c418dd5af60dd382410be.jpg',
      'https://i.pinimg.com/736x/4e/1f/b7/4e1fb7e5764f0f310841b5c9022ee35d.jpg',
      'https://i.pinimg.com/736x/44/7f/d9/447fd937af28a452944422b33a731c69.jpg',
      'https://i.pinimg.com/736x/fd/b1/d4/fdb1d45ae70389107c2a492e034270e0.jpg'


    ];

    const randomImage = backgroundImages[Math.floor(Math.random() * backgroundImages.length)];
    setBackgroundImage(randomImage);
  }, []);

  useEffect(() => {
    const fetchEventInfo = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/v1/event/${id}/info-for-web/`);
        if (!response.ok) throw new Error('Error al obtener información del evento');

        const data = await response.json();
        setEventInfo(data);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchEventInfo();
  }, [id, apiUrl]);

  const redirectToWhatsApp = () => {
    const message = encodeURIComponent('¡Hola! Me gustaría comprar un ticket para el evento ' + eventInfo.name);
    window.open(`https://wa.me/+54${eventInfo.organizer_contact}?text=${message}`, '_blank');
    console.log('Redirigiendo a WhatsApp... +54' + eventInfo.organizer_contact);
  };

  if (!eventInfo) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImage})` }} />
      <div className="absolute inset-0 bg-black opacity-15" />

      <div className="relative z-10 flex flex-col min-h-screen p-4 max-w-lg mx-auto ">
        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-4 text-center bg-slate-500 bg-opacity-35 w-full p-4 rounded-lg shadow-lg font-poppins glowing"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {eventInfo.name}
        </motion.h1>
        <motion.img
          src={eventInfo.image_address}
          alt={eventInfo.name}
          className="rounded-lg shadow-lg mb-4 w-full opacity-85 max-h-80 object-cover"
          animate={{
            boxShadow: [
              "0 0 10px rgba(255, 255, 255, 0.3)",
              "0 0 20px rgba(255, 255, 255, 0.6)",
              "0 0 10px rgba(255, 255, 255, 0.3)",
            ],
          }}
          transition={{
            repeat: Infinity,  // Repite indefinidamente
            repeatType: "reverse",  // Hace que el movimiento sea cíclico (vuelve al estado inicial)
            duration: 4, // Duración de cada ciclo
          }}
        />

        <motion.div
          className="mb-4 max-w-2xl bg-slate-500 bg-opacity-35 w-full p-4 rounded-lg shadow-lg"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <CountdownTimer targetDate={eventInfo.date} />
        </motion.div>

        <motion.p
          className="text-xl md:text-2xl mb-4 text-center bg-slate-500 bg-opacity-35 w-full p-4 rounded-lg shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {eventInfo.place}
        </motion.p>

        <motion.button
          className="bg-white text-gray-900 hover:bg-gray-100 font-bold py-3 px-6 rounded-full text-xl transition duration-300 ease-in-out transform hover:scale-105 mb-8"
          onClick={redirectToWhatsApp}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Buy Ticket
        </motion.button>
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm text-center opacity-70">
        Powered by entradita.com
      </div>
    </div>
  );
}

export default EventPage;
