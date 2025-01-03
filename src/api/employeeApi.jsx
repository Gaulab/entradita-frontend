// entradaFront/src/api/employeeApi.jsx
const apiUrl = import.meta.env.VITE_API_URL;

// Devuelve los empleados de un evento
export const getEmployees = async (id, authToken) => {
    try{
        const response = await fetch(`${apiUrl}/api/v1/event/${id}/employees/`, {
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

export const createEmployee = async (formData, authToken, eventId) => {
    console.log("id en API: ", formData);
    try {
        const response = await fetch(`${apiUrl}/api/v1/employee/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                event: eventId,
                is_seller: formData.is_seller,
                assigned_name: formData.assigned_name,
                seller_capacity: parseInt(formData.seller_capacity),
                ticket_tags: formData.ticket_tags
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
export const changeEmployeeStatus = async (authToken, itemToChange) => {
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
export const updateEmployee = async (submitData, authToken, employeeId) => {
    // console.log("newTicketTags en API: ", newTicketTags);
    // console.log("editingEmpleado en API: ", editingEmpleado);
    // console.log("newEmpleadoName en API: ", newEmpleadoName);
    // console.log("newEmpleadoCapacity en API: ", newEmpleadoCapacity);
    try {
        const response = await fetch(`${apiUrl}/api/v1/employee/${employeeId}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                assigned_name: submitData.assigned_name,
                seller_capacity: parseInt(submitData.seller_capacity),
                ticket_tags: submitData.ticket_tags
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
export const deleteEmployee = async (authToken, itemToDelete) => {
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
export const getSeller = async (uuid) => {
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