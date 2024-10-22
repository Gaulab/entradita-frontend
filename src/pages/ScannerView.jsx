import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Scanner } from '@yudiel/react-qr-scanner';
import { Input } from "../components/ui/input"; // Asegúrate de tener un componente Input
import PropTypes from 'prop-types';

const ScannerView = ({ uuid }) => {
  const { id } = useParams();
  const [escaner, setEscaner] = useState(null);
  const [escaneando, setEscaneando] = useState(false);
  const [error, setError] = useState('');
  const [dni, setDni] = useState('');
  const [ticketData, setTicketData] = useState(null); // Datos del ticket (nombre, apellido, dni)
  const [dialogColor, setDialogColor] = useState(''); // Color del diálogo (verde, rojo, amarillo)
  const [eventId, setEventId] = useState(null);
  const [escanerNotFound, setEscanerNotFound] = useState(false);
  const [password, setPassword] = useState('');
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem('isPasswordCorrect'); // Clear localStorage when leaving the page
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    const storedPasswordStatus = localStorage.getItem('isPasswordCorrect');
    if (storedPasswordStatus) {
      setIsPasswordCorrect(JSON.parse(storedPasswordStatus));
    }

    const fecthScanner = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/v1/employees/scanner/${uuid}/info/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 404) {
          setEscanerNotFound(true);
          return;
        }

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log(data);
        setEscaner(data);
        setEventId(data.event);

      } catch (error) {
        console.error('Error fetching scanner:', error);
      }
    };

    fecthScanner();
  }, [uuid]);

  const validarTicket = async (qrValue) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/tickets/scan/${qrValue}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ event_id: eventId }),
      });
  
      data = await response.json();
      console.log(data);

      if(response.data.scanned){
        setDialogColor('yellow');
      }
      else{
        setDialogColor('green');
      }

    } catch (error) {
      setDialogColor('red');
      setError('Ticket no encontrado.');
      return null;
    }
    
    return data;
  };

  const handleScan = async (result) => {
    console.log(result);
    if (result) {
      setEscaneando(false);
      const ticket = await validarTicket(result.rawValue);
      setTicketData(ticket);
    }
  };

  const handleError = (error) => {
    console.error(error);
    setError('Error al escanear. Por favor, intente de nuevo.');
  };

  const iniciarEscaneo = () => {
    setEscaneando(true);
    setError('');
    setTicketData(null); // Reiniciar datos del ticket
  };

  const buscarPorDni = async () => {
    
  };

  const validarDni = async (dni) => {
    
  };

  const verifyPassword = async () => {
    if (!eventId) {
      setPasswordError('ID de evento no disponible.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/v1/events/${eventId}/check-password/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();
      if (response.ok) {
        setIsPasswordCorrect(true);
        localStorage.setItem('isPasswordCorrect', true); // Guardar en localStorage
      } else {
        setPasswordError(data.error || 'Error verificando la contraseña.');
      }
    } catch {
      setPasswordError('Error de red al verificar la contraseña.');
    }
  };

  if (escanerNotFound) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <h1 className="text-2xl">Escaner no encontrado</h1>
      </div>
    );
  }

  // Mostrar formulario de contraseña si no ha sido verificada aún
  if (!isPasswordCorrect) {
    if (!eventId) {
      return <div className="flex items-center justify-center h-screen bg-gray-900 text-white">Cargando...</div>;
    }

    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
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
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-white">Escanear Ticket</CardTitle>
          <CardDescription className="text-center text-gray-400">
            Escanee el código QR del ticket para el evento ID: {id}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {escaneando ? (
            <div className="aspect-square">
              <Scanner
                onScan={handleScan}
                onError={handleError}
              />
            </div>
          ) : (
            <>
              <Button onClick={iniciarEscaneo} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Iniciar Escaneo
              </Button>
              <div className="flex flex-col space-y-2">
                <Input
                  type="text"
                  placeholder="Ingrese DNI del ticket"
                  value={dni}
                  onChange={(e) => setDni(e.target.value)}
                  className="w-full bg-gray-700 text-white"
                />
                <Button onClick={buscarPorDni} className="w-full bg-green-600 hover:bg-green-700 text-white">
                  Buscar por DNI
                </Button>
              </div>
            </>
          )}
          {/* Mostrar resultado del escaneo */}
          {ticketData && (
            <div className={`p-4 rounded-lg ${dialogColor === 'green' ? 'bg-green-600' : dialogColor === 'yellow' ? 'bg-yellow-500' : 'bg-red-600'}`}>
              <p className="text-white font-bold">Resultado del Escaneo:</p>
              <p className="text-white">Nombre: {ticketData.owner_name}</p>
              <p className="text-white">Apellido: {ticketData.owner_surname}</p>
              <p className="text-white">DNI: {ticketData.owner_dni}</p>
            </div>
          )}
          {/* Mostrar error si ocurre */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

ScannerView.propTypes = {
  uuid: PropTypes.string.isRequired,
};

export default ScannerView;