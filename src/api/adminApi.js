import { apiRequest } from '../utils/apiUtils';

const apiUrl = import.meta.env.VITE_API_URL;

export const getLogs = async (token, errorOnly = false) => {
  const url = errorOnly
    ? `${apiUrl}/api/v1/main/admin/logs/?level=error`
    : `${apiUrl}/api/v1/main/admin/logs/`;
  return apiRequest(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }, 'Error al cargar los logs');
};

export const getAdminEvents = async (token) => {
  return apiRequest(`${apiUrl}/api/v1/main/admin/events/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }, 'Error al cargar los eventos');
};

export const chargeEvent = async (eventId, token) => {
  return apiRequest(`${apiUrl}/api/v1/main/admin/events/${eventId}/charge/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }, 'Error al actualizar el estado de cobro');
};

export const getTicketHistory = async (token) => {
  return apiRequest(`${apiUrl}/api/v1/main/admin/ticket-history/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }, 'Error al cargar el histórico de tickets');
};
