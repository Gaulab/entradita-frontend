import { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import Badge from '../../components/ui/badge';
import LoadingSpinner from '../../components/ui/loadingspinner';
import { ArrowLeftIcon, Upload, Copy, Check, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { getTicketPurchaseConfig, getMyTicketRequests, createTicketRequest } from '../../api/ticketPurchaseApi';
import { notifyError, notifySuccess } from '../../utils/notify';

const STATUS_CONFIG = {
  PENDING: { label: 'Pendiente', variant: 'default', icon: Clock, color: 'text-yellow-400' },
  APPROVED: { label: 'Aprobada', variant: 'secondary', icon: CheckCircle2, color: 'text-green-400' },
  REJECTED: { label: 'Rechazada', variant: 'destructive', icon: XCircle, color: 'text-red-400' },
};

import PropTypes from 'prop-types';

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="ml-2 p-1 rounded hover:bg-gray-600 transition-colors" title="Copiar">
      {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
    </button>
  );
}

CopyButton.propTypes = { text: PropTypes.string };

export default function BuyTickets() {
  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const token = authToken?.access;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [config, setConfig] = useState(null);
  const [requests, setRequests] = useState([]);

  const [quantity, setQuantity] = useState('');
  const [file, setFile] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const [configData, reqData] = await Promise.all([
        getTicketPurchaseConfig(token),
        getMyTicketRequests(token),
      ]);
      setConfig(configData);
      setRequests(reqData.requests);
    } catch (err) {
      notifyError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchData(); }, [fetchData]);

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
    if (!file) { notifyError('Subí el comprobante de transferencia.'); return; }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('quantity', parsedQty);
      formData.append('comprobante', file);
      await createTicketRequest(formData, token);
      notifySuccess('Solicitud enviada correctamente. Te notificaremos por email cuando sea procesada.');
      setQuantity('');
      setFile(null);
      const reqData = await getMyTicketRequests(token);
      setRequests(reqData.requests);
    } catch (err) {
      notifyError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const transfer = config?.transfer || {};

  return (
    <div className="min-h-screen p-4 bg-gray-900 text-gray-100">
      <div className="max-w-3xl mx-auto">
        <Button onClick={() => navigate('/dashboard')} variant="entraditaTertiary" className="w-full mb-4">
          <ArrowLeftIcon className="mr-2 h-4 w-4" /> Volver al Dashboard
        </Button>

        {/* Transfer info */}
        <Card className="bg-gray-800 border-gray-700 mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg">Datos para la transferencia</CardTitle>
            <CardDescription className="text-gray-400">Realizá la transferencia y luego subí el comprobante abajo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: 'Titular', value: transfer.holder },
              { label: 'CVU', value: transfer.cvu },
              { label: 'Alias', value: transfer.alias },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between bg-gray-900/50 rounded-lg px-4 py-3 border border-gray-700">
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wide">{label}</span>
                  <p className="text-sm text-white font-mono mt-0.5">{value || '—'}</p>
                </div>
                {value && <CopyButton text={value} />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Purchase form */}
        <Card className="bg-gray-800 border-gray-700 mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg">Solicitar Tickets</CardTitle>
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
                    <span className="text-gray-300 font-medium">Total a transferir</span>
                    <span className="text-green-400 font-bold text-lg">${totalPrice.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-gray-200">Comprobante de transferencia</Label>
                <label className="flex items-center gap-2 cursor-pointer bg-gray-700 border border-gray-600 rounded-md px-3 py-2 hover:bg-gray-600 transition-colors">
                  <Upload className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-gray-300">{file ? file.name : 'Seleccionar archivo (PDF, PNG o JPG)'}</span>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files[0] || null)}
                  />
                </label>
              </div>

              <Button
                type="submit"
                disabled={submitting || !parsedQty || !file}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {submitting ? 'Enviando...' : 'Enviar solicitud'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Request history */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg">Historial de solicitudes</CardTitle>
          </CardHeader>
          <CardContent>
            {requests.length === 0 ? (
              <p className="text-gray-500 text-center py-6 text-sm">No tenés solicitudes anteriores.</p>
            ) : (
              <div className="space-y-3">
                {requests.map((req) => {
                  const statusCfg = STATUS_CONFIG[req.status];
                  const StatusIcon = statusCfg.icon;
                  return (
                    <div key={req.id} className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <StatusIcon className={`w-4 h-4 ${statusCfg.color}`} />
                          <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
                        </div>
                        <span className="text-xs text-gray-500">{new Date(req.created_at).toLocaleDateString('es-AR')}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500 text-xs">Cantidad</span>
                          <p className="text-white font-medium">{req.quantity}</p>
                        </div>
                        <div>
                          <span className="text-gray-500 text-xs">Precio/ticket</span>
                          <p className="text-white font-medium">${parseFloat(req.unit_price).toFixed(2)}</p>
                        </div>
                        <div>
                          <span className="text-gray-500 text-xs">Total</span>
                          <p className="text-green-400 font-bold">${parseFloat(req.total_price).toLocaleString('es-AR')}</p>
                        </div>
                      </div>
                      {req.status === 'REJECTED' && req.reject_reason && (
                        <p className="mt-2 text-xs text-red-400 bg-red-950/30 p-2 rounded border border-red-900/50">
                          Motivo: {req.reject_reason}
                        </p>
                      )}
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
