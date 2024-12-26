import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getEventPage } from '../api/eventPageApi';
import { googleFonts, FontStyles } from '../fonts'; 

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

const Title = ({ title, subtitle, cardColor }) => (
  <motion.div
    className="mb-2 text-center w-full p-4 rounded-lg shadow-lg glowing"
    style={{ backgroundColor: `${cardColor}30` }}
    initial={{ opacity: 0, y: -50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <h1 className="text-5xl md:text-7xl font-bold">{title}</h1>
    {subtitle && <h2 className="text-xl md:text-4xl mt-2">{subtitle}</h2>}
  </motion.div>
);

const Text = ({ content, cardColor }) => (
  <motion.p
    className="text-xl md:text-2xl mb-2 text-center w-full p-4 rounded-lg shadow-lg"
    style={{ backgroundColor: `${cardColor}30` }} // 25% opacity in hex is 40
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5, delay: 0.4 }}
  >
    {content}
  </motion.p>
);

const ImageFront = ({ src, alt, cardColor }) => (
  <motion.img
    src={src}
    alt={alt}
    className="rounded-lg shadow-lg mb-2 w-full opacity-85 object-cover"
    animate={{
      boxShadow: [`0 0 10px ${cardColor}90`, `0 0 20px ${cardColor}90`, `0 0 10px ${cardColor}90`],
    }}
    transition={{
      repeat: Infinity,
      repeatType: 'reverse',
      duration: 4,
    }}
  />
);

const Button = ({ text, link, color, bgcolor }) => (
  <motion.a
    href={link}
    className="font-bold py-3 px-6 rounded-lg text-xl transition duration-300 ease-in-out transform hover:scale-105 mb-2 inline-block text-center"
    style={{ color: color, backgroundColor: bgcolor }}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    {text}
  </motion.a>
);

const Pay = ({ text, cbu, alias, cardColor }) => (
  <div className="w-full p-4 rounded-lg shadow-lg mb-2" style={{ backgroundColor: `${cardColor}30` }}>
    <p className="mb-2">{text}</p>
    <p className="mb-2">
      <strong>CBU:</strong> {cbu}
    </p>
    <p className="mb-2">
      <strong>Alias:</strong> {alias}
    </p>
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
        console.log('eventPage', eventPage);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchEventPage();
  }, [id]);


  if (!eventData) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const generalBlock = eventData.blocks.find((block) => block.type === 'GENERAL');
  const cardColor = generalBlock?.data.card_color || '#000000';

  const renderBlock = (block) => {
    switch (block.type) {
      case 'TITLE':
        return <Title title={block.data.title} subtitle={block.data.subtitle} cardColor={cardColor} />;
      case 'TEXT':
        return <Text content={block.data.text} cardColor={cardColor} />;
      case 'IMAGE':
        return <ImageFront src={block.data.image_address} alt={block.data.title || 'Event image'} cardColor={cardColor} />;
      case 'COUNTDOWN':
        return (
          <motion.div
            className="mb-2 max-w-2xl w-full p-4 rounded-lg shadow-lg"
            style={{ backgroundColor: `${cardColor}30` }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <CountdownTimer targetDate={block.data.contdown_date} />
          </motion.div>
        );
      case 'BUTTON':
        return <Button text={block.data.button_text} link={block.data.button_link} color={block.data.button_color} bgcolor={block.data.button_bgcolor} />;
      case 'PAY':
        return <Pay text={block.data.pay_text} cbu={block.data.pay_cbu} alias={block.data.pay_alias} cardColor={cardColor} />;
      default:
        return null;
    }
  };

  return (
    <>
      <FontStyles />  
      <div
        className="min-h-screen text-white relative overflow-hidden"
        style={{
          fontFamily: generalBlock?.data.font || 'Arial',
          color: generalBlock?.data.font_color || '#FFFFFF',
        }}
      >
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${generalBlock?.data.image_background})` }} />
        <div className="absolute inset-0 bg-black opacity-20" />

        <div className="relative z-10 flex flex-col min-h-screen p-4 max-w-lg mx-auto">
          {eventData.blocks
            .sort((a, b) => a.order - b.order)
            .map((block) => (
              <React.Fragment key={block.id}>{renderBlock(block)}</React.Fragment>
            ))}
        </div>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm text-center opacity-70">Powered by entradita.com</div>
      </div>
    </>
  );
}

export default EventPage;
