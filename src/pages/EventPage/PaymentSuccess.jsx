import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle, Home, Mail, Store } from "lucide-react";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [eventId, setEventId] = useState(null);
  const [paymentId, setPaymentId] = useState(null);

  useEffect(() => {
    // Capturamos los datos que nos mandó el Backend desde la URL
    const event_id = searchParams.get("event_id");
    const payId = searchParams.get("payment_id");

    setEventId(event_id);
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
        <div className="bg-[#121a24] rounded-lg p-4 text-left border border-gray-800 flex justify-between items-center">
          <p className="text-gray-400 text-xs tracking-wider uppercase font-semibold">ID del pago</p>
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-green-700/40 bg-gradient-to-r from-green-600/10 to-emerald-500/10">
            <span className="font-mono text-green-300 text-base select-all">
              {paymentId || "Pendiente"}
            </span>
          </div>
        </div>

        {/* Aviso de envío por mail */}
        <div className="my-8 flex gap-2 text-lg items-center justify-center text-gray-300">
          <Mail className="text-blue-400" />
          <span>Los QRs serán enviados por correo.</span>
        </div>

        {/* Botonon de Acción */}
        <div className="space-y-3">
          <Link
            to="/"
            className="w-full block bg-blue-600 hover:bg-blue-500 text-gray-100 hover:text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Inicio
          </Link>
          {eventId && (
            <Link
              to={`/event-page/${eventId}`}
              className="w-full block bg-pink-600 hover:bg-pink-500 text-gray-100 hover:text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Store className="w-5 h-5" />
              Evento
            </Link>
          )}
        </div>

      </div>
    </div>
  );
}