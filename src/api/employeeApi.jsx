import { apiRequest } from "../utils/apiUtils";

// entradaFront/src/api/employeeApi.jsx
const apiUrl = import.meta.env.VITE_API_URL;

// Devuelve los empleados de un evento
export const getEmployees = async (id, authToken) => {
    return apiRequest(`${apiUrl}/api/v1/main/event/${id}/employees/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
    }, 'Error al cargar los empleados');
}

export const createEmployee = async (formData, authToken, eventId) => {
    return apiRequest(`${apiUrl}/api/v1/main/employee/`, {
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
    }, 'Error al crear el empleado');
};


// Cambiar status de un empleado
export const changeEmployeeStatus = async (authToken, itemToChange) => {
    return apiRequest(`${apiUrl}/api/v1/main/employee/${itemToChange.id}/status/`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
            status: !itemToChange.status
        })
    }, 'Error al cambiar el estado del empleado');
}



// Actualización de un empleado
export const updateEmployee = async (submitData, authToken, employeeId) => {
    return apiRequest(`${apiUrl}/api/v1/main/employee/${employeeId}/`, {
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
    }, 'Error al editar el empleado');
};

// Eliminación de un empleado
export const deleteEmployee = async (authToken, itemToDelete) => {
    await apiRequest(`${apiUrl}/api/v1/main/employee/${itemToDelete.id}/`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        }
    }, 'Error al eliminar el empleado');
};

// Scanner view
export const getScanner = async (uuid) => {
    return apiRequest(`${apiUrl}/api/v1/main/employees/scanner/${uuid}/info/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }, 'Error al cargar los datos del scanner');
}

// Vendedor view
export const getSeller = async (uuid) => {
    return apiRequest(`${apiUrl}/api/v1/main/employee/seller/${uuid}/info/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }, 'Error al cargar los datos del vendedor');
}

export const getSellerTickets = async ({ uuid, page = 1, limit = 10, search = '' }) => {
    return apiRequest(`${apiUrl}/api/v1/main/employee/seller/${uuid}/tickets/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ page, limit, search }),
    }, 'Error al cargar los tickets del vendedor');
}

// Check password
export const checkPassword = async (uuid, password) => {
    return apiRequest(`${apiUrl}/api/v1/main/event/${uuid}/check-password/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
    }, 'Error al verificar la contraseña');
};