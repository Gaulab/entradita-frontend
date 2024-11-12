const apiUrl = import.meta.env.VITE_API_URL;

// Devuelve los detalles de un evento
export const getEvent = async (id, authToken) => {
  try {
    const response = await fetch(`${apiUrl}/api/v1/events/${id}/`, {
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

// Devuelve los detalles de un evento ----> NO USADA CON LAS PAGES ACTUALES
export const getEventDetails = async (id, authToken) => {
  try {
    const response = await fetch(`${apiUrl}/api/v1/events/${id}/details`, {
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
    const response = await fetch(`${apiUrl}/api/v1/events/`, {
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

// Creacion de un evento
export const createEvent = async (e, authToken) => {
  try {
    const response = await fetch(`${apiUrl}/api/v1/events/create/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        name: e.target.name.value,
        date: e.target.date.value,
        place: e.target.place.value,
        capacity: e.target.capacity.value ? parseInt(e.target.capacity.value) : null,
        image_address: e.target.image_address.value ? e.target.image_address.value : null,
        password_employee: e.target.password_employee.value
      }),
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error('Error al crear el evento');
    }

  } catch (error) {
    throw new Error(error.message || 'Error desconocido al crear el evento');
  }
};

// Actualización de un evento
export const updateEvent = async (e, id, authToken) => {
  try {
    const response = await fetch(`${apiUrl}/api/v1/events/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        name: e.target.name.value,
        date: e.target.date.value,
        place: e.target.place.value,
        capacity: e.target.capacity.value ? parseInt(e.target.capacity.value) : 0,
        image_address: e.target.image_address.value,
        password_employee: e.target.password_employee.value
      }),
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
    const response = await fetch(`${apiUrl}/api/v1/events/${id}/`, {
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


