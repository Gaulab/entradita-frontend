import { handleApiError } from "../utils/apiUtils";

const apiUrl = import.meta.env.VITE_API_URL;

// Devuelve un ticket por uuid
export const getTicket = async (ticket_uuid) => {
  console.log('Getting ticket API...', ticket_uuid);
  try {
    const response = await fetch(`${apiUrl}/api/v1/main/ticket/${ticket_uuid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    await handleApiError(response, 'QR inexistente');
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// Creacion ticket por organizador
export const createTicket = async (formData, eventId, authToken) => {
  // console.log('Creating ticket API...', formData.owner_name, formData.owner_lastname, formData.ticket_tag);
  try {
    const response = await fetch(`${apiUrl}/api/v1/main/ticket/`, {
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
    });
    await handleApiError(response, 'Error al crear el ticket');
    return await response.json();
  } catch (error) {
    throw error;
  }
};
// Creacion ticket por vendedor

export const createTicketBySeller = async (formData, uuid) => {
  try {
    const response = await fetch(`${apiUrl}/api/v1/main/employees/seller/${uuid}/create-ticket/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    await handleApiError(response, 'Error al crear el ticket');
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// Eliminación de un ticket por organizador
export const deleteTicket = async (authToken, itemToDelete) => {
  try {
    const response = await fetch(`${apiUrl}/api/v1/main/ticket/${itemToDelete.id}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    });
    await handleApiError(response, 'Error al eliminar el ticket');
    return true;
  } catch (error) {
    throw error;
  }
};

// Eliminacion de un ticket por vendedor
export const deleteTicketBySeller = async (uuid, ticketId) => {
  try {
    const response = await fetch(`${apiUrl}/api/v1/main/employees/seller/${uuid}/delete-ticket/${ticketId}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    await handleApiError(response, 'Error al eliminar el ticket');
    return true;
  } catch (error) {
    throw error;
  }
};

// Validar ticket por payload
export const checkTicketByPayload = async (payload, scanner, eventId) => {
  try {
    const response = await fetch(`${apiUrl}/api/v1/main/ticket/scan-qr/${payload}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ event_id: eventId, scanner_id: scanner }),
    });
    await handleApiError(response, 'Ticket no encontrado');
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// Validar ticket por DNI
export const checkTicketByDni = async (dni, scanner, eventId) => {
  try {
    const response = await fetch(`${apiUrl}/api/v1/main/ticket/scan-dni/${dni}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ event_id: eventId, scanner_id: scanner }),
    });
    await handleApiError(response, 'Ticket no encontrado');
    return await response.json();
  } catch (error) {
    throw error;
  }
};
