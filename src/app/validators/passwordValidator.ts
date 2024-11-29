import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value || '';
    const hasUppercase = /[A-Z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    if (!hasUppercase) {
      return { noUppercase: true };
    }
    if (!hasNumber) {
      return { noNumber: true };
    }
    if (!hasSpecial) {
      return { noSpecial: true };
    }
    return null; // Validación exitosa
  };
}