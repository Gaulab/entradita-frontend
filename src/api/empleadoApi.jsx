// entradaFront/src/api/empleadoApi.jsx
const apiUrl = import.meta.env.VITE_API_URL;

// Devuelve los empleados de un evento
export const getEmpleados = async (id, authToken) => {
    try{
        const response = await fetch(`${apiUrl}/api/v1/events/${id}/employees/`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken}`
            },
        });

        if (response.ok) {
            return await response.json();
        }
        else {
            throw new Error('Error al obtener empleados');
        }
    }
    catch (error) {
        throw new Error(error.message || 'Error desconocido al obtener empleados');
    }
}

export const createEmpleado = async (authToken, isSellerEmpleado, newEmpleadoName, newEmpleadoCapacity, newTicketTags, id) => {
    // console.log("newTicketTags en API: ", newTicketTags);
    try {
        const response = await fetch(`${apiUrl}/api/v1/employee/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                is_seller: isSellerEmpleado,
                assigned_name: newEmpleadoName,
                seller_capacity: parseInt(newEmpleadoCapacity) || null,
                event: id,
                ticket_tags: newTicketTags // Asegúrate de enviar un array válido
            })
        });

        if (response.ok) {
            return await response.json();
        } else {
            const errorData = await response.json();
            console.error("Error al crear el empleado (API)", errorData);
            throw new Error(errorData.message || 'Error desconocido al crear el empleado');
        }
    } catch (error) {
        console.error("Error al crear el empleado:", error);
        throw new Error(error.message || 'Error desconocido al crear el empleado');
    }
};


// Cambiar status de un empleado
export const changeEmpleadoStatus = async (authToken, itemToChange) => {
    try {
        const response = await fetch(`${apiUrl}/api/v1/employee/${itemToChange.id}/status/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                status: !itemToChange.status
            })
        });

        if (response.ok) {
            return await response.json();
        }
        else {
            throw new Error('Error al cambiar el estado del empleado');
        }
    }
    catch (error) {
        throw new Error(error.message || 'Error desconocido al cambiar el estado del empleado');
    }
}



// Actualización de un empleado
export const updateEmpleado = async (authToken, editingEmpleado, newEmpleadoName, newEmpleadoCapacity, newTicketTags) => {
    // console.log("newTicketTags en API: ", newTicketTags);
    // console.log("editingEmpleado en API: ", editingEmpleado);
    // console.log("newEmpleadoName en API: ", newEmpleadoName);
    // console.log("newEmpleadoCapacity en API: ", newEmpleadoCapacity);
    try {
        const response = await fetch(`${apiUrl}/api/v1/employee/${editingEmpleado.id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                assigned_name: newEmpleadoName,
                seller_capacity: parseInt(newEmpleadoCapacity),
                ticket_tags: newTicketTags
            })
        });

        if (response.ok) {
            return await response.json();
        }
        else {
            throw new Error('Error al editar el empleado');
        }
    }
    catch (error) {
        throw new Error(error.message || 'Error desconocido al editar el empleado');
    }
};

// Eliminación de un empleado
export const deleteEmpleado = async (authToken, itemToDelete) => {
    try {
        await fetch(`${apiUrl}/api/v1/employee/${itemToDelete.id}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        });
    }
    catch (error) {
        throw new Error(error.message || 'Error desconocido al eliminar el empleado');
    }
};

// Scanner view
export const getScanner = async (uuid) => {
    try {
        const response = await fetch(`${apiUrl}/api/v1/employees/scanner/${uuid}/info/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            return await response.json();
        }
        else {
            throw new Error('Scanner no encontrado');
        }
    }
    catch (error) {
        throw new Error(error.message || 'Error al obtener los datos del scanner');
    }
}

// Vendedor view
export const getVendedor = async (uuid) => {
    try {
        const response = await fetch(`${apiUrl}/api/v1/employee/seller/${uuid}/info/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            return await response.json();
        }
        else {
            throw new Error('Vendedor no encontrado');
        }
    }
    catch (error) {
        throw new Error(error.message || 'Error al obtener los datos del vendedor');
    }
}

// Check password
export const checkPassword = async (eventId, password) => {
    try {
      const response = await fetch(`${apiUrl}/api/v1/events/${eventId}/check-password/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Contraseña incorrecta')
      }
    } catch (error) {
        throw new Error(error.message || 'Error al verificar la contraseña');
    }
  };