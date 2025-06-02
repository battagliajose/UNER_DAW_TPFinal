import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { TipoRespuestaEnum } from '../enums/tipo-pregunta.enum';
import { OpcionDTO } from '../models/opcion.dto';

export const opcionesNoVacias: ValidatorFn = (
  formGroup: AbstractControl,
): ValidationErrors | null => {
  const group = formGroup as FormGroup;
  const controlTipo = group.get('tipo');
  const controlOpciones = group.get('opciones');

  if (!controlTipo?.value || !controlOpciones?.value) {
    return null;
  }

  if (
    esMultipleChoice(controlTipo.value) &&
    !tieneItems(controlOpciones.value)
  ) {
    return { opcionesRequeridas: true };
  }

  return null;
};

function esMultipleChoice(tipo: TipoRespuestaEnum): boolean {
  return [
    TipoRespuestaEnum.OPCION_MULTIPLE_SELECCION_MULTIPLE,
    TipoRespuestaEnum.OPCION_MULTIPLE_SELECCION_SIMPLE,
  ].includes(tipo);
}

function tieneItems(array: FormControl<OpcionDTO>[]): boolean {
  return array.length > 0;
}
