import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle, Download, Home, Loader2 } from "lucide-react";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [orderId, setOrderId] = useState(null);
  const [paymentId, setPaymentId] = useState(null);

  useEffect(() => {
    // Capturamos los datos que nos mandó el Backend desde la URL
    const externalRef = searchParams.get("order_id");
    const payId = searchParams.get("payment_id");
    
    setOrderId(externalRef);
    setPaymentId(payId);
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-[#121a24] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#1a2433] rounded-2xl shadow-2xl border border-gray-800 overflow-hidden text-center p-8 animate-in fade-in zoom-in duration-500">
        
        {/* Icono Animado */}
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">¡Pago Exitoso!</h1>
        <p className="text-gray-400 mb-8">
          Tu compra ha sido procesada correctamente. Te hemos enviado un correo con los detalles.
        </p>

        {/* Detalles de la Transacción */}
        <div className="bg-[#121a24] rounded-lg p-4 mb-8 text-left border border-gray-800">
          <div className="flex justify-between mb-2">
            <span className="text-gray-500 text-sm">Orden ID:</span>
            <span className="text-white font-mono text-sm">{orderId || "Cargando..."}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 text-sm">Pago MP:</span>
            <span className="text-white font-mono text-sm">{paymentId || "Pendiente"}</span>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="space-y-3">
          <Link 
            to="/dashboard" // O a donde muestres tus tickets
            className="w-full block bg-[#009ee3] hover:bg-[#0082c3] text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Ver mis Tickets
          </Link>

          <Link 
            to="/" 
            className="w-full block bg-transparent border border-gray-600 hover:bg-gray-800 text-gray-300 font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Volver al Inicio
          </Link>
        </div>

      </div>
    </div>
  );
}