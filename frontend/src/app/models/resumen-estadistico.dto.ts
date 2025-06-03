export interface ResumenEstadisticoDTO {
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
    respuestas?: string[];
  }[];
}
