import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { getTicket } from '../api/ticketApi';
import html2canvas from 'html2canvas';

export default function TicketPage() {
  const { ticket_uuid } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const ticketRef = useRef(null);

  useEffect(() => {
    if (ticket_uuid) {
      const getData = async () => {
        try {
          const data = await getTicket(ticket_uuid);
          setData(data);
          setLoading(false);
        } catch (error) {
          setError(error.message);
          setLoading(false);
        }
      };
      getData();
    } else {
      setError('No se proporcionó un UUID válido');
      setLoading(false);
    }
  }, [ticket_uuid]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleDownload = async () => {
    if (!ticketRef.current) return;

    setIsDownloading(true);
    const downloadButton = ticketRef.current.querySelector('button');
    const downloadText = ticketRef.current.querySelector('p.text-sm.text-gray-600');
    if (downloadButton) {
      downloadButton.style.display = 'none';
    }
    if (downloadText) {
      downloadText.style.display = 'none';
    }

    try {
      const canvas = await html2canvas(ticketRef.current, {
        scale: 4,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
      });

      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `ticket-${data.event_name}-${data.owner_name}.jpeg`;
      link.click();
    } catch (error) {
      console.error('Error generating ticket image:', error);
    } finally {
      setIsDownloading(false);
      if (downloadButton) {
        downloadButton.style.display = 'flex';
      }
      if (downloadText) {
        downloadText.style.display = 'block';
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121a24]">
        <div className="text-center">
          <div className="flex flex-col items-center">
            <div className="mb-4">
              <Logo />
            </div>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
            <p className="mt-4 text-gray-200">Cargando información del ticket...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-red-500 bg-white p-4 rounded-lg shadow-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 p-4 overflow-auto">
      <div className="w-full max-w-md">
        <div ref={ticketRef} className="p-8 py-2 flex flex-col h-min items-center bg-white rounded-3xl">
          <div className="w-full h-15 mb-2">
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-gray-300" style={{ width: '100px', aspectRatio: 1 }}>
                <img src={data.event_image_address} alt="Event Logo" className="w-full h-full object-cover" style={{ objectFit: 'cover', width: '100%', height: '100%' }} crossOrigin="anonymous" />
              </div>
            </div>
          </div>
          <div className="text-center mb-2">
            <p className="text-sm text-gray-500">Point this QR to the scan</p>
          </div>

          <div className="bg-white p-0 rounded-xl mb-4">
            <QRCodeSVG id="qr-code" value={data.qr_payload} size={260} level="M"
              fgColor="#000000" // Negro puro
              bgColor="#FFFFFF" // Blanco puro
              className="w-full max-w-[260px]" />
          </div>

          <div className="relative w-full">
            <div className="absolute -left-9 top-1/2 w-4 h-7 bg-gray-950 rounded-r-full transform -translate-y-1/2" />
            <div className="absolute -right-9 top-1/2 w-4 h-7 bg-gray-950 rounded-l-full transform -translate-y-1/2" />
            <div className="border-t-2 border-dashed border-gray-800 my-2" />
          </div>

          <div className="w-full space-y-1 mt-1">
            <h1 className="text-base font-bold text-gray-800">{data.event_name}</h1>

            <div className="text-lg font-bold text-gray-800">
              Ticket para <span className="text-green-600">{data.ticket_tag_info?.name}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="col-span-1">
                <p className="text-gray-500">Name</p>
                <p className="font-medium text-gray-800">
                  {data.owner_name} {data.owner_lastname}
                </p>
              </div>

              {data.owner_dni && (
                <div className="col-span-1">
                  <p className="text-gray-500">DNI</p>
                  <p className="font-medium text-gray-800">{data.owner_dni}</p>
                </div>
              )}
              {!data.owner_dni && <div className="col-span-1"></div>}

              <div className="col-span-1">
                <p className="text-gray-500 flex items-center gap-2">Date & Time</p>
                <p className="font-medium text-gray-800">{data.event_date}</p>
              </div>

              <div className="col-span-1">
                <p className="text-gray-500 flex items-center gap-2">Location</p>
                <p className="font-medium text-gray-800">{data.event_place}</p>
              </div>
            </div>

            <div className="mt-4">
              <p className="font-sm text-sm text-red-800">
                No compartas esta entrada con nadie <br /> Es única y personal.
              </p>
            </div>

            <div className="">
              {!isDownloading && <p className="text-sm text-gray-600 mb-2 text-start">Descarga tu entrada por si luego no tenés internet o batería en tu celular</p>}
              <Button onClick={handleDownload} disabled={isDownloading} className="w-full bg-gray-700 hover:bg-gray-600 text-white transition-colors">
                <Download className="mr-2 h-4 w-4" />
                {isDownloading ? 'Generando...' : 'Descargar QR'}
              </Button>
            </div>

            <div className="text-center font-bold text-gray-400 text-sm">entradita.com</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Logo({ small = false }) {
  Logo.propTypes = {
    small: PropTypes.bool,
  };

  return (
    <div className={`flex items-center ${small ? "text-lg" : "text-xl"}`}>
      <div className="mr-1">
        <img
          src="/isotipoWhite.png" // Replace with the path to your logo image
          alt="Entradita Logo"
          className={`${small ? "w-10 h-10" : "w-10 h-10"}`}
        />
      </div>
      <span className={`font-bold text-white ${small ? "text-sm" : "text-lg"}`}>entradita.com</span>
    </div>
  );
}
