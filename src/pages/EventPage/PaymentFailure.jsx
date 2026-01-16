import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { XCircle, RefreshCcw, Home } from "lucide-react";

export default function PaymentFailure() {
  const [searchParams] = useSearchParams();
  const [errorDetails, setErrorDetails] = useState("");

  useEffect(() => {
    // Capturamos el error si viene especificado
    const error = searchParams.get("error");
    if (error) {
        // Limpiamos un poco el string si viene sucio
        setErrorDetails(decodeURIComponent(error));
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-[#121a24] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#1a2433] rounded-2xl shadow-2xl border border-red-900/30 overflow-hidden text-center p-8 animate-in fade-in zoom-in duration-500">
        
        {/* Icono de Error */}
        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-red-500" />
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">Hubo un problema</h1>
        <p className="text-gray-400 mb-6">
          No pudimos procesar tu pago. No se te ha cobrado nada.
        </p>

        {/* Caja de Detalles (Solo si hay info extra) */}
        {errorDetails && (
            <div className="bg-[#121a24] border border-red-800/50 rounded-lg p-3 mb-8 text-sm text-red-300">
                <p className="font-bold mb-1">Detalle del error:</p>
                {errorDetails}
            </div>
        )}

        {/* Botones de Acción */}
        <div className="space-y-3">
          <button 
            onClick={() => window.history.back()} // Intenta volver atrás para reintentar
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCcw className="w-5 h-5" />
            Intentar Nuevamente
          </button>

          <Link 
            to="/" 
            className="w-full block bg-transparent border border-gray-600 hover:bg-gray-800 text-gray-300 font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Ir al Inicio
          </Link>
        </div>

        <p className="mt-6 text-xs text-gray-500">
            Si el problema persiste, contacta con tu banco o con soporte.
        </p>

      </div>
    </div>
  );
}