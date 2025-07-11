import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Download, Calendar, MapPin } from 'lucide-react';
import html2canvas from 'html2canvas';
import { Helmet } from 'react-helmet-async';

export default function TicketPageTrial() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const ticketRef = useRef(null);


  useEffect(() => {
    const fakeData = {
      event_name: 'Evento X',
      event_image_address: 'https://i.imgur.com/k4iUzTR.jpeg',
      qr_payload: '696996822060e8038513f0e5a4e9fc20f555088ed1a8d01f9b9efe1e5d364b50',
      owner_name: 'Lionel Andrés',
      owner_lastname: 'Messi',
      owner_dni: '33016244',
      event_date: '2025-01-01 20:00',
      event_place: 'Estadio X',
      ticket_tag_info: { name: 'VIP' },
    };

    setData(fakeData);
    setLoading(false);
  }, []);

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

      const image = canvas.toDataURL('image/jpeg');
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
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-gray-600 text-lg">Cargando...</div>
      </div>
    );
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
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-gray-300" style={{ width: 'auto', aspectRatio: 1 }}>
                <img src={data.event_image_address} alt="Event Logo" className="w-full h-full object-cover" style={{ objectFit: 'cover', width: '100%', height: '100%' }} crossOrigin="anonymous" />
              </div>
            </div>
          </div>
          <div className="text-center mb-2">
            <p className="text-sm text-gray-500">Point this QR to the scan</p>
          </div>

          <div className="bg-white p-0 rounded-xl mb-4">
            <QRCodeSVG id="qr-code" value={data.qr_payload} size={260} level="M" className="w-full max-w-[260px]" />
          </div>

          <div className="relative w-full">
            <div className="absolute -left-9 top-1/2 w-4 h-7 bg-gray-950 rounded-r-full transform -translate-y-1/2" />
            <div className="absolute -right-9 top-1/2 w-4 h-7 bg-gray-950 rounded-l-full transform -translate-y-1/2" />
            <div className="border-t-2 border-dashed border-gray-800 my-2" />
          </div>

          <div className="w-full space-y-1 mt-1">
            <h1 className="text-base font-bold text-gray-800">{data.event_name}</h1>

            <div className="text-base font-bold text-gray-500">Ticket {data.ticket_tag_info?.name}</div>

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
