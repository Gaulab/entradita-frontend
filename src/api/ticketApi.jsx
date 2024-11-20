const apiUrl = import.meta.env.VITE_API_URL;

// Devuelve un ticket por uuid
export const getTicket = async (ticket_uuid) => {
  try {
    const response = await fetch(`${apiUrl}/api/v1/tickets/public/${ticket_uuid}/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if(response.ok){
      return await response.json()
    }
    else{
      throw new Error('QR inexistente')
    }
  }  catch (error){
    throw new Error(error.message || 'QR inexistente');
  }
}

// Creacion ticket por organizador
export const createTicket = async (e, id, authToken) => {
  try {
    const response = await fetch(`${apiUrl}/api/v1/tickets/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        event: id,
        owner_name: e.target.name.value,
        owner_lastname: e.target.surname.value,
        owner_dni: e.target.dni.value,
      }),
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error('Error al crear el ticket');
    }
  } catch (error) {
    throw new Error(error.message || 'Error desconocido al crear el ticket');
  }
};

// Creacion ticket por vendedor
export const createTicketBySeller = async (e, uuid) => {
  try {
    const response = await fetch(`${apiUrl}/api/v1/employees/seller/${uuid}/create-ticket/`, { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 
      },
      body: JSON.stringify({
        owner_name: e.target.name.value,
        owner_lastname: e.target.surname.value,
        owner_dni: e.target.dni.value,
      }),
    });
    const data = await response.json();

    if (response.ok) {
      return data;
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    throw new Error(error.message || 'Error desconocido al crear el ticket');
  }
}

// Eliminación de un ticket por organizador
export const deleteTicket = async (authToken, itemToDelete) => {
  try {
    const response = await fetch(`${apiUrl}/api/v1/tickets/${itemToDelete.id}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
    });
  } catch (error) {
    throw new Error(error.message || 'Error desconocido al eliminar el ticket');
  }
};

// Eliminacion de un ticket por vendedor
export const deleteTicketBySeller = async (uuid, ticketId) => {
  try {
    const response = await fetch(`${apiUrl}/api/v1/employees/seller/${uuid}/delete-ticket/${ticketId}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch(error) {
    throw new Error(error.message || 'Error desconocido al eliminar el ticket');
  }
}

// Validar ticket por payload
export const checkTicketByPayload = async (payload, scanner, eventId) => {
  try {
    const response = await fetch(`${apiUrl}/api/v1/tickets/scan/${payload}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ event_id: eventId, scanner_id: scanner }),
    });
    if(response.ok){
      return await response.json();
    }
    else {
      throw new Error('Ticket no encontrado');
    }

  } catch (error) {
    throw new Error(error.message || 'Ticket no encontrado');
  }
}

// Validar ticket por DNI
export const checkTicketByDni = async (dni, scanner, eventId) => {
  try {
    const response = await fetch(`${apiUrl}/api/v1/tickets/scan/dni/${dni}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ event_id: eventId, scanner_id: scanner }),
    });
    
    if(response.ok){
      return await response.json();
    }
    else {
      throw new Error('Ticket no encontrado');
    }

  } catch (error) {
    throw new Error(error.message || 'Ticket no encontrado');
  }
}