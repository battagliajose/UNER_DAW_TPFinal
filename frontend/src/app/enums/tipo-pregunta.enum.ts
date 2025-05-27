export enum TipoRespuestaEnum {
  ABIERTA = 'ABIERTA',
  OPCION_MULTIPLE_SELECCION_SIMPLE = 'OPCION_MULTIPLE_SELECCION_SIMPLE',
  OPCION_MULTIPLE_SELECCION_MULTIPLE = 'OPCION_MULTIPLE_SELECCION_MULTIPLE',
}

export const tipoPreguntaPresentacion: {
  tipo: TipoRespuestaEnum;
  presentacion: string;
}[] = [
  { tipo: TipoRespuestaEnum.ABIERTA, presentacion: 'Abierta' },
  {
    tipo: TipoRespuestaEnum.OPCION_MULTIPLE_SELECCION_SIMPLE,
    presentacion: 'Selección simple',
  },
  {
    tipo: TipoRespuestaEnum.OPCION_MULTIPLE_SELECCION_MULTIPLE,
    presentacion: 'Selección múltiple',
  },
];
