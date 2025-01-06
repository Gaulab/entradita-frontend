'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertTriangle, Download, Calendar, MapPin } from 'lucide-react';
import { getTicket } from '@/api/ticketApi';
import html2canvas from 'html2canvas';

export default function TicketPage() {
  const { ticket_uuid } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scanned, setScanned] = useState(true); // Simula que ya fue escaneado

  useEffect(() => {
    if (ticket_uuid) {
      const getData = async () => {
        try {
          const data = await getTicket(ticket_uuid);
          setData(data);
          setLoading(false);
        } catch (error) {
          setError(error.message);
        }
      };
      getData();
    } else {
      setError('No se proporcionó un UUID válido');
    }
  }, [ticket_uuid]);

  useEffect(() => {
    // Desplazar la ventana al principio cuando el componente se monta
    window.scrollTo(0, 0);
  }, []);

  const handleDownload = async () => {
    const ticketElement = document.getElementById('ticket-container');
    try {
      const canvas = await html2canvas(ticketElement, { scale: 2, backgroundColor: null });
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `ticket-${ticket_uuid}.png`;
      link.click();
    } catch (error) {
      console.error('Error generating ticket image:', error);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-gray-600 text-lg">Cargando...</div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-red-500 bg-white p-4 rounded-lg shadow-lg">{error}</div>
      </div>
    );

  return (
    <div className="flex justify-center h-screen bg-gray-900 p-4 overflow-hidden">
      <div id="ticket-container" className="p-8 py-2 flex flex-col h-min items-center bg-white rounded-3xl ">
        <div className="w-full h-15 mb-2">
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-14 h-14 rounded-full overflow-hidden border-4 border-gray-300 shadow-lg">
              <img src={data.event_image_address} alt="Event Logo" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
        <div className="text-center mb-2">
          <p className="text-sm text-gray-500">{scanned ? 'Este ticket ya ha sido escaneado' : 'Point this QR to the scan'}</p>
        </div>

        <div className="bg-white p-0 rounded-xl mb-4">
          <QRCodeSVG id="qr-code" value={data.qr_payload} size={260} level="M" className="w-full max-w-[400px]" />
        </div>

        {/* ... (el resto del código es igual) */}
      </div>
    </div>
  );
}
