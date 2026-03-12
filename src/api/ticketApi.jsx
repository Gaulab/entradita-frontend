import { apiRequest } from "../utils/apiUtils";

const apiUrl = import.meta.env.VITE_API_URL;

// Devuelve un ticket por uuid
export const getTicket = async (ticket_uuid) => {
  console.log('Getting ticket API...', ticket_uuid);
  return apiRequest(`${apiUrl}/api/v1/main/ticket/${ticket_uuid}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }, 'QR inexistente');
};

// Creacion ticket por organizador
export const createTicket = async (formData, eventId, authToken) => {
  return apiRequest(`${apiUrl}/api/v1/main/ticket/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      event: eventId,
      owner_name: formData.owner_name,
      owner_lastname: formData.owner_lastname,
      owner_dni: formData.owner_dni,
      ticket_tag: formData.ticket_tag,
    }),
  }, 'Error al crear el ticket');
};
// Creacion ticket por vendedor

export const createTicketBySeller = async (formData, uuid) => {
  return apiRequest(`${apiUrl}/api/v1/main/employees/seller/${uuid}/create-ticket/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  }, 'Error al crear el ticket');
};

// Eliminación de un ticket por organizador
export const deleteTicket = async (authToken, itemToDelete) => {
  await apiRequest(`${apiUrl}/api/v1/main/ticket/${itemToDelete.id}/`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
  }, 'Error al eliminar el ticket');
  return true;
};

// Eliminacion de un ticket por vendedor
export const deleteTicketBySeller = async (uuid, ticketId) => {
  await apiRequest(`${apiUrl}/api/v1/main/employees/seller/${uuid}/delete-ticket/${ticketId}/`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  }, 'Error al eliminar el ticket');
  return true;
};

// Validar ticket por payload
export const checkTicketByPayload = async (payload, scanner, eventId) => {
  return apiRequest(`${apiUrl}/api/v1/main/ticket/scan-qr/${payload}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ event_id: eventId, scanner_id: scanner }),
  }, 'Ticket no encontrado');
};

// Validar ticket por DNI
export const checkTicketByDni = async (dni, scanner, eventId) => {
  return apiRequest(`${apiUrl}/api/v1/main/ticket/scan-dni/${dni}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ event_id: eventId, scanner_id: scanner }),
  }, 'Ticket no encontrado');
};
