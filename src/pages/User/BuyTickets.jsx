import { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import Badge from '../../components/ui/badge';
import LoadingSpinner from '../../components/ui/loadingspinner';
import { ArrowLeftIcon, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { getTicketPurchaseConfig, createTopUpPreference, getTopUpHistory } from '../../api/ticketPurchaseApi';
import { notifyError, notifySuccess } from '../../utils/notify';

const STATUS_CONFIG = {
  APPROVED: { label: 'Aprobada', variant: 'secondary', icon: CheckCircle2, color: 'text-green-400' },
  PENDING: { label: 'Pendiente', variant: 'default', icon: Clock, color: 'text-yellow-400' },
  REJECTED: { label: 'Rechazada', variant: 'destructive', icon: XCircle, color: 'text-red-400' },
};

export default function BuyTickets() {
  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const token = authToken?.access;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [config, setConfig] = useState(null);
  const [orders, setOrders] = useState([]);

  const [quantity, setQuantity] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const [configData, historyData] = await Promise.all([
        getTicketPurchaseConfig(token),
        getTopUpHistory(token),
      ]);
      setConfig(configData);
      setOrders(historyData.orders || []);
    } catch (err) {
      notifyError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Feedback al volver desde MercadoPago (?topup=success|failure|pending)
  useEffect(() => {
    const topup = searchParams.get('topup');
    if (!topup) return;
    if (topup === 'success') {
      notifySuccess('¡Pago recibido! Los créditos se acreditan en unos segundos.');
    } else if (topup === 'failure') {
      notifyError('El pago no se completó. Podés intentar de nuevo.');
    }
    searchParams.delete('topup');
    setSearchParams(searchParams, { replace: true });
  }, [searchParams, setSearchParams]);

  const getTier = (qty) => {
    if (!config?.tiers || !qty || qty < 1) return null;
    return config.tiers.find(t => qty >= t.min && (t.max === null || qty <= t.max)) || config.tiers[config.tiers.length - 1];
  };

  const parsedQty = parseInt(quantity) || 0;
  const currentTier = getTier(parsedQty);
  const totalPrice = currentTier ? (parsedQty * currentTier.price) : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!parsedQty || parsedQty < 1) { notifyError('Ingresá una cantidad válida.'); return; }

    setSubmitting(true);
    try {
      const { init_point } = await createTopUpPreference(parsedQty, token);
      if (!init_point) throw new Error('No se recibió el link de pago.');
      // Redirigimos al checkout de MercadoPago.
      window.location.href = init_point;
    } catch (err) {
      notifyError(err.message);
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen p-4 bg-gray-900 text-gray-100">
      <div className="max-w-3xl mx-auto">
        <Button onClick={() => navigate('/dashboard')} variant="entraditaTertiary" className="w-full mb-4">
          <ArrowLeftIcon className="mr-2 h-4 w-4" /> Volver al Dashboard
        </Button>

        {/* Purchase form */}
        <Card className="bg-gray-800 border-gray-700 mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg">Comprar créditos de tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-200">Cantidad de Tickets</Label>
                <Input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Ej: 500"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              {parsedQty > 0 && currentTier && (
                <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Precio por ticket</span>
                    <span className="text-white font-semibold">${currentTier.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Cantidad</span>
                    <span className="text-white">{parsedQty.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-gray-700 pt-2 flex justify-between">
                    <span className="text-gray-300 font-medium">Total a pagar</span>
                    <span className="text-green-400 font-bold text-lg">${totalPrice.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={submitting || !parsedQty}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {submitting ? 'Redirigiendo a MercadoPago...' : 'Pagar con MercadoPago'}
              </Button>
              <p className="text-xs text-gray-500 text-center">
                Los créditos se acreditan automáticamente al confirmarse el pago.
              </p>
            </form>
          </CardContent>
        </Card>

        {/* Top-up history */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg">Historial de recargas</CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <p className="text-gray-500 text-center py-6 text-sm">No tenés recargas anteriores.</p>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => {
                  const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
                  const StatusIcon = statusCfg.icon;
                  return (
                    <div key={order.id} className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <StatusIcon className={`w-4 h-4 ${statusCfg.color}`} />
                          <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
                        </div>
                        <span className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString('es-AR')}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500 text-xs">Cantidad</span>
                          <p className="text-white font-medium">{order.quantity}</p>
                        </div>
                        <div>
                          <span className="text-gray-500 text-xs">Precio/ticket</span>
                          <p className="text-white font-medium">${parseFloat(order.unit_price).toFixed(2)}</p>
                        </div>
                        <div>
                          <span className="text-gray-500 text-xs">Total</span>
                          <p className="text-green-400 font-bold">${parseFloat(order.total_price).toLocaleString('es-AR')}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
