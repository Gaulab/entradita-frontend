import { useParams } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
// import { QrScanner } from '@yudiel/react-qr-scanner';

export default function ScanTicket() {
  const { id } = useParams();
  const [escaneando, setEscaneando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState('');

  const handleScan = (result) => {
    if (result) {
      setResultado(result);
      setEscaneando(false);
      // Aquí iría la lógica para validar el ticket con el backend
      // Por ahora, solo mostraremos el resultado
    }
  };

  const handleError = (error) => {
    console.error(error);
    setError('Error al escanear. Por favor, intente de nuevo.');
  };

  const iniciarEscaneo = () => {
    setEscaneando(true);
    setResultado(null);
    setError('');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-white">Escanear Ticket</CardTitle>
          <CardDescription className="text-center text-gray-400">
            Escanee el código QR del ticket para el evento ID: {id}
          </CardDescription>
        </CardHeader>
        {/* <CardContent className="space-y-4">
          {escaneando ? (
            <div className="aspect-square">
              <QrScanner
                onDecode={handleScan}
                onError={handleError}
                constraints={{ facingMode: 'environment' }}
              />
            </div>
          ) : (
            <Button onClick={iniciarEscaneo} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Iniciar Escaneo
            </Button>
          )}
          {resultado && (
            <Alert>
              <AlertDescription className="text-green-400">
                Ticket escaneado: {resultado}
              </AlertDescription>
            </Alert>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent> */}
      </Card>
    </div>
  );
}