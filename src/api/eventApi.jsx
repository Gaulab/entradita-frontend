// entraditaFront/src/api/eventApi.jsx
const apiUrl = import.meta.env.VITE_API_URL;


export const putPurchaseInfo = async (eventId, purchaseInfo, authToken) => {
  try {
    const response = await fetch(`${apiUrl}/api/v1/main/event/${eventId}/purchase-info/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(purchaseInfo),
        });
      } catch (error) {
        throw new Error(error.message || 'Error al actualizar la información de compra');
      }
    };


export const getPurchaseInfo = async (eventId) => {
  try {
    const response = await fetch(`${apiUrl}/api/v1/main/event/${eventId}/purchase-info/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error('Error al cargar los detalles del evento');
    }
  } catch (error) {
    throw new Error(error.message || 'Error al cargar los detalles del evento');
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

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error('Error al cargar el evento');
    }
    
  } catch (error) {
    throw new Error(error.message || 'Error al cargar el evento');
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

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error('Error al cargar los detalles del evento');
    }
    
  } catch (error) {
    throw new Error(error.message || 'Error al cargar los detalles del evento');
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
    

    if (response.ok) {
      return await response.json(); // Devuelve los datos de los eventos
    } else {
      throw new Error('Error al obtener eventos');
    }
  } catch (error) {
    throw new Error(error.message || 'Error desconocido al obtener eventos');
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

    if (response.ok) {
      return await response.json();
    } else {
      const errorData = await response.json();
      console.error("Error al crear el evento:", errorData); // Muestra el error detallado
      throw new Error(errorData.detail || 'Error al crear el evento');
    }
  } catch (error) {
    console.error("Error en createEvent:", error.message);
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

    if (!response.ok) {
      throw new Error('Error al actualizar el evento');
    }

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

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error('Error al editar el evento');
    }

  } catch (error) {
    throw new Error(error.message || 'Error desconocido al editar el evento');
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

    if (response.ok) {
      return true;
    } else {
      throw new Error('Error al eliminar el evento');
    }

  } catch (error) {
    throw new Error(error.message || 'Error desconocido al eliminar el evento');
  }
};


