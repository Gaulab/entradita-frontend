import { apiRequest } from '../utils/apiUtils';

const apiRoot = String(import.meta.env.VITE_API_URL ?? '').trim().replace(/\/+$/, '');

function mainAdminUrl(suffixWithLeadingSlash, searchParams) {
  const q = searchParams && searchParams.toString();
  const base = `${apiRoot}${suffixWithLeadingSlash}`;
  return q ? `${base}?${q}` : base;
}

/**
 * @param {string} token
 * @param {object} [params]
 * @param {number} [params.page]
 * @param {number} [params.page_size]
 * @param {string} [params.payment_id] substring en línea / payment_id parseado
 * @param {string} [params.order_id]
 * @param {string} [params.type] INFO | WARNING | ERROR
 * @param {string} [params.reason] coincidencia exacta con razón parseada
 */
export const getLogs = async (token, params = {}) => {
  const search = new URLSearchParams();
  if (params.page != null) search.set('page', String(params.page));
  if (params.page_size != null) search.set('page_size', String(params.page_size));
  if (params.payment_id) search.set('payment_id', params.payment_id);
  if (params.order_id) search.set('order_id', params.order_id);
  if (params.type) search.set('type', params.type);
  if (params.reason) search.set('reason', params.reason);
  const url = mainAdminUrl('/api/v1/main/admin/logs/', search);
  return apiRequest(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }, 'Error al cargar los logs');
};

/**
 * @param {string} token
 * @param {object} [params]
 * @param {number} [params.page] 1-based
 * @param {number} [params.page_size]
 */
export const getAdminEvents = async (token, params = {}) => {
  const search = new URLSearchParams();
  if (params.page != null) search.set('page', String(params.page));
  if (params.page_size != null) search.set('page_size', String(params.page_size));
  return apiRequest(mainAdminUrl('/api/v1/main/admin/events/', search), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }, 'Error al cargar los eventos');
};

export const chargeEvent = async (eventId, token) => {
  return apiRequest(mainAdminUrl(`/api/v1/main/admin/events/${eventId}/charge/`), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }, 'Error al actualizar el estado de cobro');
};

export const getTicketHistory = async (token) => {
  return apiRequest(mainAdminUrl('/api/v1/main/admin/ticket-history/'), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }, 'Error al cargar el histórico de tickets');
};

/**
 * @param {string} token
 * @param {object} [params]
 * @param {number} [params.page] 1-based
 * @param {number} [params.page_size] default 10 en backend
 */
export const getAdminTicketRequests = async (token, params = {}) => {
  const search = new URLSearchParams();
  if (params.page != null) search.set('page', String(params.page));
  if (params.page_size != null) search.set('page_size', String(params.page_size));
  const url = mainAdminUrl('/api/v1/main/admin/ticket-requests/', search);
  return apiRequest(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }, 'Error al cargar las solicitudes de tickets');
};

export const approveTicketRequest = async (id, token) => {
  return apiRequest(mainAdminUrl(`/api/v1/main/admin/ticket-requests/${id}/approve/`), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }, 'Error al aprobar la solicitud');
};

export const rejectTicketRequest = async (id, reason, token) => {
  return apiRequest(mainAdminUrl(`/api/v1/main/admin/ticket-requests/${id}/reject/`), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ reason }),
  }, 'Error al rechazar la solicitud');
};
