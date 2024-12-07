import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CountdownTimer = ({ targetDate }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        días: Math.floor(difference / (1000 * 60 * 60 * 24)),
        horas: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutos: Math.floor((difference / 1000 / 60) % 60),
        segundos: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const timerComponents = [];

  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval]) {
      return;
    }

    timerComponents.push(
      <div key={interval} className="flex flex-col items-center">
        <span className="text-4xl md:text-6xl font-bold">{timeLeft[interval]}</span>
        <span className="text-sm md:text-base">{interval}</span>
      </div>
    );
  });

  return <div className="grid grid-cols-4 gap-4 text-center">{timerComponents.length ? timerComponents : <span>¡El evento ha comenzado!</span>}</div>;
};

function EventPage() {
  const [eventDate] = useState(new Date('2024-12-31T00:00:00'));
  const [whatsappNumber] = useState('+1234567890');
  const [location] = useState('Arena Mega Stadium, Ciudad Ejemplo');
  const [gradient, setGradient] = useState('');

  const redirectToWhatsApp = () => {
    const message = encodeURIComponent('¡Hola! Me gustaría comprar un ticket para el evento.');
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  useEffect(() => {
    const colors = [
      'from-pink-500', 'from-purple-500', 'from-indigo-500', 'from-blue-500', 'from-green-500', 'from-yellow-500', 'from-red-500',
      'to-pink-500', 'to-purple-500', 'to-indigo-500', 'to-blue-500', 'to-green-500', 'to-yellow-500', 'to-red-500'
    ];
    const randomFrom = colors[Math.floor(Math.random() * 7)];
    let randomTo = colors[Math.floor(Math.random() * 7) + 7];
    while (randomFrom.split('-')[1] === randomTo.split('-')[1]) {
      randomTo = colors[Math.floor(Math.random() * 7) + 7];
    }
    setGradient(`bg-gradient-to-br ${randomFrom} ${randomTo}`);
  }, []);

  return (
    <div className={`min-h-screen text-white relative overflow-hidden ${gradient}`}>
      <div className="absolute inset-0 bg-black opacity-50" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        <motion.h1 className="text-5xl md:text-7xl font-bold mb-8 text-center" initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          Malabrigo Beer
        </motion.h1>

        <motion.div className="mb-8 w-full max-w-2xl" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <CountdownTimer targetDate={eventDate} />
        </motion.div>

        <motion.p className="text-xl md:text-2xl mb-8 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}>
          {location}
        </motion.p>

        <motion.button
          className="bg-white text-gray-900 hover:bg-gray-100 font-bold py-3 px-6 rounded-full text-xl transition duration-300 ease-in-out transform hover:scale-105 mb-8"
          onClick={redirectToWhatsApp}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Comprar Ticket por WhatsApp
        </motion.button>

        <motion.p className="mt-8 text-lg text-center max-w-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.6 }}>
          ¡No te pierdas la fiesta más esperada del año! Música en vivo, DJs internacionales y mucho más.
        </motion.p>
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm text-center opacity-70">Powered by entradita.com</div>
    </div>
  );
}

export default EventPage;

