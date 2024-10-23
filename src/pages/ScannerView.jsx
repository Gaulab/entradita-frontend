import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { Scanner } from "@yudiel/react-qr-scanner";
import { Input } from "../components/ui/input"; // Asegúrate de tener un componente Input
import PropTypes from "prop-types";

const ScannerView = ({ uuid }) => {
  const { id } = useParams();
  const [escaner, setEscaner] = useState(null);
  const [escaneando, setEscaneando] = useState(false);
  const [error, setError] = useState("");
  const [dni, setDni] = useState("");
  const [ticketData, setTicketData] = useState(null); // Datos del ticket (nombre, apellido, dni)
  const [dialogColor, setDialogColor] = useState(""); // Color del diálogo (verde, rojo, amarillo)
  const [eventId, setEventId] = useState(null);
  const [escanerNotFound, setEscanerNotFound] = useState(false);
  const [password, setPassword] = useState("");
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Limpiar localStorage al salir de la página
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem("isPasswordCorrect"); // Clear localStorage when leaving the page
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
  
  // Verificar si la contraseña ya ha sido verificada
  useEffect(() => {
    const storedPasswordStatus = localStorage.getItem("isPasswordCorrect");
    if (storedPasswordStatus) {
      setIsPasswordCorrect(JSON.parse(storedPasswordStatus));
    }

    const fecthScanner = async () => {
      try {
        const response = await fetch(
          `https://entraditaback-production.up.railway.app/api/v1/employees/scanner/${uuid}/info/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 404) {
          setEscanerNotFound(true);
          return;
        }

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        // console.log("data", data);
        setEscaner(data);
        setEventId(data.event);
      } catch (error) {
        console.error("Error fetching scanner:", error);
      }
    };

    fecthScanner();
  }, [uuid]);

  const validarTicketPayload = async (result) => {
      // console.log("resultado escaneo",result);
      // console.log("resultado escaneo",result[0].rawValue);
      setEscaneando(false);
      try {
        const response = await fetch(`https://entraditaback-production.up.railway.app/api/v1/tickets/scan/${result[0].rawValue}/`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ event_id: eventId }),
          }
        );
        const data = await response.json();
        // console.log("TICKET SEARCH", data);
        setTicketData(data.ticket);
        // console.log("response.old_scanned", response.old_scanned);
        // console.log("data.old_scanned", data.old_scanned);

        if (data.old_scanned) {
          // console.log("Ticket ya escaneado");
          setDialogColor("yellow");
        } else {
          // console.log("Ticket no escaneado");
          setDialogColor("green");
        }
      } catch{
        setDialogColor("red");
        setError("Ticket no encontrado.");
        return null;
      }
  };

  const handleError = (error) => {
    console.error(error);
    setDialogColor("red");
    setError("Error al escanear. Por favor, intente de nuevo.");
  };

  const iniciarEscaneo = () => {
    setEscaneando(true);
    setError("");
    setTicketData(null); // Reiniciar datos del ticket
  };


  const validarTicketDni = async (dni) => {
    // console.log("dni", dni);
    // console.log("eventId", eventId);
    setEscaneando(false);
    setError(""); // Reiniciar el error antes de hacer la solicitud
    try {
      const response = await fetch(`https://entraditaback-production.up.railway.app/api/v1/tickets/scan/dni/${dni}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ event_id: eventId }),
      });
  
      // Manejar la respuesta del servidor
      if (!response.ok) {
        throw new Error("Ticket no encontrado."); // Lanza un error si la respuesta no es correcta
      }
  
      const data = await response.json();
      // console.log("TICKET SEARCH", data.ticket);
      setTicketData(data.ticket);
  
      if (data.old_scanned) {
        setDialogColor("yellow");
      } else {
        setDialogColor("green");
      }
    } catch (error) {
      // Captura el error y actualiza el estado
      setDialogColor("red");
      setError(error.message || "Ticket no encontrado."); // Usa el mensaje del error o uno predeterminado
      setTicketData(null); // Asegúrate de que no haya datos de ticket cuando hay un error
    }
  };
  

  const verifyPassword = async () => {
    if (!eventId) {
      setPasswordError("ID de evento no disponible.");
      return;
    }

    try {
      const response = await fetch(
        `https://entraditaback-production.up.railway.app/api/v1/events/${eventId}/check-password/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setIsPasswordCorrect(true);
        localStorage.setItem("isPasswordCorrect", true); // Guardar en localStorage
      } else {
        setPasswordError(data.error || "Error verificando la contraseña.");
      }
    } catch {
      setPasswordError("Error de red al verificar la contraseña.");
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
      return (
        <div className="flex items-center justify-center h-screen bg-gray-900 text-white w-screen">
          Cargando...
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <Card className="bg-gray-800 border-gray-700 p-6 max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-white text-xl">
              Ingrese la contraseña del evento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-4 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            />
            {passwordError && (
              <p className="text-red-500 mb-2">{passwordError}</p>
            )}
            <Button
              onClick={verifyPassword}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
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
          <CardTitle className="text-2xl font-bold text-center text-white">
            Escanear Ticket
          </CardTitle>
          <CardDescription className="text-center text-gray-400">
            Escanee el código QR del ticket para el evento ID: {id}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {escaneando ? (
            <div className="aspect-square">
              <Scanner onScan={validarTicketPayload} onError={handleError} />
            </div>
          ) : (
            <>
              <Button
                onClick={iniciarEscaneo}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
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
                <Button
                  onClick={() => validarTicketDni(dni)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  Buscar por DNI
                </Button>
              </div>
            </>
          )}

          {/* Mostrar resultado del escaneo */}
          {ticketData && (
            <div
              className={`p-4 rounded-lg ${
                dialogColor === "green"
                  ? "bg-green-600"
                  : dialogColor === "yellow"
                  ? "bg-yellow-500"
                  : "bg-red-600"
              } text-black`}
            >
              <p className="text-black font-bold">Ticket encontrado!</p>
              {dialogColor === "yellow" ? <p>Este ticket ya fue escaneado</p> : null}
              <p className="text-black">Nombre: {ticketData.owner_name}</p>
              <p className="text-black">Apellido: {ticketData.owner_lastname}</p>
              <p className="text-black">DNI: {ticketData.owner_dni}</p>
            </div>
          )}
          {/* Mostrar error si ocurre */}
          {error && (
            <div
              className={`p-4 rounded-lg bg-red-600 text-black`}
            >
              <p className="text-black font-bold">Error</p>
              <p>{error}</p>
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
