import { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext.jsx';

import { Button } from '../../components/ui/button.jsx';
import { Card, CardContent } from '../../components/ui/card.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table.jsx';
import Badge from '../../components/ui/badge.jsx';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

import PropTypes from 'prop-types';

import { getLogs, getAdminEvents, chargeEvent, getTicketHistory } from '../../api/adminApi.js';
import { getTierForCount } from '../../config/pricingConfig.js';

function formatPrice(amount) {
  return `$${amount.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

// Responsive helper hook
function useIsSmall() {
  const [isSmall, setIsSmall] = useState(window.innerWidth < 640);
  useEffect(() => {
    function onResize() {
      setIsSmall(window.innerWidth < 640);
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return isSmall;
}

const TABS = { LOGS: 'logs', EVENTS: 'events', HISTORY: 'history' };
const SORT_KEYS = { organizer: 'organizer_name', name: 'name', date: 'date', tickets: 'tickets_sold', total: 'price_total' };

const LOG_COLORS = {
  error: 'text-red-400',
  warning: 'text-yellow-400',
  info: 'text-green-300',
};

function classifyLine(line) {
  if (line.includes('| ERROR |')) return 'error';
  if (line.includes('| WARNING |')) return 'warning';
  return 'info';
}

// ─── sub-components ───────────────────────────────────────────────────────────

function LogRow({ line }) {
  const type = classifyLine(line);
  return (
    <TableRow className="border-b border-gray-800">
      <TableCell className={`font-mono text-xs whitespace-pre ${LOG_COLORS[type]}`}>
        {line}
      </TableCell>
    </TableRow>
  );
}

LogRow.propTypes = { line: PropTypes.string.isRequired };

// ─── Logs Tab ─────────────────────────────────────────────────────────────────

function LogsTab({ token }) {
  const [lines, setLines] = useState([]);
  const [total, setTotal] = useState(0);
  const [errorOnly, setErrorOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(null);
  const intervalRef = useRef(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getLogs(token, errorOnly);
      setLines(data.lines);
      setTotal(data.total);
      setLastRefresh(new Date().toLocaleTimeString());
    } catch {
      /* silently ignore — interval will retry */
    } finally {
      setLoading(false);
    }
  }, [token, errorOnly]);

  useEffect(() => {
    fetchLogs();
    intervalRef.current = setInterval(fetchLogs, 30_000);
    return () => clearInterval(intervalRef.current);
  }, [fetchLogs]);

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <span className="text-gray-500 text-xs flex-1">
          {total} líneas{lastRefresh ? ` · actualizado ${lastRefresh}` : ''}
          {loading && ' · cargando…'}
        </span>
        <label className="flex items-center gap-1.5 text-xs text-gray-400 cursor-pointer">
          <input
            type="checkbox"
            checked={errorOnly}
            onChange={(e) => setErrorOnly(e.target.checked)}
          />
          Solo ERROR
        </label>
        <Button variant="entraditaTertiary" size="sm" onClick={fetchLogs}>
          ↻ Refresh
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-800">
        <Table>
          <TableBody>
            {lines.length === 0 ? (
              <TableRow>
                <TableCell className="text-center text-gray-500 py-6">Sin resultados</TableCell>
              </TableRow>
            ) : (
              lines.map((line, i) => <LogRow key={i} line={line} />)
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

LogsTab.propTypes = { token: PropTypes.string };

function isEventPast(dateStr) {
  if (!dateStr) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const evDate = new Date(dateStr + 'T00:00:00');
  return evDate < today;
}

// ─── Events Tab ───────────────────────────────────────────────────────────────

function EventsTab({ token }) {
  const [groups, setGroups] = useState({});
  const [loading, setLoading] = useState(false);
  const [sortKey, setSortKey] = useState('organizer');
  const [sortAsc, setSortAsc] = useState(true);
  const [toggling, setToggling] = useState(null);
  const isSmall = useIsSmall();

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAdminEvents(token);
      setGroups(data.groups);
    } catch {
      /* silently ignore */
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const handlePaidEvent = async (eventId) => {
    setToggling(eventId);
    try {
      const data = await chargeEvent(eventId, token);
      setGroups((prev) => {
        const updated = { ...prev };
        for (const org of Object.keys(updated)) {
          updated[org] = updated[org].map((ev) =>
            ev.id === eventId ? { ...ev, paid_event: data.paid_event } : ev
          );
        }
        return updated;
      });
    } catch {
      /* silently ignore */
    } finally {
      setToggling(null);
    }
  };

  // Group events by organizer (as received from backend)
  const sortedGroups = Object.entries(groups)
    .sort(([orgA], [orgB]) => orgA.localeCompare(orgB));

  // Small/mobile view
  if (isSmall) {
    return (
      <div>
        <div className="flex items-center gap-4 mb-4">
          <span className="text-gray-500 text-xs flex-1">
            {sortedGroups.reduce((acc, [, evs]) => acc + evs.length, 0)} eventos{loading ? ' · cargando…' : ''}
          </span>
          <Button variant="entraditaTertiary" size="sm" onClick={fetchEvents}>
            ↻ Refresh
          </Button>
        </div>
        {sortedGroups.length === 0 ? (
          <div className="text-center text-gray-500 py-8">Sin eventos</div>
        ) : (
          sortedGroups.map(([organizer, events]) => (
            <div key={organizer} className="mb-6">
              <div className="font-semibold text-base text-gray-200 bg-gray-800 px-3 py-2 rounded-t border-b border-gray-700">{organizer}</div>
              <div>
                {events.map(ev => (
                  <div key={ev.id} className={`flex flex-col gap-2 border-b border-gray-800 px-3 py-3 ${isEventPast(ev.date) ? 'bg-gray-950 opacity-60' : 'bg-gray-900'}`}>
                    <div className={`font-medium ${isEventPast(ev.date) ? 'text-gray-400' : 'text-gray-100'}`}>{ev.name}</div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-300">
                      <span>{ev.date}</span>
                      <span className="flex items-center gap-1">
                        <span>Tickets:</span>
                        <Badge variant={ev.tickets_sold > 0 ? 'secondary' : 'default'}>
                          {ev.tickets_sold}
                        </Badge>
                      </span>
                      {ev.tickets_sold > 0 && (
                        <span className="text-green-400 font-medium">
                          {formatPrice(ev.tickets_sold * getTierForCount(ev.tickets_sold).price)}
                        </span>
                      )}
                      <span className="ml-auto flex items-center gap-1">
                        <span>Pagado:</span>
                        <input
                          type="checkbox"
                          checked={ev.paid_event}
                          disabled={toggling === ev.id}
                          onChange={() => handlePaidEvent(ev.id)}
                          className="w-4 h-4 cursor-pointer accent-green-400"
                        />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    );
  }

  // Desktop/Table view
  const allEvents = sortedGroups.flatMap(([org, events]) =>
    events.map(ev => ({
      ...ev,
      _organizer: org,
      price_total: ev.tickets_sold > 0 ? ev.tickets_sold * getTierForCount(ev.tickets_sold).price : 0,
    }))
  );

  const sorted = [...allEvents].sort((a, b) => {
    const key = SORT_KEYS[sortKey] ?? 'organizer_name';
    const va = a[key] ?? '';
    const vb = b[key] ?? '';
    if (va < vb) return sortAsc ? -1 : 1;
    if (va > vb) return sortAsc ? 1 : -1;
    return 0;
  });

  const handleSort = (key) => {
    if (sortKey === key) setSortAsc((v) => !v);
    else { setSortKey(key); setSortAsc(true); }
  };

  const arrow = (key) => sortKey === key ? (sortAsc ? ' ▲' : ' ▼') : '';

  // Render events grouped by organizer in table, showing organizer as group header
  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <span className="text-gray-500 text-xs flex-1">
          {allEvents.length} eventos{loading ? ' · cargando…' : ''}
        </span>
        <Button variant="entraditaTertiary" size="sm" onClick={fetchEvents}>
          ↻ Refresh
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-800">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-800 bg-gray-950">
              <TableHead
                className="text-gray-500 bg-gray-950 whitespace-nowrap"
                colSpan={1}
              >
                Organizador
              </TableHead>
              {[
                ['name', 'Evento'],
                ['date', 'Fecha'],
                ['tickets', 'Tickets vendidos'],
                ['total', 'Precio total'],
                ['pagado', 'Pagado'],
              ].map(([key, label]) => (
                key !== 'pagado' ? (
                  <TableHead
                    key={key}
                    onClick={() => handleSort(key)}
                    className="cursor-pointer select-none text-gray-500 bg-gray-950 whitespace-nowrap text-center"
                  >
                    {label}{arrow(key)}
                  </TableHead>
                ) : (
                  <TableHead key={key} className="text-gray-500 bg-gray-950 text-center">
                    {label}
                  </TableHead>
                )
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500 py-6 border-b border-gray-800">
                  Sin eventos
                </TableCell>
              </TableRow>
            ) : (
              sorted.map((ev, idx) => {
                const showOrg = idx === 0 || ev._organizer !== sorted[idx - 1]._organizer;
                const past = isEventPast(ev.date);
                const rowBase = past ? 'bg-red-950 opacity-60' : '';
                return (
                  <tr key={ev.id} className={rowBase}>
                    {showOrg ? (
                      <td
                        rowSpan={sorted.filter(e2 => e2._organizer === ev._organizer).length}
                        className="bg-gray-950 font-semibold text-gray-100 px-4 text-sm border-b border-gray-800 align-middle"
                        style={{ verticalAlign: 'middle', minWidth: 120 }}
                      >
                        {ev._organizer}
                      </td>
                    ) : null}
                    <td className={`border-b border-gray-800 px-4 py-2 ${past ? 'text-gray-500 italic' : 'text-gray-300'}`}>{ev.name}</td>
                    <td className={`border-b border-gray-800 px-4 py-2 whitespace-nowrap ${past ? 'text-gray-500' : 'text-gray-300'}`}>{ev.date}</td>
                    <td className="text-center border-b border-gray-800 px-4 py-2 align-middle">
                      <Badge variant={ev.tickets_sold > 0 ? 'secondary' : 'default'}>
                        {ev.tickets_sold}
                      </Badge>
                    </td>
                    <td className="text-center border-b border-gray-800 px-4 py-2 whitespace-nowrap">
                      {ev.tickets_sold > 0 ? (
                        <span className="text-green-400 font-medium text-xs">
                          {formatPrice(ev.price_total)}
                          <span className="block text-gray-500 font-normal">
                            {getTierForCount(ev.tickets_sold).name}
                          </span>
                        </span>
                      ) : (
                        <span className="text-gray-600 text-xs">—</span>
                      )}
                    </td>
                    <td className="text-center border-b border-gray-800 px-4 py-2 align-middle">
                      <input
                        type="checkbox"
                        checked={ev.paid_event}
                        disabled={toggling === ev.id}
                        onChange={() => handlePaidEvent(ev.id)}
                        className="w-4 h-4 cursor-pointer accent-green-400 mx-auto block"
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

EventsTab.propTypes = { token: PropTypes.string };

// ─── Histórico Tab ────────────────────────────────────────────────────────────

const MONTH_LABELS = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

function formatMonthLabel(yyyymm) {
  const [year, month] = yyyymm.split('-');
  return `${MONTH_LABELS[parseInt(month, 10) - 1]} ${year.slice(2)}`;
}

function HistoricoTab({ token }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTicketHistory(token);
      setHistory(data.history.map(row => ({
        ...row,
        label: formatMonthLabel(row.month),
      })));
    } catch {
      /* silently ignore */
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  const total = history.reduce((acc, r) => acc + r.web + r.admin + r.seller, 0);

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <span className="text-gray-500 text-xs flex-1">
          {total} tickets en los últimos 12 meses{loading ? ' · cargando…' : ''}
        </span>
        <Button variant="entraditaTertiary" size="sm" onClick={fetchHistory}>
          ↻ Refresh
        </Button>
      </div>

      <div className="w-full" style={{ height: 340 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={history} margin={{ top: 4, right: 16, left: -8, bottom: 0 }} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: '#9ca3af', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: '#9ca3af', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: 8 }}
              labelStyle={{ color: '#f3f4f6', fontWeight: 600 }}
              itemStyle={{ color: '#d1d5db' }}
              cursor={{ fill: 'rgba(255,255,255,0.04)' }}
            />
            <Legend
              wrapperStyle={{ paddingTop: 16, fontSize: 12, color: '#9ca3af' }}
              formatter={(value) => value === 'web' ? 'Web' : value === 'admin' ? 'Admin' : 'Vendedor'}
            />
            <Bar dataKey="web" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} name="web" />
            <Bar dataKey="seller" stackId="a" fill="#a78bfa" radius={[0, 0, 0, 0]} name="seller" />
            <Bar dataKey="admin" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} name="admin" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex gap-6 mt-4 justify-center text-xs text-gray-400">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-blue-500" />
          Web (MercadoPago)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-violet-400" />
          Vendedor
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-emerald-500" />
          Admin
        </span>
      </div>
    </div>
  );
}

HistoricoTab.propTypes = { token: PropTypes.string };

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminPanel() {
  const { authToken, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tab, setTab] = useState(TABS.EVENTS);

  if (!user?.is_staff) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-red-400 text-base">Acceso denegado. Se requiere permisos de staff.</p>
      </div>
    );
  }

  const token = authToken?.access;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="px-8 py-6 border-b border-gray-800 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-100">Panel de Administración</h1>
        <Button variant="entraditaTertiary" size="sm" onClick={() => navigate('/dashboard')}>
          ← Dashboard
        </Button>
      </header>

      <nav className="flex gap-1 px-8 py-3 border-b border-gray-800">
        {[
          [TABS.EVENTS, '🗓 Eventos'],
          [TABS.HISTORY, '📊 Histórico'],
          [TABS.LOGS, '📋 Logs de Pagos'],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer border-0 ${
              tab === key
                ? 'bg-gray-800 text-gray-100'
                : 'bg-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      <main className="px-8 py-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            {tab === TABS.LOGS && <LogsTab token={token} />}
            {tab === TABS.EVENTS && <EventsTab token={token} />}
            {tab === TABS.HISTORY && <HistoricoTab token={token} />}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
