// utils/apiUtils.js

/**
 * Procesa la respuesta de un fetch. Si no es OK, decodifica el error y lanza una excepción.
 * @param {Response} response - El objeto response del fetch.
 * @param {string} defaultMessage - El mensaje a mostrar si no se puede decodificar el error.
 */
export const handleApiError = async (response, defaultMessage = 'Ocurrió un error inesperado') => {
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      // Si el backend devuelve HTML (ej: 500 Server Error) o texto plano
      throw new Error(defaultMessage);
    }

    let errorMessage = defaultMessage;

    if (errorData.error) {
      // 1. Backend manda explícitamente { error: "..." }
      errorMessage = errorData.error;
    } else if (errorData.detail) {
      // 2. Errores genéricos de DRF (ej: "No autenticado")
      errorMessage = errorData.detail;
    } else if (typeof errorData === 'object' && errorData !== null) {
      // 3. Errores de validación de campos (Serializer)
      const keys = Object.keys(errorData);
      if (keys.length > 0) {
        const fieldName = keys[0]; // ej: "attendees"
        const fieldError = errorData[fieldName]; // El array de errores
        // A. Si es un array (Caso many=True o listas de strings)
        if (Array.isArray(fieldError)) {
          // Caso A.1: Lista de strings simples ["Este campo es obligatorio"]
          if (typeof fieldError[0] === 'string') {
             errorMessage = fieldError[0];
          } 
          // Caso A.2: Lista de OBJETOS (many=True) [ {}, {name: ["Error"]}, {} ]
          else if (typeof fieldError[0] === 'object') {
             // Buscamos el primer objeto que NO esté vacío
             for (let i = 0; i < fieldError.length; i++) {
                const itemError = fieldError[i];
                const itemKeys = Object.keys(itemError);
                if (itemKeys.length > 0) {
                   // Encontramos el error en la fila 'i'
                   const subField = itemKeys[0]; // ej: "name"
                   const msg = itemError[subField][0]; // ej: "Longitud mayor a 50"
                   
                   // Construimos un mensaje útil indicando la fila
                   errorMessage = `Error en el asistente #${i + 1} (${subField}): ${msg}`;
                   break; // Dejamos de buscar
                }
             }
          }
        } 
        // B. Si es un string directo (raro en DRF pero posible)
        else {
          errorMessage = String(fieldError);
        }
      }
    }
    throw new Error(errorMessage);
  }
  
  // Si la respuesta es OK, volvemos al flujo original
  return;
};