/**
 * Formatea una fecha en formato legible
 * @param {Date} date - Objeto Date a formatear
 * @returns {string} Fecha formateada
 */
export function formatDate(date) {
    if (!date) {
      return "Fecha no disponible"
    }

    let parsedDate = date

    if (typeof date === "string") {
      const trimmed = date.trim()
      if (!trimmed) {
        return "Fecha no disponible"
      }

      // Expected backend format: yyyy-mm-dd
      const match = /^\d{4}-\d{2}-\d{2}$/.exec(trimmed)
      if (match) {
        const [year, month, day] = trimmed.split("-").map(Number)
        parsedDate = new Date(year, month - 1, day)
      } else {
        parsedDate = new Date(trimmed)
      }
    }

    if (!(parsedDate instanceof Date) || isNaN(parsedDate)) {
      return "Fecha no disponible"
    }

    try {
      return parsedDate.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      })
    } catch (error) {
      console.error("Error al formatear fecha:", error)
      return "Fecha no disponible"
    }
  }
  