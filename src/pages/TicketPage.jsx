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
    <div className="flex justify-center items-center min-h-dvh bg-gradient-to-b from-gray-900 to-gray-950 p-4">
      <div className="w-full max-w-md ticket-appear">

        <div ref={ticketRef} className="flex flex-col h-min items-center rounded-3xl overflow-hidden shadow-2xl" style={{ backgroundColor: '#FFFFFF', colorScheme: 'light' }}>

            {/* Gradient accent top */}
            <div className="w-full h-1.5" style={{ background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #3b82f6)' }} />

            {/* Top marquee */}
            <div className="w-full overflow-hidden py-2" style={{ backgroundColor: '#FFFFFF' }}>
              <div className="flex items-center ticket-marquee-track">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex items-center shrink-0">
                    {[...Array(8)].map((_, j) => (
                      <span key={j} className="text-[10px] font-bold tracking-wider mx-3 whitespace-nowrap text-gray-400">
                        entradita.com
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* QR Section */}
            <div className="w-full px-8 pb-4 flex flex-col items-center" style={{ backgroundColor: '#FFFFFF' }}>
              <p className="text-[10px] text-gray-400 tracking-[0.2em] uppercase mb-3 font-medium">Presentá este QR en la entrada</p>

              <div className="relative" style={{ backgroundColor: '#FFFFFF' }}>
                <QRCodeSVG id="qr-code" value={data.qr_payload} size={240} level="H"
                  fgColor="#000000"
                  bgColor="#FFFFFF"
                  className="w-full max-w-[240px]"
                  style={{ backgroundColor: '#FFFFFF' }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[68px] h-[68px] rounded-full overflow-hidden border-[3px] border-gray-200 shadow-md" style={{ backgroundColor: '#FFFFFF' }}>
                    <img src={data.event_image || "/isotipoWhite.png"} alt="Event Logo" className="w-full h-full object-cover" crossOrigin="anonymous" />
                  </div>
                </div>
              </div>
            </div>

            {/* Tear line (troquelado) */}
            <div className="relative w-full px-8">
              <div className="absolute -left-4 top-1/2 w-8 h-8 bg-gray-950 rounded-full transform -translate-y-1/2 z-10" />
              <div className="absolute -right-4 top-1/2 w-8 h-8 bg-gray-950 rounded-full transform -translate-y-1/2 z-10" />
              <div className="border-t-2 border-dashed border-gray-300 my-1" />
            </div>

            {/* Info Section */}
            <div className="w-full px-7 pt-3 pb-3">
              {/* Event name + tag */}
              <div className="mb-4">
                <h1 className="text-lg font-bold text-gray-900 leading-tight">{data.event_name}</h1>
                <span className="inline-block mt-1.5 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ color: '#6d28d9', backgroundColor: '#f5f3ff' }}>
                  {data.ticket_tag_info?.name}
                </span>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                <div>
                  <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium">Nombre</p>
                  <p className="font-semibold text-gray-800 mt-0.5">{data.owner_name} {data.owner_lastname}</p>
                </div>

                {data.owner_dni ? (
                  <div>
                    <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium">DNI</p>
                    <p className="font-semibold text-gray-800 mt-0.5">{data.owner_dni}</p>
                  </div>
                ) : <div />}

                <div>
                  <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium">Fecha</p>
                  <p className="font-semibold text-gray-800 mt-0.5">{data.event_date}</p>
                </div>

                <div>
                  <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium">Lugar</p>
                  <p className="font-semibold text-gray-800 mt-0.5">{data.event_place}</p>
                </div>
              </div>

              {/* Warning + Download */}
              <p className="mt-2 text-[11px] text-red-400 text-center">⚠ No compartas esta entrada. Es única y personal.</p>
              <Button onClick={handleDownload} disabled={isDownloading} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors rounded-xl h-9 text-xs font-medium border-0 mt-2">
                <Download className="mr-1.5 h-3.5 w-3.5" />
                {isDownloading ? 'Generando...' : 'Descargar entrada'}
              </Button>
            </div>

            {/* Bottom marquee (reverse direction) */}
            <div className="w-full overflow-hidden py-2" style={{ backgroundColor: '#FFFFFF' }}>
              <div className="flex items-center ticket-marquee-track-reverse">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex items-center shrink-0">
                    {[...Array(8)].map((_, j) => (
                      <span key={j} className="text-[10px] font-bold tracking-wider mx-3 whitespace-nowrap text-gray-400">
                        entradita.com
                      </span>
                    ))}
                  </div>
                ))}
              </div>
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
