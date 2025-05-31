/**
 * Formatea una fecha en formato legible
 * @param {Date} date - Objeto Date a formatear
 * @returns {string} Fecha formateada
 */
export function formatDate(date) {
    if (!date || !(date instanceof Date) || isNaN(date)) {
      return "Fecha no disponible"
    }
  
    try {
      return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (error) {
      console.error("Error al formatear fecha:", error)
      return "Fecha no disponible"
    }
  }
  