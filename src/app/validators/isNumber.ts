import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Validador personalizado que asegura que el valor sea solo un número
export function isNumber(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null; // Si no hay valor, no hay error

    // Verifica si el valor contiene solo números
    const isNumeric = /^[0-9]+$/.test(control.value);
    return isNumeric ? null : { nonNumeric: true }; // Devuelve un error si no es un número
  };
}