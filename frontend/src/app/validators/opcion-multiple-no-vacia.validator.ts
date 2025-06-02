import { ValidatorFn, AbstractControl, FormArray } from '@angular/forms';

export const unaseleccion: ValidatorFn = (control: AbstractControl) => {
  const formArray = control as FormArray;
  return formArray.controls.some((c) => c.value === true)
    ? null
    : { unaseleccion: true };
};
