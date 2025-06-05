export interface RespuestaEncuestaDTO {
  encuestado: string;
  respuestasOpciones: {
    idPregunta: number;
    textoPregunta: string;
    opcionSeleccionada: string;
  }[];
  respuestasAbiertas: {
    idPregunta: number;
    textoPregunta: string;
    textoRespuesta: string;
  }[];
}
//dto para el resultado de una encuesta con todas las respuestas
