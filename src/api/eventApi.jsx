import { handleApiError } from "../utils/apiUtils";

// entraditaFront/src/api/eventApi.jsx
const apiUrl = import.meta.env.VITE_API_URL;

export const loadMoreTicketsApi = async ({ eventId, page = 1, limit = 10, search = "", token }) => {
  try {
    const response = await fetch(`${apiUrl}/api/v1/main/events/${eventId}/tickets/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        page,  // Enviar número de página
        limit, // Cantidad de tickets por página
        search, // Término de búsqueda
      }),
    });
    await handleApiError(response, 'Error al cargar más tickets');
    return await response.json();
  } catch (error) {
    throw error;
  }
};


// Devuelve los detalles de un evento
export const getEvent = async (id, authToken) => {
  try {
    const response = await fetch(`${apiUrl}/api/v1/main/event/${id}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
    });
    await handleApiError(response, 'Error al cargar el evento');
    return await response.json();
  } catch (error) {
    throw error;
  }
}

// Devuelve los detalles de un evento
export const getEventDetails = async (id, authToken) => {
  try {
    const response = await fetch(`${apiUrl}/api/v1/main/event/${id}/details`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
    });
    await handleApiError(response, 'Error al cargar los detalles del evento');
    return await response.json();
  } catch (error) {
    throw error;
  }
}



// Devuelve todos los eventos de un usuario
export const getEvents = async (authToken) => {
  try {
    const response = await fetch(`${apiUrl}/api/v1/main/events/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
    });
    await handleApiError(response, 'Error al cargar los eventos');
    return await response.json();
  } catch (error) {
    throw error;
  }
};


export const createEvent = async (eventData, authToken) => {
  try {
    const response = await fetch(`${apiUrl}/api/v1/main/event/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(eventData),
    });
    await handleApiError(response, 'Error al crear el evento');
    return await response.json();
  } catch (error) {
    throw error;
  }
};



// Actualización de un evento
export const updateEvent = async (eventData, eventId, token) => {
  // console.log("asd" + JSON.stringify(eventData))
  try {
    const response = await fetch(`${apiUrl}/api/v1/main/event/${eventId}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(eventData),
    });
    await handleApiError(response, 'Error al actualizar el evento');
    return await response.json();
  } catch (error) {
    throw error;
  }
};


// Deshabilitacion / Habilitacion venta de tickets
export const updateTicketSales = async (id, authToken) => {
  try {
    const response = await fetch(`${apiUrl}/api/v1/main/event/${id}/ticket-sales/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
    });
    await handleApiError(response, 'Error al actualizar la venta de tickets del evento');
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// Deshabilitacion / Habilitacion venta web del evento
export const updateWebSale = async (id, authToken) => {
  try {
    const response = await fetch(`${apiUrl}/api/v1/main/event/${id}/web-sale/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
    });
    await handleApiError(response, 'Error al actualizar la venta web del evento');
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// Reseteo de un evento periódico
export const resetEvent = async (id, authToken) => {
  try {
    const response = await fetch(`${apiUrl}/api/v1/main/event/${id}/reset/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
    });
    await handleApiError(response, 'Error al reiniciar el evento');
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// Eliminación de un evento
export const deleteEvent = async (id, authToken) => {
  try {
    const response = await fetch(`${apiUrl}/api/v1/main/event/${id}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
    });
    await handleApiError(response, 'Error al eliminar el evento');
    return true;
  } catch (error) {
    throw error;
  }
};

// Devuelve los detalles de la pagina web de un evento
export const getEventPage = async (eventId) => {
  try {
    const response = await fetch(`${apiUrl}/api/v1/main/event/${eventId}/info-for-web/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    await handleApiError(response, 'Error al cargar los datos del evento para la web');
    return await response.json();
  }
  catch (error) {
    throw error;
  }
}

// Devuelve la información de compra de un evento
export const getEventPurchaseInfo = async (eventId) => {
  try {
    const response = await fetch(`${apiUrl}/api/v1/main/event/${eventId}/purchase-info/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    await handleApiError(response, 'Error al cargar los datos de compra del evento');
    return await response.json();
  }
  catch (error) {
    throw error;
  }
}


