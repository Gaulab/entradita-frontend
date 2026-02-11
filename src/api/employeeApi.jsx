import { handleApiError } from "../utils/apiUtils";

// entradaFront/src/api/employeeApi.jsx
const apiUrl = import.meta.env.VITE_API_URL;

// Devuelve los empleados de un evento
export const getEmployees = async (id, authToken) => {
    try {
        const response = await fetch(`${apiUrl}/api/v1/main/event/${id}/employees/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
        });
        await handleApiError(response, 'Error al cargar los empleados');
        return await response.json();
    }
    catch (error) {
        throw error;
    }
}

export const createEmployee = async (formData, authToken, eventId) => {
    try {
        const response = await fetch(`${apiUrl}/api/v1/main/employee/`, {
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
        await handleApiError(response, 'Error al crear el empleado');
        return await response.json();
    } catch (error) {
        console.error("Error al crear el empleado:", error);
        throw error;
    }
};


// Cambiar status de un empleado
export const changeEmployeeStatus = async (authToken, itemToChange) => {
    try {
        const response = await fetch(`${apiUrl}/api/v1/main/employee/${itemToChange.id}/status/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                status: !itemToChange.status
            })
        });
        await handleApiError(response, 'Error al cambiar el estado del empleado');
        return await response.json();
    }
    catch (error) {
        throw error;
    }
}



// Actualización de un empleado
export const updateEmployee = async (submitData, authToken, employeeId) => {
    try {
        const response = await fetch(`${apiUrl}/api/v1/main/employee/${employeeId}/`, {
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
        await handleApiError(response, 'Error al editar el empleado');
        return await response.json();
    }
    catch (error) {
        throw error;
    }
};

// Eliminación de un empleado
export const deleteEmployee = async (authToken, itemToDelete) => {
    try {
        await fetch(`${apiUrl}/api/v1/main/employee/${itemToDelete.id}/`, {
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
        const response = await fetch(`${apiUrl}/api/v1/main/employees/scanner/${uuid}/info/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        await handleApiError(response, 'Error al cargar los datos del scanner');
        return await response.json();
    }
    catch (error) {
        throw error;
    }
}

// Vendedor view
export const getSeller = async (uuid) => {
    try {
        const response = await fetch(`${apiUrl}/api/v1/main/employee/seller/${uuid}/info/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        await handleApiError(response, 'Error al cargar los datos del vendedor');
        return await response.json();
    }
    catch (error) {
        throw error;
    }
}

// Check password
export const checkPassword = async (uuid, password) => {
    try {
        const response = await fetch(`${apiUrl}/api/v1/main/event/${uuid}/check-password/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ password }),
        });
        await handleApiError(response, 'Error al verificar la contraseña');
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
};