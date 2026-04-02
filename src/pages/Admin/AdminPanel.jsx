import { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext.jsx';

import { Button } from '../../components/ui/button.jsx';
import { Card, CardContent } from '../../components/ui/card.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table.jsx';
import Badge from '../../components/ui/badge.jsx';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

import PropTypes from 'prop-types';

import { getLogs, getAdminEvents, getTicketHistory, getAdminTicketRequests, approveTicketRequest, rejectTicketRequest } from '../../api/adminApi.js';
import { getTierForCount } from '../../config/pricingConfig.js';
import { Eye, CheckCircle2, XCircle, X, ChevronLeft, ChevronRight } from 'lucide-react';

function formatPrice(amount) {
  return `$${amount.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

/** Below Tailwind `md` (768px): prefer stacked layouts, compact chart, etc. */
function useIsBelowMd() {
  const [v, setV] = useState(() => (typeof window !== 'undefined' ? window.innerWidth < 768 : false));
  useEffect(() => {
    const onResize = () => setV(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return v;
}

/** Card layout for events instead of wide table (table breaks around lg). */
function useEventsCardLayout() {
  const [v, setV] = useState(() => (typeof window !== 'undefined' ? window.innerWidth < 1024 : false));
  useEffect(() => {
    const onResize = () => setV(window.innerWidth < 1024);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return v;
}

const TABS = { LOGS: 'logs', EVENTS: 'events', HISTORY: 'history', TICKET_REQUESTS: 'ticket_requests' };
const SORT_KEYS = { organizer: 'organizer_name', name: 'name', date: 'date', tickets: 'tickets_sold', total: 'price_total' };
const TAB_ITEMS = [
  { key: TABS.EVENTS, icon: '🗓', label: 'Eventos' },
  { key: TABS.TICKET_REQUESTS, icon: '🎫', label: 'Solicitudes' },
  { key: TABS.HISTORY, icon: '📊', label: 'Histórico' },
  { key: TABS.LOGS, icon: '📋', label: 'Logs de pagos' },
];

const LOG_LEVEL_STYLE = {
  ERROR: 'text-red-400 bg-red-500/5',
  WARNING: 'text-amber-300 bg-amber-500/5',
  INFO: 'text-emerald-300/90 bg-emerald-500/5',
  DEBUG: 'text-gray-400',
  CRITICAL: 'text-red-500',
  UNKNOWN: 'text-gray-500',
};

const PIE_COLORS = { INFO: '#34d399', WARNING: '#fbbf24', ERROR: '#f87171' };

/** Adapta respuestas antiguas `{ lines, total }` o normaliza claves faltantes. */
function normalizeLogsApiPayload(data) {
  if (!data || typeof data !== 'object') {
    return {
      entries: [],
      total: 0,
      page: 1,
      total_pages: 1,
      level_counts: { INFO: 0, WARNING: 0, ERROR: 0 },
      level_percent: { INFO: 0, WARNING: 0, ERROR: 0 },
      reasons: [],
    };
  }
  if (Array.isArray(data.lines) && !Array.isArray(data.entries)) {
    const lines = data.lines;
    return {
      entries: lines.map((raw, line_index) => ({
        line_index,
        timestamp: '',
        type: 'UNKNOWN',
        payment_id: null,
        order_id: null,
        reason: '',
        message: typeof raw === 'string' ? raw : String(raw),
        raw: typeof raw === 'string' ? raw : String(raw),
      })),
      total: data.total ?? lines.length,
      page: 1,
      total_pages: 1,
      level_counts: { INFO: 0, WARNING: 0, ERROR: 0 },
      level_percent: { INFO: 0, WARNING: 0, ERROR: 0 },
      reasons: [],
    };
  }
  return data;
}

function logLevelClass(level) {
  return LOG_LEVEL_STYLE[level] || LOG_LEVEL_STYLE.UNKNOWN;
}

// ─── sub-components ───────────────────────────────────────────────────────────

function LogEntryRow({ entry }) {
  const rowClass = logLevelClass(entry.type);
  return (
    <TableRow className="border-b border-gray-800/90">
      <TableCell className={`font-mono text-[10px] sm:text-xs whitespace-nowrap ${rowClass}`}>
        {entry.timestamp || '—'}
      </TableCell>
      <TableCell className={`font-mono text-[10px] sm:text-xs font-semibold ${rowClass}`}>
        {entry.type}
      </TableCell>
      <TableCell className="font-mono text-[10px] sm:text-xs text-gray-300 max-w-[140px] truncate" title={entry.reason}>
        {entry.reason || '—'}
      </TableCell>
      <TableCell className="font-mono text-[10px] sm:text-xs text-gray-300 max-w-[100px] truncate" title={entry.payment_id || ''}>
        {entry.payment_id || '—'}
      </TableCell>
      <TableCell className="font-mono text-[10px] sm:text-xs text-gray-300 max-w-[100px] truncate" title={entry.order_id || ''}>
        {entry.order_id || '—'}
      </TableCell>
      <TableCell className={`font-mono text-[10px] sm:text-xs text-gray-400 max-w-[min(100vw-8rem,28rem)] ${rowClass}`}>
        <span className="line-clamp-2 sm:line-clamp-none whitespace-pre-wrap break-all">{entry.message || entry.raw}</span>
      </TableCell>
    </TableRow>
  );
}

LogEntryRow.propTypes = {
  entry: PropTypes.shape({
    type: PropTypes.string,
    timestamp: PropTypes.string,
    reason: PropTypes.string,
    payment_id: PropTypes.string,
    order_id: PropTypes.string,
    message: PropTypes.string,
    raw: PropTypes.string,
  }).isRequired,
};

// ─── Logs Tab ─────────────────────────────────────────────────────────────────

function LogsTab({ token }) {
  const compactList = useIsBelowMd();
  const [entries, setEntries] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [levelCounts, setLevelCounts] = useState({ INFO: 0, WARNING: 0, ERROR: 0 });
  const [levelPercent, setLevelPercent] = useState({ INFO: 0, WARNING: 0, ERROR: 0 });
  const [reasonOptions, setReasonOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(null);
  const intervalRef = useRef(null);

  const [applied, setApplied] = useState({
    payment_id: '',
    order_id: '',
    type: '',
    reason: '',
  });
  const [draftPaymentId, setDraftPaymentId] = useState('');
  const [draftOrderId, setDraftOrderId] = useState('');
  const [draftType, setDraftType] = useState('');
  const [draftReason, setDraftReason] = useState('');

  const fetchLogs = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const raw = await getLogs(token, {
        page,
        page_size: 10,
        payment_id: applied.payment_id || undefined,
        order_id: applied.order_id || undefined,
        type: applied.type || undefined,
        reason: applied.reason || undefined,
      });
      const data = normalizeLogsApiPayload(raw);
      setEntries(data.entries || []);
      setTotal(data.total ?? 0);
      setTotalPages(data.total_pages ?? 1);
      setLevelCounts(data.level_counts || { INFO: 0, WARNING: 0, ERROR: 0 });
      setLevelPercent(data.level_percent || { INFO: 0, WARNING: 0, ERROR: 0 });
      setReasonOptions(Array.isArray(data.reasons) ? data.reasons : []);
      setLastRefresh(new Date().toLocaleTimeString());
    } catch {
      /* interval will retry */
    } finally {
      setLoading(false);
    }
  }, [token, page, applied]);

  useEffect(() => {
    fetchLogs();
    intervalRef.current = setInterval(fetchLogs, 30_000);
    return () => clearInterval(intervalRef.current);
  }, [fetchLogs]);

  const applyFilters = () => {
    setApplied({
      payment_id: draftPaymentId.trim(),
      order_id: draftOrderId.trim(),
      type: draftType,
      reason: draftReason,
    });
    setPage(1);
  };

  const clearFilters = () => {
    setDraftPaymentId('');
    setDraftOrderId('');
    setDraftType('');
    setDraftReason('');
    setApplied({ payment_id: '', order_id: '', type: '', reason: '' });
    setPage(1);
  };

  const pieSlices = ['INFO', 'WARNING', 'ERROR']
    .map((name) => ({
      name,
      value: levelCounts[name] || 0,
      pct: levelPercent[name] ?? 0,
      fill: PIE_COLORS[name],
    }))
    .filter((d) => d.value > 0);

  const pieTotal = pieSlices.reduce((a, d) => a + d.value, 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-gray-400 sm:flex-1">
          <span className="text-gray-300 font-medium">{total}</span>
          {' '}coincidencias (archivo completo)
          {lastRefresh ? ` · ${lastRefresh}` : ''}
          {loading ? ' · cargando…' : ''}
        </p>
        <Button variant="entraditaTertiary" size="sm" type="button" onClick={fetchLogs} className="w-full sm:w-auto shrink-0">
          ↻ Actualizar
        </Button>
      </div>

      <div className="rounded-xl border border-gray-700/80 bg-gray-900/40 p-3 sm:p-4 space-y-3">
        <p className="text-[11px] uppercase tracking-wider text-gray-500 font-medium">Filtros (backend)</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <label className="block space-y-1">
            <span className="text-xs text-gray-500">Payment ID</span>
            <input
              value={draftPaymentId}
              onChange={(e) => setDraftPaymentId(e.target.value)}
              placeholder="Buscar en línea / campo parseado"
              className="w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-600 min-h-[44px] sm:min-h-0"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs text-gray-500">Order ID</span>
            <input
              value={draftOrderId}
              onChange={(e) => setDraftOrderId(e.target.value)}
              placeholder="Buscar en línea / campo parseado"
              className="w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-600 min-h-[44px] sm:min-h-0"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs text-gray-500">Tipo (nivel)</span>
            <select
              value={draftType}
              onChange={(e) => setDraftType(e.target.value)}
              className="w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white min-h-[44px] sm:min-h-0"
            >
              <option value="">Todos</option>
              <option value="INFO">INFO</option>
              <option value="WARNING">WARNING</option>
              <option value="ERROR">ERROR</option>
            </select>
          </label>
          <label className="block space-y-1 sm:col-span-2 lg:col-span-1">
            <span className="text-xs text-gray-500">Razón / código</span>
            <select
              value={draftReason}
              onChange={(e) => setDraftReason(e.target.value)}
              className="w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white min-h-[44px] sm:min-h-0 max-h-40"
            >
              <option value="">Todas</option>
              {reasonOptions.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button type="button" size="sm" onClick={applyFilters} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white">
            Aplicar filtros
          </Button>
          <Button type="button" variant="entraditaTertiary" size="sm" onClick={clearFilters} className="w-full sm:w-auto">
            Limpiar
          </Button>
        </div>
      </div>

      {pieTotal > 0 && (
        <div className="rounded-xl border border-gray-700/80 bg-gray-900/40 p-3 sm:p-4">
          <p className="text-[11px] uppercase tracking-wider text-gray-500 font-medium mb-2">Distribución (resultados filtrados)</p>
          <div className="h-[220px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieSlices}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={80}
                  paddingAngle={2}
                  labelLine={false}
                  label={({ name, pct }) => `${name} ${pct}%`}
                >
                  {pieSlices.map((d) => (
                    <Cell key={d.name} fill={d.fill} stroke="#1f2937" strokeWidth={1} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: 8 }}
                  formatter={(value, name) => [`${value} líneas`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {compactList ? (
        <div className="space-y-2">
          {entries.length === 0 ? (
            <div className="rounded-xl border border-gray-700/80 bg-gray-950/40 px-4 py-8 text-center text-sm text-gray-500">
              Sin resultados en esta página
            </div>
          ) : (
            entries.map((entry) => {
              const rowClass = logLevelClass(entry.type);
              return (
                <article key={entry.line_index} className="rounded-xl border border-gray-700/80 bg-gray-950/40 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-mono text-[11px] text-gray-400 truncate">{entry.timestamp || '—'}</p>
                      <p className={`font-mono text-xs font-semibold mt-1 ${rowClass}`}>{entry.type}</p>
                    </div>
                    <span className="rounded-md bg-gray-800/80 px-2 py-1 text-[10px] font-mono text-gray-300 max-w-[52vw] truncate" title={entry.reason || ''}>
                      {entry.reason || 'sin razón'}
                    </span>
                  </div>
                  <div className="mt-2 grid grid-cols-1 gap-1 text-[11px] text-gray-400 font-mono">
                    <p className="truncate" title={entry.payment_id || ''}>payment_id: {entry.payment_id || '—'}</p>
                    <p className="truncate" title={entry.order_id || ''}>order_id: {entry.order_id || '—'}</p>
                  </div>
                  <div className={`mt-3 rounded-lg bg-gray-900/60 p-2 font-mono text-[11px] leading-relaxed text-gray-300 ${rowClass}`}>
                    <p className="whitespace-pre-wrap break-all line-clamp-4">{entry.message || entry.raw}</p>
                  </div>
                </article>
              );
            })
          )}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-700/80 bg-gray-950/40 overscroll-x-contain touch-manipulation">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-800 bg-gray-950/90 hover:bg-gray-950/90">
                <TableHead className="text-gray-500 text-[10px] sm:text-xs whitespace-nowrap">Fecha</TableHead>
                <TableHead className="text-gray-500 text-[10px] sm:text-xs whitespace-nowrap">Tipo</TableHead>
                <TableHead className="text-gray-500 text-[10px] sm:text-xs whitespace-nowrap">Razón</TableHead>
                <TableHead className="text-gray-500 text-[10px] sm:text-xs whitespace-nowrap">payment_id</TableHead>
                <TableHead className="text-gray-500 text-[10px] sm:text-xs whitespace-nowrap">order_id</TableHead>
                <TableHead className="text-gray-500 text-[10px] sm:text-xs min-w-[200px]">Mensaje</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500 py-8 text-sm">
                    Sin resultados en esta página
                  </TableCell>
                </TableRow>
              ) : (
                entries.map((entry) => <LogEntryRow key={entry.line_index} entry={entry} />)
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            Página <span className="text-gray-300">{page}</span> / {totalPages}
          </p>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              type="button"
              variant="entraditaTertiary"
              size="sm"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="flex-1 sm:flex-none min-h-[44px] sm:min-h-0"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Anterior
            </Button>
            <Button
              type="button"
              variant="entraditaTertiary"
              size="sm"
              disabled={page >= totalPages || loading}
              onClick={() => setPage((p) => p + 1)}
              className="flex-1 sm:flex-none min-h-[44px] sm:min-h-0"
            >
              Siguiente <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
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
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sortKey, setSortKey] = useState('organizer');
  const [sortAsc, setSortAsc] = useState(true);
  const useCards = useEventsCardLayout();

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAdminEvents(token, { page, page_size: 20 });
      let nextPage = page;
      if (data.total_pages >= 1 && page > data.total_pages) {
        nextPage = data.total_pages;
      }
      if (nextPage !== page) {
        setPage(nextPage);
        return;
      }
      setGroups(data.groups || {});
      setCount(data.count ?? 0);
      setTotalPages(data.total_pages ?? 1);
    } catch {
      /* silently ignore */
    } finally {
      setLoading(false);
    }
  }, [token, page]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  // Group events by organizer (as received from backend)
  const sortedGroups = Object.entries(groups)
    .sort(([orgA], [orgB]) => orgA.localeCompare(orgB));

  const currentPageCount = sortedGroups.reduce((acc, [, evs]) => acc + evs.length, 0);

  // Tablet / mobile: card list (alineado con tarjetas del dashboard)
  if (useCards) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">
            {count} evento{count !== 1 ? 's' : ''}
            {count !== currentPageCount ? <span className="normal-case text-gray-500"> · mostrando {currentPageCount}</span> : null}
            {loading ? <span className="normal-case text-gray-500"> · cargando…</span> : null}
          </p>
          <Button variant="entraditaTertiary" size="sm" onClick={fetchEvents} className="w-full sm:w-auto shrink-0">
            ↻ Actualizar
          </Button>
        </div>
        {sortedGroups.length === 0 ? (
          <div className="rounded-xl border border-gray-700/80 bg-gray-900/50 px-4 py-10 text-center text-sm text-gray-500">
            Sin eventos
          </div>
        ) : (
          sortedGroups.map(([organizer, events]) => (
            <div key={organizer} className="rounded-xl border border-gray-700/80 bg-gray-900/40 overflow-hidden">
              <div className="sticky top-0 z-[1] flex items-center gap-2 border-b border-gray-700/80 bg-gray-800/95 px-4 py-3 backdrop-blur-sm">
                <div className="h-8 w-8 shrink-0 rounded-lg bg-blue-500/15 flex items-center justify-center text-blue-300 text-xs font-bold">
                  {organizer.slice(0, 1).toUpperCase()}
                </div>
                <span className="font-semibold text-sm text-gray-100 leading-snug break-words">{organizer}</span>
              </div>
              <ul className="divide-y divide-gray-800/90">
                {events.map((ev) => {
                  const past = isEventPast(ev.date);
                  const tier = getTierForCount(ev.tickets_sold);
                  const subtotal = ev.tickets_sold > 0 ? ev.tickets_sold * tier.price : 0;
                  return (
                    <li
                      key={ev.id}
                      className={`px-4 py-4 ${past ? 'bg-gray-950/80 opacity-75' : 'bg-gray-900/30'}`}
                    >
                      <div className={`font-medium text-[15px] leading-snug ${past ? 'text-gray-400' : 'text-white'}`}>
                        {ev.name}
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400">
                        <span className={past ? 'text-gray-500' : 'text-gray-300'}>{ev.date}</span>
                        {past && <span className="rounded-full bg-gray-800 px-2 py-0.5 text-[10px] uppercase tracking-wide text-gray-500">Finalizado</span>}
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-3">
                        <div className="rounded-lg bg-gray-800/60 border border-gray-700/50 px-3 py-2">
                          <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Vendidos</p>
                          <Badge variant={ev.tickets_sold > 0 ? 'secondary' : 'default'} className="text-xs">
                            {ev.tickets_sold}
                          </Badge>
                        </div>
                        <div className="rounded-lg bg-gray-800/60 border border-gray-700/50 px-3 py-2">
                          <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Total</p>
                          {ev.tickets_sold > 0 ? (
                            <div>
                              <span className="text-sm font-semibold text-emerald-400">{formatPrice(subtotal)}</span>
                              <p className="text-[10px] text-gray-500 mt-0.5">{tier.name}</p>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-600">—</span>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))
        )}

        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-gray-500">
              Página <span className="text-gray-300">{page}</span> / {totalPages}
            </p>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                type="button"
                variant="entraditaTertiary"
                size="sm"
                disabled={page <= 1 || loading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="flex-1 sm:flex-none min-h-[44px] sm:min-h-0"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Anterior
              </Button>
              <Button
                type="button"
                variant="entraditaTertiary"
                size="sm"
                disabled={page >= totalPages || loading}
                onClick={() => setPage((p) => p + 1)}
                className="flex-1 sm:flex-none min-h-[44px] sm:min-h-0"
              >
                Siguiente <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
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
    <div className="min-w-0">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <p className="text-xs text-gray-400 sm:flex-1">
          <span className="text-gray-300 font-medium">{count}</span>
          {' '}eventos
          {count !== allEvents.length ? <span> · mostrando {allEvents.length}</span> : null}
          {loading ? <span> · cargando…</span> : null}
        </p>
        <Button variant="entraditaTertiary" size="sm" onClick={fetchEvents} className="w-full sm:w-auto shrink-0">
          ↻ Actualizar
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-700/80 -mx-1 px-1 sm:mx-0 sm:px-0 overscroll-x-contain touch-manipulation">
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
              ].map(([key, label]) => {
                const alignClass = (key === 'name' || key === 'date') ? 'text-left' : 'text-center';
                return (
                  <TableHead
                    key={key}
                    onClick={() => handleSort(key)}
                    className={`cursor-pointer select-none text-gray-500 bg-gray-950 whitespace-nowrap ${alignClass}`}
                  >
                    {label}{arrow(key)}
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500 py-6 border-b border-gray-800">
                  Sin eventos
                </TableCell>
              </TableRow>
            ) : (
              sorted.map((ev, idx) => {
                const showOrg = idx === 0 || ev._organizer !== sorted[idx - 1]._organizer;
                const past = isEventPast(ev.date);
                const rowBase = past ? 'opacity-60' : '';
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
                  </tr>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
          <p className="text-xs text-gray-500">
            Página <span className="text-gray-300">{page}</span> / {totalPages}
          </p>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              type="button"
              variant="entraditaTertiary"
              size="sm"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="flex-1 sm:flex-none min-h-[44px] sm:min-h-0"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Anterior
            </Button>
            <Button
              type="button"
              variant="entraditaTertiary"
              size="sm"
              disabled={page >= totalPages || loading}
              onClick={() => setPage((p) => p + 1)}
              className="flex-1 sm:flex-none min-h-[44px] sm:min-h-0"
            >
              Siguiente <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

EventsTab.propTypes = { token: PropTypes.string };

// ─── Histórico Tab ────────────────────────────────────────────────────────────

const MONTH_LABELS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

function formatMonthLabel(yyyymm) {
  const [year, month] = yyyymm.split('-');
  return `${MONTH_LABELS[parseInt(month, 10) - 1]} ${year.slice(2)}`;
}

function HistoricoTab({ token }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const compactChart = useIsBelowMd();

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

  const chartH = compactChart ? 280 : 340;
  const chartMargin = compactChart
    ? { top: 8, right: 4, left: -22, bottom: 4 }
    : { top: 4, right: 16, left: -8, bottom: 0 };

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
        <p className="text-xs text-gray-400 sm:flex-1">
          <span className="text-gray-300 font-medium">{total}</span>
          {' '}tickets (12 meses)
          {loading ? <span> · cargando…</span> : null}
        </p>
        <Button variant="entraditaTertiary" size="sm" onClick={fetchHistory} className="w-full sm:w-auto shrink-0">
          ↻ Actualizar
        </Button>
      </div>

      <div className="w-full min-w-0 rounded-xl border border-gray-700/80 bg-gray-950/30 p-2 sm:p-0 sm:border-0 sm:bg-transparent" style={{ height: chartH }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={history} margin={chartMargin} barCategoryGap={compactChart ? '22%' : '30%'}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
            <XAxis
              dataKey="label"
              angle={compactChart ? -40 : 0}
              textAnchor={compactChart ? 'end' : 'middle'}
              height={compactChart ? 52 : 28}
              interval={compactChart ? 1 : 0}
              tick={{ fill: '#9ca3af', fontSize: compactChart ? 9 : 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              width={compactChart ? 28 : 36}
              allowDecimals={false}
              tick={{ fill: '#9ca3af', fontSize: compactChart ? 9 : 11 }}
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
              wrapperStyle={{ paddingTop: compactChart ? 8 : 16, fontSize: compactChart ? 11 : 12, color: '#9ca3af' }}
              formatter={(value) => value === 'web' ? 'Web' : value === 'admin' ? 'Admin' : 'Vendedor'}
            />
            <Bar dataKey="web" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} name="web" />
            <Bar dataKey="seller" stackId="a" fill="#a78bfa" radius={[0, 0, 0, 0]} name="seller" />
            <Bar dataKey="admin" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} name="admin" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-6 mt-4 justify-center text-[11px] sm:text-xs text-gray-400 px-1">
        <span className="flex items-center gap-1.5 justify-center sm:justify-start">
          <span className="inline-block w-3 h-3 rounded-sm bg-blue-500 shrink-0" />
          Web (Mercado Pago)
        </span>
        <span className="flex items-center gap-1.5 justify-center sm:justify-start">
          <span className="inline-block w-3 h-3 rounded-sm bg-violet-400 shrink-0" />
          Vendedor
        </span>
        <span className="flex items-center gap-1.5 justify-center sm:justify-start">
          <span className="inline-block w-3 h-3 rounded-sm bg-emerald-500 shrink-0" />
          Admin
        </span>
      </div>
    </div>
  );
}

HistoricoTab.propTypes = { token: PropTypes.string };

// ─── Ticket Requests Tab ──────────────────────────────────────────────────────

const REQUEST_STATUS_LABEL = {
  PENDING: 'Pendiente',
  APPROVED: 'Aprobada',
  REJECTED: 'Rechazada',
};

function requestStatusClass(status) {
  if (status === 'PENDING') return 'bg-amber-500/20 text-amber-200 ring-1 ring-amber-500/30';
  if (status === 'APPROVED') return 'bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-500/25';
  if (status === 'REJECTED') return 'bg-red-500/15 text-red-200 ring-1 ring-red-500/25';
  return 'bg-gray-700 text-gray-300';
}

function TicketRequestsTab({ token }) {
  const isMobile = useIsBelowMd();
  const [requests, setRequests] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [viewUrl, setViewUrl] = useState(null);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const loadPage = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await getAdminTicketRequests(token, { page, page_size: 10 });
      let nextPage = page;
      if (data.total_pages >= 1 && page > data.total_pages) {
        nextPage = data.total_pages;
      }
      if (nextPage !== page) {
        setPage(nextPage);
        return;
      }
      setRequests(data.requests || []);
      setCount(data.count ?? 0);
      setTotalPages(data.total_pages ?? 1);
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  }, [token, page]);

  useEffect(() => {
    loadPage();
  }, [loadPage]);

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      await approveTicketRequest(id, token);
      await loadPage();
    } catch { /* ignore */ } finally {
      setActionLoading(null);
    }
  };

  const handleRejectConfirm = async () => {
    if (!rejectModal) return;
    setActionLoading(rejectModal);
    try {
      await rejectTicketRequest(rejectModal, rejectReason, token);
      setRejectModal(null);
      setRejectReason('');
      await loadPage();
    } catch { /* ignore */ } finally {
      setActionLoading(null);
    }
  };

  const isPdf = (url) => url && url.toLowerCase().endsWith('.pdf');

  const openPdf = (url) => {
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleViewComprobante = (url) => {
    if (!url) return;
    if (isMobile && isPdf(url)) {
      openPdf(url);
      return;
    }
    setViewUrl(url);
  };

  return (
    <div className="min-w-0">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <p className="text-xs text-gray-400 sm:flex-1">
          <span className="text-gray-300 font-medium">{count}</span>
          {' '}solicitudes en total
          {loading ? <span> · cargando…</span> : null}
        </p>
        <Button variant="entraditaTertiary" size="sm" type="button" onClick={loadPage} className="w-full sm:w-auto shrink-0">
          ↻ Actualizar
        </Button>
      </div>

      {requests.length === 0 && !loading ? (
        <div className="rounded-xl border border-gray-700/80 bg-gray-900/50 px-4 py-10 text-center text-sm text-gray-500">
          {count === 0 ? 'No hay solicitudes' : 'No hay ítems en esta página'}
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((req) => {
            const pending = req.status === 'PENDING';
            return (
              <div
                key={req.id}
                className="rounded-xl border border-gray-700/80 bg-gray-900/50 p-4 shadow-sm"
              >
                <div className="flex flex-col gap-4">
                  <div className="space-y-2 min-w-0">
                    <div className="flex flex-wrap items-start gap-2">
                      <span className="text-white font-semibold text-[15px] leading-snug break-words">{req.organizer_name}</span>
                      <Badge variant="default" className="shrink-0">{req.quantity} tickets</Badge>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold shrink-0 ${requestStatusClass(req.status)}`}>
                        {REQUEST_STATUS_LABEL[req.status] || req.status}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1.5 text-sm text-gray-400 sm:flex-row sm:flex-wrap sm:gap-x-4">
                      <span>
                        Precio/u.:{' '}
                        <span className="text-white tabular-nums">${parseFloat(req.unit_price).toFixed(2)}</span>
                      </span>
                      <span>
                        Total:{' '}
                        <span className="text-emerald-400 font-semibold tabular-nums">
                          ${parseFloat(req.total_price).toLocaleString('es-AR')}
                        </span>
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 space-y-1">
                      <div>Creada: {new Date(req.created_at).toLocaleString('es-AR')}</div>
                      {req.resolved_at && (
                        <div>Resuelta: {new Date(req.resolved_at).toLocaleString('es-AR')}</div>
                      )}
                      {req.status === 'REJECTED' && req.reject_reason ? (
                        <div className="text-red-300/90">Motivo: {req.reject_reason}</div>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
                    {req.comprobante_url && (
                      <Button
                        variant="entraditaTertiary"
                        size="sm"
                        type="button"
                        onClick={() => handleViewComprobante(req.comprobante_url)}
                        className="w-full sm:w-auto min-h-[44px] sm:min-h-0 justify-center"
                      >
                        <Eye className="w-4 h-4 mr-1 shrink-0" /> Ver comprobante
                      </Button>
                    )}
                    {pending && (
                      <>
                        <Button
                          size="sm"
                          type="button"
                          disabled={actionLoading === req.id}
                          onClick={() => handleApprove(req.id)}
                          className="w-full sm:w-auto min-h-[44px] sm:min-h-0 justify-center bg-emerald-700 hover:bg-emerald-600 text-white"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1 shrink-0" /> Aprobar
                        </Button>
                        <Button
                          variant="entraditaTertiary"
                          size="sm"
                          type="button"
                          disabled={actionLoading === req.id}
                          onClick={() => { setRejectModal(req.id); setRejectReason(''); }}
                          className="w-full sm:w-auto min-h-[44px] sm:min-h-0 justify-center border-red-800/80 text-red-400 hover:bg-red-950/50"
                        >
                          <XCircle className="w-4 h-4 mr-1 shrink-0" /> Rechazar
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
          <p className="text-xs text-gray-500">
            Página <span className="text-gray-300">{page}</span> / {totalPages}
          </p>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              type="button"
              variant="entraditaTertiary"
              size="sm"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="flex-1 sm:flex-none min-h-[44px] sm:min-h-0"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Anterior
            </Button>
            <Button
              type="button"
              variant="entraditaTertiary"
              size="sm"
              disabled={page >= totalPages || loading}
              onClick={() => setPage((p) => p + 1)}
              className="flex-1 sm:flex-none min-h-[44px] sm:min-h-0"
            >
              Siguiente <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* View comprobante modal */}
      {viewUrl && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 p-0 sm:p-4 pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)]"
          onClick={() => setViewUrl(null)}
          role="presentation"
        >
          <div
            className="relative flex h-[min(100dvh,100%)] w-full max-h-[100dvh] sm:max-h-[90vh] sm:max-w-4xl flex-col rounded-t-2xl sm:rounded-xl bg-gray-900 overflow-hidden border border-gray-700/80 sm:border shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Comprobante"
          >
            <button
              type="button"
              onClick={() => setViewUrl(null)}
              className="absolute top-3 right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-gray-800/95 ring-1 ring-gray-600/50 hover:bg-gray-700"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5 text-white" />
            </button>
            {isPdf(viewUrl) ? (
              <iframe src={viewUrl} className="w-full flex-1 min-h-[70dvh] sm:min-h-0 sm:h-[85vh]" title="Comprobante" />
            ) : (
              <div className="flex flex-1 min-h-0 items-center justify-center p-4 pt-14">
                <img src={viewUrl} alt="Comprobante" className="max-h-[min(75dvh,100%)] max-w-full object-contain" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reject reason modal */}
      {rejectModal && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 p-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))]"
          onClick={() => setRejectModal(null)}
          role="presentation"
        >
          <div
            className="w-full max-w-md rounded-t-2xl sm:rounded-xl border border-gray-700/80 bg-gray-800 p-5 sm:p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="reject-dialog-title"
          >
            <h3 id="reject-dialog-title" className="text-white font-semibold text-lg mb-3">
              Rechazar solicitud
            </h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Motivo del rechazo (opcional)"
              className="w-full h-28 rounded-lg border border-gray-600 bg-gray-700 p-3 text-sm text-white resize-none focus:outline-none focus:ring-2 focus:ring-red-500/80"
            />
            <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button variant="entraditaTertiary" size="sm" onClick={() => setRejectModal(null)} className="w-full sm:w-auto min-h-[44px] sm:min-h-0">
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={handleRejectConfirm}
                disabled={actionLoading === rejectModal}
                className="w-full sm:w-auto min-h-[44px] sm:min-h-0 bg-red-700 hover:bg-red-600 text-white"
              >
                {actionLoading === rejectModal ? 'Rechazando…' : 'Confirmar rechazo'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

TicketRequestsTab.propTypes = { token: PropTypes.string };

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminPanel() {
  const { authToken, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tab, setTab] = useState(TABS.EVENTS);

  if (!user?.is_staff) {
    return (
      <div className="min-h-dvh bg-gray-900 flex items-center justify-center px-6 py-10">
        <p className="text-red-400 text-sm sm:text-base text-center max-w-md leading-relaxed">
          Acceso denegado. Se requieren permisos de staff.
        </p>
      </div>
    );
  }

  const token = authToken?.access;

  return (
    <div className="min-h-screen w-screen p-4 bg-gray-900 text-gray-100 pb-[env(safe-area-inset-bottom,0px)] overflow-x-hidden">
      <div className="max-w-6xl mx-auto w-full">
        <header className="pt-[max(1rem,env(safe-area-inset-top,0px))] pb-4 sm:pb-6 border-b border-gray-800/90 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-100 tracking-tight">Administración</h1>
            <p className="text-xs text-gray-500 mt-1 hidden sm:block">Operaciones, cobros e historial</p>
          </div>
          <Button
            variant="entraditaTertiary"
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto shrink-0 min-h-[44px] sm:min-h-0"
          >
            ← Volver al dashboard
          </Button>
        </header>

        <nav className="sticky top-0 z-20 border-b border-gray-800/90 bg-gray-900/95 backdrop-blur-md supports-[backdrop-filter]:bg-gray-900/80">
          <div className="flex gap-1 py-2 overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch]">
            {TAB_ITEMS.map(({ key, icon, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                aria-label={label}
                className={`shrink-0 rounded-lg px-3 py-2.5 md:px-4 text-sm font-medium transition-colors cursor-pointer border-0 min-h-[44px] flex items-center whitespace-nowrap gap-1.5 ${
                  tab === key
                    ? 'bg-gray-800 text-gray-100 ring-1 ring-gray-600/50 shadow-sm'
                    : 'bg-transparent text-gray-400 hover:text-gray-200 active:bg-gray-800/50'
                }`}
              >
                <span aria-hidden="true">{icon}</span>
                <span className="hidden md:inline">{label}</span>
              </button>
            ))}
          </div>
        </nav>

        <main className="py-4 sm:py-6 w-full">
          <Card className="bg-gray-800/90 border-gray-700/80 shadow-lg rounded-xl">
            <CardContent className="p-4 sm:p-6 pt-4 sm:pt-6">
              {tab === TABS.LOGS && <LogsTab token={token} />}
              {tab === TABS.EVENTS && <EventsTab token={token} />}
              {tab === TABS.TICKET_REQUESTS && <TicketRequestsTab token={token} />}
              {tab === TABS.HISTORY && <HistoricoTab token={token} />}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
