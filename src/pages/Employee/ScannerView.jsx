import { useState, useEffect, useCallback } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { CheckCircle, AlertTriangle, XCircle, Search, ScanLine } from 'lucide-react';
import PropTypes from 'prop-types';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { getScanner, checkPassword } from '../../api/employeeApi';
import { checkTicketByPayload, checkTicketByDni } from '../../api/ticketApi';
import PasswordForm from '../../components/seller/PasswordForm';

const RESULT_STYLES = {
  green: {
    bg: 'bg-green-500/10 border-green-500/30',
    icon: CheckCircle,
    iconColor: 'text-green-400',
    title: 'Ticket válido',
  },
  yellow: {
    bg: 'bg-yellow-500/10 border-yellow-500/30',
    icon: AlertTriangle,
    iconColor: 'text-yellow-400',
    title: 'Ya escaneado',
  },
  red: {
    bg: 'bg-red-500/10 border-red-500/30',
    icon: XCircle,
    iconColor: 'text-red-400',
    title: 'Ticket inválido',
  },
};

const ScannerView = ({ uuid }) => {
  const [error, setError] = useState('');
  const [dni, setDni] = useState('');
  const [ticketData, setTicketData] = useState(null);
  const [dialogColor, setDialogColor] = useState('');
  const [eventId, setEventId] = useState(null);
  const [dniRequired, setDniRequired] = useState(false);
  const [isScannerActive, setIsScannerActive] = useState(true);
  const [password, setPassword] = useState('');
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [showTicketInfo, setShowTicketInfo] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = () => localStorage.removeItem('isPasswordCorrect');
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  useEffect(() => {
    const storedPasswordStatus = localStorage.getItem('isPasswordCorrect');
    if (storedPasswordStatus) {
      setIsPasswordCorrect(JSON.parse(storedPasswordStatus));
    }
    const fetchScanner = async () => {
      try {
        const data = await getScanner(uuid);
        setEventId(data.scanner.event);
        setDniRequired(data.dni_required);
      } catch (err) {
        console.error('Error fetching scanner:', err.message);
      }
    };
    if (isPasswordCorrect) {
      fetchScanner();
    }
  }, [uuid, isPasswordCorrect]);

  const handleTicketValidation = useCallback((data, isOldScanned) => {
    setTicketData(data);
    setDialogColor(isOldScanned ? 'yellow' : 'green');
    setShowTicketInfo(true);
    setIsScannerActive(false);
  }, []);

  const validarTicketPayload = useCallback(
    async (result) => {
      try {
        const data = await checkTicketByPayload(result[0].rawValue, uuid, eventId);
        handleTicketValidation(data.ticket, data.old_scanned);
      } catch (err) {
        setDialogColor('red');
        setError(err.message);
        setTicketData(null);
        setShowTicketInfo(true);
        setIsScannerActive(false);
      }
    },
    [eventId, uuid, handleTicketValidation]
  );

  const validarTicketDni = useCallback(
    async (dniValue) => {
      setError('');
      try {
        const data = await checkTicketByDni(dniValue, uuid, eventId);
        handleTicketValidation(data.ticket, data.old_scanned);
      } catch (err) {
        setTicketData(null);
        setDialogColor('red');
        setError(err.message || 'Ticket no encontrado.');
        setShowTicketInfo(true);
      }
    },
    [eventId, uuid, handleTicketValidation]
  );

  const verifyPassword = async () => {
    try {
      await checkPassword(uuid, password);
      setIsPasswordCorrect(true);
      localStorage.setItem('isPasswordCorrect', 'true');
    } catch (err) {
      setPasswordError(err.message);
    }
  };

  const resetScanner = () => {
    setShowTicketInfo(false);
    setTicketData(null);
    setError('');
    setIsScannerActive(true);
  };

  if (!isPasswordCorrect) {
    return (
      <PasswordForm
        password={password}
        setPassword={setPassword}
        verifyPassword={verifyPassword}
        passwordError={passwordError}
        subtitle="Panel de scanner"
      />
    );
  }

  const resultStyle = RESULT_STYLES[dialogColor] || RESULT_STYLES.red;
  const ResultIcon = resultStyle.icon;

  return (
    <div className="h-dvh bg-gradient-to-b from-gray-900 to-gray-950 text-white overflow-hidden flex flex-col justify-center">
      <div className="max-w-md mx-auto px-4 py-5 space-y-4 w-full">

        {/* Branding */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/isotipoWhite.png" alt="Entradita" className="w-7 h-7" />
            <span className="font-bold text-white/90 text-sm tracking-wide">entradita.com</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-400">
            <ScanLine className="w-4 h-4" />
            <span className="text-xs font-medium">Scanner</span>
          </div>
        </div>

        {/* Scanner */}
        {isScannerActive && (
          <div className="bg-gray-800/80 border border-gray-700/50 rounded-2xl overflow-hidden shadow-xl shrink-0">
            <div className="aspect-square relative">
              <Scanner
                components={{ torch: false, zoom: false, finder: false }}
                styles={{
                  container: { borderRadius: '0', width: '100%', height: '100%', backgroundColor: 'black', padding: '0' },
                  video: { borderRadius: '0', height: '100%', width: '100%', backgroundColor: 'black' },
                  finderBorder: 0,
                }}
                onScan={validarTicketPayload}
                allowMultiple={true}
                scanDelay={6000}
                onError={(err) => console.error(err)}
              />
              <div className="absolute inset-0 pointer-events-none border-[3px] border-blue-400/20 rounded-none" />
            </div>
            <div className="px-4 py-2.5 text-center shrink-0">
              <p className="text-sm text-gray-400">Apuntá la cámara al código QR del ticket</p>
            </div>
          </div>
        )}

        {/* DNI Search */}
        {dniRequired && isScannerActive && (
          <div className="bg-gray-800/80 border border-gray-700/50 rounded-2xl p-4 shadow-xl">
            <p className="text-sm text-gray-400 mb-3">O buscá por DNI</p>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Número de DNI"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-500 h-11 rounded-xl"
                onKeyDown={(e) => { if (e.key === 'Enter') validarTicketDni(dni); }}
              />
              <Button
                onClick={() => validarTicketDni(dni)}
                className="h-11 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shrink-0"
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Result */}
        {showTicketInfo && (
          <div className={`border rounded-2xl overflow-hidden shadow-xl ${resultStyle.bg}`}>
            <div className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  dialogColor === 'green' ? 'bg-green-500/20' :
                  dialogColor === 'yellow' ? 'bg-yellow-500/20' : 'bg-red-500/20'
                }`}>
                  <ResultIcon className={`w-5 h-5 ${resultStyle.iconColor}`} />
                </div>
                <div>
                  <h3 className={`font-semibold text-lg ${resultStyle.iconColor}`}>
                    {resultStyle.title}
                  </h3>
                  {dialogColor === 'yellow' && (
                    <p className="text-yellow-400/70 text-xs">Este ticket ya fue escaneado previamente</p>
                  )}
                </div>
              </div>

              {ticketData ? (
                <div className="space-y-2 mb-5">
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-sm text-gray-400">Nombre</span>
                    <span className="text-sm text-white font-medium">{ticketData.owner_name} {ticketData.owner_lastname}</span>
                  </div>
                  {ticketData.owner_dni && (
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-sm text-gray-400">DNI</span>
                      <span className="text-sm text-white font-medium">{ticketData.owner_dni}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-400">Tipo</span>
                    <span className="text-sm text-white font-medium">{ticketData.ticket_tag_name}</span>
                  </div>
                </div>
              ) : (
                <p className="text-red-300 text-sm mb-5">{error}</p>
              )}

              <Button
                onClick={resetScanner}
                className="w-full h-11 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl border-0 transition-all"
              >
                Escanear otro ticket
              </Button>
            </div>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-gray-600 shrink-0">
          Powered by <span className="font-semibold text-gray-500">entradita.com</span>
        </p>
      </div>
    </div>
  );
};

ScannerView.propTypes = {
  uuid: PropTypes.string.isRequired,
};

export default ScannerView;
