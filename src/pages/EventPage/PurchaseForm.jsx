import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Loader2, Ticket, User, CreditCard, ChevronRight, Calendar, MapPin } from "lucide-react";
import { getEventPurchaseInfo } from "../../api/eventApi";
import { createPaymentPreference } from "../../api/paymentApi";
import { Button } from "../../components/ui/button";
import { formatDate } from "../../utils/dateUtils";
import { notifyError } from "../../utils/notify";

const mp_commission = import.meta.env.VITE_MP_COMMISSION_PERCENTAGE

export default function PurchaseForm() {
  const { id } = useParams();

  // Estados de Datos
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);

  // Estados del Formulario
  const [step, setStep] = useState(1);
  const [selectedTag, setSelectedTag] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Datos del Comprador (Buyer)
  const [buyer, setBuyer] = useState({
    name: "",
    lastname: "",
    email: "",
    phone: "",
  });

  // Datos de Asistentes (Attendees) - Array dinámico
  const [attendees, setAttendees] = useState([]);

  // 1. Cargar información del evento y tickets disponibles
  useEffect(() => {
    const fetchInfo = async () => {
      try {
        setLoading(true);
        const purchaseInfo = await getEventPurchaseInfo(id);
        setEventData(purchaseInfo);
      } catch (err) {
        notifyError("No se pudo cargar la información del evento.");
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, [id]);

  // Actualizar el array de asistentes cuando cambia la cantidad
  useEffect(() => {
    setAttendees((prev) => {
      const newAttendees = [...prev];
      if (quantity > prev.length) {
        for (let i = prev.length; i < quantity; i++) {
          newAttendees.push({ name: "", lastname: "", dni: "" });
        }
      } else {
        return newAttendees.slice(0, quantity);
      }
      return newAttendees;
    });
  }, [quantity]);

  // Handlers
  const handleBuyerChange = (e) => {
    setBuyer({ ...buyer, [e.target.name]: e.target.value });
  };

  const handleAttendeeChange = (index, field, value) => {
    const newAttendees = [...attendees];
    newAttendees[index][field] = value;
    setAttendees(newAttendees);
  };

  const calculateSubtotal = () => {
    if (!selectedTag) return 0;
    return parseFloat(selectedTag.price) * quantity;
  };

  const calculateMercadoPagoFee = () => {
    const subtotal = calculateSubtotal();
    return subtotal * parseFloat(mp_commission);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateMercadoPagoFee();
  };

  // Envio del Formulario (Crear Preferencia)
  const handleSubmit = async () => {
    try {
      setProcessingPayment(true);

      const payload = {
        event_id: id,
        ticket_tag_id: selectedTag.id,
        quantity: quantity,
        valid_date: eventData.date, // Enviamos la fecha del evento como valid_date

        // Datos del Comprador
        buyer_name: buyer.name,
        buyer_lastname: buyer.lastname,
        email: buyer.email,
        phone: buyer.phone,

        // Lista de Asistentes
        attendees: attendees
      };

      const response = await createPaymentPreference(payload);

      if (!response.init_point) {
        throw new Error("No se recibió el link de pago. Por favor intenta nuevamente.");
      }

      // Redirigir al usuario al link de pago
      window.location.href = response.init_point;

    } catch (err) {
      notifyError(err.message || "Error al procesar el pago. Por favor revisa los datos e intenta nuevamente.");
      setProcessingPayment(false);
    }
  };

  // Renderizado de carga
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121a24]">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121a24] text-white">
        <p className="text-red-400">Evento no encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121a24] py-8 px-4 sm:px-6 lg:px-8 text-gray-100 font-sans" style={{ touchAction: 'pan-y' }}>
      <div className="max-w-3xl mx-auto">

        {/* Header del Evento (Resumen) */}
        <div className="bg-[#1a2433] rounded-xl p-6 mb-6 border border-border flex flex-col sm:flex-row gap-6 shadow-lg">
          <img
            src={eventData.image || "/placeholder.svg"}
            alt={eventData.name}
            className="w-full sm:w-32 h-32 object-cover rounded-lg"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white mb-2">{eventData.name}</h1>
            <div className="flex items-center text-muted-foreground mb-1">
              <Calendar className="w-4 h-4 mr-2 text-primary" />
              <span>{formatDate(eventData.date)}</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <MapPin className="w-4 h-4 mr-2 text-primary" />
              <span>{eventData.place}</span>
            </div>
          </div>
          <div className="text-right flex flex-col justify-center">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">Total a Pagar</span>
            <div className="space-y-1 mt-2">
              <p className="text-sm text-muted-foreground">Entradas: <span className="text-white font-semibold">${calculateSubtotal().toLocaleString()}</span></p>
              <p className="text-sm text-muted-foreground">Comisión Mercado Pago: <span className="text-white font-semibold">${calculateMercadoPagoFee().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
              <div className="border-t border-border pt-1 mt-1">
                <span className="text-2xl font-bold text-[#009ee3]">${calculateTotal().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pasos de Navegación */}
        <div className="flex justify-between mb-8 relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-card -z-0"></div>
          {[1, 2, 3].map((s) => (
            <div key={s} className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step >= s ? 'bg-primary text-white' : 'bg-card text-muted-foreground'}`}>
              {s}
            </div>
          ))}
        </div>

        {/* --- PASO 1: SELECCIÓN DE TICKETS --- */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-semibold flex items-center"><Ticket className="mr-2 text-primary" /> Selecciona tu entrada</h2>

            <div className="grid gap-4">
              {eventData.ticket_tags.map((tag) => (
                <div
                  key={tag.id}
                  onClick={() => setSelectedTag(tag)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all flex justify-between items-center ${selectedTag?.id === tag.id ? 'bg-primary/10 border-primary ring-1 ring-ring' : 'bg-[#1a2433] border-border hover:border-border'}`}
                >
                  <div>
                    <h3 className="font-bold text-white">{tag.name}</h3>
                    <p className="text-sm text-muted-foreground">Acceso general al evento</p>
                  </div>
                  <span className="text-xl font-bold text-primary">${parseFloat(tag.price).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="bg-[#1a2433] p-6 rounded-lg border border-border mt-6">
              <label className="block text-sm font-medium text-muted-foreground mb-2">Cantidad de entradas</label>
              <div className="flex items-center gap-4">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 rounded bg-secondary hover:bg-secondary flex items-center justify-center text-xl font-bold">-</button>
                <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(10, q + 1))} className="w-10 h-10 rounded bg-secondary hover:bg-secondary flex items-center justify-center text-xl font-bold">+</button>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full mt-4 py-3 bg-primary hover:bg-primary/90 rounded-lg font-bold text-white flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!selectedTag || quantity < 1}
            >
              Continuar <ChevronRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        )}

        {/* --- PASO 2: DATOS DEL COMPRADOR --- */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-semibold flex items-center"><CreditCard className="mr-2 text-primary" /> Datos del Comprador</h2>
            <p className="text-sm text-muted-foreground">A este email llegarán los comprobantes de pago.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Nombre" name="name" value={buyer.name} onChange={handleBuyerChange} placeholder="Ej: Juan" />
              <Input label="Apellido" name="lastname" value={buyer.lastname} onChange={handleBuyerChange} placeholder="Ej: Pérez" />
              <Input label="Email" name="email" type="email" value={buyer.email} onChange={handleBuyerChange} placeholder="juan@ejemplo.com" className="md:col-span-2" />
              <Input label="Teléfono" name="phone" value={buyer.phone} onChange={handleBuyerChange} placeholder="Ej: 341..." className="md:col-span-2" />
            </div>

            <div className="flex gap-4 mt-6">
              <button onClick={() => setStep(1)} className="px-6 py-3 rounded-lg border border-border hover:bg-card text-muted-foreground font-bold transition-colors">
                Atrás
              </button>
              <button
                disabled={!buyer.name || !buyer.email}
                onClick={() => setStep(3)}
                className="flex-1 py-3 bg-primary hover:bg-primary/90 rounded-lg font-bold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {/* --- PASO 3: DATOS DE ASISTENTES --- */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-semibold flex items-center"><User className="mr-2 text-primary" /> Asignar Entradas</h2>
            <p className="text-sm text-muted-foreground">Completa los datos de cada persona que asistirá (incluido tú si asistes).</p>

            <div className="space-y-4">
              {attendees.map((attendee, index) => (
                <div key={index} className="bg-[#1a2433] p-4 rounded-lg border border-border">
                  <h4 className="text-sm font-bold text-primary mb-3">Ticket #{index + 1}</h4>
                  <div className={`grid grid-cols-1 ${eventData.dni_required ? "sm:grid-cols-3" : "sm:grid-cols-2"} gap-3`}>
                    <Input
                      label="Nombre"
                      value={attendee.name}
                      onChange={(e) => handleAttendeeChange(index, 'name', e.target.value)}
                      placeholder="Nombre"
                    />
                    <Input
                      label="Apellido"
                      value={attendee.lastname}
                      onChange={(e) => handleAttendeeChange(index, 'lastname', e.target.value)}
                      placeholder="Apellido"
                    />
                    {eventData.dni_required &&
                      <Input
                        label="DNI"
                        value={attendee.dni}
                        onChange={(e) => handleAttendeeChange(index, 'dni', e.target.value)}
                        placeholder="DNI"
                      />
                    }

                  </div>
                </div>
              ))}
            </div>

            {/* BOTÓN DE PAGAR */}
            <div className="flex gap-4 mt-8 pt-4 border-t border-border">
              <button onClick={() => setStep(2)} className="px-6 py-3 rounded-lg border border-border hover:bg-card text-muted-foreground font-bold transition-colors">
                Atrás
              </button>
              <button
                onClick={handleSubmit}
                disabled={processingPayment}
                className="flex-1 py-3 bg-primary hover:bg-primary/90 rounded-lg font-bold text-white transition-colors flex items-center justify-center shadow-lg shadow-blue-900/20"
              >
                {processingPayment ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                  <>
                    Pagar
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}

// Componente Helper para Inputs reutilizable
function Input({ label, className = "", ...props }) {
  return (
    <div className={className}>
      <label className="block text-xs font-medium text-muted-foreground mb-1 ml-1">{label}</label>
      <input
        className="w-full px-4 py-2 bg-[#243044] border border-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
        {...props}
      />
    </div>
  );
}