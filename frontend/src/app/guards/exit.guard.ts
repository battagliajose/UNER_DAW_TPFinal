import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { Observable } from 'rxjs';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

export const exitGuard: CanDeactivateFn<CanComponentDeactivate> = (
  component,
  currentRoute,
  currentState,
  nextState,
) => {
  const isValidForm = component.canDeactivate();
  if (isValidForm) {
    const dialog = inject(ConfirmationService);
    const reference = dialog.confirm({
      message: 'Tenés cambios no guardados. ¿Seguro que querés salir?',
      header: 'Salir',
      closable: false,
      closeOnEscape: false,
      icon: 'pi pi-question-circle',
      rejectButtonProps: {
        label: 'No',
        severity: 'secondary',
      },
      acceptButtonProps: {
        label: 'Si',
      },
      accept: () => {
        reference.close();
        return true;
      },
      reject: () => {
        reference.close();
        return false;
      },
    });
  }

  return true;
};
