export function mapServerError(status: number, statusText: string): string {
  const messages: Record<number, string> = {
    400: "Solicitud incorrecta.",
    401: "No autorizado.",
    403: "Acceso denegado.",
    404: "Recurso no encontrado.",
    500: "Error interno del servidor.",
    503: "Servicio no disponible.",
  };
  return messages[status] || `Error ${status}: ${statusText}`;
}
