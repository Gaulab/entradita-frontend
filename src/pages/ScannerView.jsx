import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
// Custom components
import { Button } from "../components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { Scanner } from "@yudiel/react-qr-scanner";
import { Input } from "../components/ui/input";
import PropTypes from "prop-types";
// API
import { getScanner } from "../api/empleadoApi";
import { checkPassword } from "../api/empleadoApi";
import { checkTicketByPayload } from "../api/ticketApi";
import { checkTicketByDni } from "../api/ticketApi";

const ScannerView = ({ uuid }) => {
  const { id } = useParams();
  const [error, setError] = useState("");
  const [dni, setDni] = useState("");
  const [ticketData, setTicketData] = useState(null);
  const [dialogColor, setDialogColor] = useState("");
  const [eventId, setEventId] = useState(null);
  const [escanerNotFound, setEscanerNotFound] = useState(false);
  const [password, setPassword] = useState("");
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [showTicketInfo, setShowTicketInfo] = useState(false);

  useEffect(() => {
    const storedPasswordStatus = localStorage.getItem("isPasswordCorrect");
    if (storedPasswordStatus) {
      setIsPasswordCorrect(JSON.parse(storedPasswordStatus));
    }

    const fetchScanner = async () => {
      try {
        const data = await getScanner(uuid);
        setEventId(data.event);
      } catch (error) {
        console.error("Error fetching scanner:", error.message);
        setEscanerNotFound(true);
      }
    };

    fetchScanner();

    return () => {
      localStorage.removeItem("isPasswordCorrect");
    };
  }, [uuid]);

  const handleTicketValidation = useCallback((data, isOldScanned) => {
    setTicketData(data);
    setDialogColor(isOldScanned ? "yellow" : "green");
    setShowTicketInfo(true);
    setTimeout(() => setShowTicketInfo(false), 5000); // Hide info after 5 seconds
  }, []);

  const validarTicketPayload = useCallback(async (result) => {
    try {
      const data = await checkTicketByPayload(result[0].rawValue, uuid, eventId)
      handleTicketValidation(data.ticket, data.old_scanned);
    } catch (error) {
      setDialogColor("red");
      setError(error.message);
      setTicketData(null);
      setShowTicketInfo(true);
      setTimeout(() => setShowTicketInfo(false), 5000);
    }
  }, [eventId, handleTicketValidation]);

  const validarTicketDni = useCallback(async (dni) => {
    setError("");
    try {
      const data = await checkTicketByDni(dni, uuid, eventId)
      handleTicketValidation(data.ticket, data.old_scanned);
    } catch (error) {
      setTicketData(null);
      setDialogColor("red");
      setError(error.message || "Ticket no encontrado.");
      setShowTicketInfo(true);
      setTimeout(() => setShowTicketInfo(false), 5000);
    }
  }, [eventId, handleTicketValidation]);

  const verifyPassword = async () => {
    if (!eventId) {
      setPasswordError("ID de evento no disponible.");
      return;
    }

    try {
      const data = checkPassword(eventId,password);
      setIsPasswordCorrect(true);
      localStorage.setItem("isPasswordCorrect", "true");
    } catch (error) {
      setPasswordError(error.message);
    }
  };

  if (escanerNotFound) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <h1 className="text-2xl">Escaner no encontrado</h1>
      </div>
    );
  }

  if (!isPasswordCorrect) {
    if (!eventId) {
      return <div className="flex items-center justify-center h-screen bg-gray-900 text-white w-screen">Cargando...</div>;
    }

    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white w-screen">
        <Card className="bg-gray-800 border-gray-700 p-6 max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-white text-xl">Ingrese la contraseña del evento</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-4 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            />
            {passwordError && <p className="text-red-500 mb-2">{passwordError}</p>}
            <Button onClick={verifyPassword} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Verificar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4 w-screen">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-white">Escanear Ticket</CardTitle>
          <CardDescription className="text-center text-gray-400">Escanee el código QR del ticket para el evento ID: {id}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="aspect-square">
            <Scanner onScan={validarTicketPayload} allowMultiple={true} scanDelay={1000} onError={(error) => console.error(error)} />
          </div>

          <div className="flex flex-col space-y-2">
            <Input 
              type="text" 
              placeholder="Ingrese DNI del ticket" 
              value={dni} 
              onChange={(e) => setDni(e.target.value)} 
              className="w-full bg-gray-700 text-white" 
            />
            <Button 
              onClick={() => validarTicketDni(dni)} 
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              Buscar por DNI
            </Button>
          </div>

          {showTicketInfo && (
            <div className={`p-4 rounded-lg ${
              dialogColor === "green" ? "bg-green-600" : 
              dialogColor === "yellow" ? "bg-yellow-500" : 
              "bg-red-600"
            } text-black`}>
              {ticketData ? (
                <>
                  <p className="text-black font-bold">Ticket encontrado!</p>
                  {dialogColor === "yellow" && <p>Este ticket ya fue escaneado</p>}
                  <p className="text-black">Nombre: {ticketData.owner_name}</p>
                  <p className="text-black">Apellido: {ticketData.owner_lastname}</p>
                  <p className="text-black">DNI: {ticketData.owner_dni}</p>
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


ScannerView.propTypes = {
  uuid: PropTypes.string.isRequired,
};

export default ScannerView;