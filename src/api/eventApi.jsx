import { apiRequest } from "../utils/apiUtils";

// entraditaFront/src/api/eventApi.jsx
const apiUrl = import.meta.env.VITE_API_URL;

export const loadMoreTicketsApi = async ({ eventId, page = 1, limit = 10, search = "", token }) => {
  return apiRequest(`${apiUrl}/api/v1/main/events/${eventId}/tickets/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      page,
      limit,
      search,
    }),
  }, 'Error al cargar más tickets');
};


// Devuelve los detalles de un evento
export const getEvent = async (id, authToken) => {
  return apiRequest(`${apiUrl}/api/v1/main/event/${id}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
  }, 'Error al cargar el evento');
}

// Devuelve los detalles de un evento
export const getEventDetails = async (id, authToken) => {
  return apiRequest(`${apiUrl}/api/v1/main/event/${id}/details`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
  }, 'Error al cargar los detalles del evento');
}



// Devuelve todos los eventos de un usuario
export const getEvents = async (authToken) => {
  return apiRequest(`${apiUrl}/api/v1/main/events/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
    },
  }, 'Error al cargar los eventos');
};


export const createEvent = async (formData, authToken) => {
  return apiRequest(`${apiUrl}/api/v1/main/event/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authToken}`,
    },
    body: formData,
  }, 'Error al crear el evento');
};



// Actualización de un evento
export const updateEvent = async (formData, eventId, token) => {
  return apiRequest(`${apiUrl}/api/v1/main/event/${eventId}/`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  }, 'Error al actualizar el evento');
};


// Deshabilitacion / Habilitacion venta de tickets
export const updateTicketSales = async (id, authToken) => {
  return apiRequest(`${apiUrl}/api/v1/main/event/${id}/ticket-sales/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
  }, 'Error al actualizar la venta de tickets del evento');
};

// Deshabilitacion / Habilitacion venta web del evento
export const updateWebSale = async (id, authToken) => {
  return apiRequest(`${apiUrl}/api/v1/main/event/${id}/web-sale/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
  }, 'Error al actualizar la venta web del evento');
};

// Reseteo de un evento periódico
export const resetEvent = async (id, authToken) => {
  return apiRequest(`${apiUrl}/api/v1/main/event/${id}/reset/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
  }, 'Error al reiniciar el evento');
};

// Eliminación de un evento
export const deleteEvent = async (id, authToken) => {
  await apiRequest(`${apiUrl}/api/v1/main/event/${id}/`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
  }, 'Error al eliminar el evento');
  return true;
};

// Devuelve los detalles de la pagina web de un evento
export const getEventPage = async (eventId) => {
  return apiRequest(`${apiUrl}/api/v1/main/event/${eventId}/info-for-web/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }, 'Error al cargar los datos del evento para la web');
}

// Devuelve la información de compra de un evento
export const getEventPurchaseInfo = async (eventId) => {
  return apiRequest(`${apiUrl}/api/v1/main/event/${eventId}/purchase-info/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }, 'Error al cargar los datos de compra del evento');
}


