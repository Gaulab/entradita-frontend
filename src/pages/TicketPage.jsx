'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertTriangle, Download, Calendar, MapPin } from 'lucide-react';
import { getTicket } from '../api/ticketApi';

export default function TicketPage() {
  const { ticket_uuid } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      console.log('data', data);
    } else {
      setError('No se proporcionó un UUID válido');
    }
  }, [ticket_uuid]);

  useEffect(() => {
    // Desplazar la ventana al principio cuando el componente se monta
    window.scrollTo(0, 0);
  }, []);

  const handleDownload = () => {
    const svg = document.getElementById('qr-code');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const scale = 4;
      const borderSize = 20;
      canvas.width = (img.width + borderSize * 2) * scale;
      canvas.height = (img.height + borderSize * 2) * scale;
      ctx.scale(scale, scale);
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, borderSize, borderSize);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `ticket-qr-${ticket_uuid}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
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
      <div className="p-8 py-2 flex flex-col h-min items-center bg-white rounded-3xl">
        <div className="w-full h-15 mb-2">
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-14 h-14 rounded-full overflow-hidden border-4 border-gray-300 shadow-lg">
              <img src={data.event_image_address} alt="Event Logo" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
        <div className="text-center mb-2">
          <p className="text-sm text-gray-500">Point this QR to the scan</p>
        </div>

        <div className="bg-white p-0 rounded-xl mb-4">
          <QRCodeSVG id="qr-code" value={data.qr_payload} size={260} level="M" className="w-full max-w-[400px]" />
        </div>

        <div className="relative w-full">
          <div className="absolute -left-9 top-1/2 w-4 h-7 bg-gray-900 rounded-r-full transform -translate-y-1/2" />
          <div className="absolute -right-9 top-1/2 w-4 h-7 bg-gray-900 rounded-l-full transform -translate-y-1/2" />
          <div className="border-t-2 border-dashed border-gray-800 my-2" />
        </div>

        <div className="w-full space-y-1 mt-1">
          <h1 className="text-base font-bold text-gray-800">
            {data.event_name} - Ticket {data.ticket_tag_info.name}
          </h1>

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
            {!data.owner_dni && (
              <div className="col-span-1">
              </div>
            )}

            <div className="col-span-1">
              <p className="text-gray-500 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date & Time
              </p>
              <p className="font-medium text-gray-800">{data.event_date}</p>
            </div>

            <div className="col-span-1">
              <p className="text-gray-500 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location
              </p>
              <p className="font-medium text-gray-800">{data.event_place}</p>
            </div>
          </div>

          <div className="mt-4">
            <p className="font-sm text-sm text-red-800">
              No compartas esta entrada con nadie <br /> Es única y personal.
            </p>
          </div>

          <div className="">
            <Button onClick={handleDownload} className="w-full bg-gray-700 hover:bg-gray-600 text-white transition-colors">
              <Download className="mr-2 h-4 w-4" /> Descargar QR
            </Button>
          </div>

          <div className="text-center font-bold text-gray-400 text-sm ">entradita.com</div>
        </div>
      </div>
    </div>
  );
}
