// entraditaFront/src/pages/ScannerView.jsx

// react imports
import { useState, useEffect, useCallback } from 'react';
// react-router imports
import { useParams } from 'react-router-dom';
// Custom components
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Scanner } from '@yudiel/react-qr-scanner';
import { Input } from '../../components/ui/input';
// API
import { checkPassword } from '../../api/employeeApi';
import { checkTicketByPayload } from '../../api/ticketApi';
import { checkTicketByDni } from '../../api/ticketApi';
// PropTypes

export default function ScannerPageTrial () {
  // main states
  const { id } = useParams();
  const [error, setError] = useState('');
  const [dni, setDni] = useState('');
  const [ticketData, setTicketData] = useState(null);
  const [dialogColor, setDialogColor] = useState('');
  const [eventId, setEventId] = useState(1);
  const [dniRequired, setDniRequired] = useState(true);
  // employee status
  const [scannerNotFound, setScannerNotFound] = useState(false);
  const [showTicketInfo, setShowTicketInfo] = useState(false);
  const [uuid, setUuid] = useState("991b2687-18d1-44a0-bc60-f9bf9d42df2f");


  const handleTicketValidation = useCallback((data, isOldScanned) => {
    setTicketData(data);
    setDialogColor(isOldScanned ? 'yellow' : 'green');
    setShowTicketInfo(true);
    setTimeout(() => setShowTicketInfo(false), 6000); // Hide info after 5 seconds
  }, []);

  const validarTicketPayload = useCallback(
    async (result) => {
      try {
        const simulatedPayload = "696996822060e8038513f0e5a4e9fc20f555088ed1a8d01f9b9efe1e5d364b50";
        if (result[0].rawValue === simulatedPayload) {
          const data = {
            ticket: {
              owner_name: "Lionel Andrés",
              owner_lastname: "Messi",
              owner_dni: "33016244",
              ticket_tag_name: "VIP",
            },
            old_scanned: false,
          };
          handleTicketValidation(data.ticket, data.old_scanned);
        } else {
          throw new Error("Ticket no encontrado.");
        }
      } catch (error) {
        setDialogColor('red');
        setError(error.message);
        setTicketData(null);
        setShowTicketInfo(true);
        setTimeout(() => setShowTicketInfo(false), 5000);
      }
    },
    [handleTicketValidation]
  );

  const validarTicketDni = useCallback(
    async (dni) => {
      setError('');
      try {
        const simulatedDni = "33016244";
        if (dni === simulatedDni) {
          const data = {
            ticket: {
              owner_name: "Lionel Andrés",
              owner_lastname: "Messi",
              owner_dni: "33016244",
              ticket_tag_name: "VIP",
            },
            old_scanned: false,
          };
          handleTicketValidation(data.ticket, data.old_scanned);
        } else {
          throw new Error("Ticket no encontrado.");
        }
      } catch (error) {
        setTicketData(null);
        setDialogColor('red');
        setError(error.message || 'Ticket no encontrado.');
        setShowTicketInfo(true);
        setTimeout(() => setShowTicketInfo(false), 5000);
      }
    },
    [handleTicketValidation]
  );



  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4 w-screen">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-white">Scan Ticket</CardTitle>
          <CardDescription className="text-center text-gray-400">Scanee el código QR del ticket para el evento ID: {id}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 ">
          <div className="aspect-square">
            <Scanner
              components={{
                torch: false, // Habilita la linterna
                zoom: false, // Habilita el zoom
                finder: false,
              }}
              styles={{
                container: {borderRadius: '10px', width: '100%', height: '100%', backgroundColor: 'black', padding: '0'},
                video: { borderRadius: '10px', height: '100%', width: '100%', backgroundColor: 'black' },
                finderBorder: 0,
              }}
              onScan={validarTicketPayload}
              allowMultiple={true}
              scanDelay={4000}
              onError={(error) => console.error(error)}
            />
          </div>

          {dniRequired && (
          <div className="flex flex-col space-y-4">
            <Input type="text" placeholder="Ingrese DNI del ticket" value={dni} onChange={(e) => setDni(e.target.value)}
              className="w-full bg-gray-700 text-white" />
            <Button onClick={() => validarTicketDni(dni)} className="w-full bg-green-600 hover:bg-green-700 text-white">
              Buscar por DNI
            </Button>
            </div>
          )}

          {showTicketInfo && (
            <div className={`p-4 rounded-lg ${dialogColor === 'green' ? 'bg-green-600' : dialogColor === 'yellow' ? 'bg-yellow-500' : 'bg-red-600'} text-black`}>
              {ticketData ? (
                <>
                  <p className="text-black font-bold">Ticket encontrado!</p>
                  {dialogColor === 'yellow' && <p>Este ticket ya fue escaneado</p>}
                  <p className="text-black">Nombre: {ticketData.owner_name}</p>
                  <p className="text-black">Apellido: {ticketData.owner_lastname}</p>
                  {ticketData.owner_dni && <p className="text-black">DNI: {ticketData.owner_dni}</p>}
                  <p className="text-black">Tipo: {ticketData.ticket_tag_name}</p>
                </>
              ) : (
                <p className="text-black font-bold">{error}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
