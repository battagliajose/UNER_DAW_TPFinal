export interface ResumenEstadisticoDTO {
  nombreEncuesta?: string; // <-- AGREGADO
  cantidadEncuestasProcesadas: number;
  totalPreguntas: number;
  totalRespuestasAnalizadas: number;
  resultadosProcesados: {
    textoPregunta: string;
    tipoPregunta: string;
    opciones?: {
      textoOpcion: string;
      cantidadVecesSeleccionada: number;
      porcentajeSeleccion: string;
    }[];
    totalRespuestas?: number; // <-- AGREGADO para preguntas abiertas
    respuestas?: string[];
  }[];
}
