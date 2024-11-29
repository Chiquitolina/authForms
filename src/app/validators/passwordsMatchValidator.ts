import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function matchValidator(matchTo: string, reverse?: boolean): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.parent && reverse) {
      const c = (control.parent?.controls as any)[matchTo] as AbstractControl;
      if (c) {
        c.updateValueAndValidity(); // Actualiza la validación del otro campo
      }
      return null;
    }

    // Verifica si los valores de ambos campos coinciden
    return !!control.parent &&
      !!control.parent.value &&
      control.value === (control.parent?.controls as any)[matchTo].value
      ? null
      : { matching: true };
  };
}